import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
        <Mail className="w-4 h-4 text-amber-400" />
        Subscribe to SSU Housing Updates & Policy Alerts
      </h4>
      {subscribed ? (
        <div className="bg-emerald-950/80 border border-emerald-500/50 p-3.5 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Successfully subscribed! You will receive new listing alerts and SSU housing announcements.</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Enter your SSU student or parent email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#4d0000] border border-amber-400/40 rounded-xl text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#800000] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 border border-amber-500 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};
