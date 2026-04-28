'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);
  
  const phoneNumber = "5216321059822";
  const defaultMsg = "¡Hola equipo de NovaFrame! He estado revisando su catálogo en la plataforma y me gustaría recibir asesoría personalizada sobre los materiales de sus lienzos y la disponibilidad de medidas especiales para un proyecto. ¿Podrían ayudarme?";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMsg)}`;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    // Auto-hide after 3 seconds as requested
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    // If the mouse leaves, we can close instantly or let the 3s timer finish
    setIsOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (!mounted) return null;

  return (
    <div className="whatsapp-fab fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className="mb-6 w-72 bg-black/60 backdrop-blur-3xl border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] origin-bottom-right"
          >
            {/* Header / Uplink Status */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50" />
                </div>
                <span className="text-[10px] font-mono font-black tracking-[0.2em] text-emerald-400">SUPPORT_UPLINK</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider">Interface: Nova_Live</p>
                  ¿Dudas sobre materiales o pedidos especiales? Inicia el protocolo de chat con un especialista.
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 group transition-all"
              >
                <Shield size={14} className="text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                  INICIAR PROTOCOLO
                </span>
              </a>
            </div>

            {/* Footer Tech Detail */}
            <div className="px-5 py-3 bg-white/5 flex justify-between items-center">
              <div className="flex gap-1">
                {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-emerald-400/20 rounded-full" />)}
              </div>
              <span className="text-[8px] font-mono text-white/20">ZENITH_SYS_v3.0.4</span>
            </div>

            {/* Animated Border Beam */}
            <motion.div 
              className="absolute bottom-0 left-0 h-[1.5px] bg-emerald-400 shadow-[0_0_10px_#10b981]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The FAB Molecule */}
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Concentric Rotating Ring 1 */}
        <div className="absolute inset-[-12px] border border-emerald-500/20 rounded-full border-dashed animate-spin-slow" style={{ animationDuration: '15s' }} />
        
        {/* Concentric Rotating Ring 2 */}
        <div className="absolute inset-[-6px] border border-emerald-500/40 rounded-full border-dashed animate-spin-slow-reverse" style={{ animationDuration: '10s' }} />

        {/* Main Body */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "relative w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]",
            isOpen ? "scale-90" : "scale-100"
          )}
        >
          {/* Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 opacity-90" />
          
          {/* Scanline Animation */}
          <motion.div 
            className="absolute inset-x-0 h-1/2 bg-white/20 blur-xl pointer-events-none"
            animate={{ top: ['-50%', '150%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <MessageCircle size={28} className="text-white relative z-10 drop-shadow-lg" />
          
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
        </a>

        {/* Status Bubble */}
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-black border-2 border-emerald-500 rounded-full flex items-center justify-center z-20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </motion.div>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse linear infinite;
        }
      `}</style>
    </div>
  );
}


