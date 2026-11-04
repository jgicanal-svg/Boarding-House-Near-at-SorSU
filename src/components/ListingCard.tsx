import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { Listing } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';

interface ListingCardProps {
  listing: Listing;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isCompared, onToggleCompare }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
    setIsFavorite(favs.includes(listing.id));
  }, [listing.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
    let updated: string[];
    if (favs.includes(listing.id)) {
      updated = favs.filter(id => id !== listing.id);
      setIsFavorite(false);
    } else {
      updated = [...favs, listing.id];
      setIsFavorite(true);
    }
    localStorage.setItem('ssu_favorite_listings', JSON.stringify(updated));
  };

  const primaryPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : '/src/assets/images/student_room_interior_1793166105502.jpg';

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Image Container with Availability Badge, Favorite Button, Compare Button & Price Tag */}
      <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
        <img
          src={primaryPhoto}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <AvailabilityBadge status={listing.status} />
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(listing.id);
              }}
              className={`px-2.5 py-1.5 rounded-xl backdrop-blur-md transition-colors shadow-md text-[11px] font-bold ${isCompared ? 'bg-[#800000] text-amber-300 border border-amber-400' : 'bg-white/90 text-zinc-700 hover:bg-white'}`}
              title={isCompared ? 'Remove from comparison' : 'Add to comparison (max 3)'}
            >
              {isCompared ? '✓ Comparing' : '+ Compare'}
            </button>
          )}
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-md ${isFavorite ? 'bg-rose-600 text-white' : 'bg-white/80 text-zinc-700 hover:bg-white'}`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-3 right-3 bg-[#800000]/95 backdrop-blur-md text-amber-300 px-3.5 py-1.5 rounded-xl text-sm font-bold tabular-nums shadow-lg border border-amber-400/40">
          ₱{listing.monthly_price.toLocaleString()} <span className="text-[11px] font-normal text-zinc-200">/ mo</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Metadata */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <span className="flex items-center gap-1 font-semibold text-[#800000]">
              <MapPin className="w-3.5 h-3.5" />
              {listing.address.split(',')[0]}
            </span>
            <span aria-hidden="true">·</span>
            <span>{listing.facilities.length} Facilities</span>
          </div>

          <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#800000] transition-colors line-clamp-1 mb-1">
            {listing.name}
          </h3>

          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-3">
            {listing.description}
          </p>

          {/* Facilities summary */}
          <div className="flex flex-wrap gap-1.5">
            {listing.facilities.slice(0, 3).map((fac, idx) => (
              <span key={idx} className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                {fac}
              </span>
            ))}
            {listing.facilities.length > 3 && (
              <span className="text-[11px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded font-medium">
                +{listing.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">
            {listing.verified_at ? `Verified ${new Date(listing.verified_at).toLocaleDateString()}` : 'Awaiting verification'}
          </span>
          <Link
            to={`/listings/${listing.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800000] hover:text-amber-700 group-hover:translate-x-1 transition-transform"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
