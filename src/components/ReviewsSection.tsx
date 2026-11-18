import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { StarRating } from './StarRating';

interface Review {
  id: string;
  name: string;
  rating: number;
  safetyRating: number;
  cleanlinessRating: number;
  responsivenessRating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  listingId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ listingId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [safetyRating, setSafetyRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [responsivenessRating, setResponsivenessRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('SSU Student');

  useEffect(() => {
    const saved = localStorage.getItem(`ssu_reviews_${listingId}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const initial: Review[] = [
        {
          id: 'rev-1',
          name: 'Maria Clara (Education Major)',
          rating: 5,
          safetyRating: 5,
          cleanlinessRating: 5,
          responsivenessRating: 5,
          comment: 'Very quiet and peaceful environment, perfect for studying. Walking distance to SSU Bulan Campus gate 2!',
          date: '2026-10-15'
        },
        {
          id: 'rev-2',
          name: 'Juan Dela Cruz (BSIT)',
          rating: 4,
          safetyRating: 4,
          cleanlinessRating: 4,
          responsivenessRating: 5,
          comment: 'Stable Wi-Fi and dependable water supply. Owner is very accommodating to student inquiries and concerns.',
          date: '2026-10-20'
        }
      ];
      setReviews(initial);
      localStorage.setItem(`ssu_reviews_${listingId}`, JSON.stringify(initial));
    }

    const storedName = localStorage.getItem('ssu_user_name') || localStorage.getItem('ssu_student_name');
    if (storedName) setReviewerName(storedName);
  }, [listingId]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: reviewerName,
      rating,
      safetyRating,
      cleanlinessRating,
      responsivenessRating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`ssu_reviews_${listingId}`, JSON.stringify(updated));
    setComment('');
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  const avgSafety = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.safetyRating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  const avgCleanliness = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.cleanlinessRating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  const avgResponsiveness = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.responsivenessRating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  const numericAvg = Number(avgRating);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Student Reviews & Safety Ratings ({reviews.length})
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Verified feedback from SSU Bulan students on safety, cleanliness, and landlord responsiveness.</p>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-zinc-800 px-5 py-3 rounded-2xl border border-amber-300 dark:border-zinc-700 shadow-xs">
          <div>
            <span className="text-3xl font-extrabold text-[#800000] dark:text-amber-400">{avgRating}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Overall Score</span>
          </div>
          <StarRating rating={Math.round(numericAvg)} size="sm" />
        </div>
      </div>

      {/* Subcategory Averages Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Safety & Security</span>
            <strong className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{avgSafety} / 5.0</strong>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Cleanliness</span>
            <strong className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{avgCleanliness} / 5.0</strong>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Landlord Responsiveness</span>
            <strong className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{avgResponsiveness} / 5.0</strong>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev, index) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#800000] text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">{rev.name}</span>
                  <span className="text-[10px] text-zinc-400 block">{rev.date} • Verified SSU Stay</span>
                </div>
              </div>
              <StarRating rating={rev.rating} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 py-1.5 px-3 bg-white dark:bg-zinc-900 rounded-xl text-[10px] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              <div>Safety: <strong className="text-[#800000] dark:text-amber-400">{rev.safetyRating || 5}/5</strong></div>
              <div>Cleanliness: <strong className="text-[#800000] dark:text-amber-400">{rev.cleanlinessRating || 5}/5</strong></div>
              <div>Responsiveness: <strong className="text-[#800000] dark:text-amber-400">{rev.responsivenessRating || 5}/5</strong></div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Review Form with Granular Ratings */}
      <form onSubmit={handleAddReview} className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-5">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquarePlus className="w-4 h-4 text-[#800000] dark:text-amber-400" />
          Leave Your Verified Student Review
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          {/* Overall Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">Overall Rating</label>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} interactive={true} onRatingChange={setRating} size="md" />
              <span className="text-xs font-bold text-[#800000] dark:text-amber-400">({rating}/5)</span>
            </div>
          </div>

          {/* Safety & Security */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">Safety & Security</label>
            <div className="flex items-center gap-3">
              <StarRating rating={safetyRating} interactive={true} onRatingChange={setSafetyRating} size="sm" />
              <span className="text-xs font-bold text-[#800000] dark:text-amber-400">({safetyRating}/5)</span>
            </div>
          </div>

          {/* Cleanliness */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">Cleanliness & Facilities</label>
            <div className="flex items-center gap-3">
              <StarRating rating={cleanlinessRating} interactive={true} onRatingChange={setCleanlinessRating} size="sm" />
              <span className="text-xs font-bold text-[#800000] dark:text-amber-400">({cleanlinessRating}/5)</span>
            </div>
          </div>

          {/* Landlord Responsiveness */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">Landlord Responsiveness</label>
            <div className="flex items-center gap-3">
              <StarRating rating={responsivenessRating} interactive={true} onRatingChange={setResponsivenessRating} size="sm" />
              <span className="text-xs font-bold text-[#800000] dark:text-amber-400">({responsivenessRating}/5)</span>
            </div>
          </div>
        </div>

        <textarea
          rows={3}
          required
          placeholder="Share your student experience regarding safety, cleanliness, water/electricity, and landlord responsiveness..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#800000]"
        ></textarea>

        <button
          type="submit"
          className="px-6 py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all border border-amber-400/30 active:scale-95 cursor-pointer"
        >
          Submit Verified Review
        </button>
      </form>
    </div>
  );
};
