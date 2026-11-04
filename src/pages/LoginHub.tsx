import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShieldCheck, UserCheck, ArrowRight, Sparkles, GraduationCap, Building2, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { verifierLogin } from '../services/api';

export const LoginHub: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (role: 'STUDENT' | 'OWNER') => {
    try {
      const email = role === 'STUDENT' ? 'student.google@sorsu.edu.ph' : 'maria@bulanowner.com';
      const password = 'google-auth-token';
      const data = await verifierLogin(email, password, role);
      if (role === 'STUDENT') {
        localStorage.setItem('ssu_student_token', data.token);
        localStorage.setItem('ssu_user_name', data.user.name || 'Google Student Seeker');
        localStorage.setItem('ssu_user_email', data.user.email);
        localStorage.setItem('ssu_user_role', 'STUDENT');
        navigate('/listings');
      } else {
        localStorage.setItem('ssu_owner_token', data.token);
        localStorage.setItem('ssu_user_name', data.user.name || 'Google Boarding Owner');
        localStorage.setItem('ssu_user_email', data.user.email);
        localStorage.setItem('ssu_user_role', 'OWNER');
        navigate('/submit');
      }
    } catch {
      alert('Google Authentication simulation failed. Please try password login.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#800000] text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            SSU Bulan Campus Housing Portal
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Select Your Portal Access</h1>
          <p className="text-sm text-zinc-600 max-w-lg mx-auto">
            Please select your role to sign in to the verified student accommodation and verification management system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Portal Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Student Portal</h3>
                <p className="text-xs text-zinc-500 mt-1">For Sorsogon State University Bulan Campus students seeking verified accommodation.</p>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
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

            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <Link
                to="/student/login"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Sign In as Student
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => handleGoogleLogin('STUDENT')}
                className="w-full py-2 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs rounded-xl border border-zinc-200 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.24 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.8 0 12s.43 3.9 1.19 5.42l4.09-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </motion.div>

          {/* Owner Portal Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-600"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Owner Portal</h3>
                <p className="text-xs text-zinc-500 mt-1">For boarding house landlords & property owners managing student rentals.</p>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
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

            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <Link
                to="/owner/login"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Sign In as Owner
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => handleGoogleLogin('OWNER')}
                className="w-full py-2 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs rounded-xl border border-zinc-200 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.24 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.8 0 12s.43 3.9 1.19 5.42l4.09-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </motion.div>

          {/* Admin / Verifier Portal Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#800000]"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#800000]/10 text-[#800000] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Admin Verifier Portal</h3>
                <p className="text-xs text-zinc-500 mt-1">For SSU Bulan housing verifiers and university administrative officers.</p>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
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

            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <Link
                to="/verifier/login"
                className="w-full py-2.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-400/30"
              >
                Sign In as Verifier Admin
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center">
                <span className="text-[10px] text-zinc-400">Secure University Credentials Required</span>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
