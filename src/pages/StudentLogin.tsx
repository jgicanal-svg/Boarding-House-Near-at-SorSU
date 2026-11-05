import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { z } from 'zod';
import { verifierLogin } from '../services/api';

const studentLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Student email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const result = studentLoginSchema.safeParse({ email, password });
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
      const data = await verifierLogin(email, password, 'STUDENT');
      localStorage.setItem('ssu_student_token', data.token);
      localStorage.setItem('ssu_user_name', data.user.name || email.split('@')[0]);
      localStorage.setItem('ssu_user_email', data.user.email);
      localStorage.setItem('ssu_user_role', 'STUDENT');
      navigate('/listings');
    } catch (err: any) {
      setError(err.message || 'Authentication failed: Invalid credentials or student account not found.');
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
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-zinc-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto font-bold shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Student Sign In</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter your Zod-validated student credentials to access SSU Bulan accommodations.</p>
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

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Floating Label Email Field */}
            <div className="relative space-y-1">
              <div className="relative">
                <input
                  type="email"
                  id="student_email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`peer w-full px-3.5 pt-5 pb-2.5 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none transition-colors ${fieldErrors.email ? 'border-rose-500 focus:border-rose-600' : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-600'}`}
                />
                <label 
                  htmlFor="student_email"
                  className="absolute text-zinc-500 dark:text-zinc-400 text-xs duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                >
                  Student Email (@sorsu.edu.ph)
                </label>
              </div>
              {fieldErrors.email && <span className="text-[10px] text-rose-600 font-medium">{fieldErrors.email}</span>}
            </div>

            {/* Floating Label Password Field with Show/Hide Toggle */}
            <div className="relative space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="student_password"
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`peer w-full px-3.5 pt-5 pb-2.5 pr-10 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none transition-colors ${fieldErrors.password ? 'border-rose-500 focus:border-rose-600' : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-600'}`}
                />
                <label 
                  htmlFor="student_password"
                  className="absolute text-zinc-500 dark:text-zinc-400 text-xs duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
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
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Validating & Authenticating...' : 'Sign In to Student Portal'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
