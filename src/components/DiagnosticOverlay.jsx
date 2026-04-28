'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DiagnosticOverlay({ isVisible, product, finish, size, onComplete }) {
  const [status, setStatus] = useState('INITIALIZING_SCAN...');
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (isVisible) {
      const stages = [
        { progress: 10, status: 'BUFFERING_SENSORS...' },
        { progress: 30, status: 'ANALYZING_RESOLUTION...' },
        { progress: 60, status: 'PIGMENT_SYNTHESIS_CALC...' },
        { progress: 85, status: 'INTEGRITY_VERIFIED' },
        { progress: 100, status: 'DIAGNOSTIC_COMPLETE' }
      ];

      let currentStage = 0;
      const interval = setInterval(() => {
        if (currentStage < stages.length) {
          setProgress(stages[currentStage].progress);
          setStatus(stages[currentStage].status);
          currentStage++;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 500);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm pointer-events-auto"
        >
          {/* Scanline Animation */}
          <motion.div 
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
            className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent rotate-0 z-10"
          />

          <div className="relative w-full h-full border border-neon-cyan/20 rounded-3xl overflow-hidden">
            {/* HUD Elements */}
            <div className="absolute top-8 left-8 space-y-4">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-neon-cyan animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.4em] text-neon-cyan uppercase">{status}</span>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Target_ID: {product?.id || 'UNKNOWN'}</div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Resolution: 300 DPI // STABLE</div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Chroma: ADOBE_RGB_S2</div>
              </div>
            </div>

            <div className="absolute top-8 right-8 text-right">
              <div className="text-3xl font-black font-mono text-white tracking-tighter">{progress}%</div>
              <div className="text-[9px] font-black tracking-widest text-white/20 uppercase mt-1">Integrity_Check</div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex justify-between items-end mb-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <Cpu size={16} className="text-white/40" />
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <ShieldCheck size={16} className="text-neon-green" />
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Finish_Deployment</div>
                   <div className="text-[10px] font-black text-white uppercase">{finish}</div>
                </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                />
              </div>
            </div>

            {/* Matrix-like decorative text */}
            <div className="absolute inset-0 opacity-[0.03] font-mono text-[8px] whitespace-pre p-2 overflow-hidden pointer-events-none uppercase leading-tight">
              {mounted && Array.from({ length: 40 }).map((_, i) => (
                <div key={i}>{Math.random().toString(16).repeat(10)}</div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
