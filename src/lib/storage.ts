// Local Storage Management for Quotes

import type { CleaningQuote, QuoteStatus } from './types';

const QUOTES_KEY = 'shiny-path-quotes';

export function getQuotes(): CleaningQuote[] {
  try {
    const stored = localStorage.getItem(QUOTES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore errors
  }
  return [];
}

export interface SaveQuoteInput {
  form_type: string;
  cleaning_type: string;
  frequency: string;
  kitchens?: number;
  bathrooms?: string;
  bedrooms?: string;
  living_rooms?: number;
  extras?: string[];
  laundry_persons?: number;
  preferred_date: string;
  preferred_time?: string;
  client_address: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  details?: string;
  subtotal?: number;
  discount?: number;
  total?: number;
  status?: string;
}

export function saveQuote(quote: SaveQuoteInput): CleaningQuote {
  const quotes = getQuotes();
  const newQuote: CleaningQuote = {
    id: crypto.randomUUID(),
    form_type: quote.form_type as CleaningQuote['form_type'],
    cleaning_type: quote.cleaning_type,
    frequency: quote.frequency,
    kitchens: quote.kitchens ?? 0,
    bathrooms: quote.bathrooms ?? '0',
    bedrooms: quote.bedrooms ?? '0',
    living_rooms: quote.living_rooms ?? 0,
    extras: quote.extras ?? [],
    laundry_persons: quote.laundry_persons ?? 0,
    preferred_date: quote.preferred_date,
    preferred_time: quote.preferred_time ?? null,
    client_address: quote.client_address,
    client_name: quote.client_name,
    client_email: quote.client_email,
    client_phone: quote.client_phone,
    details: quote.details ?? null,
    subtotal: quote.subtotal ?? 0,
    discount: quote.discount ?? 0,
    total: quote.total ?? 0,
    status: (quote.status ?? 'pending') as QuoteStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  quotes.push(newQuote);
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  return newQuote;
}

export function updateQuoteStatus(id: string, status: QuoteStatus): CleaningQuote | null {
  const quotes = getQuotes();
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) return null;
  
  quotes[index] = {
    ...quotes[index],
    status,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  return quotes[index];
}

export function deleteQuote(id: string): boolean {
  const quotes = getQuotes();
  const filtered = quotes.filter(q => q.id !== id);
  if (filtered.length === quotes.length) return false;
  
  localStorage.setItem(QUOTES_KEY, JSON.stringify(filtered));
  return true;
}

export function getQuoteById(id: string): CleaningQuote | null {
  const quotes = getQuotes();
  return quotes.find(q => q.id === id) || null;
}

// Admin auth (demo only - not secure for production)
const ADMIN_KEY = 'shiny-path-admin-session';

export function checkAdminSession(): boolean {
  return localStorage.getItem(ADMIN_KEY) === 'authenticated';
}

export function setAdminSession(authenticated: boolean): void {
  if (authenticated) {
    localStorage.setItem(ADMIN_KEY, 'authenticated');
  } else {
    localStorage.removeItem(ADMIN_KEY);
  }
}

// Demo credentials (frontend only - would be replaced with real auth)
export const DEMO_ADMIN = {
  email: 'admin@shinypathcleaning.com',
  password: 'demo123',
};
