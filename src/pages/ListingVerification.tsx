import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, AlertCircle, MapPin, User, Phone, CheckSquare, Square } from 'lucide-react';
import { Listing } from '../types';
import { fetchListingById, reviewListing, updateListingStatus } from '../services/api';
import { AvailabilityBadge } from '../components/AvailabilityBadge';

export const ListingVerification: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceChecked, setPriceChecked] = useState(true);
  const [photosChecked, setPhotosChecked] = useState(true);
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const verifierName = localStorage.getItem('ssu_verifier_name') || 'Authorized Verifier SSU Bulan';

  useEffect(() => {
    const token = localStorage.getItem('ssu_verifier_token');
    if (!token) {
      navigate('/verifier/login');
      return;
    }

    if (!id) return;
    fetchListingById(id)
      .then(data => {
        setListing(data);
        if (data.verification_checklist) {
          setPriceChecked(data.verification_checklist.price_checked);
          setPhotosChecked(data.verification_checklist.photos_checked);
          setAvailabilityChecked(data.verification_checklist.availability_checked);
          setNotes(data.verification_checklist.notes);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load listing');
        setLoading(false);
      });
  }, [id, navigate]);

  const handleApprove = async () => {
    if (!listing) return;
    setSubmitting(true);
    try {
      await reviewListing(listing.id, {
        action: 'APPROVE',
        price_checked: priceChecked,
        photos_checked: photosChecked,
        availability_checked: availabilityChecked,
        notes,
        verifier_name: verifierName
      });
      alert('Listing approved and published successfully!');
      navigate('/verifier/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Approval failed');
      } else {
        setError('Approval failed');
      }
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!listing) return;
    if (!rejectionReason) {
      setError('Rejection reason is required when rejecting a listing.');
      return;
    }
    setSubmitting(true);
    try {
      await reviewListing(listing.id, {
        action: 'REJECT',
        price_checked: priceChecked,
        photos_checked: photosChecked,
        availability_checked: availabilityChecked,
        notes,
        rejection_reason: rejectionReason,
        verifier_name: verifierName
      });
      alert('Listing rejected with reason recorded.');
      navigate('/verifier/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Rejection failed');
      } else {
        setError('Rejection failed');
      }
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!listing) return;
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      await updateListingStatus(listing.id, newStatus);
      const updated = await fetchListingById(listing.id);
      setListing(updated);
      alert(`Status updated to ${newStatus}`);
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 text-sm">Loading verification review...</div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Error Loading Listing</h2>
          <p className="text-xs text-zinc-600">{error}</p>
          <Link to="/verifier/dashboard" className="px-4 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-lg">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div>
          <Link to="/verifier/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Verifier Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between">
                <AvailabilityBadge status={listing.status} />
                <span className="text-xl font-extrabold text-[#800000] tabular-nums">
                  ₱{listing.monthly_price.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/ mo</span>
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">{listing.name}</h1>

              <p className="text-xs text-zinc-600 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#800000] shrink-0" />
                {listing.address}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Description</h4>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  {listing.description || 'No description provided.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Facilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {listing.facilities.map((fac, idx) => (
                    <span key={idx} className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg font-medium">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Photos</h4>
                <div className="grid grid-cols-2 gap-4">
                  {listing.photos.map((p, idx) => (
                    <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200">
                      <img src={p} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Owner Contact</h4>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-1 text-xs text-zinc-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    <strong>{listing.owner.name}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span>{listing.owner.contact_information}</span>
                  </div>
                  {listing.owner.messenger_url && (
                    <div>
                      <a href={listing.owner.messenger_url} target="_blank" rel="noopener noreferrer" className="text-[#800000] hover:underline font-semibold">
                        Messenger Profile Link
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Quick Status Management</h3>
              <p className="text-xs text-zinc-500">Update availability status for verified listings:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('VERIFIED')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${listing.status === 'VERIFIED' ? 'bg-[#800000] text-amber-300 border-[#800000]' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}
                >
                  VERIFIED (Available)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('RESERVED')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${listing.status === 'RESERVED' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}
                >
                  RESERVED
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('TAKEN')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${listing.status === 'TAKEN' ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}
                >
                  TAKEN
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('EXPIRED')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${listing.status === 'EXPIRED' ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}
                >
                  EXPIRED
                </button>
              </div>
            </div>

          </div>

          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6 sticky top-24">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#800000] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Verification Checklist
                </div>
                <h3 className="text-base font-bold text-zinc-900">Verifier Inspection</h3>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPriceChecked(!priceChecked)}
                  className="w-full flex items-center gap-3 text-xs font-medium text-zinc-800 text-left p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  {priceChecked ? <CheckSquare className="w-5 h-5 text-[#800000] shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                  <span>Price Verified (Matches student budget & local rates)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotosChecked(!photosChecked)}
                  className="w-full flex items-center gap-3 text-xs font-medium text-zinc-800 text-left p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  {photosChecked ? <CheckSquare className="w-5 h-5 text-[#800000] shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                  <span>Photos Inspected (Matches actual rooms on visit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvailabilityChecked(!availabilityChecked)}
                  className="w-full flex items-center gap-3 text-xs font-medium text-zinc-800 text-left p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  {availabilityChecked ? <CheckSquare className="w-5 h-5 text-[#800000] shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                  <span>Availability Confirmed (Beds/rooms currently open)</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Inspection Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Enter inspection observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                ></textarea>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleApprove}
                  className="w-full py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-amber-400/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  Approve & Publish Listing
                </button>

                {!showRejectBox ? (
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-rose-200"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Listing...
                  </button>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                    <label className="text-xs font-bold text-rose-900 block">Rejection Reason Required *</label>
                    <textarea
                      rows={3}
                      placeholder="Specify why this listing is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-3 bg-white border border-rose-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-rose-500"
                    ></textarea>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleReject}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRejectBox(false)}
                        className="px-3 py-2 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
