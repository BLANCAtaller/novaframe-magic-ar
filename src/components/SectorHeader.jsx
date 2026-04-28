'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SectorHeader({ title, subtitle, breadcrumb, color = 'text-neon-pink' }) {
  return (
    <section className="pt-40 pb-20 relative overflow-hidden bg-black border-b border-white/5">
      {/* Decorative Matrix Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none font-mono text-[8px] text-white select-none overflow-hidden leading-none break-all p-4">
        {Array(20).fill('NOVAFRAME_SYSTEM_SECTOR_INITIALIZED_010101_ACCESS_GRANTED_').join(' ')}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-[1px] w-12 bg-white/10" />
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/40">
            Sector / {breadcrumb}
          </span>
          <div className="h-[1px] w-12 bg-white/10" />
        </motion.div>

        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8">
           <span className={`glitch-text-wrapper ${color}`} data-text={title}>{title}</span>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-white/30 text-lg leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>
        
        {/* Status indicator */}
        <div className="mt-12 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] font-mono text-white/20 uppercase">Core_Active</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse [animation-delay:0.2s]" />
              <span className="text-[10px] font-mono text-white/20 uppercase">Data_Sync_OK</span>
           </div>
        </div>
      </div>
    </section>
  );
}
