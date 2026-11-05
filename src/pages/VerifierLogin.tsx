import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, AlertCircle, Mail, UserCheck, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { verifierLogin, forgotPassword } from '../services/api';

const verifierLoginSchema = z.object({
  email: z.string().email('Please enter a valid admin email address').min(1, 'Admin email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const VerifierLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const result = verifierLoginSchema.safeParse({ email, password });
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
      const res = await verifierLogin(email, password, 'VERIFIER');
      localStorage.setItem('ssu_verifier_token', res.token);
      localStorage.setItem('ssu_verifier_name', res.user.name || 'Admin Verifier');
      localStorage.setItem('ssu_user_role', 'VERIFIER');
      navigate('/verifier/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Admin authentication failed. Please check your credentials.');
      } else {
        setError('Admin authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);
    try {
      const res = await forgotPassword(forgotEmail);
      setForgotSuccess(res.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setForgotError(err.message || 'Failed to send recovery link');
      } else {
        setForgotError('Failed to send recovery link');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#800000] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-zinc-950 dark:text-zinc-100 tracking-tight">
          Admin & Verifier Portal
        </h2>
        <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
          Enter your Zod-validated official SSU admin credentials to access oversight dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-zinc-800 py-8 px-6 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-2xl space-y-6">
          
          {error && (
            <div className="bg-rose-50 dark:bg-zinc-900 border-2 border-rose-300 dark:border-zinc-700 p-4 rounded-xl flex items-start gap-3 text-rose-800 dark:text-rose-400 text-xs shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Validation Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Floating Label Email */}
            <div className="relative space-y-1">
              <div className="relative">
                <input
                  type="email"
                  id="verifier_email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`peer w-full px-3.5 pt-5 pb-2.5 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none transition-colors ${fieldErrors.email ? 'border-rose-500 focus:border-rose-600' : 'border-zinc-300 dark:border-zinc-700 focus:border-[#800000]'}`}
                />
                <label 
                  htmlFor="verifier_email"
                  className="absolute text-zinc-500 dark:text-zinc-400 text-xs duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#800000]"
                >
                  Admin Email Address
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
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(null);
                    setForgotError(null);
                    setForgotModalOpen(true);
                  }}
                  className="text-[11px] font-medium text-[#800000] dark:text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="verifier_password"
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`peer w-full px-3.5 pt-5 pb-2.5 pr-10 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none transition-colors ${fieldErrors.password ? 'border-rose-500 focus:border-rose-600' : 'border-zinc-300 dark:border-zinc-700 focus:border-[#800000]'}`}
                />
                <label 
                  htmlFor="verifier_password"
                  className="absolute text-zinc-500 dark:text-zinc-400 text-xs duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#800000]"
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
              className="w-full py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-amber-400/40 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 text-amber-300" />
              )}
              {loading ? 'Validating & Signing in...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Public Home
          </Link>
        </div>
      </div>

      {forgotModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-zinc-700 flex items-center justify-center text-[#800000] dark:text-amber-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Reset Admin Password</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Receive a secure recovery link to your admin email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="bg-emerald-50 dark:bg-zinc-900 border border-emerald-200 dark:border-zinc-700 p-4 rounded-xl space-y-3">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Recovery Email Dispatched</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{forgotSuccess}</p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-800"
                >
                  Close & Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotError && (
                  <div className="bg-rose-50 dark:bg-zinc-900 border border-rose-200 dark:border-zinc-700 p-3 rounded-xl text-xs text-rose-800 dark:text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{forgotError}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="verifier@sorsu.edu.ph"
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
