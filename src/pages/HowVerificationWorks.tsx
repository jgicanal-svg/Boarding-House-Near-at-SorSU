import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, XCircle, BookmarkCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowVerificationWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-[#800000] text-xs font-bold border border-amber-300">
            <ShieldCheck className="w-4 h-4 text-[#800000]" />
            Technologia Team - SSU Bulan Campus
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">How Boarding House Verification Works</h1>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Our mission is to protect Sorsogon State University students from online scams, inaccurate pricing, and transportation waste by personally inspecting every listing before it appears publicly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#800000] text-amber-300 font-bold flex items-center justify-center border border-amber-400/40">
              01
            </div>
            <h3 className="text-base font-bold text-zinc-900">Owner Submission</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Boarding house owners or agents submit their accommodation details, monthly rental rates, facilities, and contact info.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#800000] text-amber-300 font-bold flex items-center justify-center border border-amber-400/40">
              02
            </div>
            <h3 className="text-base font-bold text-zinc-900">Physical Inspection</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              An authorized verifier from our campus team visits the location to complete our 3-point verification checklist (Price, Photos, Availability).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#800000] text-amber-300 font-bold flex items-center justify-center border border-amber-400/40">
              03
            </div>
            <h3 className="text-base font-bold text-zinc-900">Publish or Reject</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Approved listings go live instantly for students to browse. Rejected listings receive clear feedback for owner correction and resubmission.
            </p>
          </div>

        </div>

        {/* Status Definitions */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-zinc-900">Understanding Listing Statuses</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="mt-1"><Clock className="w-5 h-5 text-amber-500" /></div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">AWAITING_VERIFICATION</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  The listing has been submitted by the owner but has not yet been reviewed or visited by an authorized team verifier. Hidden from public student feed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-amber-600" /></div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">VERIFIED</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  The listing has successfully passed physical inspection and checklist verification. Fully visible to all SSU students with accurate student pricing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="mt-1"><XCircle className="w-5 h-5 text-rose-500" /></div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">REJECTED</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  The listing failed verification (e.g., incorrect pricing or safety concerns). Accompanied by a detailed rejection reason. Owners can correct and resubmit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="mt-1"><BookmarkCheck className="w-5 h-5 text-[#800000]" /></div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">RESERVED & TAKEN</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  Indicates current room availability status. Reserved means a student has held the room; Taken means fully occupied for the semester.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="mt-1"><AlertTriangle className="w-5 h-5 text-zinc-400" /></div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">EXPIRED</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  Listings that have not received an availability update from the owner within 14 days are automatically marked expired pending re-verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/listings"
            className="inline-block px-8 py-3.5 bg-[#800000] text-amber-300 font-bold text-xs rounded-xl hover:bg-[#660000] transition-colors shadow-md border border-amber-400/30"
          >
            Browse Verified Listings Now
          </Link>
        </div>

      </div>
    </div>
  );
};
