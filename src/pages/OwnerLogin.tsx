import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { verifierLogin, forgotPassword } from '../services/api';

const ownerLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Owner email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const OwnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccessMsg(null);

    const result = ownerLoginSchema.safeParse({ email, password });
    if (!result.success) {
      const formatted = result.error.format();
      setFieldErrors({
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0]
      });
      setError('Please fix the validation errors below.');
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
      setError(err.message || 'Authentication failed: Invalid credentials or owner account not found.');
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 py-16 flex items-center justify-center transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto px-4 w-full space-y-6"
      >
        <div>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Portal Selection
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-zinc-700 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Boarding House Owner Sign In</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter your Zod-validated credentials to manage listings.</p>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-zinc-900 border-2 border-rose-300 dark:border-zinc-700 p-3.5 rounded-xl flex items-start gap-2.5 text-rose-800 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Validation Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="bg-amber-50 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-700 p-3.5 rounded-xl flex items-start gap-2.5 text-amber-900 dark:text-amber-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#800000] dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Success</span>
                <span>{successMsg}</span>
              </div>
            </div>
          )}

          {!isForgotMode && (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Floating Label Email */}
              <div className="relative space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    id="owner_email"
                    required
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`peer w-full px-3.5 pt-5 pb-2.5 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none transition-colors ${fieldErrors.email ? 'border-rose-500 focus:border-rose-600' : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-600'}`}
                  />
                  <label 
                    htmlFor="owner_email"
                    className="absolute text-zinc-500 dark:text-zinc-400 text-xs duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-amber-600"
                  >
                    Owner Email Address
                  </label>
                </div>
                {fieldErrors.email && <span className="text-[10px] text-rose-600 font-medium">{fieldErrors.email}</span>}
              </div>

              {/* Floating Label Password with Show/Hide */}
              <div className="relative space-y-1">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 opacity-0">Password</span>
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="owner_password"
                    required
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`peer w-full px-3.5 pt-5 pb-2.5 pr-10 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none transition-colors ${fieldErrors.password ? 'border-rose-500 focus:border-rose-600' : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-600'}`}
                  />
                  <label 
                    htmlFor="owner_password"
                    className="absolute text-zinc-500 dark:text-zinc-400 text-xs duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-amber-600"
                  >
                    Password (min 6 chars)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <span className="text-[10px] text-rose-600 font-medium">{fieldErrors.password}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Validating & Authenticating...' : 'Sign In as Owner'}
              </button>
            </form>
          )}

          {isForgotMode && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Reset Owner Password</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter your registered owner email address to receive a secure recovery link.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Owner Email *</label>
                <input
                  type="email"
                  required
                  placeholder="maria@bulanowner.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-amber-600"
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
                  className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
