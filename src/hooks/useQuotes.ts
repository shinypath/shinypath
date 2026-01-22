import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { QuoteStatus, CleaningQuote, CleaningFormType } from '@/lib/types';

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
      const mappedQuotes: CleaningQuote[] = (data || []).map((row: any) => ({
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
      .insert([quote] as any)
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    await fetchQuotes();
    return data as unknown as CleaningQuote;
  };

  const updateQuoteStatus = async (id: string, status: QuoteStatus): Promise<CleaningQuote | null> => {
    const { data, error: updateError } = await supabase
      .from('cleaning_quotes')
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    await fetchQuotes();
    return data as unknown as CleaningQuote;
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

    return data as unknown as CleaningQuote | null;
  };

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    createQuote,
    updateQuoteStatus,
    deleteQuote,
    getQuoteById,
  };
}
