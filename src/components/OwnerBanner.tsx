import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const OwnerBanner: React.FC = () => {
  return (
    <section className="py-16 bg-[#4d0000] text-white border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Partner with SSU Bulan Housing Directory
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Are You a Boarding House Owner in Bulan?
        </h2>
        <p className="text-sm sm:text-base text-zinc-200 max-w-2xl mx-auto leading-relaxed">
          List your property to reach hundreds of Sorsogon State University Bulan Campus students looking for verified accommodations. Increase your occupancy with trusted physical verification.
        </p>
        <div className="pt-2">
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-[#800000] font-extrabold text-sm rounded-xl shadow-xl transition-all border border-amber-500"
          >
            Add Boarding House Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
