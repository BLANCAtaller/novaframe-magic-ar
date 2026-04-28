'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center"
          >
            <AlertTriangle size={36} className="text-red-500" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3 text-white">
            Error del Sistema
          </h2>
          <p className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase mb-3">
            Fallo_Crítico // Protocolo de recuperación disponible
          </p>
          <p className="text-xs text-white/20 font-mono mb-10 break-all max-w-sm mx-auto">
            {error?.message || 'Error desconocido'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:bg-neon-cyan transition-all"
            >
              <RefreshCw size={14} /> Reintentar
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-3 px-8 py-4 border border-white/10 bg-white/[0.02] text-white/50 font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:text-white hover:border-white/20 transition-all"
            >
              <Home size={14} /> Ir al Inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
