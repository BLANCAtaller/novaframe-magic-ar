'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* Glitch 404 */}
          <div className="relative mb-8">
            <h1 className="text-[10rem] md:text-[14rem] font-black italic tracking-tighter leading-none text-white/5 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl"
              >
                <AlertTriangle size={40} className="text-red-500" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3 text-white">
            Señal Perdida
          </h2>
          <p className="text-[10px] font-mono text-white/30 tracking-[0.4em] uppercase mb-10">
            Error_de_Enlace // Ruta no reconocida por el sistema
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:bg-neon-cyan transition-all"
            >
              <Home size={14} /> Volver al Inicio
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-3 px-8 py-4 border border-white/10 bg-white/[0.02] text-white/50 font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:text-white hover:border-white/20 transition-all"
            >
              Catálogo <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
