import { Listing, VerifierStats } from '../types';

export async function fetchListings(filters?: {
  status?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  facility?: string;
  zone?: string;
  owner_id?: string;
}): Promise<Listing[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.facility) params.append('facility', filters.facility);
    if (filters.zone) params.append('zone', filters.zone);
    if (filters.owner_id) params.append('owner_id', filters.owner_id);
  }

  const res = await fetch(`/api/listings?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function fetchListingById(id: string): Promise<Listing> {
  const res = await fetch(`/api/listings/${id}`);
  if (!res.ok) throw new Error('Listing not found');
  return res.json();
}

export async function submitListing(data: {
  owner_id?: string;
  owner_name?: string;
  contact_information?: string;
  messenger_url?: string;
  name: string;
  description: string;
  monthly_price: number;
  address: string;
  latitude?: number;
  longitude?: number;
  facilities: string[];
  photos: string[];
}): Promise<Listing> {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit listing');
  }
  return res.json();
}

export async function resubmitListing(id: string, data: Partial<Listing>): Promise<Listing> {
  const res = await fetch(`/api/listings/${id}/resubmit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to resubmit listing');
  return res.json();
}

export async function recordInquiry(listing_id: string, message?: string, student_email?: string): Promise<{ success: true; messenger_url: string }> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listing_id, message, student_email })
  });
  if (!res.ok) throw new Error('Failed to record inquiry');
  return res.json();
}

export async function verifierLogin(email: string, password: string, role?: string): Promise<{ token: string; user: { id?: string; email: string; name: string; role?: string } }> {
  let res: Response;
  try {
    res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
  } catch (networkError) {
    throw new Error('Network connection error. Please check your connection and try again.');
  }

  if (!res.ok) {
    let errorMessage = 'Authentication failed. Please verify your credentials.';
    try {
      const errData = await res.json();
      if (errData && errData.error) {
        errorMessage = errData.error;
      }
    } catch {
      if (res.status === 401) {
        errorMessage = 'Invalid email or password for selected role.';
      } else if (res.status === 500) {
        errorMessage = 'Server error encountered. Please try again later.';
      }
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function fetchVerifierStats(): Promise<VerifierStats> {
  const res = await fetch('/api/verifier/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function reviewListing(id: string, data: {
  action: 'APPROVE' | 'REJECT';
  price_checked: boolean;
  photos_checked: boolean;
  availability_checked: boolean;
  notes?: string;
  rejection_reason?: string;
  verifier_name?: string;
}): Promise<Listing> {
  const res = await fetch(`/api/verifier/listings/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Review failed');
  }
  return res.json();
}

export async function updateListingStatus(id: string, status: string): Promise<Listing> {
  const res = await fetch(`/api/verifier/listings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send recovery email');
  }
  return res.json();
}

export async function resetPassword(email: string, new_password: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, new_password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to reset password');
  }
  return res.json();
}

export async function resetAllAccounts(): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/reset-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to reset accounts');
  }
  return res.json();
}


