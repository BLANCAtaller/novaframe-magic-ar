'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Music, Smartphone, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';
import { useTerminal } from '@/contexts/TerminalContext';
import { SAMPLE_PRODUCTS } from '@/types';
import darkPlantArt from '../../public/dark_plant_art.png';

export default function FeaturesShowcase() {
  const { lang } = useLang();
  const { openProduct } = useTerminal();
  const t = translations[lang].lab;
  const [activeTab, setActiveTab] = useState('ar');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const FEATURES = [
    {
      id: 'collage',
      icon: Sparkles,
      label: 'Collage',
      title: t.holography.collage.title,
      desc: t.holography.collage.desc,
      color: 'text-pink-400',
      accent: '#f472b6'
    },
    {
      id: 'audio',
      icon: Music,
      label: 'Audio',
      title: t.holography.audio.title,
      desc: t.holography.audio.desc,
      color: 'text-amber-400',
      accent: '#fbbf24'
    },
    {
      id: 'ar',
      icon: Smartphone,
      label: 'AR Video',
      title: t.holography.ar.title,
      desc: t.holography.ar.desc,
      color: 'text-purple-400',
      accent: '#a855f7'
    },
    {
      id: 'light',
      icon: Zap,
      label: 'Aura',
      title: t.holography.aura.title,
      desc: t.holography.aura.desc,
      color: 'text-blue-400',
      accent: '#3b82f6'
    }
  ];
  const containerRef = useRef(null);

  // MOUSE PARALLAX LOGIC
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Smooth the mouse values
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  // Map values to rotation angles (degrees)
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);
  const rotateX = useTransform(springY, [0, 1], [15, -15]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const currentFeature = FEATURES.find(f => f.id === activeTab);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[900px] py-20 mt-12 overflow-hidden bg-[#020202] border-t border-white/5 flex flex-col items-center justify-between"
    >
      
      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:30px_30px]" />
         <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]" />
      </div>

      {/* Header text */}
      <div className="relative z-10 text-center mt-10">
         <h2 className="text-[10px] font-mono text-zinc-500 tracking-[0.4em] uppercase mb-4">{t.holography.badge}</h2>
         <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-600 to-transparent mx-auto" />
      </div>

      {/* The 3D Stage */}
      <div className="relative w-full flex-1 flex items-center justify-center perspective-[2000px] z-10">
        
        {/* Ambient background glow based on feature */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
            style={{ backgroundColor: currentFeature.accent }}
          />
        </AnimatePresence>

        {/* The Central Object with Interactive Parallax */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="flex items-center justify-center"
        >
          <motion.div
            custom={isMobile}
            variants={canvasVariants}
            initial="hidden"
            whileInView={activeTab}
            viewport={{ once: false, amount: 0.1 }}
            className="relative w-64 h-[360px] sm:w-80 sm:h-[450px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
          {/* 1. THE BASE CANVAS (Physical Frame) */}
          <div 
            className="absolute inset-0 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-md flex items-center justify-center overflow-hidden transition-transform duration-700"
            style={{ transform: (activeTab === 'ar' && !isMobile) ? 'translateX(250px)' : 'none' }}
          >
             {/* Art */}
             <div className="absolute inset-2 bg-black border border-white/5">
                 <motion.div 
                   animate={{ 
                     opacity: activeTab === 'light' || activeTab === 'ar' ? 1 : 0.4,
                     filter: activeTab === 'light' ? 'grayscale(0%) brightness(1.55) contrast(1.25) saturate(1.2)' : 'grayscale(100%) brightness(1) contrast(1)',
                     scale: activeTab === 'light' ? 1.05 : 1
                   }}
                   className="absolute inset-0 bg-cover bg-center transition-all duration-700 shadow-[0_0_40px_rgba(59,130,246,0.3)]" 
                   style={{ backgroundImage: `url(${darkPlantArt.src})` }}
                 />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-b from-transparent transition-colors duration-700",
                  activeTab === 'light' ? "to-blue-500/30" : "to-black/80"
                )} />
             </div>
          </div>

          {/* 2. FEATURE HOLOGRAPHICS (Spawned around/in front of the canvas) */}
          <AnimatePresence>

            {/* --- COLLAGE EFFECTS --- */}
            {activeTab === 'collage' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                 {/* Floating fragments */}
                 {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ z: 0, opacity: 0, scale: 0.8 }}
                      animate={{ 
                        z: 50 + (i * 40), 
                        x: i % 2 === 0 ? 30 : -30,
                        y: i < 2 ? -40 : 40,
                        opacity: 1,
                        scale: 1,
                        rotateY: [0, 5, 0],
                        rotateX: [0, -5, 0]
                      }}
                      transition={{ 
                        duration: 1 + (i * 0.2), 
                        ease: "easeOut",
                        rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/5 backdrop-blur-md border border-pink-500/30 rounded-sm shadow-[0_0_20px_rgba(244,114,182,0.15)] overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-80 bg-[url('https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center mix-blend-screen" />
                    </motion.div>
                 ))}
                 {/* Connecting lines */}
                 <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ transform: 'translateZ(100px)' }}>
                    <motion.line x1="20%" y1="30%" x2="80%" y2="70%" stroke="rgba(244,114,182,0.5)" strokeWidth="1" strokeDasharray="4 4" 
                      animate={{ strokeDashoffset: [0, 20] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                 </svg>
              </motion.div>
            )}

            {/* --- AUDIO EFFECTS --- */}
            {activeTab === 'audio' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                 {/* Orbiting rings */}
                 <motion.div 
                   animate={{ rotateZ: 360, rotateX: [60, 70, 60], rotateY: [20, -20, 20] }}
                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                   className="absolute w-[450px] h-[450px] rounded-full border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.1)_inset]"
                   style={{ transformStyle: 'preserve-3d' }}
                 >
                    {/* Ring satellites */}
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(20px)' }} />
                 </motion.div>
                 
                 <motion.div 
                   animate={{ rotateZ: -360, rotateX: [80, 70, 80] }}
                   transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                   className="absolute w-[550px] h-[550px] rounded-full border border-amber-500/10"
                   style={{ transformStyle: 'preserve-3d' }}
                 />

                 {/* Center waveform projecting outward */}
                 <div className="absolute inset-0 flex items-center justify-center gap-1" style={{ transform: 'translateZ(80px)' }}>
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={mounted ? { height: ["10px", `${Math.random() * 80 + 20}px`, "10px"] } : { height: "10px" }}
                        transition={mounted ? { duration: 0.6 + Math.random(), repeat: Infinity } : { duration: 0.6, repeat: Infinity }}
                        className="w-1.5 bg-amber-400/80 rounded-full shadow-[0_0_10px_#fbbf24]"
                      />
                    ))}
                 </div>
              </motion.div>
            )}

            {/* --- AR EFFECTS (EXPLODED DIAGRAM) --- */}
            {activeTab === 'ar' && (
              <div 
                onClick={() => {
                  const product = SAMPLE_PRODUCTS.find(p => p.slug === 'alice-wonderland-street');
                  if (product) openProduct(product);
                }}
                className="absolute inset-0 cursor-pointer group block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                  key="ar-exploded-view"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Etiqueta interactiva para indicar que se puede tocar */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-cyan-500/20 text-cyan-300 px-6 py-3 rounded-full border border-cyan-500/50 text-[11px] uppercase tracking-[0.3em] font-black backdrop-blur-xl z-50 shadow-[0_0_40px_rgba(6,182,212,0.4)] opacity-80 group-hover:opacity-100 transition-all group-hover:scale-110">
                     PROBAR_EXPERIENCIA_AR_→
                  </div>

                  {/* LÍNEAS CONECTORAS HTML (DIAGRAMA) */}
                  {!isMobile && (
                    <>
                      <div className="absolute top-1/2 left-1/2 w-[350px] border-t-2 border-dashed border-white/20 -translate-y-1/2" style={{ transform: 'translateZ(50px)' }} />
                      <div className="absolute top-1/2 right-[50%] w-[350px] border-t-2 border-dashed border-purple-500/30 -translate-y-1/2" style={{ transform: 'translateZ(50px)' }} />
                    </>
                  )}

                 {/* CAPA 2: PLANTA VIRTUAL (CENTRO) */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(50px)' }}>
                       
                       {/* --- LUNA EN ÓRBITA MÍSTICA (Antes era el sol) --- */}
                       <motion.div 
                         animate={{ rotateZ: 360 }}
                         transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                         className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                         style={{ transformStyle: 'preserve-3d' }}
                       >
                          {/* La luna se desplaza del centro para crear el radio de la órbita */}
                          <motion.div 
                            initial={{ y: -160 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-zinc-100 via-slate-300 to-zinc-400 shadow-[0_0_60px_rgba(226,232,240,0.5)]"
                            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(60px)' }}
                          >
                             {/* Crateres de la luna */}
                             <div className="absolute top-2 left-3 w-3 h-3 bg-slate-500/20 rounded-full blur-[1px]" />
                             <div className="absolute top-6 left-8 w-4 h-4 bg-slate-500/20 rounded-full blur-[1px]" />
                             <div className="absolute bottom-4 left-4 w-2 h-2 bg-slate-500/20 rounded-full blur-[1px]" />
                             
                             <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-[10px] animate-pulse" />
                          </motion.div>
                       </motion.div>

                       {/* --- RECONSTRUCCIÓN VOLUMÉTRICA DE LA HOJA (Capa 02) --- */}
                       <motion.div
                         animate={{ 
                           y: [-15, 15, -15], 
                           rotateY: [-15, 15, -15],
                           rotateX: [-5, 5, -5],
                           rotateZ: [-2, 2, -2], // Efecto de viento
                           skewX: [-1, 1, -1]    // Flexibilidad de la hoja
                         }}
                         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                         className="relative w-80 h-80 flex items-center justify-center"
                         style={{ transformStyle: 'preserve-3d' }}
                       >
                          {/* 1. CAJA HOLOGRÁFICA (Figuras 3D de soporte) */}
                          <div className="absolute inset-0 border border-cyan-500/20" style={{ transform: 'translateZ(-40px)' }}>
                             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                          </div>
                          <div className="absolute inset-0 border border-cyan-500/10" style={{ transform: 'translateZ(40px)' }}>
                             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50" />
                             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50" />
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50" />
                             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50" />
                          </div>
                          
                          {/* Conectores de profundidad (Esquinas de la caja) */}
                          {[
                            'top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'
                          ].map((pos, idx) => (
                            <div key={idx} className={cn("absolute w-px h-20 bg-gradient-to-b from-cyan-400/0 via-cyan-400/20 to-cyan-400/0", pos)} 
                                 style={{ transform: 'translateZ(0) rotateX(90deg)' }} />
                          ))}

                          {/* 2. STACK VOLUMÉTRICO (Reacciona a la Luna) */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div 
                               key={i}
                               animate={{ 
                                 filter: [
                                   `brightness(${1.2 + i*0.1}) contrast(1.2) saturate(1.2)`,
                                   `brightness(${2.0 + i*0.2}) contrast(1.4) saturate(1.5)`, // Pulso cuando la luna está cerca
                                   `brightness(${1.2 + i*0.1}) contrast(1.2) saturate(1.2)`
                                 ],
                                 scale: [1, 1.05, 1]
                               }}
                               transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                               className="absolute inset-0 bg-contain bg-no-repeat bg-center mix-blend-screen transition-opacity duration-700" 
                               style={{ 
                                 backgroundImage: `url(${darkPlantArt.src})`, 
                                 transform: `translateZ(${(i - 3) * 8}px)`,
                                 opacity: i === 3 ? 0.8 : 0.15,
                                 maskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
                                 WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)'
                               }} 
                            />
                          ))}
                          
                          {/* 3. EFECTO DE ESCANEO LÁSER (Volumétrico) */}
                          <motion.div 
                            animate={{ 
                              translateZ: [-45, 45, -45],
                              opacity: [0, 1, 1, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 border-2 border-cyan-300/40 rounded-full blur-[2px]"
                            style={{ maskImage: 'linear-gradient(to right, transparent, black, transparent)' }}
                          />

                          {/* 4. NODOS DE DATOS Y POLVO LUNAR */}
                          <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                              {mounted && [...Array(15)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ 
                                    scale: [1, 1.5, 1], 
                                    opacity: [0.2, 0.6, 0.2],
                                    y: [0, -20, 0] // Efecto de flotar con el aire
                                  }}
                                  transition={{ duration: 3 + Math.random() * 3, repeat: Infinity }}
                                  className="absolute w-1 h-1 bg-blue-100 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                  style={{ 
                                    left: `${15 + Math.random() * 70}%`, 
                                    top: `${15 + Math.random() * 70}%`,
                                    transform: `translateZ(${(Math.random() - 0.5) * 120}px)` 
                                  }}
                                />
                              ))}
                          </div>
                        </motion.div>
                        
                        {/* Etiqueta Capa 2 */}
                        <div className="absolute top-[105%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ transform: 'translateZ(120px)' }}>
                           <div className="w-px h-12 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                           <div className="flex flex-col items-center">
                              <span className="text-base text-cyan-50 font-light tracking-wide whitespace-nowrap drop-shadow-md">{t.holography.layers.virtual}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* CAPA 1: CUADRO FÍSICO (Fondo) - A la DERECHA */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: `translateX(${isMobile ? '180px' : '350px'})` }}>
                     <div className="relative w-64 h-[400px] md:w-80 md:h-[500px] bg-zinc-900/40 border-l border-zinc-800/50 shadow-[0_50px_100px_rgba(0,0,0,0.5)]" style={{ transform: `translateZ(${isMobile ? '-300px' : '-150px'}) rotateY(${isMobile ? '-10deg' : '-30deg'})` }}>
                        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
                     </div>

                     <div className="absolute top-[105%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ transform: 'translateZ(-100px)' }}>
                        <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
                        <div className="flex flex-col items-center">
                           <span className="text-base text-white/40 font-light tracking-wide whitespace-nowrap">{t.holography.layers.physical}</span>
                        </div>
                     </div>
                  </div>

                 {/* CAPA 3: EL TELÉFONO ESCÁNER (Desplazado a la IZQUIERDA de Capa 2) */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: `translateX(${isMobile ? '-180px' : '-350px'})` }}>
                    <motion.div 
                      animate={{ y: [-15, 15, -15] }} 
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute w-[140px] h-[280px] md:w-[220px] md:h-[440px] rounded-[2rem] md:rounded-[2.5rem] border-[3px] md:border-[5px] border-zinc-800 bg-black/60 backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between p-4"
                      style={{ transform: `translateZ(${isMobile ? '300px' : '200px'})` }}
                    >
                       <div className="w-20 h-5 bg-black rounded-b-xl shadow-inner mb-3" />
                       <div className="w-full h-full relative border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center bg-purple-900/20">
                          <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                             <span className="text-[9px] text-red-500 font-mono uppercase font-bold tracking-wider">REC</span>
                          </div>
                          <Activity className="text-white/40" size={40} />
                          <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
                       </div>
                       <div className="w-10 h-1.5 bg-white/20 rounded-full mt-3" />
                    </motion.div>
                    
                     {/* Etiqueta Capa 3 */}
                    <div className="absolute top-[105%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ transform: `translateZ(${isMobile ? '320px' : '220px'})` }}>
                       <div className="w-px h-12 bg-gradient-to-b from-purple-500/50 to-transparent" />
                       <div className="flex flex-col items-center">
                          <span className="text-base text-purple-50 font-light tracking-wide whitespace-nowrap drop-shadow-md">{t.holography.layers.scanner}</span>
                       </div>
                    </div>
                 </div>
                </motion.div>
              </div>
            )}

            {/* --- LIGHT EFFECTS --- */}
            {activeTab === 'light' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                 {/* The Aura casting backwards */}
                 <motion.div 
                   animate={{ 
                     backgroundColor: ["rgba(59,130,246,0.7)", "rgba(168,85,247,0.7)", "rgba(236,72,153,0.7)", "rgba(59,130,246,0.7)"],
                     scale: [1, 1.15, 1]
                   }}
                   transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-10 blur-[80px] rounded-sm"
                   style={{ transform: 'translateZ(-60px)' }} // Render behind the canvas!
                 />
                 
                 {/* Canvas surface reflection */}
                 <motion.div 
                   animate={{ opacity: [0.1, 0.3, 0.1] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-overlay"
                 />
                 
                 {/* Floating light particles in front */}
                 {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [-20, -100], 
                        x: Math.sin(i) * 50,
                        opacity: [0, 1, 0],
                        scale: [1, 2, 0.5]
                      }}
                      transition={mounted ? { duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 } : { duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-300 rounded-full shadow-[0_0_15px_#3b82f6]"
                      style={{ transform: `translateZ(${20 + i*10}px)` }}
                    />
                 ))}
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>

      {/* Description Panel */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 mt-16 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left: Interactive Pills */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const isActive = activeTab === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={cn(
                  "relative flex items-center gap-4 px-6 py-4 rounded-xl text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-500 text-left w-full md:w-64",
                  isActive ? "text-white bg-white/5 border border-white/10" : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFeatureIndicator"
                    className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} className={cn("relative z-10 transition-colors duration-300", isActive ? f.color : "opacity-50")} />
                <span className="relative z-10">{f.label}</span>
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute right-4 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: f.accent, boxShadow: `0 0 10px ${f.accent}` }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right: Dynamic Text */}
        <div className="flex-1 min-h-[180px] flex flex-col justify-center border-l border-white/10 pl-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-zinc-600" />
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: currentFeature.accent }}>
                      Sistema Integrado
                    </span>
                 </div>
                 <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
                   {currentFeature.title}
                 </h3>
                 <p className="text-[14px] md:text-[15px] font-mono text-zinc-400 leading-[1.8] tracking-wide">
                   {currentFeature.desc}
                 </p>
              </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// Variants for the main 3D object to rotate in space
const canvasVariants = {
  hidden: (isMobile) => ({
    opacity: 0,
    scale: 0.5,
    y: 100,
    transition: { duration: 0.8 }
  }),
  collage: (isMobile) => ({
    opacity: 1,
    y: 0,
    x: isMobile ? 0 : -120,
    rotateY: -25,
    rotateX: 15,
    rotateZ: -5,
    scale: isMobile ? 0.7 : 0.9,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  }),
  audio: (isMobile) => ({
    x: isMobile ? 0 : -120,
    rotateY: 35,
    rotateX: -10,
    rotateZ: 5,
    scale: isMobile ? 0.7 : 0.85,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  }),
  ar: (isMobile) => ({
    x: isMobile ? 0 : -120,
    rotateY: 15,
    rotateX: 5,
    rotateZ: 2,
    scale: isMobile ? 0.55 : 0.65,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  }),
  light: (isMobile) => ({
    x: isMobile ? 0 : -120,
    rotateY: 0,
    rotateX: 0,
    rotateZ: 0,
    scale: isMobile ? 0.8 : 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  })
};
