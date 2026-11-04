import React from 'react';
import { ListingStatus } from '../types';

interface StatusBadgeProps {
  status: ListingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
          <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    case 'AWAITING_VERIFICATION':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-100 text-zinc-700 border border-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Pending Verification
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-800 border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          Rejected
        </span>
      );
    case 'RESERVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#800000]/10 text-[#800000] border border-[#800000]/30">
          <span className="w-2 h-2 rounded-full bg-[#800000]"></span>
          Reserved
        </span>
      );
    case 'TAKEN':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-200 text-zinc-800 border border-zinc-300">
          <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
          Taken / Occupied
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-100 text-zinc-500 border border-zinc-200">
          Expired
        </span>
      );
    default:
      return null;
  }
};
