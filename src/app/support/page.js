'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence, useSpring, useVelocity, useMotionTemplate, animate, useInView } from 'framer-motion';
import { 
  Search, Globe, Shield, Zap, Cpu, 
  ArrowRight, MessageSquare, Mail, 
  ChevronDown, Phone, Command, LifeBuoy, MapPin, Map,
  Loader2, CheckCircle2, Terminal, Activity, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ParticleMorphIcon from '@/components/ParticleMorphIcon';
import PhysicalGallery from '@/components/PhysicalGallery';


// --- CYBER HELPER COMPONENTS ---

const CharacterDecrypt = ({ text, delay = 0, duration = 1.2, className }) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px" });
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  useEffect(() => {
    if (!isInView) {
      setDisplayText('');
      return;
    }

    let iteration = 0;
    let interval = null;
    const initialDelay = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          text.split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) clearInterval(interval);
        iteration += text.length / (duration * 33.3); // Normalize to duration and 30ms intervals
      }, 30);
    }, delay * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialDelay);
    };
  }, [isInView, text, delay, duration]);

  return <span ref={ref} className={className}>{displayText || (isInView ? "" : text)}</span>;
};

const GlitchHeading = ({ text }) => {
  return (
    <div className="relative group">
      <h2 className="text-6xl md:text-8xl font-black italic mb-8 tracking-tighter text-white uppercase relative z-10 mix-blend-difference">
        <CharacterDecrypt text={text} />
      </h2>
      <motion.h2 
        animate={{ 
          x: [-2, 2, -1, 1, 0],
          opacity: [0, 0.5, 0.2, 0.4, 0]
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute inset-0 text-6xl md:text-8xl font-black italic mb-8 tracking-tighter text-[#ff007f] uppercase z-0 translate-x-1 opacity-0 group-hover:opacity-50"
      >
        {text}
      </motion.h2>
      <motion.h2 
        animate={{ 
          x: [2, -2, 1, -1, 0],
          opacity: [0, 0.5, 0.2, 0.4, 0]
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute inset-0 text-6xl md:text-8xl font-black italic mb-8 tracking-tighter text-[#00ffff] uppercase z-0 -translate-x-1 opacity-0 group-hover:opacity-50"
      >
        {text}
      </motion.h2>
    </div>
  );
};

const AnimatedCounter = ({ target, suffix }) => {
  const count = useMotionValue(0);
  const isDecimal = target % 1 !== 0;
  const rounded = useTransform(count, (latest) => {
    if (isDecimal) {
      return latest.toFixed(1) + suffix;
    }
    if (target > 1000) {
      return Math.floor(latest).toLocaleString() + suffix;
    }
    return Math.floor(latest) + suffix;
  });
  
  useEffect(() => {
    const controls = animate(count, target, {
      duration: 3,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5
    });
    return controls.stop;
  }, [target, count]);

  return <motion.span className="font-mono">{rounded}</motion.span>;
};

const TechnicalLabel = ({ label, status, color = "cyan" }) => {
  const colors = {
    cyan: "text-[#00ffff] border-[#00ffff]/30 bg-[#00ffff]/10 shadow-[0_0_8px_rgba(0,255,255,0.2)]",
    yellow: "text-[#ffff00] border-[#ffff00]/30 bg-[#ffff00]/10 shadow-[0_0_8px_rgba(255,255,0,0.2)]",
    pink: "text-[#ff007f] border-[#ff007f]/30 bg-[#ff007f]/10 shadow-[0_0_8px_rgba(255,0,127,0.2)]"
  };
  
  return (
    <div className="flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">{label}</span>
      <div className={cn("px-1.5 py-0.5 border text-[8px] font-black tracking-[0.2em] uppercase", colors[color])}>
        {status}
      </div>
    </div>
  );
};

const StatusStatusTicker = ({ top }) => {
  const { lang } = useLang();
  const t = translations[lang].support;
  const items = t.monitor;

  return (
    <div className={cn(
      "w-full py-2 bg-black/80 border-y border-white/5 overflow-hidden flex items-center relative z-20",
      top ? "mb-12" : "mt-12"
    )}>
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-8 whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                <TechnicalLabel {...item} />
                <span className="text-white/10 font-mono text-xs select-none">///</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TransmissionBlock = ({ log, i, mouseX, mouseY }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1 }}
      className="p-8 border border-white/5 bg-[#080808] relative group overflow-hidden hover:border-[#00ffff]/30 transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-[#00ffff]/50 transition-colors" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 group-hover:border-[#ff007f]/50 transition-colors" />

      <div className="absolute top-2 left-2 text-[7px] font-mono text-white/20 uppercase tracking-[0.4em]">
        TRM_ID_{200 + i}
      </div>

      <div className="mb-6 flex gap-1">
        {[...Array(5)].map((_, starI) => (
          <Star key={starI} size={10} className={starI < log.rating ? "text-[#00ffff] fill-[#00ffff]/60" : "text-white/15"} />
        ))}
      </div>

      <p className="text-white/80 text-sm md:text-base font-mono leading-relaxed mb-8 uppercase tracking-tight">
        <CharacterDecrypt text={log.quote} delay={0.2} duration={0.8} />
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div>
          <div className="text-white font-black text-xs uppercase tracking-widest group-hover:text-[#00ffff] transition-colors">
             {log.user}
          </div>
          <div className="text-white/30 text-[8px] font-mono uppercase tracking-widest mt-1">
             {log.sector}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-1 h-3 bg-[#00ffff]/30" />
           <div className="w-1 h-3 bg-[#ff007f]/30" />
        </div>
      </div>

      {isHovered && (
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-[#00ffff]/5 to-transparent skew-x-12"
        />
      )}
    </motion.div>
  );
};

const MovingTelemetryStrip = ({ stats }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  const duplicatedStats = [...stats, ...stats, ...stats, ...stats]; // Expanded for even more seamless flow
  
  return (
    <div className="mt-20 w-screen relative left-[50%] right-[50%] -ml-[50vw] +ml-[50vw] bg-black/60 border-y border-white/5 overflow-hidden group py-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <style jsx>{`
        .telemetry-container {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .data-ghost {
          font-family: monospace;
          font-size: 8px;
          opacity: 0.1;
          white-space: nowrap;
          animation: slide-right 20s linear infinite;
        }
        @keyframes slide-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }
      `}</style>
      
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-cyan/10 pointer-events-none" />
      
      {/* Background Data Flux Layer (Moves opposite to marquee) */}
      <div className="absolute inset-x-0 top-0 h-full pointer-events-none flex flex-col justify-around z-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="data-ghost text-neon-cyan/20 tracking-[1em] select-none">
            {Array(10).fill("01011010101100110111001101101011010").join(" ")}
          </div>
        ))}
      </div>

      <motion.div 
        animate={{ x: ["0%", "-25%"] }} // Adjusted for 4x duplication
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-0 whitespace-nowrap telemetry-container relative z-10"
      >
        {duplicatedStats.map((stat, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[450px] p-12 border-r border-white/5 relative overflow-hidden group/item hover:bg-white/[0.02] transition-all duration-500"
          >
            {/* Kinetic Corner Brackets */}
            <motion.div 
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/30" 
            />
            
            {/* High-Speed Signal ID */}
            <div className="absolute top-4 right-6 text-[10px] font-mono text-neon-cyan/40 tracking-tighter flex items-center gap-2">
               <motion.div 
                 animate={{ opacity: [1, 0.4, 1] }} 
                 transition={{ duration: 0.5, repeat: Infinity }}
                 className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#00ffff]" 
               />
               STREAM_SYNC_OK
            </div>

            {/* Sub-header background ID */}
            <div className="absolute -top-6 -right-4 text-8xl font-mono text-white/[0.03] select-none italic font-black group-hover/item:text-neon-cyan/[0.05 transition-colors duration-700">
              {(i % stats.length) + 1}
            </div>

            {/* Background Waveform Pulse */}
            <div className="absolute bottom-6 right-10 w-48 h-24 opacity-[0.05] pointer-events-none transition-all duration-700 group-hover/item:opacity-20 group-hover/item:scale-110">
              <svg viewBox="0 0 100 40" className="w-full h-full text-neon-cyan fill-none stroke-current stroke-[1.5]">
                <motion.path 
                  d="M0 30 L 10 30 L 15 5 L 25 38 L 30 15 L 40 30 L 100 30" 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-neon-cyan rotate-45 shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                <span className="text-[12px] font-mono text-white/60 uppercase tracking-[0.5em] font-bold">
                  {stat.label}
                </span>
                <span className="ml-auto text-[9px] font-mono text-white/30 tracking-widest bg-white/5 px-2 py-0.5 rounded-none">
                  #0{(i % stats.length) + 1}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-7xl font-black italic text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover/item:text-neon-cyan transition-all duration-500 scale-100 group-hover/item:scale-[1.02] origin-left">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </span>
                <div className="text-[10px] font-mono text-neon-cyan/50 tracking-[0.3em] uppercase mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  Data_Verified_Level_5
                </div>
              </div>
              
              {/* Technical Data Stream Overlay */}
              <div className="mt-8 relative pt-5 border-t border-white/10">
                 <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                       <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase flex items-center gap-2">
                          <Activity size={12} className="text-neon-cyan animate-pulse" /> CLOUD_FLUX_STABLE
                       </span>
                    </div>
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                       LATENCY <span className="text-emerald-500">{hasMounted ? (Math.random() * 5).toFixed(2) : "0.00"}MS</span>
                    </div>
                 </div>
                 
                 {/* Progress Bar with high-speed scan effect */}
                 <div className="w-full h-[1.5px] bg-white/[0.05] mt-4 relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "400%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#00ffff]"
                    />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const DigitalSparkField = ({ mouseX, mouseY, active }) => {
  const [sparks, setSparks] = useState([]);
  
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const interval = setInterval(() => {
      setSparks(prev => [
        ...prev.slice(-15),
        {
          id: Math.random(),
          x: mouseX.get() + (Math.random() - 0.5) * 100,
          y: mouseY.get() + (Math.random() - 0.5) * 100,
          size: Math.random() * 2 + 1
        }
      ]);
    }, 100);
    return () => clearInterval(interval);
  }, [active, mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {sparks.map(spark => (
          <motion.div
            key={spark.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute rounded-full bg-[#00ffff] shadow-[0_0_5px_#00ffff]"
            style={{
              left: spark.x,
              top: spark.y,
              width: spark.size,
              height: spark.size
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ReviewMonitor = () => {
  const { lang } = useLang();
  const t = translations[lang].support;
  const reviewLogs = t.reviews;
  const trustStats = t.trustStats;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightOpacity = useSpring(0, { stiffness: 100, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    spotlightOpacity.set(1);
  }

  const spotlight = useMotionTemplate`
    radial-gradient(
      800px circle at ${mouseX}px ${mouseY}px,
      rgba(0, 255, 255, 0.05),
      transparent 80%
    )
  `;

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => spotlightOpacity.set(1)}
      onMouseLeave={() => spotlightOpacity.set(0)}
      className="w-full bg-[#030303] py-20 relative overflow-hidden border-y border-white/5 cursor-crosshair selection:bg-[#00ffff] selection:text-black"
    >
      <style jsx global>{`
        @keyframes scanline-fast {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .hud-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none hud-grid opacity-30" />
      <motion.div 
        style={{ background: spotlight, opacity: spotlightOpacity }}
        className="absolute inset-0 z-0"
      />

      <StatusStatusTicker top={true} />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] font-mono text-white/40 tracking-[0.5em] uppercase">INCOMING_DATA_STREAM</div>
           </div>
           <div className="text-[10px] font-mono text-[#00ffff]/40">PACKET_LOSS: 0.00%</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewLogs.map((log, i) => (
            <TransmissionBlock key={i} log={log} i={i} mouseX={mouseX} mouseY={mouseY} />
          ))}
        </div>

        <MovingTelemetryStrip stats={trustStats} />
      </div>

      <StatusStatusTicker top={false} />

      <DigitalSparkField mouseX={mouseX} mouseY={mouseY} active={spotlightOpacity.get() > 0.5} />
    </section>
  );
};

const SectionHeader = ({ title, subtitle, className }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn("mb-20 relative", className)}
  >
    <div className="text-[12px] font-mono tracking-[0.8em] text-white/30 uppercase mb-4">{subtitle}</div>
    <div className="relative inline-block">
      <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-white uppercase">
        {title}
      </h2>
      <div className="absolute -top-4 -left-4 text-white/5 text-9xl font-black italic select-none pointer-events-none -z-10 uppercase tracking-tighter">
        {title.split(' ')[0]}
      </div>
    </div>
    <div className="h-px w-24 bg-gradient-to-r from-white/40 to-transparent mt-6" />
  </motion.div>
);

const HexDataFlux = ({ color, active }) => {
  const [hex, setHex] = useState('');
  
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      let str = '';
      for(let i = 0; i < 50; i++) {
        str += Math.floor(Math.random() * 16).toString(16) + ' ';
      }
      setHex(str);
    }, 150);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 flex flex-wrap content-start p-4 font-mono text-[8px] leading-tight break-all transition-opacity duration-1000"
         style={{ color, opacity: active ? 0.08 : 0 }}>
      {hex}
    </div>
  );
};

const ProtocolCard = ({ pillar, i }) => {
  const { lang } = useLang();
  const t = translations[lang].support;
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      ${pillar.color}20,
      transparent 80%
    )
  `;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative min-h-[500px] lg:h-[600px] flex flex-col rounded-none border border-white/5 bg-[#030303] p-6 md:p-10 overflow-hidden transition-all duration-700 hover:border-white/20 shadow-2xl"
    >
      {/* Background Interactive Layers */}
      <HexDataFlux color={pillar.color} active={isHovered} />
      
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{ background }}
      />
      
      {/* Kinetic Corner Brackets */}
      <motion.div 
        animate={{ 
          width: isHovered ? 50 : 20, 
          height: isHovered ? 50 : 20,
          borderColor: isHovered ? pillar.color : "rgba(255,255,255,0.05)"
        }}
        className="absolute top-0 left-0 border-t-2 border-l-2 transition-colors z-20" 
      />
      <motion.div 
        animate={{ 
          width: isHovered ? 50 : 20, 
          height: isHovered ? 50 : 20,
          borderColor: isHovered ? pillar.color : "rgba(255,255,255,0.05)"
        }}
        className="absolute top-0 right-0 border-t-2 border-r-2 transition-colors z-20" 
      />
      <motion.div 
        animate={{ 
          width: isHovered ? 50 : 20, 
          height: isHovered ? 50 : 20,
          borderColor: isHovered ? pillar.color : "rgba(255,255,255,0.05)"
        }}
        className="absolute bottom-0 left-0 border-b-2 border-l-2 transition-colors z-20" 
      />
      <motion.div 
        animate={{ 
          width: isHovered ? 50 : 20, 
          height: isHovered ? 50 : 20,
          borderColor: isHovered ? pillar.color : "rgba(255,255,255,0.05)"
        }}
        className="absolute bottom-0 right-0 border-b-2 border-r-2 transition-colors z-20" 
      />

      {/* Scanning Line overlay */}
      {isHovered && (
        <motion.div 
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[2px] z-10 opacity-30 blur-[1px]"
          style={{ background: `linear-gradient(to right, transparent, ${pillar.color}, transparent)` }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col">
        {/* Card Header metadata */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
             <div className="text-[9px] font-mono text-white/40 tracking-[0.3em] uppercase flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ backgroundColor: isHovered ? pillar.color : "" }} /> 
               {pillar.idFull}
             </div>
             <div className="text-[8px] font-mono text-white/20 tracking-[0.2em] uppercase transition-colors" style={{ color: isHovered ? pillar.color : "" }}>SYSTEM_STATE: {pillar.status}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <Activity size={12} className={cn("transition-colors", isHovered ? "text-white" : "text-white/20")} style={{ color: isHovered ? pillar.color : "" }} />
             <div className="text-[7px] font-mono text-white/10 uppercase tracking-tighter">LAT: {pillar.latency}</div>
          </div>
        </div>

        {/* Particle Icon Area */}
        <div className="relative w-32 h-32 mb-8 self-center flex items-center justify-center border border-white/5 bg-white/[0.01] group-hover:bg-transparent transition-all group-hover:border-transparent group-hover:scale-110 duration-700">
           {/* Inner glow pulse */}
           <motion.div 
             animate={{ 
               opacity: isHovered ? [0.1, 0.3, 0.1] : 0, 
               scale: isHovered ? [0.8, 1.2, 0.8] : 0.8 
             }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute inset-0 rounded-full blur-2xl"
             style={{ backgroundColor: pillar.color }}
           />
           
           <ParticleMorphIcon 
              type={pillar.iconType} 
              color={pillar.color} 
              isActive={isHovered} 
              mouseX={mouseX}
              mouseY={mouseY}
              size={120} 
              particleCount={800}
           />
        </div>

        <div className="mt-6 pl-6 border-l border-white/10 relative">
          {/* Decorative accent top-left of the line */}
          <div className="absolute top-0 left-[-1px] w-[1px] h-4" style={{ backgroundColor: pillar.color }} />
          
          <motion.h3 
            className="text-3xl font-black italic tracking-tighter mb-4 uppercase flex items-center gap-3"
          >
            <div className="px-1.5 py-0.5 border border-white/10 rounded-sm bg-white/[0.03] text-[10px] font-mono text-white/30">
              INDX_{i+1}
            </div>
            <span style={{ color: isHovered ? pillar.color : "white" }} className="transition-colors duration-500">
              {pillar.title}
            </span>
          </motion.h3>
          
          <p className="text-white/60 text-[15px] leading-relaxed font-display font-light tracking-[0.02em] max-w-[95%] transition-colors group-hover:text-white/80">
            {pillar.description}
          </p>
        </div>

        {/* Technical Status Log Console */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-[7px] font-mono text-white/20 uppercase tracking-widest">{t.tags.efficiency}</div>
              <div className="text-sm font-mono text-white/90">
                {isHovered ? (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span style={{ color: pillar.color }}>99.{hasMounted ? (Math.random() * 99).toFixed(0) : "00"}%</span>
                  </motion.span>
                ) : '---'}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[7px] font-mono text-white/20 uppercase tracking-widest">{t.tags.integrity}</div>
              <div className="text-[10px] font-mono font-bold" style={{ color: isHovered ? pillar.color : "inherit" }}>
                CONFIANZA_PRIME: 1.0.0
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.02] p-3 font-mono text-[7px] text-white/30 h-16 overflow-hidden relative border border-white/5">
            <div className="absolute top-0 right-2 w-1 h-full bg-white/5" />
            <motion.div 
               animate={{ y: isHovered ? [-10, -50] : 0 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="space-y-1"
            >
              <div>{">"} INITIATING PROTOCOL: {pillar.idFull}</div>
              <div>{">"} CALIBRATING SENSORS... OK</div>
              <div>{">"} SYNCING NEURAL_LINK: ACTIVE</div>
              <div>{">"} FLOW_FIELD_STABILIZED: {pillar.latency}</div>
              <div>{">"} ASSET_INTEGRITY_CHECK: 100%</div>
              <div>{">"} DISPATCHING_COMMAND_UPLINK...</div>
              <div>{">"} STATUS: {pillar.status}</div>
              <div>{">"} ENERGY_LEAK_DETECTED: STABLE</div>
              <div>{">"} KINETIC_RESONANCE: OPTIMAL</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background ID Watermark - Kinetic */}
      <motion.div 
        animate={{ 
          y: isHovered ? -20 : 0,
          opacity: isHovered ? 0.04 : 0.015
        }}
        className="absolute -bottom-10 -right-4 text-[200px] font-black italic text-white select-none pointer-events-none transition-colors leading-none"
      >
        {i + 1}
      </motion.div>
    </motion.div>
  );
};

export default function SupportPage() {
  const { lang } = useLang();
  const t = translations[lang].support;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    document.title = lang === 'ES' ? "Centro de Soporte // Protocolos — NovaFrame" : "Support Center // Protocols — NovaFrame";
  }, [lang]);

  // Derived Data from Translations
  const pillars = t.pillars.map((p, i) => ({
    ...p,
    icon: [Globe, Shield, Zap][i],
    color: ['#00ffff', '#10b981', '#ff007f'][i],
    gradient: ['from-cyan-500/20 to-blue-500/0', 'from-emerald-500/20 to-teal-500/0', 'from-pink-500/20 to-rose-500/0'][i]
  }));

  const faqsData = t.faqs;
  const reviews = t.reviews;
  const trustFeaturesData = t.trustFeatures;
  const trustStatsData = t.trustStats;

  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('LOGISTICA');
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // TACTICAL GLITCH PHYSICS
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const smoothX = useSpring(xRaw, { stiffness: 80, damping: 25, mass: 2.5 });
  const smoothY = useSpring(yRaw, { stiffness: 80, damping: 25, mass: 2.5 });
  
  const rotateX = useTransform(smoothY, [-500, 500], [15, -15]);
  const rotateY = useTransform(smoothX, [-500, 500], [-15, 15]);
  
  const xVelocity = useVelocity(smoothX);
  const yVelocity = useVelocity(smoothY);
  const glitchOffsetX = useTransform(xVelocity, [-2000, 0, 2000], [25, 0, -25], { clamp: true });
  const glitchOffsetY = useTransform(yVelocity, [-2000, 0, 2000], [15, 0, -15], { clamp: true });
  const mouseSkewX = useTransform(xVelocity, [-2000, 0, 2000], [-15, 0, 15], { clamp: true });
  
  const textGlitchShadow = useMotionTemplate`${glitchOffsetX}px ${glitchOffsetY}px 0px rgba(0,255,255,0.9), calc(-1 * ${glitchOffsetX}px) calc(-1 * ${glitchOffsetY}px) 0px rgba(255,0,127,0.9)`;

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    xRaw.set(moveX);
    yRaw.set(moveY);
  };

  const [activeFaq, setActiveFaq] = useState(null);
  const [uplinkState, setUplinkState] = useState('idle'); // 'idle' | 'sending' | 'success'

  const handleUplinkSubmit = async (e) => {
    e.preventDefault();
    if (uplinkState !== 'idle') return;
    
    setUplinkState('sending');
    
    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        method: formData.get('method'),
        reason: formData.get('reason'),
        message: formData.get('message'),
        timestamp: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, "support_requests"), data);
      setUplinkState('success');
      
      // Reset form and state after 5 seconds
      setTimeout(() => {
        setUplinkState('idle');
      }, 5000);
      
      e.target.reset();
    } catch (error) {
      console.error("Error submitting support request:", error);
      setUplinkState('idle');
    }
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="bg-black text-white selection:bg-neon-cyan/30 font-sans cursor-crosshair">
      
      {/* 1. HERO SECTION (CINEMATIC) */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none" style={{ filter: 'url(#noiseFilter)' }} />
        
        {/* Background Scanners */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10 animate-[scan-laser_4s_ease-in-out_infinite] shadow-[0_0_20px_rgba(0,255,255,0.8)] mix-blend-screen pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="perspective-1000 max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-16 h-[3px] bg-neon-pink shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
              <span className="text-neon-pink text-xs font-black tracking-[0.5em] uppercase drop-shadow-[0_0_5px_rgba(255,0,127,0.8)] flex items-center justify-center gap-2">
                <LifeBuoy size={14} className="animate-spin-slow" /> RED DE SOPORTE OPERATIVA
              </span>
            </div>
            
            <motion.h1 
              style={{ rotateX, rotateY, textShadow: textGlitchShadow, skewX: mouseSkewX, transformStyle: 'preserve-3d' }}
              className="text-[2.5rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8.5rem] font-black italic tracking-tighter mb-8 flex flex-col leading-[0.85] selection:bg-[#ff007f] selection:text-white text-white drop-shadow-2xl"
            >
              <span>{lang === 'ES' ? 'CENTRO DE' : 'COMMAND'}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-[#ff007f] p-2 -ml-2">{lang === 'ES' ? 'COMANDO' : 'CENTER'}</span>
            </motion.h1>

            <motion.div 
               style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
               className="max-w-2xl border-l-4 border-neon-cyan bg-black/40 backdrop-blur-md p-6 shadow-[0_0_30px_rgba(0,255,255,0.1)] relative group"
            >
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan/50" />
              <p className="text-white/80 text-sm md:text-base font-mono leading-relaxed font-light">
                 {t.heroDesc}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 flex flex-col items-center gap-4 py-8"
        >
          <div className="text-[10px] font-mono tracking-widest text-white/20 uppercase">{lang === 'ES' ? 'SCROLL PARA EXPLORAR' : 'SCROLL TO EXPLORE'}</div>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* REVIEW MONITOR TICKER */}
      <ReviewMonitor />

      {/* 2. PILLARS SECTION (TACTICAL BENTO) */}
      <section id="pillars" className="min-h-screen py-32 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-6 opacity-5 pointer-events-none select-none">
           <div className="text-[15rem] font-black italic tracking-tighter leading-none">PROTOCOLOS</div>
        </div>
        <SectionHeader title={t.pillarsTitle} subtitle={t.pillarsSubtitle} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <ProtocolCard key={pillar.id} pillar={pillar} i={i} />
          ))}
        </div>
      </section>

      {/* 3. FAQ SECTION (TACTICAL DATA ARCHIVE) */}
      <section id="faq" className="min-h-screen py-32 px-6 bg-transparent border-y border-white/5 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeader title={t.faqTitle} subtitle={t.faqSubtitle} className="text-center" />
          
          <div className="space-y-4">
            {faqsData.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "relative border border-white/5 bg-white/[0.01] backdrop-blur-md overflow-hidden group transition-all duration-500",
                  activeFaq === i ? "border-white/20 bg-white/[0.03]" : "hover:border-white/10 hover:bg-white/[0.02]"
                )}
              >
                {/* Active Sidebar Indicator */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 transition-all duration-500",
                  activeFaq === i ? "bg-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.8)]" : "bg-transparent group-hover:bg-white/20"
                )} />

                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-8 md:px-12 py-8 flex items-center justify-between"
                >
                  <div className="flex flex-col gap-2">
                     <span className="text-[9px] font-mono tracking-[0.3em] uppercase font-black text-white/30 flex items-center gap-2">
                        {activeFaq === i && <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,255,0.8)]" />}
                        SYS_QUERY_0{i + 1}
                     </span>
                     <span className={cn(
                        "text-xl md:text-2xl font-black italic tracking-tighter transition-all duration-300",
                        activeFaq === i ? "text-neon-cyan translate-x-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" : "text-white/80 group-hover:text-white group-hover:translate-x-1"
                      )}>
                        {faq.question}
                     </span>
                  </div>
                  
                  {/* Plus to Cross tactical button */}
                  <div className={cn(
                     "w-10 h-10 border flex items-center justify-center relative transition-all duration-500 flex-shrink-0",
                     activeFaq === i ? "border-neon-cyan bg-neon-cyan/10 rotate-90" : "border-white/10 group-hover:border-white/30"
                  )}>
                     <div className={cn("absolute w-4 h-px transition-colors duration-500", activeFaq === i ? "bg-neon-cyan rotate-45" : "bg-white/50 group-hover:bg-white")} />
                     <div className={cn("absolute h-4 w-px transition-colors duration-500", activeFaq === i ? "bg-neon-cyan rotate-45" : "bg-white/50 group-hover:bg-white")} />
                  </div>
                </button>

                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {/* Inner separator line */}
                      <div className="h-px w-[calc(100%-6rem)] mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      
                      <div className="px-8 md:px-12 py-10 flex gap-8">
                        {/* Vertical Accent Line */}
                        <div className="w-[2px] h-full bg-neon-cyan/20 shrink-0 self-stretch" />
                        
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-2 text-[10px] text-neon-cyan tracking-[0.3em] uppercase font-black">
                             <ArrowRight size={12} /> RESPUESTA_DESCIFRADA
                          </div>
                          <p className="text-white/70 text-lg md:text-xl font-display font-light leading-relaxed tracking-wide max-w-3xl">
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                      {/* Internal Glitch scanning box */}
                      <motion.div 
                        animate={{ left: ['-10%', '110%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute bottom-0 w-[20%] h-[1px] bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,1)] opacity-50"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION (CINEMATIC FULL SCREEN) */}
      <section id="contact" className="relative min-h-screen py-32 px-6 flex flex-col items-center justify-center bg-white/[0.01]">
         <div className="max-w-4xl mx-auto w-full">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
               <SectionHeader title={t.contactTitle} subtitle={t.contactSubtitle} className="!mb-6" />
               <p className="text-white/40 text-lg leading-relaxed mx-auto max-w-lg italic">
                  {t.contactDesc}
               </p>
            </motion.div>

            {/* CONTACT FORM - TACTICAL HUD */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-[1px] md:p-[2px] bg-gradient-to-b from-white/20 via-transparent to-white/5 rounded-none shadow-[0_0_50px_rgba(0,255,255,0.05)] overflow-hidden"
            >
               <div className="glass-dark p-8 md:p-16 bg-black/80 backdrop-blur-3xl relative overflow-hidden group">
                   
                   {/* Scanning Beam */}
                   <motion.div 
                     animate={{ top: ['-10%', '110%'] }}
                     transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                     className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent z-0 pointer-events-none"
                   />

                   <AnimatePresence mode="wait">
                     {uplinkState === 'success' ? (
                       <motion.div
                         key="success"
                         initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                         animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                         exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                         className="relative z-10 flex flex-col items-center justify-center text-center py-24"
                       >
                         <motion.div 
                           initial={{ scale: 0, rotate: -180 }}
                           animate={{ scale: 1, rotate: 0 }}
                           transition={{ type: "spring", stiffness: 200, damping: 20 }}
                           className="w-32 h-32 rounded-full border border-neon-cyan/50 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(0,255,255,0.1)]"
                         >
                           <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                             className="absolute inset-0 border border-dashed border-neon-cyan/30 rounded-full"
                           />
                           <CheckCircle2 size={48} className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
                         </motion.div>
                         
                         <h3 className="text-4xl md:text-5xl font-black italic tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-white uppercase">
                           {t.contactSuccessTitle}
                         </h3>
                         <p className="text-neon-cyan/80 text-xs font-mono tracking-[0.3em] uppercase max-w-sm mx-auto leading-relaxed border-t border-neon-cyan/20 pt-6 mt-4">
                           {t.contactSuccessSubtitle}
                         </p>
                       </motion.div>
                     ) : (
                       <motion.form 
                         key="form"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         onSubmit={handleUplinkSubmit} 
                         className="relative z-10 space-y-10"
                       >
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-3 relative group/input">
                                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 
                                 <label className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-neon-cyan rounded-sm animate-pulse" /> {t.formId}
                                 </label>
                                 <input name="name" required disabled={uplinkState === 'sending'} type="text" placeholder={t.formNamePlace} className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/10 font-mono text-sm tracking-widest text-white disabled:opacity-50" />
                              </div>

                              <div className="space-y-3 relative group/input">
                                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 
                                 <label className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-neon-pink rounded-sm animate-pulse" /> {t.formEmail}
                                 </label>
                                 <input name="email" required disabled={uplinkState === 'sending'} type="email" placeholder={t.formEmailPlace} className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/10 font-mono text-sm tracking-widest text-white disabled:opacity-50" />
                              </div>

                              <div className="space-y-3 relative group/input">
                                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 
                                 <label className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-neon-cyan rounded-sm animate-pulse" /> {t.formPhone}
                                 </label>
                                 <input name="phone" required disabled={uplinkState === 'sending'} type="tel" placeholder={t.formPhonePlace} className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/10 font-mono text-sm tracking-widest text-white disabled:opacity-50" />
                              </div>

                              <div className="space-y-3 relative group/input">
                                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-focus-within/input:border-neon-pink transition-colors z-20 pointer-events-none" />
                                 
                                 <label className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-neon-pink rounded-sm animate-pulse" /> {t.formMethod}
                                 </label>
                                 <select name="method" disabled={uplinkState === 'sending'} className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:bg-white/[0.04] outline-none transition-all appearance-none text-white/80 cursor-pointer disabled:opacity-50 font-mono text-sm tracking-widest uppercase">
                                    <option className="bg-black text-white" value="whatsapp">{t.formOptions.method.whatsapp}</option>
                                    <option className="bg-black text-white" value="email">{t.formOptions.method.email}</option>
                                    <option className="bg-black text-white" value="voice">{t.formOptions.method.voice}</option>
                                    <option className="bg-black text-white" value="telegram">{t.formOptions.method.telegram}</option>
                                 </select>
                              </div>

                              <div className="space-y-3 relative group/input">
                                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-focus-within/input:border-neon-cyan transition-colors z-20 pointer-events-none" />
                                 
                                 <label className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-neon-cyan rounded-sm animate-pulse" /> {t.formType}
                                 </label>
                                 <select name="reason" disabled={uplinkState === 'sending'} className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:bg-white/[0.04] outline-none transition-all appearance-none text-white/80 cursor-pointer disabled:opacity-50 font-mono text-sm tracking-widest uppercase">
                                    <option className="bg-black text-white" value="support">{t.formOptions.reason.support}</option>
                                    <option className="bg-black text-white" value="sales">{t.formOptions.reason.sales}</option>
                                    <option className="bg-black text-white" value="warranty">{t.formOptions.reason.warranty}</option>
                                    <option className="bg-black text-white" value="shipping">{t.formOptions.reason.shipping}</option>
                                    <option className="bg-black text-white" value="collab">{t.formOptions.reason.collab}</option>
                                    <option className="bg-black text-white" value="other">{t.formOptions.reason.other}</option>
                                 </select>
                              </div>


                           </div>

                          <div className="space-y-3 relative group/input">
                             <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-focus-within/input:border-white transition-colors z-20 pointer-events-none" />
                             <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-focus-within/input:border-white transition-colors z-20 pointer-events-none" />
                             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-focus-within/input:border-white transition-colors z-20 pointer-events-none" />
                             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-focus-within/input:border-white transition-colors z-20 pointer-events-none" />
                             
                             <label className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase flex items-center gap-2">
                               <div className="w-1.5 h-1.5 bg-white/50 rounded-sm animate-pulse" /> {t.formMessage}
                             </label>
                             <textarea name="message" required disabled={uplinkState === 'sending'} rows={4} placeholder={t.formMessagePlace} className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:bg-white/[0.04] outline-none transition-all resize-none placeholder:text-white/10 leading-relaxed disabled:opacity-50 font-mono text-sm tracking-widest text-white" />
                          </div>

                          <button 
                             type="submit" 
                             disabled={uplinkState === 'sending'}
                             className="w-full relative overflow-hidden py-8 bg-neon-cyan text-black font-black italic tracking-[0.5em] uppercase hover:bg-white transition-colors text-xs flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:hover:bg-neon-cyan disabled:shadow-none disabled:cursor-wait group mt-8"
                          >
                             {/* Scan line effect on button */}
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[1.5s] ease-in-out repeat-infinite" />
                             
                             {uplinkState === 'sending' ? (
                               <span className="relative z-10 flex items-center gap-4">
                                 <Loader2 size={18} className="animate-spin text-black" />
                                 {t.formSending}
                               </span>
                             ) : (
                               <span className="relative z-10 flex items-center justify-center gap-5">
                                 {t.formSubmit} <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform" />
                               </span>
                             )}
                          </button>
                       </motion.form>
                     )}
                   </AnimatePresence>
               </div>
            </motion.div>
         </div>
      </section>

      {/* 4.5 WHATSAPP DIRECT UPLINK QR (NEW) */}
      <section className="py-32 relative overflow-hidden bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Side: Technical Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="text-[10px] font-mono tracking-[0.5em] text-[#00ffff] uppercase font-black flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-[#00ffff]/50" /> 
                  {t.whatsappSubtitle}
                </div>
                <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none relative group/title">
                  <CharacterDecrypt 
                    text={t.whatsappTitle.split(' ')[0]} 
                    className="relative z-10"
                  />
                  <br className="md:hidden" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-white to-[#ff007f] drop-shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-700 group-hover/title:tracking-widest">
                    {t.whatsappTitle.split(' ')[1]}
                  </span>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 left-0 flex items-center gap-2">
                    <div className="w-12 h-[2px] bg-[#00ffff] shadow-[0_0_10px_#00ffff] animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
                    <span className="text-[8px] font-mono text-white/40 tracking-[0.4em]">LINK_ESTABLISHED_v4.2</span>
                  </div>
                </h2>
              </div>

              <p className="text-white/60 text-lg md:text-xl font-display font-light leading-relaxed max-w-xl italic">
                {t.whatsappDesc}
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">{t.tags.channelStatus}</div>
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-black tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    ONLINE_ENCRYPTED
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">{t.tags.responseTime}</div>
                  <div className="text-white font-mono text-xs font-black tracking-widest uppercase italic">
                    {t.tags.responseTimeVal}
                  </div>
                </div>
              </div>

              <motion.a 
                href="https://wa.me/526321059822"
                target="_blank"
                className="inline-flex items-center gap-6 px-10 py-6 bg-transparent border border-[#00ffff] text-[#00ffff] text-xs font-black italic tracking-[0.4em] uppercase hover:bg-[#00ffff]/10 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ffff]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {t.whatsappBtn} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Right Side: QR Code Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square max-w-[500px] mx-auto group"
            >
              {/* Background Effects */}
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-10 bg-[#00ffff]/10 blur-[100px] rounded-full group-hover:bg-[#00ffff]/20 transition-all duration-1000" 
              />
              <div className="absolute -inset-2 border-2 border-[#00ffff]/20 rounded-none group-hover:border-[#00ffff]/40 transition-colors duration-700 animate-pulse" />
              
              {/* QR Container - Tactical Interface Redesign */}
              <div className="relative z-10 w-full aspect-square p-12 border border-white/10 bg-white shadow-[0_0_80px_rgba(255,255,255,0.15)] overflow-hidden group/qr">
                {/* Tactical Corners - Reinforced */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#00ffff] z-30 transition-all duration-500 group-hover/qr:w-24 group-hover/qr:h-24" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-black/5 z-30" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-black/5 z-30" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#ff007f] z-30 transition-all duration-500 group-hover/qr:w-24 group-hover/qr:h-24" />
                
                {/* Interface Metadata */}
                <div className="absolute top-4 left-6 flex items-center gap-2 z-30 opacity-40">
                  <div className="w-1 h-1 rounded-full bg-black animate-ping" />
                  <span className="text-[6px] font-mono text-black font-bold tracking-[0.3em]">SCAN_LOCKED</span>
                </div>
                <div className="absolute bottom-4 right-6 text-[6px] font-mono text-black/30 font-bold tracking-[0.3em] z-30">
                  REF_SAT_52.4
                </div>

                {/* Internal Crosshair / Targeting */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-5 group-hover/qr:opacity-10 transition-opacity duration-700">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black" />
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-black rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-black/50 rounded-full border-dashed animate-spin-slow" />
                </div>
                
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/whatsapp_qr.webp" 
                    alt="WhatsApp Contact QR" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain p-2 mix-blend-multiply group-hover/qr:scale-[1.02] transition-transform duration-700"
                  />
                  {/* Scanning Overlay - Enhanced Laser Beam */}
                  <motion.div 
                    animate={{ 
                      top: ['-5%', '105%', '-5%'],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_15px_#00ffff] z-20 pointer-events-none"
                  />
                </div>
              </div>

              {/* Tag below QR - Enhanced */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 whitespace-nowrap">
                <div className="w-12 h-px bg-white/10" />
                <div className="text-[9px] font-mono text-white/40 tracking-[0.5em] uppercase">
                  ID_CANAL: <span className="text-white/60">WHATSAPP_SAT_LINK_52</span>
                </div>
                <div className="w-12 h-px bg-white/10" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. GEO-CENTER SECTION (ZENITH HUD MAP) */}
      <section className="relative h-[700px] w-full overflow-hidden border-t border-white/5 bg-black">
        {/* Map Iframe with Tactical Filter */}
        <iframe 
          src="https://maps.google.com/maps?q=Mexicas%207129,%20Nacional,%2031120%20Chihuahua,%20Chih&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full opacity-90"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
        
        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, rgba(0,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

        {/* NEXUS PRIME COMMAND CENTER (ULTRA-PREMIUM REDESIGN) */}
        <div className="absolute left-1/2 lg:left-32 top-1/2 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 z-20 w-[95%] max-w-[550px] perspective-1000">
          <motion.div
            style={{ 
              rotateX: useTransform(useMotionValue(0.5), [0, 1], [10, -10]),
              rotateY: useTransform(useMotionValue(0.5), [0, 1], [-10, 10])
            }}
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            className="relative group transition-all duration-700 ease-out"
          >
            {/* OUTER GLOW CHASSIS */}
            <div className="absolute -inset-10 bg-neon-cyan/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* INDUSTRIAL FRAME / BRACKETS */}
            <div className="absolute -top-1 -left-1 w-16 h-16 border-t-4 border-l-4 border-neon-cyan/60 z-30 pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-16 h-16 border-t-4 border-r-4 border-white/30 z-30 pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-16 h-16 border-b-4 border-l-4 border-white/30 z-30 pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-16 h-16 border-b-4 border-r-4 border-white/30 z-30 pointer-events-none" />

            <div className="relative bg-black/70 backdrop-blur-[50px] border border-white/10 rounded-none p-10 md:p-14 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
              
              {/* INTERNAL SCANNING BEAM */}
              <motion.div 
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent z-0 pointer-events-none mix-blend-screen"
              />

              {/* KINETIC ROTARY SCANNER (BACKGROUND LAYER) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="w-[600px] h-[600px] border-[1px] border-dashed border-neon-cyan rounded-full flex items-center justify-center"
                >
                  <div className="w-1/2 h-1/2 border-r border-neon-cyan/50" />
                </motion.div>
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 border-[1px] border-dotted border-white/30 rounded-full"
                />
                {/* Center Core dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_20px_rgba(0,255,255,1)]" />
              </div>

              {/* DATA FLOW LOGS (VERY SUBTLE) */}
              <div className="absolute inset-0 opacity-[0.03] font-mono text-[8px] pointer-events-none select-none overflow-hidden p-4 leading-none">
                {Array(20).fill(0).map((_, i) => (
                  <div key={i} className="whitespace-nowrap mb-1">
                    {`SYS_LOG_0${i} >> NEXUS_SYNC_INITIATED >> COORDS_LOCKED_31120 >> STATUS_OK >> ENCRYPT_AES_256 >> TRANSMISSION_SECURE`}
                  </div>
                ))}
              </div>

              {/* NEXUS CONTENT */}
              <div className="relative z-10">
                 {/* HEADER HUD PRIME */}
                 <div className="flex justify-between items-start mb-12">
                    <div className="flex items-start gap-4">
                       <div className="w-2.5 h-2.5 mt-1 bg-red-500 rounded-sm animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                       <div>
                          <div className="text-[10px] font-mono tracking-[0.4em] text-neon-cyan font-black mb-1.5 uppercase drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] flex items-center gap-2">
                            <span>{t.gpsStatus}</span>
                            <span className="w-10 h-[1px] bg-neon-cyan/50 block hidden md:block"></span>
                          </div>
                          <h4 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 drop-shadow-lg">
                            NEXUS_PRIME_01
                          </h4>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 border-l border-white/10 pl-4">
                       <div className="text-[10px] font-mono text-white/50 tracking-[0.3em] font-bold">28° 40' 30.0" N</div>
                       <div className="text-[10px] font-mono text-white/50 tracking-[0.3em] font-bold">106° 07' 33.6" W</div>
                       <div className="text-[8px] font-mono text-neon-cyan/60 tracking-[0.3em] mt-1">LOC_SECURE</div>
                    </div>
                 </div>

                 {/* SYNC STATUS BARS */}
                 <div className="flex gap-1 mb-14 h-6 items-end p-3 bg-neon-cyan/[0.03] border border-neon-cyan/10 backdrop-blur-sm rounded-none w-fit">
                    {[0.6, 0.4, 0.9, 0.5, 0.7, 0.3, 0.8, 0.5, 0.9, 1.0, 0.4].map((h, i) => (
                       <motion.div 
                          key={i}
                          animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                          transition={{ duration: 0.8 + i*0.1, repeat: Infinity }}
                          className="w-1.5 bg-neon-cyan rounded-sm shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                       />
                    ))}
                    <span className="text-[9px] font-mono text-neon-cyan ml-4 tracking-[0.4em] uppercase font-black">{t.syncingFlux}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 group/item p-4 bg-white/[0.02] border border-white/5 relative">
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan/50" />
                       <div className="text-[10px] font-mono text-neon-cyan tracking-[0.3em] uppercase font-black flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_5px_rgba(0,255,255,0.8)]" /> {t.locData}
                       </div>
                       <p className="text-xl font-bold text-white leading-relaxed font-display italic tracking-tighter">
                          MEXICAS 7129<br/>
                          <span className="text-white/40 text-[10px] font-mono tracking-[0.4em] uppercase not-italic">31120 CHIHUAHUA, CHIH.</span>
                       </p>
                    </div>

                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 relative">
                       <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                       <div className="text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase font-black flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" /> {t.accessibility}
                       </div>
                       <div className="text-[12px] font-display text-white/60 space-y-2 uppercase font-bold tracking-widest">
                          <div className="flex justify-between border-b border-white/10 pb-1"><span>{t.schedule.weekdays}</span> <span className="text-white font-black italic">{t.schedule.weekdaysTime}</span></div>
                          <div className="flex justify-between border-b border-white/10 pb-1"><span>{t.schedule.saturday}</span> <span className="text-white font-black italic">{t.schedule.saturdayTime}</span></div>
                       </div>
                    </div>
                 </div>


                 {/* ACTION UNIT (HYPER-LINK) */}
                 <motion.a 
                    href="https://maps.app.goo.gl/jmz583nohEsWVy9s7"
                    target="_blank"
                    className="relative w-full py-6 mt-12 bg-transparent border border-neon-cyan text-neon-cyan text-[11px] font-black italic tracking-[0.5em] uppercase flex items-center justify-center gap-6 group transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,255,255,0.05)] hover:shadow-[inset_0_0_40px_rgba(0,255,255,0.2),0_0_30px_rgba(0,255,255,0.3)] hover:bg-neon-cyan/10 overflow-hidden"
                 >
                    {/* Ghost Glitch Scan */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-5 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                       {t.gpsBtn} <Map size={18} className="group-hover:scale-110 group-hover:animate-pulse transition-transform" />
                    </span>
                 </motion.a>
              </div>

              {/* TECHNICAL METADATA FOOTER */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                 <div className="flex gap-4 text-[7px] font-mono text-white/10 uppercase tracking-[0.3em]">
                    <span>HW_VER: 4.8.0</span>
                    <span>TEMP: 22.4°C</span>
                    <span>UPTIME: 99.9%</span>
                 </div>
                 <div className="text-[7px] font-mono text-white/10 uppercase tracking-[0.2em] font-black">
                    MANUFACTURE_HUB_LOCK
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Galería 611 — Presencia Física */}
      <PhysicalGallery />

    </div>
  );
}
