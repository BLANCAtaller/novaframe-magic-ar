'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const BOOT_LOGS = [
  { text: '>> INITIALIZING NOVAFRAME_CORE v4.28...', delay: 0 },
  { text: '>> CHECKING SYSTEM INTEGRITY...', delay: 150 },
  { text: '>> SECURITY LAYER: AES-GCM-256 ACTIVE', delay: 300 },
  { text: '>> SYNCHRONIZING WITH GLOBAL NODES [14,292]', delay: 450 },
  { text: '>> LOADING ASSET_DATABASE... OK', delay: 600 },
  { text: '>> AUTHORIZING TERMINAL ACCESS...', delay: 750 },
  { text: '>> WELCOME, USER_ADMIN', delay: 900 },
];

export default function SystemLoader() {
  const [complete, setComplete] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    setIsMounted(true);
    if (!isHome) return;
    
    // Check if we've already booted in this session to avoid annoyance
    // (Disabled during development so we can always see the 4-second animation)
    // if (sessionStorage.getItem('nova_boot_complete')) {
    //  setComplete(true);
    //  return;
    // }
    
    BOOT_LOGS.forEach((log) => {
      setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log.text]);
      }, log.delay);
    });

    const timer = setTimeout(() => {
      setComplete(true);
      sessionStorage.setItem('nova_boot_complete', 'true');
    }, 1200);

    return () => clearTimeout(timer);
  }, [isHome]);

  if (!isMounted || !isHome) return null;

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono p-6"
        >
          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
          
          <div className="w-full max-w-md space-y-6 relative">
            {/* Visual Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Authentication Protocol</div>
                <div className="text-xl font-black text-white tracking-tighter italic flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                  NOVAFRAME_INIT
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-neon-cyan animate-pulse">0x8FB4DA2...</div>
                <div className="text-[10px] text-white/20 uppercase tracking-widest leading-none">Sector_Primary</div>
              </div>
            </div>

            {/* Log Stream */}
            <div className="h-48 overflow-hidden space-y-1">
              {visibleLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[11px] text-white/70 tracking-widest flex items-center gap-2"
                >
                  <span className="text-neon-cyan font-black">❯</span>
                  {log}
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1] }} 
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-4 bg-neon-cyan/50 inline-block align-middle ml-2" 
              />
            </div>

            {/* Loading Bar */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                <span>System_Load</span>
                <motion.span
                  animate={{ opacity: [0.3, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  Running
                </motion.span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-neon-pink via-neon-cyan to-white shadow-[0_0_15px_#06b6d4]"
                />
              </div>
            </div>
            
            {/* Visual Decoration */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-neon-cyan/5 blur-[40px] rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-neon-pink/5 blur-[40px] rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
