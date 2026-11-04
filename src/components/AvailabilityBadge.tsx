import React from 'react';
import { CheckCircle2, Clock, Ban } from 'lucide-react';
import { ListingStatus } from '../types';

interface AvailabilityBadgeProps {
  status: ListingStatus;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ status }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-[#800000] border border-amber-300 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#800000]" />
          Available
        </span>
      );
    case 'RESERVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-[#800000]/10 text-[#800000] border border-[#800000]/30 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#800000]" />
          Reserved
        </span>
      );
    case 'TAKEN':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-zinc-200 text-zinc-700 border border-zinc-300 shadow-sm">
          <Ban className="w-3.5 h-3.5 text-zinc-600" />
          Taken / Occupied
        </span>
      );
    case 'AWAITING_VERIFICATION':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Pending
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
          Expired
        </span>
      );
    default:
      return null;
  }
};
