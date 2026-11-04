export interface Owner {
  id: string;
  name: string;
  email?: string;
  contact_information: string;
  messenger_url: string;
  created_at: string;
}

export interface VerificationChecklist {
  price_checked: boolean;
  photos_checked: boolean;
  availability_checked: boolean;
  notes: string;
  verifier_name: string;
  created_at: string;
}

export type ListingStatus = 'AWAITING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'RESERVED' | 'TAKEN' | 'EXPIRED';

export interface Listing {
  id: string;
  owner_id: string;
  verified_by?: string;
  name: string;
  description: string;
  monthly_price: number;
  address: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  status: ListingStatus;
  rejection_reason?: string;
  submitted_at: string;
  verified_at?: string;
  updated_at: string;
  photos: string[];
  owner: Owner;
  verification_checklist?: VerificationChecklist;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  student_email?: string;
  message?: string;
  created_at: string;
}

export interface ListingReport {
  id: string;
  listing_id: string;
  listing_name: string;
  reason: string;
  details: string;
  student_email: string;
  created_at: string;
}

export interface VerifierStats {
  pending: number;
  verified: number;
  rejected: number;
  reserved: number;
  taken: number;
  expired: number;
  total_inquiries: number;
}

