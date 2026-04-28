'use client';
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import Image from 'next/image';

const PhysicalGallery = () => {
  const containerRef = useRef(null);
  
  // PARALLAX PHYSICS (Matching FeaturesShowcase)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-32 bg-black relative border-t border-white/5 overflow-hidden"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* 3D Image Container */}
          <motion.div 
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="w-full lg:w-1/2 relative group"
          >
            {/* Outer Glow */}
            <div className="absolute -inset-4 bg-neon-cyan/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative aspect-square lg:aspect-[4/3] rounded-none overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
              {/* Scanning Beam */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-[100px] bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent z-20 pointer-events-none"
              />

              <Image 
                src="/images/gallery/galeria_611.jpg"
                alt="Galería 611 - Chihuahua"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              
              {/* UI Overlays */}
              <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/70 tracking-[0.2em]">LIVE_FEED</span>
                </div>
                <div className="text-[8px] font-mono text-white/30 tracking-widest px-1">
                  COORD: 28.6330° N, 106.0734° W
                </div>
              </div>

              {/* Industrial Brackets */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-neon-cyan/50 z-30" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-neon-pink/50 z-30" />
            </div>

            {/* Floating Hardware Label */}
            <motion.div 
              style={{ translateZ: 50 }}
              className="absolute -bottom-6 -right-6 bg-black border border-white/10 p-4 hidden md:block z-40"
            >
              <div className="text-[8px] font-mono text-white/40 mb-1">UNIT_ID</div>
              <div className="text-xs font-black text-white tracking-widest">NEXUS_CHH_01</div>
            </motion.div>
          </motion.div>

          {/* Info Container (Styled like FeaturesShowcase) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex flex-col justify-center space-y-10"
          >
            <div className="space-y-4">
              <div className="text-[10px] font-mono tracking-[0.5em] text-neon-pink uppercase font-black flex items-center gap-3">
                <div className="w-8 h-[1px] bg-neon-pink/50" /> 
                PRESENCIA_FÍSICA
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                GALERÍA <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">611</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center group-hover:border-neon-cyan transition-colors">
                  <MapPin size={20} className="text-neon-cyan" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase">UBICACIÓN_CENTRAL</div>
                  <div className="text-lg text-white font-bold italic tracking-tight uppercase">CHIHUAHUA, MÉXICO</div>
                  <div className="text-sm text-white/40 font-mono">Infonavit Nacional, 31120</div>
                </div>
              </div>

              <p className="text-white/60 text-lg md:text-xl font-display font-light leading-relaxed max-w-xl italic">
                Experimenta la calidad de los lienzos antirreflejantes y observa nuestros sistemas de marcos físicos en un entorno de exhibición profesional.
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Lienzos Pro', 'Marcos Sólidos', 'Asesoría VIP', 'Showroom'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] text-white/50 font-mono tracking-widest uppercase border-b border-white/5 pb-2">
                  <CheckCircle2 size={12} className="text-neon-cyan" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/526321059822" 
                target="_blank" 
                className="group relative inline-flex items-center gap-6 px-10 py-6 bg-transparent border border-white/20 text-white text-xs font-black italic tracking-[0.4em] uppercase hover:border-neon-pink hover:text-neon-pink transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-pink/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                CONTACTAR ASESOR <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              </motion.a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PhysicalGallery;
