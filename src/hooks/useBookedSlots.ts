import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBlockedSlots } from './useBlockedSlots';

export interface BookedSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

// Total available slots per day (8:00 AM to 6:00 PM = 11 slots, actually from TIME_SLOTS it is 9 slots, but we'll leave as 11 if it was defined so, or just use 9)
export const TOTAL_DAILY_SLOTS = 9; // Updated from 11 to 9 since TIME_SLOTS has 9 slots

export type DateAvailability = 'available' | 'limited' | 'full';

export function useBookedSlots() {
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Bring in blocked slots logic
  const { checkIsBlocked, loading: loadingBlocks } = useBlockedSlots();

  const fetchBookedSlots = useCallback(async () => {
    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('cleaning_quotes')
        .select('preferred_date, preferred_time')
        .neq('status', 'cancelled')
        .neq('status', 'completed')
        .gte('preferred_date', today);

      if (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      } else {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        const slots: BookedSlot[] = (data || [])
          .filter(row => {
            if (!row.preferred_date || !row.preferred_time) return false;
            if (row.preferred_date > today) return true;
            if (row.preferred_date === today && row.preferred_time) {
              const [hours, minutes] = row.preferred_time.split(':').map(Number);
              if (hours > currentHour) return true;
              if (hours === currentHour && minutes > currentMinutes) return true;
              return false;
            }
            return false;
          })
          .map(row => ({
            date: row.preferred_date,
            time: row.preferred_time!,
          }));
        setBookedSlots(slots);
      }
    } catch (err) {
      console.error('Unexpected error in useBookedSlots:', err);
      setBookedSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookedSlots();
  }, [fetchBookedSlots]);

  const getBookedTimesForDate = useCallback((date: string): string[] => {
    // Collect all booked times from quotes
    // Currently blocked multiple bookings are disabled, so we only return manually blocked times
    // Wait, the user wants manual blocking. The previous code disabled ALL blocking (returned []).
    // So we will return ONLY the manually blocked times, OR we can combine them. 
    // Since the previous code explicitly disabled booking blocking, I will only return manually blocked times.
    const allSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    const blockedTimes = allSlots.filter(time => checkIsBlocked(date, time));
    return blockedTimes;
  }, [checkIsBlocked]);

  const isSlotBooked = useCallback((date: string, time: string): boolean => {
    return checkIsBlocked(date, time);
  }, [checkIsBlocked]);

  const getBookedCountForDate = useCallback((date: string): number => {
    return getBookedTimesForDate(date).length;
  }, [getBookedTimesForDate]);

  const isDateFullyBooked = useCallback((date: string): boolean => {
    return checkIsBlocked(date) || getBookedTimesForDate(date).length >= TOTAL_DAILY_SLOTS;
  }, [checkIsBlocked, getBookedTimesForDate]);

  const getDateAvailability = useCallback((date: string): DateAvailability => {
    if (isDateFullyBooked(date)) return 'full';
    const blockedCount = getBookedTimesForDate(date).length;
    if (blockedCount > 0) return 'limited';
    return 'available';
  }, [isDateFullyBooked, getBookedTimesForDate]);

  const getAvailableSlotsCount = useCallback((date: string): number => {
    if (checkIsBlocked(date)) return 0;
    return TOTAL_DAILY_SLOTS - getBookedTimesForDate(date).length;
  }, [checkIsBlocked, getBookedTimesForDate]);

  return {
    bookedSlots,
    loading: loading || loadingBlocks,
    isSlotBooked,
    getBookedTimesForDate,
    getBookedCountForDate,
    isDateFullyBooked,
    getDateAvailability,
    getAvailableSlotsCount,
    refresh: fetchBookedSlots,
  };
}
