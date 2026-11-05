import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 py-16 flex items-center justify-center transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-zinc-800 text-[#800000] dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-zinc-700">
            <Sparkles className="w-3.5 h-3.5" />
            SSU Bulan Campus Housing Portal
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Select Your Portal Access</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Please select your role and sign in with your credentials to access the verified student accommodation and verification management system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Portal Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-zinc-700 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Student Portal</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For Sorsogon State University Bulan Campus students seeking verified accommodation.</p>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Browse 100% verified listings
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Calculate campus commute times
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Share reviews and save favorites
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-700">
              <Link
                to="/student/login"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Sign In as Student
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Owner Portal Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-600"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-zinc-700 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Owner Portal</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For boarding house landlords & property owners managing student rentals.</p>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Submit & manage listings
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Request SSU verifier inspection
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Receive student inquiries
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-700">
              <Link
                to="/owner/login"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Sign In as Owner
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Admin / Verifier Portal Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#800000]"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#800000]/10 dark:bg-zinc-700 text-[#800000] dark:text-amber-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Admin Verifier Portal</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For SSU Bulan housing verifiers and university administrative officers.</p>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Review & inspect listings
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verify safety compliance
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reset all accounts & data
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-700">
              <Link
                to="/verifier/login"
                className="w-full py-2.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-400/30"
              >
                Sign In as Verifier Admin
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
