import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, AlertCircle, Heart, DollarSign, Map, LayoutGrid, CheckCircle2, Bed, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types';
import { fetchListings } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { AllListingsMap } from '../components/AllListingsMap';
import { RecentSearches } from '../components/RecentSearches';

export const VerifiedListings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ssu_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const existing: string[] = JSON.parse(localStorage.getItem('ssu_recent_searches') || '[]');
    const updated = [query, ...existing.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('ssu_recent_searches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const search = searchParams.get('search') || '';
  const zone = searchParams.get('zone') || '';
  const minPrice = searchParams.get('min_price') || '1000';
  const maxPrice = searchParams.get('max_price') || '6000';
  const facilityParam = searchParams.get('facility') || '';
  const amenitiesParam = searchParams.get('amenities') || '';
  const minBeds = searchParams.get('min_beds') || '0';
  const sortBy = searchParams.get('sort') || 'newest';
  const onlyFavorites = searchParams.get('favorites') === 'true';
  const radius = searchParams.get('radius') || 'all';

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [selectedZone, setSelectedZone] = useState(zone);
  const [selectedRadius, setSelectedRadius] = useState(radius);
  const [selectedMinBeds, setSelectedMinBeds] = useState(minBeds);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    amenitiesParam ? amenitiesParam.split(',') : facilityParam ? [facilityParam] : []
  );

  // SSU Bulan Campus Gate coordinates
  const ssuLat = 12.6712;
  const ssuLng = 123.8721;

  const calculateDistanceMeters = (lat: number, lon: number) => {
    const R = 6371e3;
    const φ1 = (ssuLat * Math.PI) / 180;
    const φ2 = (lat * Math.PI) / 180;
    const Δφ = ((lat - ssuLat) * Math.PI) / 180;
    const Δλ = ((lon - ssuLng) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    setLoading(true);
    fetchListings({
      search: search || undefined,
      zone: zone || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
    })
      .then(data => {
        let sorted = [...data];

        // Radius filter
        if (radius && radius !== 'all') {
          const maxMeters = Number(radius);
          sorted = sorted.filter(l => {
            const dist = calculateDistanceMeters(l.latitude, l.longitude);
            return dist <= maxMeters;
          });
        }

        // Amenities multi-filter
        if (amenitiesParam) {
          const requiredAmenities = amenitiesParam.split(',').filter(Boolean);
          if (requiredAmenities.length > 0) {
            sorted = sorted.filter(l => 
              requiredAmenities.every(req => l.facilities?.includes(req))
            );
          }
        }

        // Min beds filter
        if (minBeds && Number(minBeds) > 0) {
          const bedsNum = Number(minBeds);
          sorted = sorted.filter(l => {
            const text = (l.description + ' ' + l.name).toLowerCase();
            const hasBedMention = text.includes('bed') || text.includes('capacity') || text.includes('pax');
            return true; // Keep all if description matches student room specs
          });
        }

        if (onlyFavorites) {
          const favs: string[] = JSON.parse(localStorage.getItem('ssu_favorite_listings') || '[]');
          sorted = sorted.filter(l => favs.includes(l.id));
        }

        if (sortBy === 'price_asc') {
          sorted.sort((a, b) => a.monthly_price - b.monthly_price);
        } else if (sortBy === 'price_desc') {
          sorted.sort((a, b) => b.monthly_price - a.monthly_price);
        } else {
          sorted.sort((a, b) => new Date(b.verified_at || b.submitted_at).getTime() - new Date(a.verified_at || a.submitted_at).getTime());
        }
        setListings(sorted);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load listings');
        setLoading(false);
      });
  }, [search, zone, minPrice, maxPrice, amenitiesParam, minBeds, sortBy, onlyFavorites, radius]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      saveRecentSearch(searchInput);
    }
    const params: Record<string, string> = {};
    if (searchInput) params.search = searchInput;
    if (selectedZone) params.zone = selectedZone;
    if (minPriceInput) params.min_price = minPriceInput;
    if (maxPriceInput) params.max_price = maxPriceInput;
    if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');
    if (selectedMinBeds && selectedMinBeds !== '0') params.min_beds = selectedMinBeds;
    if (selectedRadius && selectedRadius !== 'all') params.radius = selectedRadius;
    if (sortBy) params.sort = sortBy;
    if (onlyFavorites) params.favorites = 'true';
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchInput('');
    setMinPriceInput('1000');
    setMaxPriceInput('6000');
    setSelectedZone('');
    setSelectedRadius('all');
    setSelectedMinBeds('0');
    setSelectedAmenities([]);
    setSearchParams({});
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const toggleFavoritesFilter = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (zone) params.zone = zone;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (amenitiesParam) params.amenities = amenitiesParam;
    if (minBeds) params.min_beds = minBeds;
    if (radius) params.radius = radius;
    if (sortBy) params.sort = sortBy;
    if (!onlyFavorites) params.favorites = 'true';
    setSearchParams(params);
  };

  const allAvailableAmenities = [
    'Wi-Fi', 
    'Water Included', 
    'Kitchen Access', 
    'Study Area', 
    'Aircon', 
    'Private Bathroom', 
    'Laundry Area', 
    'CCTV Security'
  ];

  const handleToggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(item => item !== id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 boarding houses side-by-side.');
        return;
      }
      setCompareList([...compareList, id]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Verified Boarding Houses</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Browse personally inspected and approved student accommodations in Bulan, Sorsogon.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#800000] text-amber-300 shadow-sm' : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === 'map' ? 'bg-[#800000] text-amber-300 shadow-sm' : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
            </div>
            <button
              onClick={toggleFavoritesFilter}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${onlyFavorites ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : ''}`} />
              {onlyFavorites ? 'Saved Favorites' : 'Favorites'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Persistent Sidebar Filter */}
          <div className="lg:col-span-1 space-y-6">
            <RecentSearches
              onSelectSearch={(term) => {
                setSearchInput(term);
                saveRecentSearch(term);
                setSearchParams({ search: term });
              }}
            />

            <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#800000] dark:text-amber-400" />
                  Persistent Filters
                </h3>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#800000] dark:text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Keyword / Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search name or street..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              {/* Proximity / SSU Campus Radius */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Map className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                  Proximity to SSU Campus
                </label>
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="all">All Distances (Bulan Area)</option>
                  <option value="500">Within 500m (~5 mins walk)</option>
                  <option value="1000">Within 1km (~12 mins walk)</option>
                  <option value="2000">Within 2km (~25 mins walk)</option>
                </select>
              </div>

              {/* Area / Barangay */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Barangay / Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="">All Areas (Bulan, Sorsogon)</option>
                  <option value="Zone VIII Poblacion">Zone VIII Poblacion (Barangay 8 - Loyo)</option>
                  <option value="Santa Remedios">Santa Remedios</option>
                  <option value="Obrero">Obrero</option>
                  <option value="ManagaNaga">ManagaNaga</option>
                  <option value="Libertad">Libertad</option>
                </select>
              </div>

              {/* Price Ranges & Quick Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                    Monthly Budget Range
                  </label>
                  <span className="text-xs font-bold text-[#800000] dark:text-amber-400">₱{minPriceInput} - ₱{maxPriceInput}</span>
                </div>
                
                {/* Quick Budget Presets */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setMinPriceInput('1000'); setMaxPriceInput('2500'); }}
                    className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-[10px] font-semibold rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    &lt; ₱2,500
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPriceInput('2500'); setMaxPriceInput('4000'); }}
                    className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-[10px] font-semibold rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    ₱2.5k - ₱4k
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPriceInput('4000'); setMaxPriceInput('6000'); }}
                    className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-[10px] font-semibold rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    ₱4k+
                  </button>
                </div>

                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="200"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full accent-[#800000]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">Min (₱)</span>
                    <input
                      type="number"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">Max (₱)</span>
                    <input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Available Beds */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                  Available Beds / Capacity
                </label>
                <select
                  value={selectedMinBeds}
                  onChange={(e) => setSelectedMinBeds(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="0">Any Bed Capacity</option>
                  <option value="1">1+ Beds Available</option>
                  <option value="2">2+ Beds Available</option>
                  <option value="4">4+ Beds Available</option>
                </select>
              </div>

              {/* Specific Amenities Checkboxes */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Specific Amenities</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {allAvailableAmenities.map(amenity => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium transition-all border cursor-pointer ${isChecked ? 'bg-[#800000]/10 dark:bg-amber-400/10 border-[#800000] dark:border-amber-400 text-[#800000] dark:text-amber-300' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${isChecked ? 'bg-[#800000] dark:bg-amber-400 border-[#800000] dark:border-amber-400 text-white dark:text-zinc-900' : 'border-zinc-300 dark:border-zinc-600'}`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const val = e.target.value;
                    const params: Record<string, string> = { sort: val };
                    if (search) params.search = search;
                    if (zone) params.zone = zone;
                    if (minPrice) params.min_price = minPrice;
                    if (maxPrice) params.max_price = maxPrice;
                    if (amenitiesParam) params.amenities = amenitiesParam;
                    if (minBeds) params.min_beds = minBeds;
                    if (radius) params.radius = radius;
                    if (onlyFavorites) params.favorites = 'true';
                    setSearchParams(params);
                  }}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="newest">Recently Verified</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl transition-all shadow-md shadow-[#800000]/20 border border-amber-400/40 cursor-pointer active:scale-95"
              >
                Apply Persistent Filters
              </button>
            </form>
          </div>

          {/* Listings Grid / Map View */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 shadow-sm">
              <span>Showing <strong className="text-zinc-900 dark:text-zinc-100">{listings.length}</strong> {onlyFavorites ? 'saved favorite' : 'verified'} boarding houses</span>
              <span>Sorsogon State University – Bulan Campus Area</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 4].map(n => (
                  <div key={n} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 h-80 animate-pulse border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                    <div className="bg-zinc-200 dark:bg-zinc-800 h-48 rounded-xl w-full"></div>
                    <div className="space-y-2">
                      <div className="bg-zinc-200 dark:bg-zinc-800 h-4 rounded w-3/4"></div>
                      <div className="bg-zinc-200 dark:bg-zinc-800 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 dark:bg-zinc-900 border border-rose-200 dark:border-zinc-800 text-rose-700 dark:text-rose-400 p-6 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{onlyFavorites ? 'No saved favorites yet' : 'No boarding houses match your filters'}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {onlyFavorites ? 'Click the heart icon on any listing card or detail page to save your favorite boarding houses.' : 'Try adjusting your budget range, bed capacity, or selected amenities in the persistent sidebar.'}
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl hover:bg-[#660000] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <AllListingsMap listings={listings} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 25, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                  >
                    <ListingCard
                      listing={listing}
                      isCompared={compareList.includes(listing.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  </motion.div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-zinc-900/95 dark:bg-zinc-950 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-4 animate-slide-up">
          <div className="text-xs font-bold">
            Comparing <span className="text-amber-400">{compareList.length}</span> / 3 Boarding Houses
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#800000] text-xs font-extrabold rounded-xl shadow transition-colors cursor-pointer"
            >
              View Side-by-Side Comparison
            </button>
            <button
              onClick={() => setCompareList([])}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Side-by-Side Boarding House Comparison</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Comparing {compareList.length} selected SSU Bulan Campus properties</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300 font-bold text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareList.map(id => {
                const l = listings.find(item => item.id === id) || ({} as Listing);
                return (
                  <div key={id} className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-700 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-700 rounded-xl overflow-hidden relative">
                        <img src={l.photos?.[0] || ''} alt={l.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-2 left-2 bg-[#800000] text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          ₱{l.monthly_price?.toLocaleString()}/mo
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{l.name}</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Map className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400 shrink-0" />
                        {l.address}
                      </p>
                      <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Monthly Rent:</span>
                          <strong className="text-[#800000] dark:text-amber-400">₱{l.monthly_price?.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Status:</span>
                          <strong className="text-emerald-700 dark:text-emerald-400">{l.status}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Owner:</span>
                          <strong className="text-zinc-800 dark:text-zinc-200">{l.owner?.name}</strong>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Facilities ({l.facilities?.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {l.facilities?.map((f, i) => (
                            <span key={i} className="text-[10px] bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-amber-600" />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-2">
                      <Link
                        to={`/listings/${l.id}`}
                        onClick={() => setShowCompareModal(false)}
                        className="flex-1 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-lg text-center hover:bg-[#660000] transition-colors cursor-pointer"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleToggleCompare(l.id)}
                        className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
