import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type BlockType = 'specific' | 'weekly' | 'monthly';

export interface BlockedSlot {
  id: string;
  type: BlockType;
  date_value: string; // 'YYYY-MM-DD' for specific, '0'-'6' for weekly, '1'-'31' for monthly
  time_slot: string; // 'ALL' or 'HH:MM'
}

export function useBlockedSlots() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedSlots = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blocked_slots')
        .select('*');

      if (error) {
        console.error('Error fetching blocked slots:', error);
        setBlockedSlots([]);
      } else {
        setBlockedSlots(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockedSlots();
  }, [fetchBlockedSlots]);

  const addBlockedSlot = async (slot: Omit<BlockedSlot, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('blocked_slots')
        .insert([slot])
        .select()
        .single();

      if (error) throw error;
      setBlockedSlots(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding blocked slot:', error);
      return { success: false, error };
    }
  };

  const removeBlockedSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blocked_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBlockedSlots(prev => prev.filter(slot => slot.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error removing blocked slot:', error);
      return { success: false, error };
    }
  };

  /**
   * Checks if a given date and time are blocked.
   * date is 'YYYY-MM-DD'
   * time is 'HH:MM'
   */
  const checkIsBlocked = useCallback((dateStr: string, timeStr?: string) => {
    const dateObj = new Date(dateStr + "T12:00:00");
    const dayOfWeek = dateObj.getDay().toString(); // 0-6
    const dayOfMonth = dateObj.getDate().toString(); // 1-31

    for (const block of blockedSlots) {
      const matchesDate = 
        (block.type === 'specific' && block.date_value === dateStr) ||
        (block.type === 'weekly' && block.date_value === dayOfWeek) ||
        (block.type === 'monthly' && block.date_value === dayOfMonth);

      if (matchesDate) {
        if (!timeStr) {
          // If we are just checking if the whole date is blocked, we return true if there's an 'ALL' block
          if (block.time_slot === 'ALL') return true;
        } else {
          // Check specific time or 'ALL'
          if (block.time_slot === 'ALL' || block.time_slot === timeStr) return true;
        }
      }
    }
    return false;
  }, [blockedSlots]);

  return {
    blockedSlots,
    loading,
    addBlockedSlot,
    removeBlockedSlot,
    checkIsBlocked,
    refresh: fetchBlockedSlots
  };
}
