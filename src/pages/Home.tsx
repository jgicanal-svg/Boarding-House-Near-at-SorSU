import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, CheckCircle2, ArrowRight, Building2, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types';
import { fetchListings } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { FAQ } from '../components/FAQ';

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings()
      .then(data => {
        setFeaturedListings(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings?search=${encodeURIComponent(searchQuery)}&zone=${encodeURIComponent(selectedZone)}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col overflow-hidden transition-colors">
      
      {/* Hero Section */}
      <section className="relative bg-[#4d0000] dark:bg-[#330000] text-white overflow-hidden py-24 lg:py-32 border-b-4 border-amber-400">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/src/assets/images/bulan_boarding_hero_1793166105471.jpg"
            alt="Bulan Campus Housing"
            className="w-full h-full object-cover scale-105 animate-pulse duration-[10000ms]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#330000] via-[#4d0000]/95 to-transparent"></div>

        {/* Decorative Floating Glow Elements */}
        <div className="absolute top-12 right-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-4 left-1/3 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-lg backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Sorsogon State University – Bulan Campus Verified Housing
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-wrap balance">
              Find Your Verified Boarding House in Bulan.
            </h1>

            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-2xl">
              Stop wasting money on transportation and outdated social media posts. Every boarding house listed here is personally inspected and verified by our trusted team verifiers.
            </p>

            {/* Search Bar Form */}
            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch} 
              className="bg-white dark:bg-zinc-800 p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2.5 max-w-2xl border border-amber-400/40"
            >
              <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-700 focus-within:border-[#800000] transition-colors">
                <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, street, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <div className="sm:w-52">
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full h-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 focus:outline-none border border-zinc-200/60 dark:border-zinc-700"
                >
                  <option value="">All Areas (Bulan, Sorsogon)</option>
                  <option value="Zone VIII Poblacion">Zone VIII Poblacion (Barangay 8 - Loyo)</option>
                  <option value="Santa Remedios">Santa Remedios</option>
                  <option value="Obrero">Obrero</option>
                  <option value="ManagaNaga">ManagaNaga</option>
                  <option value="Libertad">Libertad</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-sm rounded-xl transition-all shadow-md shadow-[#800000]/30 whitespace-nowrap border border-amber-400/40 cursor-pointer active:scale-95"
              >
                Search Listings
              </button>
            </motion.form>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-zinc-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>100% Physically Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Accurate Student Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Direct Owner Messenger Links</span>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 relative transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Why Use SSU Bulan Housing Verification?</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Designed specifically for students and parents searching for secure, affordable student housing in Bulan.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#800000] text-amber-300 flex items-center justify-center shadow-lg shadow-[#800000]/20 border border-amber-400/30">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Trusted Verification</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our team checks every room, reviews monthly rental pricing, inspects safety facilities, and confirms current availability before publishing.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#800000] text-amber-300 flex items-center justify-center shadow-lg shadow-[#800000]/20 border border-amber-400/30">
                <Smartphone className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Direct Messenger Contact</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Connect instantly with boarding house owners or agents via pre-filled Facebook Messenger links without intermediary fees.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#800000] text-amber-300 flex items-center justify-center shadow-lg shadow-[#800000]/20 border border-amber-400/30">
                <Building2 className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Transportation Waste</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Browse exact distances to SSU Bulan Campus, complete facility lists, clear photos, and exact prices from your phone before visiting.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Verified Listings in Responsive Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Featured Verified Boarding Houses</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Recently inspected and approved accommodations near SSU Bulan Campus.</p>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#800000] dark:text-amber-400 hover:text-amber-700 group"
          >
            Browse All Verified Listings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white dark:bg-zinc-800 rounded-3xl p-4 h-80 animate-pulse border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between">
                <div className="bg-zinc-200 dark:bg-zinc-700 h-48 rounded-2xl w-full"></div>
                <div className="space-y-2">
                  <div className="bg-zinc-200 dark:bg-zinc-700 h-4 rounded w-3/4"></div>
                  <div className="bg-zinc-200 dark:bg-zinc-700 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">No verified listings available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Student FAQ Component with Accordion Functionality */}
      <FAQ />

    </div>
  );
};
