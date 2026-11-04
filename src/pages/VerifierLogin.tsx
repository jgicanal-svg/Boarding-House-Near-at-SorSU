import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, AlertCircle, Mail, UserCheck } from 'lucide-react';
import { verifierLogin, forgotPassword } from '../services/api';

export const VerifierLogin: React.FC = () => {
  const [email, setEmail] = useState('verifier@sorsu.edu.ph');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
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

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your admin email and password.');
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
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#800000] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-zinc-950 tracking-tight">
          Admin & Verifier Portal
        </h2>
        <p className="text-center text-xs text-zinc-600">
          Enter your official SSU admin email and password to access the oversight dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200 rounded-2xl space-y-6">
          
          {error && (
            <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-xl flex items-start gap-3 text-rose-800 text-xs shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Authentication Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Admin Email Address</label>
              <input
                type="email"
                required
                placeholder="verifier@sorsu.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(null);
                    setForgotError(null);
                    setForgotModalOpen(true);
                  }}
                  className="text-[11px] font-medium text-[#800000] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-amber-400/40"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 text-amber-300" />
              )}
              {loading ? 'Signing in as Admin...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>

          <div className="pt-3 border-t border-zinc-100 text-center space-y-2">
            <div className="text-[11px] text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1">
              <p className="font-bold text-zinc-800">Demo Admin Credentials Hint:</p>
              <p>Email: <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">verifier@sorsu.edu.ph</code></p>
              <p>Password: <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">password123</code></p>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Public Home
          </Link>
        </div>
      </div>

      {forgotModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#800000]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Reset Admin Password</h3>
                  <p className="text-[11px] text-zinc-500">Receive a secure recovery link to your admin email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                <p className="text-xs font-bold text-emerald-800">Recovery Email Dispatched</p>
                <p className="text-xs text-emerald-700">{forgotSuccess}</p>
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
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{forgotError}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="verifier@sorsu.edu.ph"
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-colors"
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
