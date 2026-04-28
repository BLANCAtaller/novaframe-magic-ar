'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Eye, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_PRODUCTS } from '@/types';
import { cn } from '@/lib/utils';

const MagneticCard = ({ product, idx, onOpenProduct }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: idx * 0.15 }}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: isMobile ? "flat" : "preserve-3d"
      }}
      className="relative aspect-[3/4] group cursor-pointer"
      onClick={() => onOpenProduct && onOpenProduct(product)}
    >
      {/* Card Container with Depth */}
      <div 
        className="absolute inset-0 bg-white/[0.02] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:border-white/20 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
        style={{ transform: isMobile ? "none" : "translateZ(30px)" }}
      >
        {/* Background Shadow Glow */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px]",
          product.rarity === 'Zenith' ? "bg-neon-cyan/20" : "bg-neon-yellow/10"
        )} />

        {/* Main Content */}
        <div className="relative h-full flex flex-col p-8 z-10">
          {/* Badge */}
          <div className="flex justify-between items-start mb-6" style={{ transform: isMobile ? "none" : "translateZ(20px)" }}>
            <div className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border",
              product.rarity === 'Zenith' ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10" : "border-neon-yellow text-neon-yellow bg-neon-yellow/10"
            )}>
              {product.rarity}
            </div>
            <div className="text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors uppercase">
              ID: {product.nodeId}
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full relative overflow-hidden rounded-2xl mb-8" style={{ transform: isMobile ? "none" : "translateZ(40px)" }}>
            <Image 
              src={product.imageUrl} 
              alt={product.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100">
              <div className="p-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                <Eye size={32} className="text-white" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4" style={{ transform: isMobile ? "none" : "translateZ(30px)" }}>
            <h3 className="text-3xl font-black text-white group-hover:text-neon-cyan transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-white/30" />
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">{product.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scanline Effect */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px] animate-scanline" />
        )}
      </div>

      <div className="absolute -inset-2 rounded-[3.5rem] border border-white/[0.03] pointer-events-none transition-all duration-700 group-hover:border-white/[0.08]" />
    </motion.div>
  );
};

export default function CollectionShowcase({ onOpenProduct }) {
  const featured = SAMPLE_PRODUCTS
    .filter(p => (p.rarity === 'Zenith' || p.rarity === 'Legendary') && p.id !== 'p48')
    .slice(0, 3);

  return (
    <section className="py-32 bg-black relative overflow-hidden" style={{ perspective: "1500px" }}>
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-gradient-radial from-neon-pink/10 via-transparent to-transparent opacity-30 blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-24 gap-12 md:gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-neon-yellow" size={16} />
              <span className="text-neon-yellow text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase">Selección_Curada // Alta_Fid</span>
            </div>
            {/* Glitch Reveal Animation */}
            <motion.h2 
               initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
               whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase"
            >
              PIEZAS MAESTRAS <br /> 
              <motion.span 
                 initial={{ x: 10, color: '#f0f' }}
                 whileInView={{ x: 0, color: 'rgba(255, 0, 255, 0)' }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.2, delay: 0.4 }}
                 className="glitch-text-wrapper text-gradient inline-block" data-text="MUTADAS"
              >
                MUTADAS
              </motion.span>
            </motion.h2>
          </div>
          <Link 
            href="/marketplace"
            className="flex items-center gap-4 group text-white/40 hover:text-white transition-colors pb-4 border-b border-white/10 mx-auto md:mx-0 w-fit"
          >
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">Ver Catálogo Completo</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {featured.map((product, idx) => (
            <MagneticCard key={product.id} product={product} idx={idx} onOpenProduct={onOpenProduct} />
          ))}
        </div>
      </div>
    </section>
  );
}
