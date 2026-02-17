import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { QuoteStatus, CleaningQuote, CleaningFormType } from '@/lib/types';
import { sendNotificationEmail, type NotificationType } from './useEmailSettings';

export interface QuoteInsert {
  form_type: string;
  cleaning_type: string;
  frequency: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  preferred_date: string;
  preferred_time?: string | null;
  details?: string | null;
  bathrooms?: string;
  bedrooms?: string;
  kitchens?: number;
  living_rooms?: number;
  extras?: string[];
  laundry_persons?: number;
  subtotal?: number;
  discount?: number;
  total?: number;
  status?: string;
}

// Map status changes to notification types
const statusToNotificationType: Partial<Record<QuoteStatus, NotificationType>> = {
  confirmed: 'appointment_confirmed',
  cancelled: 'appointment_cancelled',
};

export function useQuotes() {
  const [quotes, setQuotes] = useState<CleaningQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('cleaning_quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setQuotes([]);
    } else {
      // Map database fields to app types
      const mappedQuotes: CleaningQuote[] = (data || []).map((row: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        id: row.id,
        form_type: row.form_type as CleaningFormType,
        cleaning_type: row.cleaning_type,
        frequency: row.frequency,
        client_name: row.client_name,
        client_email: row.client_email,
        client_phone: row.client_phone,
        client_address: row.client_address,
        preferred_date: row.preferred_date,
        preferred_time: row.preferred_time,
        details: row.details,
        bathrooms: row.bathrooms,
        bedrooms: row.bedrooms,
        kitchens: row.kitchens,
        living_rooms: row.living_rooms,
        extras: row.extras || [],
        laundry_persons: row.laundry_persons,
        subtotal: row.subtotal || 0,
        discount: row.discount || 0,
        total: row.total,
        status: row.status as QuoteStatus,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      setQuotes(mappedQuotes);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const createQuote = async (quote: QuoteInsert): Promise<CleaningQuote | null> => {
    const { data, error: insertError } = await supabase
      .from('cleaning_quotes')
      .insert([quote])
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Send notification emails for new booking (non-blocking)
    if (data?.id) {
      sendNotificationEmail(data.id, 'appointment_created', true, true)
        .then(result => {
          if (!result.success) {
            console.warn('Failed to send appointment_created email:', result.error);
          }
        })
        .catch(err => console.warn('Email notification error:', err));
    }

    await fetchQuotes();
    return data as CleaningQuote;
  };

  const updateQuote = async (id: string, updates: Partial<CleaningQuote>): Promise<CleaningQuote | null> => {
    // Omitting fields that shouldn't be updated directly or are handled automatically
    const { id: _, created_at, updated_at, ...updateData } = updates;

    const { data, error: updateError } = await supabase
      .from('cleaning_quotes')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    await fetchQuotes();
    return data as CleaningQuote;
  };

  const updateQuoteStatus = async (id: string, status: QuoteStatus): Promise<CleaningQuote | null> => {
    const { data, error: updateError } = await supabase
      .from('cleaning_quotes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Send notification email for status change (non-blocking)
    const notificationType = statusToNotificationType[status];
    if (notificationType && data?.id) {
      sendNotificationEmail(data.id, notificationType, true, false)
        .then(result => {
          if (!result.success) {
            console.warn(`Failed to send ${notificationType} email:`, result.error);
          }
        })
        .catch(err => console.warn('Email notification error:', err));
    }

    await fetchQuotes();
    return data as CleaningQuote;
  };

  const deleteQuote = async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('cleaning_quotes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    await fetchQuotes();
    return true;
  };

  const getQuoteById = async (id: string): Promise<CleaningQuote | null> => {
    const { data, error: fetchError } = await supabase
      .from('cleaning_quotes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    return data as CleaningQuote | null;
  };

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    createQuote,
    updateQuote,
    updateQuoteStatus,
    deleteQuote,
    getQuoteById,
  };
}