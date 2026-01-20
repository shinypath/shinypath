// Shiny Path Cleaning - Type Definitions

export type QuoteStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type CleaningFormType = 'house' | 'office' | 'post-construction';

export interface CleaningQuote {
  id: string;
  cleaning_type: string;
  form_type: CleaningFormType;
  frequency: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  living_rooms: number;
  extras: string[];
  laundry: number;
  preferred_date: string;
  preferred_time: string;
  address: string;
  client_name: string;
  email: string;
  phone: string;
  company?: string;
  additional_details?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

export interface HouseCleaningFormData {
  cleaningType: string;
  frequency: string;
  kitchens: number;
  bathrooms: string;
  bedrooms: string;
  livingRooms: number;
  extras: string[];
  laundry: number;
  date: string;
  time: string;
  address: string;
  name: string;
  email: string;
  phone: string;
  details: string;
}

export interface OfficeCleaningFormData {
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
  details: string;
}

export interface PostConstructionFormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  details: string;
}

export interface CalculatedPrice {
  typePrice: number;
  kitchenPrice: number;
  bathroomPrice: number;
  bedroomPrice: number;
  livingRoomPrice: number;
  extrasPrice: number;
  laundryPrice: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
}
