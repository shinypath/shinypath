import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BookedSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

// Total available slots per day (8:00 AM to 6:00 PM = 11 slots)
export const TOTAL_DAILY_SLOTS = 11;

export type DateAvailability = 'available' | 'limited' | 'full';

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
   * Get count of booked slots for a date
   */
  const getBookedCountForDate = useCallback((date: string): number => {
    return getBookedTimesForDate(date).length;
  }, [getBookedTimesForDate]);

  /**
   * Check if a date has any available slots
   */
  const isDateFullyBooked = useCallback((date: string): boolean => {
    return getBookedCountForDate(date) >= TOTAL_DAILY_SLOTS;
  }, [getBookedCountForDate]);

  /**
   * Get availability status for a date
   * - 'available': 0-3 slots booked (8+ available)
   * - 'limited': 4-10 slots booked (1-7 available)  
   * - 'full': 11 slots booked (0 available)
   */
  const getDateAvailability = useCallback((date: string): DateAvailability => {
    const bookedCount = getBookedCountForDate(date);
    if (bookedCount >= TOTAL_DAILY_SLOTS) return 'full';
    if (bookedCount >= 4) return 'limited';
    return 'available';
  }, [getBookedCountForDate]);

  /**
   * Get available slots count for a date
   */
  const getAvailableSlotsCount = useCallback((date: string): number => {
    return Math.max(0, TOTAL_DAILY_SLOTS - getBookedCountForDate(date));
  }, [getBookedCountForDate]);

  return {
    bookedSlots,
    loading,
    isSlotBooked,
    getBookedTimesForDate,
    getBookedCountForDate,
    isDateFullyBooked,
    getDateAvailability,
    getAvailableSlotsCount,
    refresh: fetchBookedSlots,
  };
}
