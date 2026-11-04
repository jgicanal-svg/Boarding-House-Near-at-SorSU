import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle2, XCircle, BookmarkCheck, AlertCircle, Eye, LogOut, RefreshCw, TrendingUp, Users, Home, BarChart2, Trash2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Listing, VerifierStats, ListingReport } from '../types';
import { fetchVerifierStats, fetchListings } from '../services/api';
import { AvailabilityBadge } from '../components/AvailabilityBadge';

export const VerifierDashboard: React.FC = () => {
  const [stats, setStats] = useState<VerifierStats | null>(null);
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [reports, setReports] = useState<ListingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'analytics' | 'reports'>('analytics');
  const navigate = useNavigate();

  const verifierName = localStorage.getItem('ssu_verifier_name') || 'Verifier';

  useEffect(() => {
    const token = localStorage.getItem('ssu_verifier_token');
    if (!token) {
      navigate('/verifier/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = () => {
    setLoading(true);
    const storedReports = JSON.parse(localStorage.getItem('ssu_listing_reports') || '[]');
    setReports(storedReports);

    Promise.all([
      fetchVerifierStats(),
      fetchListings({ status: 'AWAITING_VERIFICATION' })
    ])
      .then(([statsData, pendingData]) => {
        setStats(statsData);
        setPendingListings(pendingData);
        fetchListings({ status: 'VERIFIED' }).then(verified => {
          fetchListings({ status: 'REJECTED' }).then(rejected => {
            fetchListings({ status: 'RESERVED' }).then(reserved => {
              fetchListings({ status: 'TAKEN' }).then(taken => {
                setAllListings([...pendingData, ...verified, ...rejected, ...reserved, ...taken]);
                setLoading(false);
              });
            });
          });
        });
      })
      .catch(() => setLoading(false));
  };

  const handleDeleteReport = (reportId: string) => {
    const updated = reports.filter(r => r.id !== reportId);
    setReports(updated);
    localStorage.setItem('ssu_listing_reports', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('ssu_verifier_token');
    localStorage.removeItem('ssu_verifier_name');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 text-sm">Loading verifier dashboard & analytics...</div>
      </div>
    );
  }

  // Recharts Data Sets
  const registrationTrendsData = [
    { month: 'May', students: 120, owners: 12 },
    { month: 'Jun', students: 240, owners: 18 },
    { month: 'Jul', students: 480, owners: 24 },
    { month: 'Aug', students: 620, owners: 30 },
    { month: 'Sep', students: 850, owners: 38 },
    { month: 'Oct', students: 1120, owners: 45 },
  ];

  const listingStatusChartData = stats ? [
    { name: 'Pending', count: stats.pending, fill: '#f59e0b' },
    { name: 'Verified', count: stats.verified, fill: '#10b981' },
    { name: 'Reserved', count: stats.reserved, fill: '#800000' },
    { name: 'Taken', count: stats.taken, fill: '#71717a' },
    { name: 'Rejected', count: stats.rejected, fill: '#e11d48' },
  ] : [];

  const userGrowthData = [
    { month: 'May', totalUsers: 132 },
    { month: 'Jun', totalUsers: 258 },
    { month: 'Jul', totalUsers: 504 },
    { month: 'Aug', totalUsers: 650 },
    { month: 'Sep', totalUsers: 888 },
    { month: 'Oct', totalUsers: 1165 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#800000] border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-zinc-900">Admin & Verifier Dashboard</h1>
                <span className="text-[11px] bg-amber-100 text-[#800000] font-bold px-2 py-0.5 rounded border border-amber-300">SSU Bulan Campus</span>
              </div>
              <p className="text-xs text-zinc-500">Welcome back, <strong>{verifierName}</strong> — Oversight & Analytics Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Pending
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">{stats.pending}</div>
              <p className="text-[11px] text-zinc-400">Needs review</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">{stats.verified}</div>
              <p className="text-[11px] text-zinc-400">Active public</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">{stats.rejected}</div>
              <p className="text-[11px] text-zinc-400">Needs correction</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-[#800000] uppercase tracking-wider flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" /> Reserved
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">{stats.reserved}</div>
              <p className="text-[11px] text-zinc-400">Held by student</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Taken
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">{stats.taken}</div>
              <p className="text-[11px] text-zinc-400">Fully occupied</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Inquiries
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 tabular-nums">{stats.total_inquiries}</div>
              <p className="text-[11px] text-zinc-400">Student inquiries</p>
            </div>

          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'analytics' ? 'bg-[#800000] text-amber-300 shadow-sm border border-amber-400/30' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              <BarChart2 className="w-4 h-4" />
              Admin Analytics & Visualizations
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'pending' ? 'bg-[#800000] text-amber-300 shadow-sm border border-amber-400/30' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              <Clock className="w-4 h-4" />
              Pending Submissions ({pendingListings.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'all' ? 'bg-[#800000] text-amber-300 shadow-sm border border-amber-400/30' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              <Home className="w-4 h-4" />
              All Listings ({allListings.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'reports' ? 'bg-[#800000] text-amber-300 shadow-sm border border-amber-400/30' : 'text-zinc-600 hover:bg-zinc-100'}`}
            >
              <AlertCircle className="w-4 h-4" />
              Student Reports ({reports.length})
            </button>
          </div>
          <span className="text-xs text-zinc-500 hidden md:inline">SSU Bulan Campus Administration</span>
        </div>

        {/* Student Reports Tab Content */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900">Student Flagged Listing Reports</span>
              <span className="text-xs text-zinc-500">SSU Bulan Campus Administration</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <th className="py-3 px-6">Listing Name</th>
                    <th className="py-3 px-6">Reason</th>
                    <th className="py-3 px-6">Details / Notes</th>
                    <th className="py-3 px-6">Reported By</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        No listing reports submitted by students.
                      </td>
                    </tr>
                  ) : (
                    reports.map(rep => (
                      <tr key={rep.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-4 px-6 font-semibold text-zinc-900">
                          <Link to={`/listings/${rep.listing_id}`} className="text-[#800000] hover:underline">
                            {rep.listing_name}
                          </Link>
                        </td>
                        <td className="py-4 px-6 font-bold text-rose-700">
                          {rep.reason}
                        </td>
                        <td className="py-4 px-6 text-zinc-700 max-w-xs">
                          <p className="truncate">{rep.details}</p>
                        </td>
                        <td className="py-4 px-6 text-zinc-500">
                          {rep.student_email}
                        </td>
                        <td className="py-4 px-6 text-zinc-400">
                          {new Date(rep.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                          <Link
                            to={`/listings/${rep.listing_id}`}
                            className="px-3 py-1.5 bg-amber-50 text-[#800000] hover:bg-amber-100 font-bold rounded-lg transition-colors border border-amber-300"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteReport(rep.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            title="Dismiss / Remove Report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recharts Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Registration Trends Line Chart */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#800000]" />
                    Registration Trends (Students vs Owners)
                  </h3>
                  <span className="text-[11px] text-zinc-400">Past 6 Months</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                      <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line type="monotone" dataKey="students" name="Student Seekers" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="owners" name="Boarding House Owners" stroke="#800000" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Total Active Listings vs Status Bar Chart */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#800000]" />
                    Total Active Listings by Status
                  </h3>
                  <span className="text-[11px] text-zinc-400">Current Overview</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={listingStatusChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }} />
                      <Bar dataKey="count" name="Listings Count" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* User Growth Area Chart */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#800000]" />
                  Cumulative User Growth Over Time
                </h3>
                <span className="text-[11px] text-zinc-400">Total Registered Campus Users</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="totalUsers" name="Total Campus Users" stroke="#800000" fill="#800000" fillOpacity={0.15} strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Listings Table Tab Content */}
        {activeTab !== 'analytics' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900">
                {activeTab === 'pending' ? 'Pending Submissions Avoirng Verification' : 'All Registered Boarding House Listings'}
              </span>
              <span className="text-xs text-zinc-500">SSU Bulan Campus Housing</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <th className="py-3 px-6">Boarding House</th>
                    <th className="py-3 px-6">Owner / Contact</th>
                    <th className="py-3 px-6">Monthly Price</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Submitted</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {(activeTab === 'pending' ? pendingListings : allListings).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        No listings found in this view.
                      </td>
                    </tr>
                  ) : (
                    (activeTab === 'pending' ? pendingListings : allListings).map(listing => (
                      <tr key={listing.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-4 px-6 font-semibold text-zinc-900">
                          <div className="truncate max-w-xs">{listing.name}</div>
                          <span className="text-[11px] font-normal text-zinc-500 truncate block">{listing.address}</span>
                        </td>
                        <td className="py-4 px-6 text-zinc-600">
                          <div>{listing.owner.name}</div>
                          <span className="text-[11px] text-zinc-400">{listing.owner.contact_information}</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-[#800000] tabular-nums">
                          ₱{listing.monthly_price.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <AvailabilityBadge status={listing.status} />
                        </td>
                        <td className="py-4 px-6 text-zinc-500">
                          {new Date(listing.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/verifier/listings/${listing.id}/verify`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-[#800000] hover:bg-amber-100 font-bold rounded-lg transition-colors border border-amber-300"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#800000]" />
                            Review & Verify
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
