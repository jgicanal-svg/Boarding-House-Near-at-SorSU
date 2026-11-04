import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, UserCheck, LogOut, PlusCircle, User, Heart, MessageSquare, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifierToken = localStorage.getItem('ssu_verifier_token');
  const ownerToken = localStorage.getItem('ssu_owner_token');
  const studentToken = localStorage.getItem('ssu_student_token');
  const userRole = localStorage.getItem('ssu_user_role') || (verifierToken ? 'VERIFIER' : ownerToken ? 'OWNER' : studentToken ? 'STUDENT' : '');
  const isLoggedIn = Boolean(verifierToken || ownerToken || studentToken);
  const isOwner = userRole === 'OWNER' || Boolean(ownerToken);
  const userName = localStorage.getItem('ssu_user_name') || localStorage.getItem('ssu_student_name') || localStorage.getItem('ssu_owner_name') || 'User';

  const [isDark, setIsDark] = useState(() => localStorage.getItem('ssu_theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ssu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ssu_theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem('ssu_verifier_token');
    localStorage.removeItem('ssu_verifier_name');
    localStorage.removeItem('ssu_owner_token');
    localStorage.removeItem('ssu_student_token');
    localStorage.removeItem('ssu_user_name');
    localStorage.removeItem('ssu_user_role');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand wordmark */}
          <Link to="/" className="flex items-center gap-3 group whitespace-nowrap shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-amber-300 shadow-md shadow-[#800000]/20 group-hover:bg-[#660000] transition-colors border border-amber-400/30">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-base font-extrabold text-[#800000] dark:text-amber-400 tracking-tight block">SSU Bulan Housing</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-500 font-semibold block tracking-wider uppercase">
                {userRole === 'STUDENT' ? 'Student Portal' : userRole === 'OWNER' ? 'Owner Portal' : userRole === 'VERIFIER' ? 'Verifier Admin' : 'Verified Boarding Guide'}
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link 
              to="/" 
              className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/') ? 'text-[#800000] dark:text-amber-400 font-bold border-b-2 border-[#800000] dark:border-amber-400 pb-1' : 'hover:text-[#800000]'}`}
            >
              Home
            </Link>
            {isOwner ? (
              <Link 
                to="/how-it-works" 
                className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/how-it-works') ? 'text-[#800000] dark:text-amber-400 font-bold border-b-2 border-[#800000] dark:border-amber-400 pb-1' : 'hover:text-[#800000]'}`}
              >
                How Verification Works
              </Link>
            ) : (
              <Link 
                to="/listings" 
                className={`transition-colors whitespace-nowrap shrink-0 ${isActive('/listings') ? 'text-[#800000] dark:text-amber-400 font-bold border-b-2 border-[#800000] dark:border-amber-400 pb-1' : 'hover:text-[#800000]'}`}
              >
                Verified Listings
              </Link>
            )}
          </nav>

          {/* Zone 3: Primary action & Profile / Login */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/messages"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap rounded-lg border ${isActive('/messages') ? 'bg-[#800000] text-amber-300 border-[#800000]' : 'bg-amber-50 dark:bg-zinc-800 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-zinc-700 hover:bg-amber-100'}`}
                  title="Messages & Viewings"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                  Messages
                </Link>

                {isOwner ? (
                  <Link
                    to="/submit"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 bg-[#800000] hover:bg-[#660000] rounded-lg transition-colors whitespace-nowrap border border-amber-400/40 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                    Add Boarding House
                  </Link>
                ) : !verifierToken ? (
                  <Link
                    to="/listings?favorites=true"
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-zinc-800 hover:bg-rose-100 rounded-lg transition-colors whitespace-nowrap border border-rose-200 dark:border-zinc-700"
                    title="Saved Favorites"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-600" />
                    Favorites
                  </Link>
                ) : null}

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors whitespace-nowrap border border-zinc-200 dark:border-zinc-700"
                >
                  <User className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                  {userName}
                </Link>
                {verifierToken && (
                  <Link
                    to="/verifier/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#800000] dark:text-amber-400 bg-amber-50 dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap"
                  >
                    <UserCheck className="w-4 h-4 text-[#800000] dark:text-amber-400" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-700 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-300 bg-[#800000] hover:bg-[#660000] shadow-md rounded-lg transition-colors whitespace-nowrap border border-amber-400/40"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  Account Login
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
