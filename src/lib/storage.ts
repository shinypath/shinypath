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

export function saveQuote(quote: Omit<CleaningQuote, 'id' | 'created_at' | 'updated_at'>): CleaningQuote {
  const quotes = getQuotes();
  const newQuote: CleaningQuote = {
    ...quote,
    id: crypto.randomUUID(),
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
