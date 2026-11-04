import React from 'react';
import { ShieldCheck, MapPin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsletterSubscription } from './NewsletterSubscription';
import { WeatherWidget } from './WeatherWidget';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4d0000] dark:bg-zinc-950 text-zinc-300 dark:text-zinc-400 pt-16 pb-12 border-t-4 border-amber-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Weather Widget */}
        <WeatherWidget />

        {/* Footer Call To Action & Newsletter Banner */}
        <div className="bg-[#330000] dark:bg-zinc-900 p-8 rounded-3xl border border-amber-400/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">Looking for Trusted Student Housing in Bulan?</h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              Browse verified dorms and boarding houses near Sorsogon State University – Bulan Campus. No transportation waste, direct owner contact.
            </p>
          </div>

          <NewsletterSubscription />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#660000] dark:border-zinc-800">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#800000] border border-amber-400/40 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">SSU Bulan Housing</span>
            </div>
            <p className="text-xs text-zinc-300 dark:text-zinc-400 leading-relaxed">
              Personalized verification and trusted accommodation directory for students of Sorsogon State University – Bulan Campus. Eliminating transportation waste and outdated social media listings.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-300 dark:text-zinc-400">
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Home</Link></li>
              <li><Link to="/listings" className="hover:text-amber-300 transition-colors">Verified Listings</Link></li>
              <li><Link to="/how-it-works" className="hover:text-amber-300 transition-colors">How Verification Works</Link></li>
              <li><Link to="/submit" className="hover:text-amber-300 transition-colors">Submit Boarding House</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">Campus & Location</h4>
            <ul className="space-y-3 text-xs text-zinc-300 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Sorsogon State University – Bulan Campus, Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@ssubulan-housing.edu.ph</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} SSU Bulan Campus Boarding House Verification System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> for SSU Bulan Students
          </p>
        </div>
      </div>
    </footer>
  );
};
