import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { StarRating } from './StarRating';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  listingId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ listingId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
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
          comment: 'Very quiet and peaceful environment, perfect for studying. Walking distance to SSU Bulan Campus gate 2!',
          date: '2026-10-15'
        },
        {
          id: 'rev-2',
          name: 'Juan Dela Cruz (BSIT)',
          rating: 4,
          comment: 'Stable Wi-Fi and dependable water supply. Owner is very accommodating to students.',
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

  const numericAvg = Number(avgRating);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Student Reviews & Ratings ({reviews.length})
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Verified feedback from SSU Bulan students who stayed here.</p>
        </div>
        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-300 shadow-xs">
          <span className="text-2xl font-extrabold text-[#800000]">{avgRating}</span>
          <StarRating rating={Math.round(numericAvg)} size="sm" />
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
            className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#800000] text-amber-300 flex items-center justify-center font-bold text-xs">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">{rev.name}</span>
                  <span className="text-[10px] text-zinc-400 block">{rev.date}</span>
                </div>
              </div>
              <StarRating rating={rev.rating} size="sm" />
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed pl-10">{rev.comment}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleAddReview} className="pt-6 border-t border-zinc-100 space-y-4">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquarePlus className="w-4 h-4 text-[#800000]" />
          Share Your Experience
        </h4>

        <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <span className="text-xs font-semibold text-zinc-700">Your Rating:</span>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
          />
          <span className="text-xs font-bold text-[#800000] ml-2">({rating} / 5 stars)</span>
        </div>

        <textarea
          rows={3}
          required
          placeholder="Write your review about cleanliness, water, electricity, and distance to SSU campus..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
        ></textarea>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all border border-amber-400/30 active:scale-95"
        >
          Submit Student Review
        </button>
      </form>
    </div>
  );
};
