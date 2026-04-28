'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ScanLine, Aperture, Shield, ChevronRight, Zap, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/* ════════════════════════════════════════════════════════════════════
   DIMENSIONES SUSPENDIDAS — AR PORTAL
   ════════════════════════════════════════════════════════════════════
   This is the entry portal for the WebAR experience. 
   It provides context, instructions, and launches the AR viewer.
   ════════════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    icon: Smartphone,
    title: 'Prepara tu dispositivo',
    description: 'Asegúrate de tener buena iluminación y sostén tu teléfono de forma estable.',
    color: '#9d4edd',
  },
  {
    icon: ScanLine,
    title: 'Apunta hacia tu cuadro',
    description: 'Centra la obra NovaFrame en la pantalla de tu dispositivo hasta que sea reconocida.',
    color: '#1ed760',
  },
  {
    icon: Eye,
    title: 'Observa la magia',
    description: 'El contenido oculto emergerá del lienzo. Mueve tu dispositivo para explorar la dimensión.',
    color: '#ff2a85',
  },
];

export default function ArViewerPortal() {
  const [isReady, setIsReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const launchAR = () => {
    // Navigate to the standalone AR viewer
    window.location.href = '/ar/index.html';
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden">
      
      {/* ═══════════ BACKGROUND EFFECTS ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9d4edd] rounded-full blur-[200px] opacity-[0.07]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#030303] to-transparent" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* ═══════════ HEADER ═══════════ */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-xs font-mono tracking-widest uppercase"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Volver</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#9d4edd] animate-pulse" />
          <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">
            NOVAFRAME AR ENGINE v1.0
          </span>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-12">
        
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9d4edd]/10 border border-[#9d4edd]/20 mb-8">
            <Aperture size={12} className="text-[#9d4edd]" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#9d4edd]">
              Experiencia Inmersiva
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
            Dimensiones<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#ff2a85]">
              Suspendidas
            </span>
          </h1>
          
          <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Desbloquea la capa oculta de tu obra NovaFrame. 
            El arte trasciende el papel.
          </p>
        </motion.div>

        {/* ═══════════ INTERACTIVE STEPS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-lg mb-12"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="flex-1 h-1 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  {activeStep === i && (
                    <motion.div
                      layoutId="step-progress"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: step.color }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${STEPS[activeStep].color}15`,
                    borderColor: `${STEPS[activeStep].color}30`,
                  }}
                >
                  {React.createElement(STEPS[activeStep].icon, {
                    size: 20,
                    style: { color: STEPS[activeStep].color },
                  })}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {STEPS[activeStep].title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {STEPS[activeStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ═══════════ LAUNCH BUTTON ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={launchAR}
            className="group relative px-10 py-4 bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] rounded-2xl font-bold text-lg tracking-tight text-white shadow-[0_20px_60px_rgba(157,78,221,0.3)] hover:shadow-[0_25px_80px_rgba(157,78,221,0.45)] transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <Aperture size={22} className="relative z-10" />
            <span className="relative z-10">Activar Cámara AR</span>
            <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 text-white/20">
            <Shield size={10} />
            <span className="text-[9px] font-mono tracking-widest uppercase">
              La cámara no graba ni almacena datos
            </span>
          </div>
        </motion.div>

      </main>

      {/* ═══════════ TECH SPECS FOOTER ═══════════ */}
      <footer className="relative z-10 px-6 py-6 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-[#9d4edd]" />
              <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">WebAR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">No requiere App</span>
            </div>
          </div>
          <span className="text-[8px] font-mono text-white/10 tracking-wider">MindAR Engine</span>
        </div>
      </footer>
    </div>
  );
}
