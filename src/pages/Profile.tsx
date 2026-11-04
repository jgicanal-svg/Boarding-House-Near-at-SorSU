import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, CheckCircle2, Camera, ArrowLeft, Upload, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Profile: React.FC = () => {
  const [name, setName] = useState('Student Seeker');
  const [email, setEmail] = useState('student@sorsu.edu.ph');
  const [contact, setContact] = useState('09123456789');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const [role, setRole] = useState('STUDENT');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  ];

  useEffect(() => {
    const storedRole = localStorage.getItem('ssu_user_role') || 
      (localStorage.getItem('ssu_verifier_token') ? 'VERIFIER' : 
       localStorage.getItem('ssu_owner_token') ? 'OWNER' : 'STUDENT');
    const storedName = localStorage.getItem('ssu_user_name') || localStorage.getItem('ssu_student_name') || localStorage.getItem('ssu_owner_name') || (storedRole === 'OWNER' ? 'Boarding House Owner' : storedRole === 'VERIFIER' ? 'Admin / Verifier' : 'Student Seeker');
    const storedEmail = localStorage.getItem('ssu_user_email') || (storedRole === 'OWNER' ? 'owner@bulan.edu.ph' : storedRole === 'VERIFIER' ? 'verifier@sorsu.edu.ph' : 'student@sorsu.edu.ph');
    const storedContact = localStorage.getItem('ssu_user_contact') || '09123456789';
    const storedAvatar = localStorage.getItem('ssu_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    setName(storedName);
    setEmail(storedEmail);
    setContact(storedContact);
    setAvatarUrl(storedAvatar);
    setRole(storedRole);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ssu_user_name', name);
    localStorage.setItem('ssu_user_email', email);
    localStorage.setItem('ssu_user_contact', contact);
    localStorage.setItem('ssu_user_avatar', avatarUrl);
    if (role === 'STUDENT') {
      localStorage.setItem('ssu_student_name', name);
    } else if (role === 'OWNER') {
      localStorage.setItem('ssu_owner_name', name);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getRoleDisplayName = (r: string) => {
    if (r === 'OWNER') return 'Boarding House Owner';
    if (r === 'VERIFIER' || r === 'ADMIN') return 'Admin / Verifier';
    return 'Student Seeker';
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-zinc-100 pb-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 border-2 border-[#800000] shadow-md group">
              <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                <Upload className="w-5 h-5 mb-1" />
                Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-[#800000] text-xs font-bold border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                {getRoleDisplayName(role)}
              </div>
              <h1 className="text-xl font-extrabold text-zinc-900">{name}</h1>
              <p className="text-xs text-zinc-500">{email}</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-center gap-3 text-amber-900 text-xs">
              <CheckCircle2 className="w-5 h-5 text-[#800000] shrink-0" />
              <span className="font-bold">Profile and role badge updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/60">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#800000]" />
                Profile Information & Role Designation
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Display Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Contact Number *</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Active Role & Permission</label>
                <input
                  type="text"
                  disabled
                  value={getRoleDisplayName(role)}
                  className="w-full px-3 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 cursor-not-allowed"
                />
                <span className="text-[10px] text-zinc-500">Role is determined by your active account portal login session.</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#800000]" />
                    Profile Picture / Avatar URL or Upload
                  </span>
                  <label className="text-[11px] text-[#800000] font-bold cursor-pointer hover:underline">
                    Browse File...
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                />
                
                {/* Preset Avatars */}
                <div className="pt-2">
                  <span className="text-[11px] text-zinc-500 block mb-2">Or choose a preset avatar:</span>
                  <div className="flex gap-3">
                    {presetAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 ${avatarUrl === url ? 'border-[#800000] shadow-md scale-105' : 'border-zinc-200'}`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all border border-amber-400/40 active:scale-95"
            >
              Save Profile Changes
            </button>

          </form>

        </div>

      </motion.div>
    </div>
  );
};
