import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, AlertCircle, Heart, DollarSign, Map, LayoutGrid, CheckCircle2 } from 'lucide-react';
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
  const maxPrice = searchParams.get('max_price') || '5000';
  const facility = searchParams.get('facility') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const onlyFavorites = searchParams.get('favorites') === 'true';
  const radius = searchParams.get('radius') || 'all';

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [selectedFacility, setSelectedFacility] = useState(facility);
  const [selectedZone, setSelectedZone] = useState(zone);
  const [selectedRadius, setSelectedRadius] = useState(radius);

  // SSU Bulan Campus Gate
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
      facility: facility || undefined,
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
  }, [search, zone, minPrice, maxPrice, facility, sortBy, onlyFavorites, radius]);

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
    if (selectedFacility) params.facility = selectedFacility;
    if (selectedRadius && selectedRadius !== 'all') params.radius = selectedRadius;
    if (sortBy) params.sort = sortBy;
    if (onlyFavorites) params.favorites = 'true';
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchInput('');
    setMinPriceInput('1000');
    setMaxPriceInput('5000');
    setSelectedFacility('');
    setSelectedZone('');
    setSelectedRadius('all');
    setSearchParams({});
  };

  const toggleFavoritesFilter = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (zone) params.zone = zone;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (facility) params.facility = facility;
    if (radius) params.radius = radius;
    if (sortBy) params.sort = sortBy;
    if (!onlyFavorites) params.favorites = 'true';
    setSearchParams(params);
  };

  const allFacilities = ['Wi-Fi', 'Water Included', 'Kitchen Access', 'Study Area', 'Aircon', 'Private Bathroom', 'Laundry Area', 'CCTV Security'];

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header, Map/Grid Toggle & Favorites */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Verified Boarding Houses</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Browse personally inspected and approved student accommodations in Bulan, Sorsogon.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'grid' ? 'bg-[#800000] text-amber-300 shadow-sm' : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'map' ? 'bg-[#800000] text-amber-300 shadow-sm' : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
            </div>
            <button
              onClick={toggleFavoritesFilter}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${onlyFavorites ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : ''}`} />
              {onlyFavorites ? 'Saved Favorites' : 'Favorites'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar with Price Range Slider & Recent Searches */}
          <div className="lg:col-span-1 space-y-6">
            <RecentSearches
              onSelectSearch={(term) => {
                setSearchInput(term);
                saveRecentSearch(term);
                setSearchParams({ search: term });
              }}
            />
            <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-700">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#800000] dark:text-amber-400" />
                  Filter Listings
                </h3>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#800000] dark:text-amber-400 hover:underline font-medium"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Keyword / Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search name or street..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                {recentSearches.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <span className="text-[10px] text-zinc-400 font-semibold block">Recent Searches:</span>
                    <div className="flex flex-wrap gap-1">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSearchInput(term);
                            saveRecentSearch(term);
                            const params: Record<string, string> = { search: term };
                            if (selectedZone) params.zone = selectedZone;
                            if (minPriceInput) params.min_price = minPriceInput;
                            if (maxPriceInput) params.max_price = maxPriceInput;
                            setSearchParams(params);
                          }}
                          className="text-[10px] bg-zinc-100 dark:bg-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 hover:text-[#800000] px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-600 transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Walking Distance Radius Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Map className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                  Walking Distance from SSU Gate
                </label>
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="all">All Distances (Bulan Area)</option>
                  <option value="500">Within 500m (~5 mins walk)</option>
                  <option value="1000">Within 1km (~12 mins walk)</option>
                  <option value="2000">Within 2km (~25 mins walk)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Area / Barangay</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="">All Areas (Bulan, Sorsogon)</option>
                  <option value="Zone VIII Poblacion">Zone VIII Poblacion (Barangay 8 - Loyo)</option>
                  <option value="Santa Remedios">Santa Remedios</option>
                  <option value="Obrero">Obrero</option>
                  <option value="ManagaNaga">ManagaNaga</option>
                  <option value="Libertad">Libertad</option>
                </select>
              </div>

              {/* Price Range Slider & Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
                    Monthly Budget Range
                  </label>
                  <span className="text-xs font-bold text-[#800000] dark:text-amber-400">₱{minPriceInput} - ₱{maxPriceInput}</span>
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
                      className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">Max (₱)</span>
                    <input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Required Facility</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="">Any Facility</option>
                  {allFacilities.map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

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
                    if (facility) params.facility = facility;
                    if (onlyFavorites) params.favorites = 'true';
                    setSearchParams(params);
                  }}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#800000]"
                >
                  <option value="newest">Recently Verified</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-lg transition-colors shadow-sm border border-amber-400/30"
              >
                Apply Budget & Filters
              </button>
            </form>
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="flex items-center justify-between bg-white dark:bg-zinc-800 px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300">
              <span>Showing <strong className="text-zinc-900 dark:text-zinc-100">{listings.length}</strong> {onlyFavorites ? 'saved favorite' : 'verified'} boarding houses</span>
              <span>Sorsogon State University – Bulan Campus Area</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 4].map(n => (
                  <div key={n} className="bg-white dark:bg-zinc-800 rounded-2xl p-4 h-80 animate-pulse border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between">
                    <div className="bg-zinc-200 dark:bg-zinc-700 h-48 rounded-xl w-full"></div>
                    <div className="space-y-2">
                      <div className="bg-zinc-200 dark:bg-zinc-700 h-4 rounded w-3/4"></div>
                      <div className="bg-zinc-200 dark:bg-zinc-700 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 text-rose-700 dark:text-rose-400 p-6 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{onlyFavorites ? 'No saved favorites yet' : 'No boarding houses found'}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {onlyFavorites ? 'Click the heart icon on any listing card or detail page to save your favorite boarding houses.' : 'Try adjusting your search budget range or filters.'}
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-lg hover:bg-[#660000] transition-colors"
                >
                  Clear Filters
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
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-zinc-900/95 dark:bg-zinc-950 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-4">
          <div className="text-xs font-bold">
            Comparing <span className="text-amber-400">{compareList.length}</span> / 3 Boarding Houses
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#800000] text-xs font-extrabold rounded-xl shadow transition-colors"
            >
              View Side-by-Side Comparison
            </button>
            <button
              onClick={() => setCompareList([])}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Side-by-Side Boarding House Comparison</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Comparing {compareList.length} selected SSU Bulan Campus properties</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300 font-bold text-xs"
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
                        <span className="absolute top-2 left-2 bg-[#800000] text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          ₱{l.monthly_price?.toLocaleString()}/mo
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{l.name}</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Map className="w-3.5 h-3.5 text-[#800000] dark:text-amber-400" />
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
                        className="flex-1 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-lg text-center hover:bg-[#660000]"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleToggleCompare(l.id)}
                        className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-lg"
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
