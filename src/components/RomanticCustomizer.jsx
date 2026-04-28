'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Music, Smartphone, Zap, Sparkles, PlayCircle, ScanLine, Fingerprint, Camera, Asterisk } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURE_MODULES = [
  {
    id: 'COLLAGE',
    label: 'Collage',
    title: 'Fotomontaje Físico',
    subtitle: 'Tus memorias, preservadas matemáticamente',
    description: 'Imprimimos en alta resolución un ensamblaje armónico de tus mejores fotografías. Integramos los nombres de la pareja y esa fecha inolvidable usando tipografías premium. Cada composición es diseñada con precisión para crear un lienzo físico inmutable digno de una galería de arte contemporáneo.',
    icon: Sparkles,
    color: '#ff2a85',
    bgWord: 'MEMORIES',
  },
  {
    id: 'AUDIO_SYNC',
    label: 'Audio/Música',
    title: 'Soundwave & Video',
    subtitle: 'El ADN auditivo y visual de su momento perfecto',
    description: 'Añade tu canción especial de Spotify o tu video de YouTube favorito impreso como un código inteligente de alta definición. Basta con apuntar la cámara de tu celular hacia la obra gráfica para que la experiencia audiovisual cobre vida, conectando instantáneamente tus recuerdos físicos con la tecnología.',
    icon: Music,
    color: '#1ed760',
    bgWord: 'RHYTHM',
  },
  {
    id: 'AR_VIDEO',
    label: 'AR Video',
    title: 'Dimensiones Suspendidas',
    subtitle: 'Realidad aumentada entrelazada con el arte',
    description: 'Integra una capa digital invisible sobre tu obra física. Al interactuar con el lienzo a través de un dispositivo móvil, una grabación especial cobra vida, emergiendo mágicamente del papel para crear una experiencia de profundidad cinematográfica en tu propio espacio.',
    icon: Smartphone,
    color: '#9d4edd',
    bgWord: 'VIRTUAL',
  },
  {
    id: 'LED_PULSE',
    label: 'Iluminación',
    title: 'Retroiluminación Reactiva LED',
    subtitle: 'Fotones sincronizados a frecuencias bajas',
    description: 'Una tira perimetral de LEDs integrados de grado arquitectónico proyectará un rebote de luz espectacular sobre tu pared. La tecnología inteligente oculta en el marco absorbe el ruido ambiental y los destellos lumínicos se disparan en estricta sincronía con la melodía, creando un aura inmersiva inolvidable.',
    icon: Zap,
    color: '#ffb703',
    bgWord: 'LUMEN',
  }
];

export default function RomanticCustomizer() {
  const containerRef = useRef(null);
  const [activeModule, setActiveModule] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeData = FEATURE_MODULES[activeModule];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  function handleMouseMove({ clientX, clientY }) {
    if (isMobile) return;
    const x = (clientX / window.innerWidth) - 0.5;
    const y = (clientY / window.innerHeight) - 0.5;
    mouseX.set(x * 60);
    mouseY.set(y * 60);
  }

  // Auto-rotate if untouched
  useEffect(() => {
    let interval;
    const handleMouseLeave = () => {
      mouseX.set(0); mouseY.set(0);
    };
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => window.removeEventListener('mouseleave', handleMouseLeave);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-16 sm:py-24 bg-[#030303] overflow-hidden flex flex-col items-center justify-center font-sans border-y border-white/5"
      style={{ perspective: isMobile ? "none" : "2000px", minHeight: isMobile ? "700px" : "900px" }}
    >
      {/* 1. LAYER BASE: GRADIENT MESH VOLUMÉTRICO */}
      <AnimatePresence mode="popLayout">
        <motion.div
           key={activeData.id + "-mesh"}
           initial={{ opacity: 0, scale: 0.8, filter: isMobile ? "blur(100px)" : "blur(180px)" }}
           animate={{ opacity: 0.15, scale: 1.2, filter: isMobile ? "blur(80px)" : "blur(120px)" }}
           exit={{ opacity: 0, scale: 1.5, filter: isMobile ? "blur(120px)" : "blur(200px)" }}
           transition={{ duration: 1.5, ease: "easeInOut" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full mix-blend-screen pointer-events-none"
           style={{ backgroundColor: activeData.color }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      {/* 2. LAYER TEXTO GIGANTE (KINETIC TYPOGRAPHY) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none overflow-hidden z-0 flex flex-col items-center justify-center h-full">
         <AnimatePresence mode="popLayout">
           <motion.div
              key={activeData.id + "-text"}
              initial={{ y: isMobile ? 80 : 150, opacity: 0, scale: 0.9, rotateX: isMobile ? 0 : -20 }}
              animate={{ y: 0, opacity: 0.03, scale: 1, rotateX: 0 }}
              exit={{ y: isMobile ? -80 : -150, opacity: 0, scale: 1.1, rotateX: isMobile ? 0 : 20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[20vw] font-black tracking-tighter leading-none select-none text-white whitespace-nowrap"
              style={{ transformStyle: isMobile ? "flat" : "preserve-3d" }}
           >
              {activeData.bgWord}
           </motion.div>
         </AnimatePresence>
      </div>

      {/* 3. LAYER PRINCIPAL: EL ATELIER 3D */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center mt-6 pb-4">
        
        {/* The Premium Hardware Frame */}
        <motion.div
          style={{
            rotateX: isMobile ? 0 : smoothY,
            rotateY: isMobile ? 0 : smoothX,
            transformStyle: isMobile ? "flat" : "preserve-3d"
          }}
          className="relative w-[85vw] max-w-[420px] aspect-[4/5] drop-shadow-2xl"
        >
           {/* Aura Casting on Wall */}
           <motion.div 
             className="absolute -inset-10 -translate-z-20 bg-white opacity-0 blur-[60px] rounded-[3rem] transition-colors duration-700"
             animate={{ 
               opacity: activeModule === 3 ? 0.3 : 0.05,
               backgroundColor: activeData.color,
               scale: activeModule === 3 ? [1, 1.05, 0.98, 1.02] : 1
             }}
             transition={{ duration: activeModule === 3 ? 0.5 : 1, repeat: activeModule === 3 ? Infinity : 0 }}
           />

           {/* The Frame Hardware Structure */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#000] rounded-xl border border-zinc-800/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_40px_100px_-20px_rgba(0,0,0,1)] ring-1 ring-black overflow-hidden flex flex-col items-center justify-center p-3 sm:p-5">
             
             {/* The Passepartout (Inner White Mat) */}
             <div className="w-full h-full bg-[#f4f4f5] shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)] relative overflow-hidden p-2 sm:p-3">
                
                {/* The Canvas Art (Animated Internals) */}
                <div className="w-full h-full bg-white relative overflow-hidden border border-zinc-200">
                  <AnimatePresence mode="popLayout" initial={false}>
                    
                    {/* SCENE 0: COLLAGE AVANT-GARDE */}
                    {activeModule === 0 && (
                      <motion.div 
                        key="s0"
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 bg-[#e5e5e5] flex flex-col"
                      >
                         <div className="flex-1 w-full relative overflow-hidden">
                            {/* Polaroid 1 (Slanted) */}
                            <motion.div 
                              initial={{ rotateZ: 15, y: 50, x: 20 }} animate={{ rotateZ: -5, y: 10, x: -10 }} transition={{ duration: 1.5, ease: "easeOut" }}
                              className="absolute inset-0 m-4 bg-zinc-300 shadow-[2px_10px_20px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden"
                            >
                               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-40 transition-opacity hover:opacity-100 hover:mix-blend-normal duration-1000" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </motion.div>
                            {/* Polaroid 2 (Front) */}
                            <motion.div 
                              initial={{ rotateZ: -10, y: -20, x: -30 }} animate={{ rotateZ: 3, y: 30, x: 10 }} transition={{ duration: 1.2, ease: "backOut", delay: 0.1 }}
                              className="absolute top-10 left-6 right-8 bottom-12 bg-white p-2 sm:p-3 pb-8 sm:pb-12 shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-10"
                            >
                               <div className="w-full h-full bg-zinc-200 relative overflow-hidden">
                                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-multiply" />
                               </div>
                               <div className="absolute bottom-2 left-0 w-full text-center font-serif text-[8px] sm:text-[10px] text-zinc-400 tracking-widest italic">P A R I S</div>
                            </motion.div>
                         </div>
                         <div className="h-20 sm:h-24 bg-white border-t border-zinc-200 flex flex-col items-center justify-center px-4 relative z-20">
                            <h3 className="font-serif text-lg sm:text-2xl text-black font-black tracking-tight flex items-center gap-2">
                              A <Asterisk size={12} className="text-[#ff2a85] animate-spin-slow" /> M
                            </h3>
                            <div className="mt-1 flex items-center justify-between w-full max-w-[200px]">
                              <div className="h-[1px] flex-1 bg-black/10" />
                              <span className="font-mono text-[6px] sm:text-[8px] uppercase tracking-[0.3em] px-2 text-zinc-500">Vol. 01 / ∞</span>
                              <div className="h-[1px] flex-1 bg-black/10" />
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {/* SCENE 1: AUDIO PLAQUE (SPOTIFY/YOUTUBE) */}
                    {activeModule === 1 && (
                      <motion.div 
                        key="s1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 bg-[#f4f4f5] flex items-center justify-center p-3 sm:p-5 relative overflow-hidden"
                      >
                         {/* The Physical Plaque Emulation */}
                         <div className="w-full h-full bg-white shadow-xl flex flex-col items-center p-3 sm:p-5 text-black relative z-10 border border-zinc-200">
                            
                            {/* Header Names */}
                            <div className="flex items-center gap-2 text-black mt-1">
                               <Heart size={12} className="fill-current" />
                               <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-tight">Jesús & Giovanna</h3>
                               <Heart size={12} className="fill-current" />
                            </div>

                            {/* The Photo */}
                            <div className="w-full aspect-square bg-zinc-100 mt-2 sm:mt-3 mb-2 sm:mb-3 relative overflow-hidden shadow-inner border border-zinc-100">
                               <motion.div 
                                 className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-90 transition-transform duration-[10s] hover:scale-110"
                               />
                            </div>

                            {/* Scanning Codes (Cycle between Spotify & Youtube) */}
                            <div className="w-full flex items-center justify-center h-10 sm:h-12 relative mb-2">
                                <motion.div
                                   animate={{ opacity: [1, 1, 0, 0, 1] }}
                                   transition={{ duration: 8, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] }}
                                   className="absolute flex items-center justify-center gap-2 w-full"
                                >
                                   <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                                       <Music size={14} className="text-white" />
                                   </div>
                                   {/* Spotify wave simulation */}
                                   <div className="flex items-center gap-[2px] sm:gap-1 h-6 sm:h-8">
                                      {[1, 3, 5, 2, 8, 4, 10, 3, 7, 2, 9, 3, 6, 2, 1].map((v, i) => (
                                        <div key={i} className="w-1.5 sm:w-2 bg-black rounded-full" style={{ height: `${v*10}%` }} />
                                      ))}
                                   </div>
                                </motion.div>

                                <motion.div
                                   animate={{ opacity: [0, 0, 1, 1, 0] }}
                                   transition={{ duration: 8, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] }}
                                   className="absolute flex items-center justify-center gap-3 w-full"
                                >
                                   <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#ff0000] rounded-lg flex items-center justify-center shrink-0">
                                       <PlayCircle size={16} className="text-white fill-white" />
                                   </div>
                                   <div className="flex flex-col items-start gap-1">
                                      <div className="h-2 sm:h-2.5 w-24 bg-black/80 rounded" />
                                      <div className="flex items-center gap-1">
                                         {[1,2,3,4,5].map(x => <div key={x} className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-black/60 rounded-[2px]" />)}
                                      </div>
                                   </div>
                                </motion.div>
                            </div>

                            {/* Song / Video Details */}
                            <div className="w-full text-left px-1">
                               <h4 className="font-bold text-sm sm:text-base leading-tight">Host of a Ghost</h4>
                               <p className="text-[10px] sm:text-xs text-zinc-500 font-semibold mt-0.5">Porter</p>
                            </div>

                            {/* Player UI */}
                            <div className="w-full mt-2 sm:mt-3 px-1 flex flex-col gap-2">
                               <div className="w-full flex items-center justify-between text-[8px] sm:text-[10px] text-zinc-500 font-mono font-bold">
                                  <span>1:26</span>
                                  <div className="flex-1 h-1 sm:h-1.5 bg-zinc-200 rounded-full relative mx-2">
                                     <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-black rounded-full" />
                                     <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full shadow" />
                                  </div>
                                  <span>3:50</span>
                               </div>
                               
                               <div className="w-full flex items-center justify-between mt-1 sm:mt-2 px-1">
                                  <Heart size={14} className="text-zinc-600 fill-zinc-600" />
                                  <div className="flex items-center gap-4 sm:gap-6 text-black">
                                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"></line></svg>
                                     <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">
                                       <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                     </div>
                                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"></line></svg>
                                  </div>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path></svg>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {/* SCENE 2: AR ENCRYPTED */}
                    {activeModule === 2 && (
                      <motion.div 
                        key="s2"
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="absolute inset-0 bg-white flex items-center justify-center perspective-[800px]"
                      >
                         {/* Canvas Print Base */}
                         <div className="absolute inset-0 bg-[#f0f0f0] flex items-center justify-center">
                           <Fingerprint strokeWidth={0.5} className="text-zinc-300 w-48 h-48 sm:w-64 sm:h-64 opacity-50" />
                         </div>

                         {/* The Glass Phone Layer */}
                         <motion.div 
                           initial={{ z: 0, rotateX: 0, rotateY: 0, scale: 0.95 }}
                           animate={isMobile ? { scale: 1 } : { z: 80, rotateX: 10, rotateY: -15, scale: 1 }}
                           transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                           className="relative w-[65%] aspect-[9/19] rounded-[2rem] bg-black/80 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(157,78,221,0.3)] flex flex-col p-2 overflow-hidden mx-auto"
                           style={{ transformStyle: isMobile ? "flat" : "preserve-3d" }}
                         >
                            {/* Screen Glow */}
                            <div className="absolute -inset-10 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(157,78,221,0.2),rgba(255,255,255,0),rgba(157,78,221,0.2))] animate-[spin_4s_linear_infinite]" />
                            <div className="absolute inset-0 bg-black/60 z-0" />

                            <div className="w-1/3 h-4 sm:h-5 bg-black rounded-full mx-auto mt-1 absolute top-2 left-1/2 -translate-x-1/2 z-20" />
                            
                            <div className="relative z-10 w-full h-full border border-white/10 rounded-[1.5rem] overflow-hidden flex flex-col justify-between">
                              {/* Video Playback UI */}
                              <div className="absolute inset-0">
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1] }} 
                                  transition={{ duration: 4, repeat: Infinity }}
                                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-50" 
                                />
                                <div className="absolute inset-0 bg-black/40" />
                              </div>

                              <div className="p-3 sm:p-4 text-white flex justify-between items-center relative z-20">
                                 <div className="flex gap-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                   <span className="font-mono text-[7px] sm:text-[9px] tracking-widest uppercase">REC</span>
                                 </div>
                                 <ScanLine size={12} className="text-white/50" />
                              </div>

                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                 <motion.div 
                                   whileHover={{ scale: 1.1 }}
                                   className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-lg border border-white/30 flex items-center justify-center cursor-pointer"
                                 >
                                   <PlayCircle size={20} className="text-white fill-white ml-1" />
                                 </motion.div>
                              </div>

                              <div className="p-3 sm:p-4 relative z-20 border-t border-white/10 bg-black/20 backdrop-blur-md">
                                 <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div animate={{ width: ["0%", "100%"] }} transition={{ duration: 6, ease: "linear", repeat: Infinity }} className="h-full bg-[#9d4edd] rounded-full" />
                                 </div>
                              </div>
                            </div>
                         </motion.div>
                      </motion.div>
                    )}

                    {/* SCENE 3: SYNCHRONIZED LUMENS */}
                    {activeModule === 3 && (
                      <motion.div 
                        key="s3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-[#050505] overflow-hidden flex items-center justify-center flex-col"
                      >
                         {/* Massive Audio Bloom */}
                         <motion.div 
                            animate={{ opacity: [0.1, 1, 0.2], scale: [0.8, 1.2, 0.9] }}
                            transition={{ duration: 0.4, repeat: Infinity, repeatType: 'mirror' }}
                            className="absolute inset-0 bg-[#ffb703] blur-[80px]"
                         />
                         
                         <div className="relative z-10 p-6 w-full h-full flex flex-col justify-between">
                            <div className="flex justify-between w-full opacity-50">
                               <div className="w-3 h-3 border-t border-l border-[#ffb703]" />
                               <div className="w-3 h-3 border-t border-r border-[#ffb703]" />
                            </div>
                            
                            <motion.div 
                              className="w-16 h-16 sm:w-24 sm:h-24 mx-auto border sm:border-2 border-[#ffb703] rounded-full flex items-center justify-center relative"
                            >
                              <Zap size={24} className="text-white drop-shadow-[0_0_10px_#ffb703]" />
                              {/* Expanding Echo Rings */}
                              <motion.div 
                                animate={{ scale: [1, 2.5], opacity: [1, 0] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 border border-[#ffb703] rounded-full"
                              />
                              <motion.div 
                                animate={{ scale: [1, 2], opacity: [1, 0] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                                className="absolute inset-0 border border-[#ffb703] rounded-full"
                              />
                            </motion.div>

                            <div className="flex justify-between w-full opacity-50 items-end">
                               <div className="w-3 h-3 border-b border-l border-[#ffb703]" />
                               <div className="w-3 h-3 border-b border-r border-[#ffb703]" />
                            </div>
                         </div>

                         {/* Hard Bass Visualization Bars */}
                         <div className="absolute bottom-0 left-0 right-0 h-1/4 sm:h-1/3 flex items-end justify-center gap-1 sm:gap-2 px-8 opacity-80 z-20">
                            {[1, 5, 2, 8, 10, 4, 7, 3, 9, 2].map((v, i) => (
                               <motion.div 
                                 key={i}
                                 className="w-full bg-[#ffb703]"
                                 animate={{ height: [`${v*10}%`, `${v*20}%`, `${v*5}%`] }}
                                 transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 }}
                               />
                            ))}
                         </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

             </div>
           </div>
        </motion.div>

      </div>

      {/* 4. LAYER UI INTERFAZ: "THE MAC OS DOCK" */}
      <div className="relative z-30 w-full flex flex-col items-center pb-8">
         
         {/* Modern Orbital Dock */}
         <div className="w-11/12 max-w-[800px] h-20 sm:h-24 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 mx-auto relative overflow-x-auto sm:overflow-visible overflow-y-visible hide-scrollbar mb-6 sm:mb-8">
            
            <div className="w-full flex items-center h-full relative z-10 min-w-[400px] sm:min-w-0">
               {FEATURE_MODULES.map((mod, idx) => {
                 const isActive = activeModule === idx;
                 return (
                   <button 
                     key={mod.id}
                     onClick={() => setActiveModule(idx)}
                     className="flex-1 h-full relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-1 sm:px-4 rounded-full group transition-all"
                   >
                     {/* Background Pill using Framer Motion Layout for PERFECT sliding */}
                     {isActive && (
                       <motion.div
                         layoutId="dock-pill"
                         className="absolute inset-0 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] rounded-full -z-10"
                         transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                       />
                     )}
                     
                     <motion.div 
                       animate={{ 
                         color: isActive ? mod.color : 'rgba(255,255,255,0.4)',
                         scale: isActive ? 1.1 : 1
                       }}
                       className="transition-colors duration-300"
                     >
                       <mod.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="sm:w-5 sm:h-5" />
                     </motion.div>
                     <div className="flex flex-col items-center sm:items-start text-left">
                        <span className="text-[10px] sm:text-xs font-bold font-sans tracking-wide transition-colors whitespace-nowrap" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                           {mod.label}
                        </span>
                     </div>
                   </button>
                 );
               })}
            </div>
         </div>

         {/* EXPLANATION LAYER (No Button) */}
         <div className="w-full flex flex-col items-center px-6">
            <AnimatePresence mode="wait">
               <motion.div 
                  key={activeModule}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-3xl flex flex-col items-center text-center"
               >
                  <h4 
                    className="text-2xl sm:text-4xl font-black mb-4 sm:mb-6 tracking-tight drop-shadow-md" 
                    style={{ color: activeData.color, textShadow: `0 0 50px ${activeData.color}90` }}
                  >
                    {activeData.title}
                  </h4>
                  
                  <p className="text-[#e2e2e2] text-sm sm:text-[17px] font-sans font-light mb-6 h-28 sm:h-20 leading-[1.8] max-w-2xl mx-auto opacity-90 drop-shadow">
                     {activeData.description}
                  </p>
                  
               </motion.div>
            </AnimatePresence>
         </div>

      </div>

    </section>
  );
}
