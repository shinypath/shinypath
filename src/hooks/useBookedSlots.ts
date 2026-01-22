import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BookedSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

/**
 * Fetches booked date/time slots from cleaning_quotes
 * Excludes cancelled quotes so those slots become available again
 */
export function useBookedSlots() {
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookedSlots = useCallback(async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('cleaning_quotes')
      .select('preferred_date, preferred_time')
      .neq('status', 'cancelled'); // Exclude cancelled appointments

    if (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    } else {
      const slots: BookedSlot[] = (data || [])
        .filter(row => row.preferred_date && row.preferred_time)
        .map(row => ({
          date: row.preferred_date,
          time: row.preferred_time!,
        }));
      setBookedSlots(slots);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookedSlots();
  }, [fetchBookedSlots]);

  /**
   * Check if a specific date/time combination is already booked
   */
  const isSlotBooked = useCallback((date: string, time: string): boolean => {
    return bookedSlots.some(slot => slot.date === date && slot.time === time);
  }, [bookedSlots]);

  /**
   * Get all booked times for a specific date
   */
  const getBookedTimesForDate = useCallback((date: string): string[] => {
    return bookedSlots
      .filter(slot => slot.date === date)
      .map(slot => slot.time);
  }, [bookedSlots]);

  /**
   * Check if a date has any available slots (assuming business hours 8am-6pm)
   */
  const isDateFullyBooked = useCallback((date: string): boolean => {
    const bookedTimes = getBookedTimesForDate(date);
    // Business hours: 8:00 to 18:00 (11 slots)
    const totalSlots = 11;
    return bookedTimes.length >= totalSlots;
  }, [getBookedTimesForDate]);

  return {
    bookedSlots,
    loading,
    isSlotBooked,
    getBookedTimesForDate,
    isDateFullyBooked,
    refresh: fetchBookedSlots,
  };
}
