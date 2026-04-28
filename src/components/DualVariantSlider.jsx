'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, useVelocity, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ARTWORKS = [
  { 
    id: 'white-rabbit-chrono', 
    title: 'THE WHITE RABBIT // CHRONO ZENITH',
    colorUrl: '/images/products/chrono-rabbit/color/chrono_rabbit_zenith.webp',
    pbnUrl: '/images/products/chrono-rabbit/paint-by-numbers/chrono_rabbit_pbn.webp',
    objectPosition: 'center'
  },
  { 
    id: 'courage-berserk', 
    title: 'COURAGE // THE BLACK SWORDSMAN',
    colorUrl: '/images/products/courage-berserk/color/courage-berserk-v1.webp',
    pbnUrl: '/images/products/courage-berserk/color/courage-berserk-v5.webp',
    objectPosition: 'center 60%'
  },
  { 
    id: 'charmander-cyber', 
    title: 'CHARMANDER // NEURAL_DRAKE',
    colorUrl: '/images/products/charmander-evolution/color/charmander-cyber.webp',
    pbnUrl: '/images/products/charmander-evolution/paint-by-numbers/charmander-cyber.webp',
    objectPosition: 'center'
  },
  { 
    id: 'boss-bunny', 
    title: 'BOSS BUNNY // EMPIRE_STATE',
    colorUrl: '/images/products/boss-bunny/color/boss-bunny.webp',
    pbnUrl: '/images/products/boss-bunny/paint-by-numbers/boss-bunny.webp',
    objectPosition: 'center'
  },
  { 
    id: 'mcduck-zenith', 
    title: 'McDUCK // GLOBAL_MARKET_v4',
    colorUrl: '/images/products/hong-kong-mcduck/color/hong-kong-mcduck.webp',
    pbnUrl: '/images/products/wonderland-mcduck/paint-by-numbers/wonderland-mcduck.webp',
    objectPosition: 'center'
  },
];

const getThumb = (url) => url ? url.replace(/\.(webp|png|jpg|jpeg)$/i, '_thumb.webp') : null;




export default function DualVariantSlider() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSentinelMode, setIsSentinelMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // NAVEGACIÓN HUD
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  
  const currentArt = ARTWORKS[currentIndex];

  // ============================================
  // SOFT-A: FRICCIÓN MAGNÉTICA
  // ============================================
  const xPct = useMotionValue(50);
  const smoothPct = useSpring(xPct, { stiffness: 100, damping: 25, mass: 1.5 });
  
  const pX = useMotionValue(0);
  const pY = useMotionValue(0);
  const smoothPX = useSpring(pX, { stiffness: 80, damping: 30 });
  const smoothPY = useSpring(pY, { stiffness: 80, damping: 30 });

  // ============================================
  // NANO-B: GLITCH HUD REACTIVO A LA VELOCIDAD
  // ============================================
  const xVelocity = useVelocity(smoothPct);
  const glitchOffset = useTransform(xVelocity, [-800, 0, 800], [5, 0, 5], { clamp: true });
  const glitchSkew = useTransform(xVelocity, [-800, 0, 800], [-10, 0, 10], { clamp: true });
  const glitchTextShadow = useMotionTemplate`${glitchOffset}px 0 0 rgba(0, 255, 255, 0.8), calc(-1 * ${glitchOffset}px) 0 0 rgba(255, 0, 127, 0.8)`;
  
  const clipPath = useMotionTemplate`inset(0 calc(100% - ${smoothPct}%) 0 0)`;
  const leftPos = useMotionTemplate`${smoothPct}%`;
  
  const baseTransform = useMotionTemplate`translate(${smoothPX}px, ${smoothPY}px) scale(1.05)`;
  const topTransform = useMotionTemplate`translate(${smoothPX}px, ${smoothPY}px) scale(1.05)`;


  useEffect(() => {
    let intervalId;
    if (isSentinelMode) {
      xPct.set(50);
      let phase = 0;
      intervalId = setInterval(() => {
        phase += 0.015;
        const newVal = 50 + Math.sin(phase) * 15;
        xPct.set(newVal);
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isSentinelMode, xPct]);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    if (isSentinelMode) setIsSentinelMode(false);
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const position = (x / rect.width) * 100;
    
    xPct.set(position);
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    pX.set((mouseX / rect.width - 0.5) * 30);
    pY.set((mouseY / rect.height - 0.5) * 30);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    pX.set(0);
    pY.set(0);
    setTimeout(() => { setIsSentinelMode(true); }, 3500);
  };
  
  const handlePointerEnter = () => {
    setIsHovered(true);
    setIsSentinelMode(false);
  };

  // NAVEGACIÓN HANDLERS
  const triggerGlitchChange = (direction) => {
    if(isChanging) return;
    setIsChanging(true);
    // Movemos el slider rápidamente hacia el centro o a un lado
    xPct.set(50);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prev) => (prev + 1) % ARTWORKS.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + ARTWORKS.length) % ARTWORKS.length);
      }
      setIsChanging(false);
    }, 300); // 300ms de "glitch/pantalla rota"
  };

  return (
    <section className="relative w-full bg-black py-32 overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-900/10 to-pink-900/10 blur-[150px] pointer-events-none" />

      {/* HEADER DESC */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full mb-24">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 md:gap-6 text-center md:text-left">
          <div className="group cursor-default flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-neon-cyan to-[#ff007f] transition-all duration-500 group-hover:w-16" />
              <span className="text-neon-cyan text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase opacity-90">
                PROTOCOLO DE RECONSTRUCCIÓN
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
              EL CÓDIGO FUENTE. <br/> 
              <span className="text-white/30 transition-colors duration-700 group-hover:text-white/60">REVELADO.</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-sm font-light leading-relaxed hover:text-white/60 transition-colors mx-auto md:mx-0">
            Interactúa con el escáner para descubrir la dualidad de la galería. Adquiere el diseño hiperrealista original, o escoge la matriz <span className="text-neon-cyan font-medium opacity-80">Paint-by-Numbers</span> para colorear tu propia versión.
          </p>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* NAVEGACIÓN HUD FLOTANTE SUPERIOR */}
        <div className="absolute -top-20 left-1/2 md:left-auto md:right-6 -translate-x-1/2 md:translate-x-0 z-40 flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end px-4">
          <button 
             onClick={() => triggerGlitchChange('prev')} 
             className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan/50 hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,255,255,0)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex flex-col items-center bg-black/40 backdrop-blur px-8 py-2 border border-white/10 rounded">
            <span className="text-[10px] text-neon-cyan font-black tracking-[0.3em]">
              [{String(currentIndex + 1).padStart(2, '0')} // {String(ARTWORKS.length).padStart(2, '0')}]
            </span>
            <AnimatePresence mode="popLayout">
               <motion.span 
                 key={currentArt.id}
                 initial={{ y: 10, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: -10, opacity: 0 }}
                 className="text-[10px] text-white/60 font-mono tracking-widest mt-1"
               >
                 {currentArt.title}
               </motion.span>
            </AnimatePresence>
          </div>
          <button 
             onClick={() => triggerGlitchChange('next')} 
             className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-[#ff007f]/20 hover:text-[#ff007f] hover:border-[#ff007f]/50 hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,0,127,0)] hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* CONTAINER DEL SLIDER Y GLITCH */}
        <div className="relative">
          {/* CRITICAL VHS GLITCH OVERLAY (SOLO ACTIVO DURANTE IS_CHANGING) */}
          <AnimatePresence>
            {isChanging && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 pointer-events-none mix-blend-difference"
              >
                 <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 15%, 100% 15%, 100% 25%, 0 25%)' }} />
                 <div className="absolute inset-0 bg-neon-cyan" style={{ clipPath: 'polygon(0 65%, 100% 65%, 100% 70%, 0 70%)' }} />
                 <div className="absolute inset-0 bg-[#ff007f]" style={{ clipPath: 'polygon(0 85%, 100% 85%, 100% 88%, 0 88%)' }} />
                 <div className="absolute inset-0 backdrop-saturate-200 backdrop-invert" />
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/5] md:aspect-[16/9] rounded-[2rem] overflow-hidden cursor-crosshair border border-white/10 group select-none shadow-2xl"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerEnter={handlePointerEnter}
            onClick={(e) => handlePointerMove(e)}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              containerRef.current._touchStartX = touch.clientX;
            }}
            onTouchEnd={(e) => {
              if (!containerRef.current._touchStartX) return;
              const touch = e.changedTouches[0];
              const diff = touch.clientX - containerRef.current._touchStartX;
              if (Math.abs(diff) > 60) {
                triggerGlitchChange(diff > 0 ? 'prev' : 'next');
              }
              containerRef.current._touchStartX = null;
            }}
          >
            {/* Base Layer: Color Image with Blurred Backdrop */}
            <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {/* BLURRED BACKGROUND (To fill gaps) */}
                {/* BLURRED BACKGROUND (Using lightweight thumb) */}
                <motion.img 
                  key={`blur-base-${currentArt.id}`}
                  src={getThumb(currentArt.colorUrl)}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className={`absolute w-full h-full object-cover ${isMobile ? 'blur-xl' : 'blur-3xl'} scale-110 pointer-events-none`}
                />
                {/* PRIMARY IMAGE (Contained -> Covered) */}
                <motion.img 
                  key={`base-${currentArt.id}`}
                  src={currentArt.colorUrl}
                  alt="Full Color Variant"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, filter: isMobile ? "none" : "blur(20px)" }}
                  transition={{ duration: 0.6 }}
                  draggable="false"
                  style={{ transform: baseTransform, objectPosition: currentArt.objectPosition || 'center' }}
                  className="absolute w-full h-full object-cover pointer-events-none filter contrast-[1.05] saturate-[1.1] z-10"
                />
              </AnimatePresence>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute top-8 right-8 px-5 py-3 bg-[#050505]/95 backdrop-blur-xl border border-neon-cyan/40 select-none z-10 flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,255,0.2)]"
              style={{ x: glitchOffset, skewX: glitchSkew }}
            >
              <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
              <div className="flex flex-col gap-0.5">
                 <motion.span style={{ textShadow: glitchTextShadow }} className="text-[10px] font-black tracking-[0.2em] uppercase text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">TRUE_COLOR // HI_RES</motion.span>
                 <span className="text-[8px] font-mono tracking-[0.1em] text-neon-cyan/80">[PIXELS_LOCKED: 100%]</span>
              </div>
            </motion.div>

            {/* Top Layer: Paint By Numbers (Clipped) with Blurred Backdrop */}
            <motion.div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center bg-[#0a0a0a]" style={{ clipPath }}>
              <AnimatePresence mode="popLayout">
                {/* BLURRED BACKGROUND PBN */}
                {/* BLURRED BACKGROUND PBN (Using lightweight thumb) */}
                <motion.img 
                  key={`blur-top-${currentArt.id}`}
                  src={getThumb(currentArt.pbnUrl || currentArt.colorUrl)}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className={`absolute w-full h-full object-cover ${isMobile ? 'blur-xl' : 'blur-3xl'} scale-110 grayscale pointer-events-none`}
                />
                {/* PRIMARY IMAGE PBN (Contained -> Covered) */}
                <motion.img 
                  key={`top-${currentArt.id}`}
                  src={currentArt.pbnUrl || currentArt.colorUrl}
                  alt="Paint By Numbers Variant"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0, filter: isMobile ? "none" : "blur(20px)" }}
                  transition={{ duration: 0.6 }}
                  draggable="false"
                  style={{ transform: topTransform, objectPosition: currentArt.objectPosition || 'center' }}
                  className={`absolute w-full h-full object-cover grayscale mix-blend-luminosity pointer-events-none z-10 ${!currentArt.pbnUrl ? 'contrast-[1.4] brightness-[0.8]' : ''}`}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-[#ff007f]/5 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="absolute top-8 left-8 px-5 py-3 bg-[#050505]/90 backdrop-blur-xl border border-white/10 select-none flex items-center gap-4 shadow-2xl"
                 style={{ x: glitchOffset, skewX: glitchSkew }}
              >
                 <span className="w-1.5 h-1.5 bg-[#ff007f]/60 rounded-full animate-pulse" />
                 <div className="flex flex-col gap-0.5">
                   <motion.span style={{ textShadow: glitchTextShadow }} className="text-[10px] font-black tracking-widest uppercase text-white/70">RAW_MATRIX // PBN_MAP</motion.span>
                   <span className="text-[8px] font-mono tracking-widest text-[#ff007f]/50">[TRACING_ACTIVE: STANDBY]</span>
                 </div>
              </motion.div>
            </motion.div>

            {/* Slider Line & Handle (Z-20) */}
            <motion.div 
              className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-neon-cyan via-purple-500 to-[#ff007f] shadow-[0_0_20px_rgba(0,255,255,0.7)] z-20 pointer-events-none flex items-center justify-center mix-blend-screen"
              style={{ left: leftPos, transform: 'translateX(-50%)' }}
            >
              <div className="absolute inset-y-0 w-full bg-white opacity-40 blur-[1px] animate-pulse" />
              
              <motion.div 
                className="absolute w-6 bg-gradient-to-b from-transparent via-white/80 to-transparent mix-blend-plus-lighter"
                style={{ opacity: useTransform(xVelocity, [-500, 0, 500], [0.8, 0, 0.8]), height: 200, filter: "blur(4px)" }} 
              />

              <div className={`absolute flex items-center justify-center transition-transform duration-[600ms] ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-md border border-neon-cyan/50 rotate-45 shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-transform duration-[2s] ease-out group-hover:rotate-[225deg]" />
                  <div className="absolute inset-[5px] border border-[#ff007f]/40 rotate-45 transition-transform duration-[3s] ease-out group-hover:-rotate-[135deg]" />
                  <div className="relative z-10 flex items-center justify-center gap-[6px] opacity-90 transition-transform duration-300 group-hover:scale-110">
                     <div style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} className="w-2.5 h-3.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,1)]" />
                     <div className="w-[1px] h-4 bg-white/20" />
                     <div style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} className="w-2.5 h-3.5 bg-[#ff007f] shadow-[0_0_10px_rgba(255,0,127,1)]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative High-Tech Frame (Z-30) */}
        <div className="absolute inset-0 pointer-events-none z-30 p-6 opacity-80 mt-12 md:mt-0">
          <div className="w-full h-full rounded-[2rem] relative">
            <div className="absolute -top-[1px] -left-[1px] w-8 h-8 border-t-2 border-l-2 border-neon-cyan/60 rounded-tl-[2rem] shadow-[-2px_-2px_10px_rgba(0,255,255,0.1)]" />
            <div className="absolute -top-[1px] -right-[1px] w-8 h-8 border-t-2 border-r-2 border-[#ff007f]/60 rounded-tr-[2rem] shadow-[2px_-2px_10px_rgba(255,0,127,0.1)]" />
            <div className="absolute -bottom-[1px] -left-[1px] w-8 h-8 border-b-2 border-l-2 border-neon-cyan/60 rounded-bl-[2rem] shadow-[-2px_2px_10px_rgba(0,255,255,0.1)]" />
            <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 border-b-2 border-r-2 border-[#ff007f]/60 rounded-br-[2rem] shadow-[2px_2px_10px_rgba(255,0,127,0.1)]" />
          </div>
        </div>

      </div>
    </section>
  );
}
