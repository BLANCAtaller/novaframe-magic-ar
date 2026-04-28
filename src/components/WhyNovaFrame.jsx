'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const AnimatedText = ({ text, className, delay = 0 }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function WhyNovaFrame() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center bg-black overflow-hidden font-sans selection:bg-cyan-500/30"
    >
      {mounted && (
        <>
          {/* Immersive Background Layers */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
            
            {/* Diagnostic Scanning Line */}
            <motion.div 
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent z-20 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            />

            {/* Mouse Following Spotlight */}
            <motion.div 
              className="absolute inset-0 z-10"
              animate={{
                background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.04), transparent 70%)`
              }}
            />

            {/* Blueprint Wireframe (Parallax) */}
            <motion.div 
              style={{ y: y1, opacity: 0.05 }}
              className="absolute right-[-10%] top-0 w-[80%] h-full flex items-center justify-center z-5"
            >
              <svg viewBox="0 0 800 600" className="w-full h-full stroke-cyan-500 fill-none stroke-[0.5]">
                <rect x="100" y="100" width="600" height="400" />
                <line x1="100" y1="100" x2="700" y2="500" />
                <line x1="700" y1="100" x2="100" y2="500" />
                <circle cx="400" cy="300" r="50" />
                <circle cx="400" cy="300" r="150" strokeDasharray="10 10" />
                <path d="M 50 300 H 750" strokeDasharray="5 5" />
                <path d="M 400 50 V 550" strokeDasharray="5 5" />
                <text x="110" y="90" className="fill-cyan-500 font-mono text-[10px]">FRAME_PROTOCOL_V4.2</text>
                <text x="600" y="520" className="fill-cyan-500 font-mono text-[10px]">AXIS_CALIBRATION: OK</text>
              </svg>
            </motion.div>

            {/* Parallax Grid */}
            <motion.div 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
                backgroundSize: '120px 120px',
                y: y2
              }}
              className="absolute inset-0 opacity-[0.03]" 
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
            <div className="flex flex-col items-start gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 mb-8"
              >
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-cyan-500" />
                   <div className="w-1.5 h-1.5 bg-cyan-500/20" />
                </div>
                <span className="text-cyan-500 font-mono text-[10px] tracking-[1em] uppercase font-black">
                  Calibración // Protocolo
                </span>
              </motion.div>
              
              <div className="relative">
                <AnimatedText 
                  text="INGENIERÍA" 
                  className="text-[12vw] md:text-[8vw] font-black text-white tracking-tighter uppercase leading-[0.7]"
                />
                <AnimatedText 
                  text="DEL ASOMBRO" 
                  delay={0.15}
                  className="text-[12vw] md:text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-transparent italic tracking-tighter uppercase leading-[0.7]"
                />
                
                {/* Micro-Technical Callouts */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-4 top-0 hidden xl:flex flex-col gap-1 items-end opacity-20"
                >
                  <span className="text-[8px] font-mono text-white tracking-widest">RES_8K_NATIVE</span>
                  <div className="w-12 h-[1px] bg-white" />
                  <span className="text-[8px] font-mono text-white tracking-widest">DRIVE_UNIT_01</span>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-12 flex flex-wrap items-center gap-12"
              >
                <div className="flex flex-col group py-4 px-6 border-l border-white/5 hover:border-cyan-500/50 transition-colors">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mb-3">Precisión_HVD</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono text-white font-black tracking-tighter">DELTA-E 2.0</span>
                  </div>
                </div>
                
                <div className="flex flex-col group py-4 px-6 border-l border-white/5 hover:border-cyan-500/50 transition-colors">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mb-3">Certificación</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono text-white font-black tracking-tighter uppercase">Archivo</span>
                  </div>
                </div>

                <div className="flex flex-col group py-4 px-6 border-l border-white/5 hover:border-cyan-500/50 transition-colors">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mb-3">Estado</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono text-cyan-500 font-black tracking-tighter uppercase animate-pulse">Optimum</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Immersive Vertical Tag */}
          <div className="absolute right-12 top-0 bottom-0 flex items-center pointer-events-none opacity-5">
             <span className="text-[12px] font-mono text-white tracking-[2em] uppercase origin-center rotate-90 whitespace-nowrap">
                TECHNICAL_SUPERIORITY_ESTABLISHED
             </span>
          </div>
        </>
      )}
    </section>
  );
}
