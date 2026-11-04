/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OwnerBanner } from './components/OwnerBanner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { VerifiedListings } from './pages/VerifiedListings';
import { ListingDetail } from './pages/ListingDetail';
import { SubmitListing } from './pages/SubmitListing';
import { HowVerificationWorks } from './pages/HowVerificationWorks';
import { Profile } from './pages/Profile';
import { LoginHub } from './pages/LoginHub';
import { StudentLogin } from './pages/StudentLogin';
import { OwnerLogin } from './pages/OwnerLogin';
import { VerifierLogin } from './pages/VerifierLogin';
import { VerifierDashboard } from './pages/VerifierDashboard';
import { ListingVerification } from './pages/ListingVerification';
import { Messages } from './pages/Messages';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkLogin = () => {
      const v = localStorage.getItem('ssu_verifier_token');
      const o = localStorage.getItem('ssu_owner_token');
      const s = localStorage.getItem('ssu_student_token');
      const role = localStorage.getItem('ssu_user_role') || (v ? 'VERIFIER' : o ? 'OWNER' : s ? 'STUDENT' : '');
      setIsLoggedIn(Boolean(v || o || s));
      setIsOwner(role === 'OWNER' || Boolean(o));
      setIsAdmin(role === 'VERIFIER' || Boolean(v) || location.pathname.startsWith('/verifier'));
    };
    checkLogin();
    const interval = setInterval(checkLogin, 500);
    window.addEventListener('storage', checkLogin);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkLogin);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<VerifiedListings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/submit" element={<SubmitListing />} />
          <Route path="/how-it-works" element={<HowVerificationWorks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginHub />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/verifier/login" element={<VerifierLogin />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* Protected Verifier Routes */}
          <Route 
            path="/verifier/dashboard" 
            element={
              <ProtectedRoute>
                <VerifierDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/verifier/listings/:id/verify" 
            element={
              <ProtectedRoute>
                <ListingVerification />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {(isOwner || isAdmin || location.pathname === '/' || location.pathname.startsWith('/verifier') || location.pathname.startsWith('/owner')) && (
        <>
          {isOwner && <OwnerBanner />}
          <Footer />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
