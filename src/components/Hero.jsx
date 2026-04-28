'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, useVelocity, useMotionTemplate } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, Zap, Shield, Globe, Database, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTerminal } from '@/contexts/TerminalContext';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';
import HolographicCube from '@/components/HolographicCube';

const BACKGROUNDS = [
  { id: 'mesh', name: 'Malla Neural', color: 'from-fuchsia-600/30 via-pink-600/20 to-violet-600/20' },
  { id: 'grid', name: 'Cuadrícula Digital', color: 'from-blue-600/30 via-cyan-500/20 to-indigo-600/20' },
  { id: 'aurora', name: 'Destello Solar', color: 'from-amber-500/30 via-orange-600/20 to-yellow-500/20' },
  { id: 'pattern', name: 'Patrón Glitch', color: 'from-emerald-500/20 via-teal-600/30 to-cyan-600/20' }
];

const BackgroundEffect = ({ activeId, isMobile }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2, ease: "circOut" }}
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-all duration-1000 saturate-150 contrast-125",
            BACKGROUNDS.find(b => b.id === activeId)?.color
          )}
        >
          {/* Decorative elements based on mode */}
          {activeId === 'grid' && (
            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.1) 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
          )}
          {activeId === 'mesh' && (
            <div className={`absolute inset-0 opacity-50 ${isMobile ? 'blur-[60px]' : 'blur-[100px]'} bg-gradient-to-tr from-[#ff007f] via-purple-600 to-transparent animate-pulse`} />
          )}
          {activeId === 'aurora' && (
            <>
              <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[60%] bg-neon-cyan/20 ${isMobile ? 'blur-[80px]' : 'blur-[150px]'} rounded-full animate-pulse`} />
              <div className={`absolute -bottom-[20%] -right-[10%] w-[50%] h-[60%] bg-[#ff007f]/20 ${isMobile ? 'blur-[80px]' : 'blur-[150px]'} rounded-full animate-pulse`} />
            </>
          )}
          {activeId === 'pattern' && (
             <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,255,255,0.3) 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
    </div>
  );
};

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { openSynthesis } = useTerminal();
  const { lang } = useLang();
  const t = translations[lang].hero;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // EXTREME INERTIA LOGIC (Soft-A scaled up)
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  // Mass 2.5 creates a very heavy "dragging" cinematic feel
  const smoothX = useSpring(xRaw, { stiffness: 80, damping: 25, mass: 2.5 });
  const smoothY = useSpring(yRaw, { stiffness: 80, damping: 25, mass: 2.5 });
  
  const rotateX = useTransform(smoothY, [-500, 500], [25, -25]);
  const rotateY = useTransform(smoothX, [-500, 500], [-25, 25]);
  
  // BACKGROUND PARALLAX
  const bgShiftX = useTransform(smoothX, [-500, 500], [-30, 30]);
  const bgShiftY = useTransform(smoothY, [-500, 500], [-30, 30]);

  // COMBINED EXTREME MOUSE GLITCH
  const xVelocity = useVelocity(smoothX);
  const yVelocity = useVelocity(smoothY);
  const glitchOffsetX = useTransform(xVelocity, [-2000, 0, 2000], [25, 0, -25], { clamp: true });
  const glitchOffsetY = useTransform(yVelocity, [-2000, 0, 2000], [15, 0, -15], { clamp: true });
  const mouseSkewX = useTransform(xVelocity, [-2000, 0, 2000], [-20, 0, 20], { clamp: true });
  
  const textGlitchShadow = useMotionTemplate`${glitchOffsetX}px ${glitchOffsetY}px 0px rgba(0,255,255,0.9), calc(-1 * ${glitchOffsetX}px) calc(-1 * ${glitchOffsetY}px) 0px rgba(255,0,127,0.9)`;

  // SCROLL GLITCH FOR MARQUEE
  const { scrollY } = useScroll();
  const scrollV = useSpring(useVelocity(scrollY), { stiffness: 400, damping: 50 });
  const marqueeSkew = useTransform(scrollV, [-2000, 0, 2000], [-45, 0, 45], { clamp: true });

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    xRaw.set(moveX);
    yRaw.set(moveY);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 pb-32 overflow-x-hidden lg:overflow-hidden flex flex-col lg:justify-center bg-black cursor-crosshair"
    >
      <motion.div style={{ x: bgShiftX, y: bgShiftY }} className="absolute inset-[-5%] w-[110%] h-[110%] pointer-events-none">
         <BackgroundEffect activeId={BACKGROUNDS[bgIndex].id} isMobile={isMobile} />
      </motion.div>
      
      {/* Intense Scanning Laser Overlays */}
      {!isMobile && (
        <>
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10 animate-scan-laser shadow-[0_0_20px_rgba(0,255,255,0.8)] mix-blend-screen pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-transparent via-[#ff007f] to-transparent z-10 animate-scan-vertical shadow-[0_0_20px_rgba(255,0,127,0.8)] mix-blend-screen pointer-events-none" />
        </>
      )}
      
      {/* Hyper-Terminal Overlays */}
      <div className="absolute top-32 right-12 z-20 hidden xl:block">
        <motion.div 
          style={{ textShadow: textGlitchShadow, skewX: mouseSkewX }}
          className="bg-black/40 backdrop-blur-md border border-neon-cyan/50 p-4 rounded text-[10px] font-mono tracking-widest text-white/50 space-y-2 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,255,1)]" />
            <span className="uppercase">{t.terminal.systemLoad}</span>
            <span className="text-neon-cyan font-black">{t.terminal.systemValue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff007f] rounded-full shadow-[0_0_5px_rgba(255,0,127,1)]" />
            <span className="uppercase">{t.terminal.syncBuffer}</span>
            <span className="text-[#ff007f] font-black">{t.terminal.syncValue}</span>
          </div>
          <div className="pt-2 border-t border-white/20 mt-2">
            LOC: 28.6330N-106.0691W // MX
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/4 left-12 z-20 hidden 2xl:block">
        <motion.div style={{ textShadow: textGlitchShadow, skewX: mouseSkewX }} className="flex flex-col gap-24">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 group">
               <div className="w-3 h-3 border border-white/40 rotate-45 group-hover:bg-neon-cyan transition-colors shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
               <div className="h-[2px] w-12 bg-white/20 group-hover:w-24 group-hover:bg-neon-cyan transition-all" />
               <span className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.5em] group-hover:text-neon-cyan transition-colors">Sector_0{i}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 perspective-1000">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 text-center lg:text-left">
              <span className="w-12 sm:w-16 h-[3px] bg-neon-pink shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
              <span className="text-neon-pink text-[10px] sm:text-xs font-black tracking-[0.5em] uppercase drop-shadow-[0_0_5px_rgba(255,0,127,0.8)]">{t.badge}</span>
            </div>

            <motion.h1 
              style={{ 
                rotateX: isMobile ? 0 : rotateX, 
                rotateY: isMobile ? 0 : rotateY, 
                textShadow: textGlitchShadow, 
                skewX: isMobile ? 0 : mouseSkewX 
              }}
              className="text-[3rem] sm:text-[4.5rem] lg:text-[6.5rem] font-black tracking-tighter leading-[0.85] mb-6 preserve-3d text-white selection:bg-[#ff007f] selection:text-white text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <span className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  {t.arBadge}
                </span>
              </div>
              {t.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-[#ff007f]">{t.titleLine2}</span>
            </motion.h1>

            <p 
              className="text-sm lg:text-base text-white/70 mb-8 max-w-lg leading-relaxed font-light backdrop-blur-sm p-4 border-l-4 lg:border-l-4 border-neon-cyan bg-black/20 text-center lg:text-left mx-auto lg:mx-0"
            >
              {t.description} <span className="text-neon-pink font-black uppercase tracking-widest inline-flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                {t.arLabel}
              </span>{t.descriptionEnd}
              <span className="block mt-4 pt-4 border-t border-white/10 text-[10px] font-mono tracking-widest text-neon-cyan/80">
                {t.systemStatus}
              </span>
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              <a href="/marketplace">
                <button className="bg-neon-cyan text-black px-7 py-3 rounded-none font-black text-[8px] tracking-[0.4em] uppercase flex items-center gap-3 group hover:bg-[#ff007f] hover:text-white transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,127,0.6)] skew-x-[-10deg]">
                  <span className="skew-x-[10deg]">{t.ctaPrimary}</span>
                  <ArrowRight size={18} className="skew-x-[10deg] group-hover:translate-x-3 transition-transform" />
                </button>
              </a>
              <button 
                onClick={openSynthesis}
                className="bg-black/50 backdrop-blur-lg px-7 py-3 border-2 border-neon-pink text-neon-pink font-black text-[8px] tracking-[0.4em] uppercase hover:bg-neon-pink hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,127,0.2)] skew-x-[-10deg]"
              >
                <span className="skew-x-[10deg]">{t.ctaSecondary}</span>
              </button>
            </div>

            {/* High-Tech Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-white/10">
              {[
                { ...t.metrics[0], color: 'text-neon-pink' },
                { ...t.metrics[1], color: 'text-neon-cyan' },
                { ...t.metrics[2], color: 'text-neon-yellow' }
              ].map((m, idx) => (
                <div key={idx} className="group cursor-default text-center lg:text-left">
                  <div className={`text-2xl lg:text-3xl font-black mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_currentColor] ${m.color}`}>{m.val}</div>
                  <div className="text-[7px] sm:text-[8px] uppercase tracking-[0.3em] font-bold text-white/50 group-hover:text-white transition-colors">{m.label}</div>
                </div>
              ))}

            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:col-span-5 relative z-10 mt-12 lg:mt-0"
          >
            {/* HolographicCube — Solo tablet/desktop (md+). En móvil se muestra un placeholder ligero */}
            <div style={{ scale: 1.03 }} className="relative perspective-1000 translate-x-0 lg:-translate-x-4">
               <div className="absolute inset-0 bg-neon-cyan/5 blur-[100px] rounded-full pointer-events-none" />
               
               {/* Placeholder visual ligero para móvil */}
               <div className="block md:hidden w-full h-[250px] relative flex items-center justify-center">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-32 h-32 border border-neon-cyan/30 rotate-45 relative">
                     <div className="absolute inset-2 border border-[#ff007f]/30 rotate-12" />
                     <div className="absolute inset-4 border border-neon-cyan/20 -rotate-6" />
                     <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-[#ff007f]/10 animate-pulse" />
                   </div>
                 </div>
                 <div className="absolute bottom-4 left-0 right-0 text-center">
                   <span className="text-[8px] font-mono text-white/20 tracking-[0.5em] uppercase">HOLO_CORE // ACTIVE</span>
                 </div>
               </div>

               {/* Cubo 3D completo para tablet y desktop */}
               <div className="hidden md:block">
                 <HolographicCube />
               </div>
               
               {/* Decorative Ring */}
               <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none hidden md:block" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Extreme Scrolling Notification Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-neon-cyan/40 py-4 whitespace-nowrap overflow-hidden z-30 shadow-[0_-10px_30px_rgba(0,255,255,0.1)]">
        <motion.div 
          style={{ skewX: marqueeSkew }}
          animate={{ x: [0, -2000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="inline-block mx-8 sm:mx-12 text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-[0.5em]">
              {t.marquee.syncing} <span className="text-[#ff007f] drop-shadow-[0_0_5px_rgba(255,0,127,1)]">GEISHA_V2.SYS</span> <span className="mx-2 sm:mx-4 text-neon-cyan">///</span> {t.marquee.detecting} <span className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,1)]">CRITICAL</span> <span className="mx-2 sm:mx-4 text-neon-cyan">///</span> {t.marquee.protocol} <span className="text-neon-yellow drop-shadow-[0_0_5px_rgba(255,255,0,1)]">ACTIVO</span>
            </span>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes scan-laser {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes scan-vertical {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        .animate-scan-laser {
          animation: scan-laser 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-scan-vertical {
          animation: scan-vertical 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}
