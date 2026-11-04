import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, CheckCircle2, MessageCircle, Send, Calendar, User, Phone, ArrowLeft, AlertCircle, Heart, Mail, Footprints, Bike, Navigation, Star, Printer } from 'lucide-react';
import { Listing } from '../types';
import { fetchListingById, recordInquiry } from '../services/api';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import { MapComponent } from '../components/MapComponent';
import { ReviewsSection } from '../components/ReviewsSection';
import { motion } from 'motion/react';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'nearby' | 'reviews'>('overview');
  
  const [studentName, setStudentName] = useState('Student Seeker');
  const [studentEmail, setStudentEmail] = useState('student@sorsu.edu.ph');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate Price / Hidden Fees');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const handleMessengerShare = () => {
    window.open(`https://www.facebook.com/dialog/send?link=${shareUrl}&app_id=0&redirect_uri=${shareUrl}`, '_blank');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    const existing = JSON.parse(localStorage.getItem('ssu_listing_reports') || '[]');
    const newReport = {
      id: 'rep_' + Date.now(),
      listing_id: listing.id,
      listing_name: listing.name,
      reason: reportReason,
      details: reportDetails,
      student_email: studentEmail,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('ssu_listing_reports', JSON.stringify([newReport, ...existing]));
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportDetails('');
    }, 2000);
  };

  // Distance calculations relative to SSU Bulan Campus (12.6712, 123.8721)
  const ssuLat = 12.6712;
  const ssuLng = 123.8721;

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!id) return;
    fetchListingById(id)
      .then(data => {
        setListing(data);
        setLoading(false);
        const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
        setIsFavorite(favs.includes(data.id));

        const storedName = localStorage.getItem('ssu_user_name') || localStorage.getItem('ssu_student_name');
        const storedEmail = localStorage.getItem('ssu_user_email');
        if (storedName) setStudentName(storedName);
        if (storedEmail) setStudentEmail(storedEmail);

        setInquiryMessage(`Hello ${data.owner.name}, I am interested in renting your boarding house "${data.name}" listed at ₱${data.monthly_price.toLocaleString()}/month located at ${data.address}. Is this accommodation currently available for the upcoming semester at SSU Bulan Campus?`);
      })
      .catch(err => {
        setError(err.message || 'Failed to load listing details');
        setLoading(false);
      });
  }, [id]);

  const toggleFavorite = () => {
    if (!listing) return;
    const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
    let updated: string[];
    if (favs.includes(listing.id)) {
      updated = favs.filter(item => item !== listing.id);
      setIsFavorite(false);
    } else {
      updated = [...favs, listing.id];
      setIsFavorite(true);
    }
    localStorage.setItem('ssu_favorite_listings', JSON.stringify(updated));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setSubmittingInquiry(true);
    try {
      await recordInquiry(listing.id, inquiryMessage, studentEmail);
      setInquirySuccess(true);
      setSubmittingInquiry(false);

      const ownerEmail = listing.owner.email || 'support@ssubulan-housing.edu.ph';
      const subject = encodeURIComponent(`Inquiry for Boarding House: ${listing.name} (SSU Bulan Housing)`);
      const body = encodeURIComponent(`Dear ${listing.owner.name},\n\n${inquiryMessage}\n\nStudent Name: ${studentName}\nStudent Email: ${studentEmail}\nListing Reference ID: ${listing.id}`);
      
      setTimeout(() => {
        window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
      }, 1000);
    } catch {
      alert('Failed to send inquiry');
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-6 bg-zinc-200 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/10] bg-zinc-200 rounded-3xl w-full"></div>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 space-y-4">
                <div className="h-6 bg-zinc-200 rounded w-1/4"></div>
                <div className="h-10 bg-zinc-200 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-72 bg-zinc-200 rounded-3xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Listing Not Found</h2>
          <p className="text-xs text-zinc-600">{error || 'The requested boarding house listing could not be found.'}</p>
          <Link to="/listings" className="inline-block px-4 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-lg hover:bg-[#660000]">
            Back to Verified Listings
          </Link>
        </div>
      </div>
    );
  }

  const distanceKm = calculateDistanceKm(ssuLat, ssuLng, listing.latitude, listing.longitude);
  const walkingMinutes = Math.max(2, Math.round(distanceKm * 14)); // ~4-5 km/h walking speed
  const tricycleMinutes = Math.max(1, Math.round(distanceKm * 5));

  const photos = listing.photos && listing.photos.length > 0 
    ? listing.photos 
    : ['/src/assets/images/student_room_interior_1793166105502.jpg'];

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <Link to="/listings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Verified Listings
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleFacebookShare}
              className="px-3 py-2 bg-[#1877F2] text-white hover:bg-[#166fe5] rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Share to Facebook"
            >
              Facebook
            </button>
            <button
              onClick={handleMessengerShare}
              className="px-3 py-2 bg-[#0084FF] text-white hover:bg-[#0077e6] rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Share via Messenger"
            >
              Messenger
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Copy link to clipboard"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-900 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Print or Save Record"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Print Record
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all shadow-sm cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Report
            </button>
            <button
              onClick={toggleFavorite}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border cursor-pointer ${isFavorite ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Photo Gallery with Lightbox Trigger */}
            <div className="space-y-3">
              <div 
                onClick={() => { setLightboxIndex(activePhotoIndex); setShowLightbox(true); }}
                className="aspect-[16/10] bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm relative group cursor-pointer"
                title="Click to open fullscreen photo gallery"
              >
                <img
                  src={photos[activePhotoIndex]}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-zinc-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-white/20">
                    🔍 Click to Expand Photos ({photos.length})
                  </span>
                </div>
              </div>
              {photos.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${activePhotoIndex === idx ? 'border-[#800000] shadow-md' : 'border-zinc-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Availability Header */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <AvailabilityBadge status={listing.status} />
                <div className="text-2xl font-extrabold text-[#800000] tabular-nums">
                  ₱{listing.monthly_price.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/ month</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {listing.name}
                </h1>
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: [1, 1.06, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-300 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Verified Property
                </motion.span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#800000] shrink-0" />
                {listing.address}
              </p>

              <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Submitted: {new Date(listing.submitted_at).toLocaleDateString()}
                </span>
                {listing.verified_at && (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Verified On: {new Date(listing.verified_at).toLocaleDateString()} ({listing.verified_by})
                  </span>
                )}
              </div>
            </div>

            {/* Tabs Navigation (Overview, Nearby, Reviews) */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-zinc-200 px-6 pt-4 gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#800000] text-[#800000]' : 'border-transparent text-zinc-500 hover:text-zinc-900'}`}
                >
                  Overview & Facilities
                </button>
                <button
                  onClick={() => setActiveTab('nearby')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'nearby' ? 'border-[#800000] text-[#800000]' : 'border-transparent text-zinc-500 hover:text-zinc-900'}`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Nearby & 500m Map
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'reviews' ? 'border-[#800000] text-[#800000]' : 'border-transparent text-zinc-500 hover:text-zinc-900'}`}
                >
                  <Star className="w-3.5 h-3.5" />
                  Reviews & Ratings
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* About This Boarding House */}
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-zinc-900">About This Boarding House</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                        {listing.description}
                      </p>
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Facilities & Amenities */}
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-zinc-900">Facilities & Amenities</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {listing.facilities.map((fac, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-700">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                            {fac}
                          </div>
                        ))}
                      </div>
                    </div>

                    {listing.verification_checklist && (
                      <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-300 space-y-4">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                          <ShieldCheck className="w-5 h-5 text-[#800000]" />
                          Official Team Verification Record
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-700">
                          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200">
                            <CheckCircle2 className="w-4 h-4 text-[#800000]" />
                            <span>Price Verified ({listing.verification_checklist.price_checked ? 'Yes' : 'No'})</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200">
                            <CheckCircle2 className="w-4 h-4 text-[#800000]" />
                            <span>Photos Inspected ({listing.verification_checklist.photos_checked ? 'Yes' : 'No'})</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200">
                            <CheckCircle2 className="w-4 h-4 text-[#800000]" />
                            <span>Availability Checked ({listing.verification_checklist.availability_checked ? 'Yes' : 'No'})</span>
                          </div>
                        </div>
                        {listing.verification_checklist.notes && (
                          <p className="text-xs text-zinc-600 bg-white p-3 rounded-xl border border-amber-200">
                            <strong>Verifier Notes:</strong> {listing.verification_checklist.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'nearby' && (
                  <div className="space-y-6">
                    {/* Campus Proximity & Commute Estimate Card */}
                    <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-300 space-y-4">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                        <Navigation className="w-5 h-5 text-[#800000]" />
                        SSU Bulan Campus Walking & Commute Estimates (500m Radius Zone)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-800">
                        <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center gap-3 shadow-sm">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Distance</span>
                            <strong className="text-sm font-extrabold text-zinc-900">{distanceKm.toFixed(2)} km</strong>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center gap-3 shadow-sm">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <Footprints className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Walking Time</span>
                            <strong className="text-sm font-extrabold text-zinc-900">~{walkingMinutes} mins walk</strong>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center gap-3 shadow-sm">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            <Bike className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Tricycle Commute</span>
                            <strong className="text-sm font-extrabold text-zinc-900">~{tricycleMinutes} mins ride</strong>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-amber-900/80 leading-relaxed">
                        Properties within a 500m walking radius from Sorsogon State University – Bulan Campus main gate allow students to easily walk to classes, student services, and campus facilities within 5 to 7 minutes.
                      </p>
                    </div>

                    {/* Interactive Leaflet Map with 500m Radius & Walking Path */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-zinc-900">Map & 500m Walking Radius to SSU Gate</h3>
                        <span className="text-xs text-zinc-500">OpenStreetMap & Leaflet</span>
                      </div>
                      <MapComponent
                        latitude={listing.latitude}
                        longitude={listing.longitude}
                        boardingHouseName={listing.name}
                        address={listing.address}
                        showRadius={true}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection listingId={listing.id} />
                )}

              </div>
            </div>

            {listing.status === 'REJECTED' && listing.rejection_reason && (
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 space-y-2">
                <h4 className="text-sm font-bold text-rose-800">Listing Verification Rejected</h4>
                <p className="text-xs text-rose-700">{listing.rejection_reason}</p>
              </div>
            )}

          </div>

          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6 sticky top-24">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#800000] uppercase tracking-wider">Owner / Agent Info</span>
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-zinc-500" />
                  {listing.owner.name}
                </h3>
                <p className="text-xs text-zinc-600 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  {listing.owner.contact_information}
                </p>
              </div>

              <Link
                to={`/messages?listing_id=${listing.id}`}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors border border-amber-600/30"
              >
                <MessageCircle className="w-4 h-4 fill-zinc-950 text-amber-500" />
                Open In-App Chat & Schedule Viewing
              </Link>

              {listing.owner.messenger_url && (
                <a
                  href={listing.owner.messenger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#0084FF] hover:bg-[#006edc] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Contact via Facebook Messenger
                </a>
              )}

              <hr className="border-zinc-100" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#800000]" />
                  Send Inquiry to Owner's Email
                </h4>
                {inquirySuccess ? (
                  <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-[#800000] mx-auto" />
                    <p className="text-xs font-bold text-amber-900">Inquiry Prepared & Sent!</p>
                    <p className="text-[11px] text-zinc-600">Opening your email client with pre-filled details...</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-700">Your Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-700">Your Email</label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-700">Message (Pre-filled with listing details)</label>
                      <textarea
                        rows={5}
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="w-full py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-400/40"
                    >
                      {submittingInquiry ? 'Sending...' : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Inquiry Email
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Report Listing Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-zinc-900">Report Inaccurate Listing</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-zinc-400 hover:text-zinc-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Report Submitted Successfully</h4>
                <p className="text-xs text-emerald-700">Thank you. The SSU Bulan Housing administration will review this report shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Reason for Reporting</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  >
                    <option value="Inaccurate Price / Hidden Fees">Inaccurate Price / Hidden Fees</option>
                    <option value="Incorrect Address / Location">Incorrect Address / Location</option>
                    <option value="Safety or Security Concern">Safety or Security Concern</option>
                    <option value="Already Full / Unavailable">Already Full / Unavailable</option>
                    <option value="Other Issue">Other Issue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Detailed Description & Notes</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please explain what is inaccurate or concerning about this boarding house..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Print Summary Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#800000]" />
                <h3 className="text-base font-bold text-zinc-900">Official Boarding House Print Summary</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl hover:bg-[#660000] cursor-pointer"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Content Area */}
            <div className="space-y-6 text-zinc-900 print:text-black">
              <div className="text-center space-y-1 pb-4 border-b-2 border-[#800000]">
                <h1 className="text-xl font-extrabold text-[#800000]">SORSOGON STATE UNIVERSITY – BULAN CAMPUS</h1>
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Boarding House Verification & Accreditation Record</p>
                <p className="text-[10px] text-zinc-400">Generated on: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Property Name:</span>
                  <strong className="text-sm font-extrabold text-zinc-900">{listing.name}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Monthly Rent:</span>
                  <strong className="text-sm font-extrabold text-[#800000]">₱{listing.monthly_price.toLocaleString()} / month</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block">Complete Address:</span>
                  <strong className="text-zinc-900">{listing.address}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Verification Status:</span>
                  <strong className="text-emerald-700">{listing.status}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Verified Date:</span>
                  <strong className="text-zinc-900">{listing.verified_at ? new Date(listing.verified_at).toLocaleDateString() : 'Pending'}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Owner & Contact Information</h4>
                <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div>
                    <span className="text-zinc-500 block">Owner Name:</span>
                    <strong>{listing.owner.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Contact Number:</span>
                    <strong>{listing.owner.contact_information}</strong>
                  </div>
                  {listing.owner.email && (
                    <div>
                      <span className="text-zinc-500 block">Email:</span>
                      <strong>{listing.owner.email}</strong>
                    </div>
                  )}
                  {listing.owner.messenger_url && (
                    <div>
                      <span className="text-zinc-500 block">Messenger:</span>
                      <strong>{listing.owner.messenger_url}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Facilities & Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {listing.facilities.map((fac, idx) => (
                    <span key={idx} className="text-xs bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200 font-medium">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {listing.verification_checklist && (
                <div className="space-y-2 pt-3 border-t border-zinc-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Official Inspection Checklist</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                      Price Checked: <strong>{listing.verification_checklist.price_checked ? 'Yes' : 'No'}</strong>
                    </div>
                    <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                      Photos Inspected: <strong>{listing.verification_checklist.photos_checked ? 'Yes' : 'No'}</strong>
                    </div>
                    <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                      Availability: <strong>{listing.verification_checklist.availability_checked ? 'Yes' : 'No'}</strong>
                    </div>
                  </div>
                  {listing.verification_checklist.notes && (
                    <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <strong>Verifier Notes:</strong> {listing.verification_checklist.notes}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-6 border-t border-zinc-200 text-center text-[10px] text-zinc-500 space-y-1">
                <p>Sorsogon State University – Bulan Campus Boarding House Verification & Student Accommodation System</p>
                <p>Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Gallery Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
              <span className="text-white text-xs font-bold bg-white/10 px-3.5 py-2 rounded-full border border-white/20">
                Photo {lightboxIndex + 1} of {photos.length}
              </span>
              <button
                onClick={() => setShowLightbox(false)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer border border-white/20"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative max-h-[75vh] max-w-4xl w-full flex items-center justify-center">
              <img
                src={photos[lightboxIndex]}
                alt={listing.name}
                className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />

              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                    className="absolute left-2 p-3 bg-black/70 hover:bg-black text-white rounded-full font-bold transition-all shadow-xl cursor-pointer border border-white/20"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => setLightboxIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 p-3 bg-black/70 hover:bg-black text-white rounded-full font-bold transition-all shadow-xl cursor-pointer border border-white/20"
                  >
                    ❯
                  </button>
                </>
              )}
            </div>

            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto max-w-md pb-2">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-16 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${lightboxIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-white/30 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
