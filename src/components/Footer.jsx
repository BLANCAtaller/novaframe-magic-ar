'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MessageCircle, Terminal, Shield, Zap, Globe } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';

const ParticleNexus = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Móvil: menos anillos y puntos para ahorrar rendimiento
  const rings = isMobile ? 3 : 6;
  const dotsPerRing = isMobile ? 16 : 32;
  const totalPoints = rings * dotsPerRing;

  return (
    <div className="relative w-full h-56 flex items-center justify-center perspective-1000 overflow-hidden group">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)]" />

      {/* 3D Particle Structure */}
      <motion.div
        animate={{ 
          rotateY: 360,
          rotateX: [10, 25, 10]
        }}
        transition={{ 
          rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-32 h-32"
      >
        {isMounted && Array.from({ length: totalPoints }).map((_, i) => {
          const ringIndex = Math.floor(i / dotsPerRing);
          const dotInRing = i % dotsPerRing;
          const angle = (dotInRing / dotsPerRing) * Math.PI * 2;
          
          // Advanced Geometry: Hourglass / Bulb variation
          const radiusVariation = Math.sin((ringIndex / (rings - 1)) * Math.PI) * 12;
          const radius = 50 + radiusVariation;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (ringIndex - (rings / 2)) * 16; 
          
          return (
            <motion.div
              key={`h-${i}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                x,
                y,
                z,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                scale: [0.6, 1.2, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (ringIndex * 0.15) + (dotInRing * 0.04),
                ease: "easeInOut"
              }}
            >
              <div 
                className={`w-px h-px rounded-full ${
                  ringIndex === 2 || ringIndex === 3 
                    ? 'bg-neon-cyan shadow-[0_0_15px_rgba(0,255,255,1)] w-1 h-1' 
                    : 'bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                }`} 
              />
            </motion.div>
          );
        })}

        {/* Extra Orbital Rings (Cross-Axis) */}
        {isMounted && [0, 90].map((rotation, ringIdx) => (
          <motion.div
            key={`orbit-${ringIdx}`}
            animate={{ rotateX: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ 
              transformStyle: 'preserve-3d',
              rotateY: rotation,
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i / 24) * Math.PI * 2;
              return (
                <div 
                  key={i}
                  className="absolute left-1/2 top-1/2 w-1 h-1 bg-neon-cyan/40 rounded-full shadow-[0_0_8px_rgba(0,255,255,0.4)]"
                  style={{
                    transform: `rotateZ(${angle}rad) translateX(75px)`
                  }}
                />
              );
            })}
          </motion.div>
        ))}

        {/* Core Pulsating Signal */}
        <div className="absolute inset-0 flex items-center justify-center">
           <motion.div 
             animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-24 h-24 rounded-full bg-neon-cyan/20 blur-3xl"
           />
        </div>
      </motion.div>

      {/* HUD Data Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        <div className="text-[7px] font-mono text-neon-cyan/60 uppercase tracking-[0.3em] flex items-center gap-2">
          <div className="w-1 h-1 bg-neon-cyan rounded-full animate-ping" /> SINC_NEXO_ULTRA
        </div>
        <div className="text-[6px] font-mono text-white/20 uppercase tracking-widest">Nodos_Activos: 192</div>
      </div>

      <div className="absolute bottom-4 right-4 text-right">
        <div className="text-[7px] font-mono text-white/30 uppercase tracking-[0.2em]">Flujo_Hiper_Densidad</div>
        <div className="text-[6px] font-mono text-neon-cyan/40 uppercase tracking-widest">Tipo-V: Hiper_Kinético</div>
      </div>
    </div>
  );
};


export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { lang } = useLang();
  const t = translations[lang].footer;

  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61573485158694", label: "Facebook", color: "#1877F2" },
    { Icon: Instagram, href: "https://instagram.com/novaframe", label: "Instagram", color: "#E4405F" },
    { Icon: Mail, href: "mailto:jesusrodriguez7129@gmail.com", label: "Email", color: "#EA4335" },
    { Icon: MessageCircle, href: "https://wa.me/526321059822", label: "WhatsApp", color: "#25D366" }
  ];

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-4">
            <div className="lg:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Terminal size={20} className="text-black" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">NOVAFRAME</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed mb-8 font-light max-w-sm">
                {t.tagline}
              </p>
              <div className="flex gap-4">
                {socialLinks.map(({ Icon, href, label, color }, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.1,
                      borderColor: color,
                      color: color,
                      backgroundColor: `${color}10` // 10 is hex for ~6% opacity
                    }}
                    whileTap={{ scale: 0.95 }}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{ '--hover-color': color }}
                    className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center text-white/40 transition-all duration-300"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">{t.systemsTitle}</h4>
               <ul className="space-y-4">
                 {t.systemLinks.map(item => (
                   <li key={item.name}>
                     <a href={item.href} className="text-sm text-white/40 hover:text-neon-cyan transition-colors flex items-center gap-2 group">
                       <span className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-neon-cyan transition-colors" />
                       {item.name}
                     </a>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">{t.protocolsTitle}</h4>
               <ul className="space-y-4">
                 {t.protocolLinks.map(item => (
                   <li key={item.name}>
                     <a href={item.href} className="text-sm text-white/40 hover:text-neon-pink transition-colors flex items-center gap-2 group">
                       <span className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-neon-pink transition-colors" />
                       {item.name}
                     </a>
                   </li>
                 ))}
               </ul>
            </div>

          <div className="glass-dark border border-white/10 rounded-3xl p-4 relative overflow-hidden flex flex-col items-center justify-center">
             <div className="absolute top-0 right-0 p-4">
               <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
             </div>
             
              <ParticleNexus />

             <div className="mt-4 w-full px-4">
                <div className="h-px bg-white/5 w-full mb-4" />
                <div className="flex justify-between items-center text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">
                   <span>{lang === 'ES' ? 'Estado: Síntesis_Lista' : 'Status: Synthesis_Ready'}</span>
                   <span>Ver: 3.0.4</span>
                </div>
             </div>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-mono text-white/20 tracking-widest uppercase text-center md:text-left">
            © {currentYear} {t.copyright}
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
             <span className="flex items-center gap-2"><Globe size={12} /> {t.location}</span>
             <span className="flex items-center gap-2"><Shield size={12} /> {t.ssl}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
