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

    try {
      // Get today's date in YYYY-MM-DD format for comparison
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('cleaning_quotes')
        .select('preferred_date, preferred_time')
        .neq('status', 'cancelled') // Exclude cancelled appointments
        .neq('status', 'completed') // Exclude completed appointments (slot is free again)
        .gte('preferred_date', today); // Only get future or today's slots

      if (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      } else {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        // Filter out slots that have already passed today
        const slots: BookedSlot[] = (data || [])
          .filter(row => {
            if (!row.preferred_date || !row.preferred_time) return false;

            // If it's a future date, keep it
            if (row.preferred_date > today) return true;

            // If it's today, check if the time has passed
            if (row.preferred_date === today && row.preferred_time) {
              const [hours, minutes] = row.preferred_time.split(':').map(Number);
              // Keep slot if it hasn't passed yet
              if (hours > currentHour) return true;
              if (hours === currentHour && minutes > currentMinutes) return true;
              return false; // Time has passed
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

  /**
   * Check if a specific date/time combination is already booked
   * DISABLED: Always returns false to allow multiple bookings
   */
  const isSlotBooked = useCallback((_date: string, _time: string): boolean => {
    return false; // Blocking disabled - allow multiple bookings
  }, []);

  /**
   * Get all booked times for a specific date
   * DISABLED: Always returns empty array to allow multiple bookings
   */
  const getBookedTimesForDate = useCallback((_date: string): string[] => {
    return []; // Blocking disabled - allow multiple bookings
  }, []);

  /**
   * Get count of booked slots for a date
   * DISABLED: Always returns 0 to allow multiple bookings
   */
  const getBookedCountForDate = useCallback((_date: string): number => {
    return 0; // Blocking disabled - allow multiple bookings
  }, []);

  /**
   * Check if a date has any available slots
   * DISABLED: Always returns false (never fully booked)
   */
  const isDateFullyBooked = useCallback((_date: string): boolean => {
    return false; // Blocking disabled - allow multiple bookings
  }, []);

  /**
   * Get availability status for a date
   * DISABLED: Always returns 'available' to allow multiple bookings
   */
  const getDateAvailability = useCallback((_date: string): DateAvailability => {
    return 'available'; // Blocking disabled - allow multiple bookings
  }, []);

  /**
   * Get available slots count for a date
   * DISABLED: Always returns full capacity to allow multiple bookings
   */
  const getAvailableSlotsCount = useCallback((_date: string): number => {
    return TOTAL_DAILY_SLOTS; // Blocking disabled - allow multiple bookings
  }, []);

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
