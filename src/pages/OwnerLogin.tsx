import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { verifierLogin, forgotPassword } from '../services/api';

export const OwnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your owner email and password.');
      return;
    }

    if (!email.includes('@') || (!email.includes('owner') && !email.includes('bulanowner.com'))) {
      setError('Account not found. Please verify your registered owner email address.');
      return;
    }

    if (password.length < 6) {
      setError('Invalid password. Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifierLogin(email, password, 'OWNER');
      localStorage.setItem('ssu_owner_token', data.token);
      localStorage.setItem('ssu_user_name', data.user.name || email.split('@')[0]);
      localStorage.setItem('ssu_user_email', data.user.email);
      localStorage.setItem('ssu_user_role', 'OWNER');
      navigate('/submit');
    } catch (err: any) {
      setError(err.message || 'Authentication failed: Invalid password or owner account not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!email) {
      setError('Please enter your owner email address first.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSuccessMsg(res.message);
      setIsForgotMode(false);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch recovery link.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await verifierLogin('maria@bulanowner.com', 'google-token', 'OWNER');
      localStorage.setItem('ssu_owner_token', data.token);
      localStorage.setItem('ssu_user_name', 'Aling Maria Gicanal (Owner)');
      localStorage.setItem('ssu_user_email', 'maria@bulanowner.com');
      localStorage.setItem('ssu_user_role', 'OWNER');
      navigate('/submit');
    } catch {
      setError('Google authentication failed. Please try password login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto px-4 w-full space-y-6"
      >
        <div>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Portal Selection
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Boarding House Owner Sign In</h1>
            <p className="text-xs text-zinc-500">Manage your student boarding house listings and verification requests.</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Sign In Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#800000] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Success</span>
                <span>{successMsg}</span>
              </div>
            </div>
          )}

          {!isForgotMode && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs rounded-xl border border-zinc-300 shadow-xs transition-all flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.24 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.8 0 12s.43 3.9 1.19 5.42l4.09-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-200"></div>
                <span className="flex-shrink mx-4 text-zinc-400 text-[10px] uppercase font-semibold">or owner email</span>
                <div className="flex-grow border-t border-zinc-200"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Owner Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="maria@bulanowner.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700">Password *</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-[11px] text-amber-700 hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In as Owner'}
                </button>
              </form>
            </>
          )}

          {isForgotMode && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900">Reset Owner Password</h3>
                <p className="text-xs text-zinc-500">Enter your registered owner email address to receive a secure recovery link.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Owner Email *</label>
                <input
                  type="email"
                  required
                  placeholder="maria@bulanowner.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs text-zinc-600 space-y-1">
            <span className="font-bold text-zinc-900 block">Demo Owner Accounts:</span>
            <p>Email: <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">maria@bulanowner.com</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">juanico@bulanowner.com</code></p>
            <p>Password: <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">password123</code></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
