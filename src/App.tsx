import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Wallet, 
  ShieldCheck, 
  Store, 
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';

// Portals
import ConsumerApp from './apps/consumer/ConsumerApp';
import MerchantApp from './apps/merchant/MerchantApp';
import BackofficeApp from './apps/admin/BackofficeApp';
import Auth from './portals/Auth';
import LandingPage from './portals/LandingPage';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('flexpay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('flexpay_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/login" element={<Auth onLogin={setUser} />} />
          
          {/* Merchant Portal (merchant-ui) */}
          <Route path="/merchant/*" element={
            <ProtectedRoute user={user} allowedRoles={['merchant', 'admin']}>
              <MerchantApp user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />

          {/* Admin Portal (backoffice-ui) */}
          <Route path="/admin/*" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <BackofficeApp user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />

          {/* Consumer Portal (consumer-ui) */}
          <Route path="/*" element={
            <ProtectedRoute user={user} allowedRoles={['consumer', 'merchant', 'admin']}>
              <ConsumerApp user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function ProtectedRoute({ children, user, allowedRoles }: { children: React.ReactNode, user: any, allowedRoles: string[] }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
