/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { signInWithGoogle } from './lib/firebase';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import React, { ReactNode } from 'react';

const Login = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950">
    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
      <Heart className="w-16 h-16 text-rose-500 fill-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]" />
    </motion.div>
  </div>;
  if (user) return <Navigate to="/" />;

  return (
    <div className="p-12 text-center h-screen flex flex-col justify-center bg-zinc-950 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <span className="text-rose-500 font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">Premium Dating</span>
        <h1 className="text-[80px] font-black mb-8 text-white leading-none tracking-tighter uppercase italic">
          Witeithie<span className="text-rose-500 not-italic">.</span>
        </h1>
        <p className="text-zinc-500 mb-16 max-w-[280px] mx-auto font-medium text-lg border-l-2 border-rose-500 pl-6 text-left">
          Connecting hearts within your metropolitan reach with <span className="text-white">unapologetic authenticity.</span>
        </p>
        <button 
          className="w-full max-w-xs mx-auto bg-white text-black py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_40px_-5px_rgba(244,63,94,0.2)] hover:bg-rose-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
          onClick={() => signInWithGoogle()}
        >
           Begin Journey
        </button>
        <p className="mt-12 text-[9px] text-zinc-600 uppercase tracking-[0.3em] leading-loose max-w-[240px] mx-auto">
          Secure biometric-ready encryption. Terms & Privacy apply.
        </p>
      </motion.div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Discover />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
