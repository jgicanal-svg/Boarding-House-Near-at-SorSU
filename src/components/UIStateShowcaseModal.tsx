import React, { useState } from 'react';
import { 
  Inbox, 
  Loader2, 
  AlertTriangle, 
  WifiOff, 
  Clock, 
  SearchX, 
  ShieldAlert, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  X,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface UIStateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UIStateShowcaseModal: React.FC<UIStateShowcaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSimulatingSlow, setIsSimulatingSlow] = useState(false);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#800000] text-white flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#800000] flex items-center justify-center font-bold shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">System UI States Gallery</h2>
              <p className="text-xs text-amber-200">Interactive preview of all 10 standard interface states for SSU Bulan Housing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tab Navigation */}
          <div className="w-72 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto space-y-1">
            {[
              { id: 1, title: '1. Empty State', icon: Inbox, desc: 'No items / favorites yet' },
              { id: 2, title: '2. Loading State', icon: Loader2, desc: 'Skeleton pulse loader' },
              { id: 3, title: '3. Error State', icon: AlertTriangle, desc: 'Server fetch failure' },
              { id: 4, title: '4. No Internet', icon: WifiOff, desc: 'Offline network mode' },
              { id: 5, title: '5. Slow Network', icon: Clock, desc: 'Low bandwidth delay' },
              { id: 6, title: '6. No Search Result', icon: SearchX, desc: 'Zero matching queries' },
              { id: 7, title: '7. Permission Denied', icon: ShieldAlert, desc: 'Role restriction notice' },
              { id: 8, title: '8. Session Expired', icon: Lock, desc: 'Token timeout alert' },
              { id: 9, title: '9. Form Validation', icon: AlertCircle, desc: 'Zod input error styling' },
              { id: 10, title: '10. Success State', icon: CheckCircle2, desc: 'Action completed modal' },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${isActive ? 'bg-[#800000] text-amber-300 shadow-md font-bold' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-zinc-400'}`} />
                  <div className="truncate">
                    <div className="text-xs">{tab.title}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-amber-100/80' : 'text-zinc-400'}`}>{tab.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main State Preview Area */}
          <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-zinc-900 flex flex-col justify-center items-center">
            
            {activeTab === 1 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-zinc-800 text-[#800000] dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Saved Boarding Houses</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  You haven't saved any boarding houses to your favorites yet. Browse verified listings near SSU Bulan Campus and click the heart icon to save them here.
                </p>
                <button 
                  onClick={() => { onClose(); window.location.href = '/listings'; }}
                  className="px-5 py-2.5 bg-[#800000] hover:bg-[#660000] text-amber-300 text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Browse Verified Listings
                </button>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#800000] dark:text-amber-400 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading Verified Properties...
                </div>
                <div className="space-y-4">
                  {[1, 2].map(n => (
                    <div key={n} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl animate-pulse space-y-3">
                      <div className="h-36 bg-zinc-200 dark:bg-zinc-700 rounded-xl w-full"></div>
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md bg-rose-50 dark:bg-zinc-800/80 p-8 rounded-3xl border border-rose-200 dark:border-zinc-700 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Failed to Connect to Database</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We encountered an unexpected error while retrieving listing verification records from the SSU server. Please try again.
                </p>
                <button 
                  onClick={() => alert('Retrying connection...')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Request
                </button>
              </motion.div>
            )}

            {activeTab === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md bg-zinc-100 dark:bg-zinc-800 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-3xl bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto">
                  <WifiOff className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Internet Connection</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Your device appears to be offline. Cached listing data is being displayed. Check your Wi-Fi or mobile data connection to view live updates.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {isSimulatingOffline ? 'Simulating Offline' : 'Test Reconnection'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md bg-amber-50 dark:bg-zinc-800/80 p-8 rounded-3xl border border-amber-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Slow Network Detected</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Your network connection is experiencing high latency. High-resolution boarding house photos are loading in compressed mode to save bandwidth.
                </p>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-1/2 animate-pulse"></div>
                </div>
              </motion.div>
            )}

            {activeTab === 6 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Boarding House Found</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We couldn't find any verified properties matching <strong className="text-zinc-800 dark:text-zinc-200">"Luxury Penthouse Zone 8"</strong> near SSU Bulan Campus. Try broadening your price range or clearing filters.
                </p>
                <button 
                  onClick={() => alert('Filters cleared!')}
                  className="px-5 py-2.5 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {activeTab === 7 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md bg-rose-50 dark:bg-zinc-800/80 p-8 rounded-3xl border border-rose-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Permission Denied</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  You are currently logged in as a Student. Access to the <strong className="text-zinc-800 dark:text-zinc-200">Verifier Review Dashboard</strong> requires administrator privileges.
                </p>
                <button 
                  onClick={() => { onClose(); window.location.href = '/verifier/login'; }}
                  className="px-5 py-2.5 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Log in as Verifier / Admin
                </button>
              </motion.div>
            )}

            {activeTab === 8 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md bg-zinc-50 dark:bg-zinc-800/80 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-zinc-700 text-[#800000] dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Session Expired</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  For your security, your session has expired due to 30 minutes of inactivity. Please re-enter your credentials to continue managing your housing records.
                </p>
                <button 
                  onClick={() => { onClose(); window.location.href = '/login'; }}
                  className="px-5 py-2.5 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Sign In Again
                </button>
              </motion.div>
            )}

            {activeTab === 9 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                  <AlertCircle className="w-4 h-4" />
                  Form Zod Validation Error State
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="student@ssubulan.edu.ph"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-rose-500 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <span className="text-[10px] text-rose-600 font-medium mt-1 block">Please enter a valid @ssubulan.edu.ph or registered email address.</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                    <input
                      type="password"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-rose-500 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <span className="text-[10px] text-rose-600 font-medium mt-1 block">Password must be at least 8 characters with 1 uppercase & 1 number.</span>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(true)}
                    className="w-full py-2.5 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Validate Form Input
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 10 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md bg-emerald-50 dark:bg-zinc-800/80 p-8 rounded-3xl border border-emerald-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Listing Verified Successfully!</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The boarding house inspection checklist has been successfully verified, stamped with the SSU official seal, and published live for students.
                </p>
                <button 
                  onClick={() => {
                    setSuccessToast(true);
                    setTimeout(() => setSuccessToast(false), 3000);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Trigger Success Toast
                </button>
                {successToast && (
                  <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg animate-bounce">
                    ✓ Success Toast Notification Triggered!
                  </div>
                )}
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
