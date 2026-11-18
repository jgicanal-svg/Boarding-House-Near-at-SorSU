import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2, Heart, Flag, AlertTriangle, X } from 'lucide-react';
import { Listing } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';

interface ListingCardProps {
  listing: Listing;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isCompared, onToggleCompare }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate Pricing');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
    setIsFavorite(favs.includes(listing.id));
  }, [listing.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
    let updated: string[];
    if (favs.includes(listing.id)) {
      updated = favs.filter(id => id !== listing.id);
      setIsFavorite(false);
    } else {
      updated = [...favs, listing.id];
      setIsFavorite(true);
    }
    localStorage.setItem('ssu_favorite_listings', JSON.stringify(updated));
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          reason: reportReason,
          details: reportDetails,
          student_email: localStorage.getItem('ssu_student_email') || 'student@ssubulan.edu.ph'
        })
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportSuccess(false);
          setShowReportModal(false);
          setReportDetails('');
        }, 2000);
      }
    } catch {
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const primaryPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : '/src/assets/images/student_room_interior_1793166105502.jpg';

  return (
    <>
      <div className="group bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
        {/* Image Container with Availability Badge, Favorite Button, Compare Button, Report Button & Price Tag */}
        <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
          <img
            src={primaryPhoto}
            alt={listing.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3">
            <AvailabilityBadge status={listing.status} />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(listing.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl backdrop-blur-md transition-colors shadow-md text-[11px] font-bold ${isCompared ? 'bg-[#800000] text-amber-300 border border-amber-400' : 'bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800'}`}
                title={isCompared ? 'Remove from comparison' : 'Add to comparison (max 3)'}
              >
                {isCompared ? '✓ Comparing' : '+ Compare'}
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowReportModal(true);
              }}
              className="p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-rose-50 hover:text-rose-600 text-zinc-700 dark:text-zinc-200 backdrop-blur-md transition-colors shadow-md cursor-pointer"
              title="Report suspicious, inaccurate, or outdated info"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-md cursor-pointer ${isFavorite ? 'bg-rose-600 text-white' : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800'}`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
          <div className="absolute bottom-3 right-3 bg-[#800000]/95 backdrop-blur-md text-amber-300 px-3.5 py-1.5 rounded-xl text-sm font-bold tabular-nums shadow-lg border border-amber-400/40">
            ₱{listing.monthly_price.toLocaleString()} <span className="text-[11px] font-normal text-zinc-200">/ mo</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Location & Metadata */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1 font-semibold text-[#800000] dark:text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
                {listing.address.split(',')[0]}
              </span>
              <span aria-hidden="true">·</span>
              <span>{listing.facilities.length} Facilities</span>
            </div>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#800000] dark:group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
              {listing.name}
            </h3>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed mb-3">
              {listing.description}
            </p>

            {/* Facilities summary */}
            <div className="flex flex-wrap gap-1.5">
              {listing.facilities.slice(0, 3).map((fac, idx) => (
                <span key={idx} className="text-[11px] bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  {fac}
                </span>
              ))}
              {listing.facilities.length > 3 && (
                <span className="text-[11px] bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded font-medium">
                  +{listing.facilities.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400 font-medium">
              {listing.verified_at ? `Verified ${new Date(listing.verified_at).toLocaleDateString()}` : 'Awaiting verification'}
            </span>
            <Link
              to={`/listings/${listing.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800000] dark:text-amber-400 hover:text-amber-700 group-hover:translate-x-1 transition-transform"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Report Listing Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Report Boarding House</h3>
                  <p className="text-[11px] text-zinc-500">Flag suspicious, inaccurate, or outdated info</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Report Submitted Successfully</h4>
                <p className="text-xs text-zinc-500">Thank you for helping keep the SSU Bulan housing directory safe and accurate. Our verification admin team will review this property.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
                  <span className="text-zinc-500 block">Reporting Property:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100">{listing.name}</strong>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Reason for Flagging</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Inaccurate Pricing">Inaccurate Rental Price</option>
                    <option value="Already Fully Occupied / Taken">Already Fully Occupied / Taken</option>
                    <option value="Fake / Misleading Photos">Fake or Misleading Photos</option>
                    <option value="Incorrect Address / Location">Incorrect Address / Location</option>
                    <option value="Suspicious / Scam">Suspicious / Scam Listing</option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Additional Details (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details to help our admin team investigate..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#800000]"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
