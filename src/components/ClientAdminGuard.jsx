'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import AdminLogin from '@/components/AdminLogin';
import { Activity, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientAdminGuard({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only check auth on client
    if (typeof window === 'undefined') return;
    
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Activity size={36} className="text-neon-cyan animate-spin" />
          <p className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Verificando Nexus...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={setUser} />;
  }

  return (
    <>
      {/* Top Admin Bar */}
      <div className="fixed top-0 inset-x-0 z-[100] bg-black/80 backdrop-blur-md border-b border-white/5 h-10 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black tracking-widest text-emerald-500 uppercase">Nexus Segura</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[8px] font-black tracking-widest uppercase text-white/30 hover:text-red-400 transition-colors"
        >
          CERRAR SESIÓN <LogOut size={10} />
        </button>
      </div>

      {/* Main Content wrapper */}
      <div className="pt-10">
        {children}
      </div>
    </>
  );
}
