'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SAMPLE_PRODUCTS } from '@/types';
import { cn } from '@/lib/utils';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const Row = ({ products, speed = 40, reverse = false, yOffset = 0, onOpenProduct, cardSize = 250, isMobile }) => {
  const [isPaused, setIsPaused] = useState(false);
  const items = [...products, ...products];
  
  return (
    <div 
      className="flex gap-6 mb-6 overflow-visible"
      onMouseEnter={() => !isMobile && setIsPaused(true)}
      onMouseLeave={() => !isMobile && setIsPaused(false)}
      style={{ transform: `translateY(${yOffset}px)` }}
    >
      <div 
        className={`flex gap-6 will-change-transform ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ 
          animationDuration: `${speed}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
          transformStyle: isMobile ? 'flat' : 'preserve-3d'
        }}
      >
        {items.map((item, i) => {
          const cyberColors = ['from-cyan-500/50', 'from-fuchsia-500/50', 'from-amber-400/50', 'from-emerald-400/50'];
          const activeColor = cyberColors[i % cyberColors.length];
          const textActiveColor = activeColor.replace('from-', 'text-').replace('/50', '');
          const borderColor = activeColor.replace('from-', 'border-').replace('/50', '');

          return (
            <motion.div 
              key={`${item.id}-${i}`} 
              onClick={() => onOpenProduct && onOpenProduct(item.product)}
              whileHover={!isMobile ? { 
                scale: 1.15, 
                z: 150,
                rotateX: -15,
                rotateY: 15,
                transition: { duration: 0.4, ease: "easeOut" }
              } : {}}
              className={`rounded-[2.5rem] p-1 overflow-hidden shrink-0 relative group cursor-crosshair shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]`}
              style={{
                width: cardSize, 
                height: cardSize,
                background: 'rgba(7, 7, 7, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
              }}
            >
              {/* Colored Glow Background - Only on Desktop for performance */}
              {!isMobile && (
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)]",
                  activeColor
                )} />
              )}

              <div className="absolute inset-0 bg-[#070707] rounded-[2.5rem] m-[2px]" />
              
              <div className="absolute inset-0 overflow-hidden rounded-[1.8rem] border border-white/10 group-hover:border-white/20 transition-colors">
                <div className="relative w-full h-full">
                  <Image
                    src={item.displayImage}
                    alt={item.product?.name || 'NovaFrame Art'}
                    fill
                    loading="lazy"
                    sizes={isMobile ? "180px" : "250px"}
                    className="object-cover transition-all duration-1000 group-hover:scale-125 group-hover:saturate-[1.3] group-hover:contrast-[1.1]"
                  />
                </div>
                
                {/* Scanning Bar Animation - Desktop Only */}
                {!isMobile && (
                  <motion.div 
                    initial={{ top: '-100%' }}
                    animate={{ top: '200%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[30%] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none z-10"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity z-10" />
              </div>
              
              {/* Dynamic Corner Accents */}
              <div className={cn("absolute top-6 left-6 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20", textActiveColor)} />
              <div className={cn("absolute bottom-6 right-6 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20", textActiveColor)} />
              
              <div className="absolute inset-0 rounded-[2.5rem] border-t border-l border-white/15 pointer-events-none z-20" />
              
              {!isMobile && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-50">
                   <div className={cn(
                     "px-6 py-2 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-full scale-90 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                     "group-hover:border-cyan-500/50"
                   )}>
                      <span className="text-[9px] font-black text-white tracking-[0.5em] uppercase">NODO_ACCESO // {item.product?.nodeId || 'ID_X'}</span>
                   </div>
                </div>
              )}

              {/* Pulse Border - Desktop Only */}
              {!isMobile && (
                <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
                  <div className={cn("absolute inset-0 border-[3px] rounded-[2.5rem] animate-pulse opacity-20", borderColor)} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default function PerspectiveStream({ onOpenProduct }) {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const [displayItems, setDisplayItems] = useState([]);
  
  // Móvil: reducir cantidad de imágenes para evitar crashes de memoria
  const maxItems = isMobile ? 12 : 60;
  const rowCount = isMobile ? 3 : 5;
  const cardSize = isMobile ? 180 : 250;
  
  useEffect(() => {
    let items = [];
    SAMPLE_PRODUCTS.forEach(product => {
      const addedUrls = new Set();
      const variantKeys = Object.keys(product).filter(key => 
        (key === 'imageUrl' || key.startsWith('imageUrlColor') || key.startsWith('imageUrlPBN')) && 
        product[key] && typeof product[key] === 'string'
      );
      
      variantKeys.forEach(key => {
        const url = product[key];
        if (url && !addedUrls.has(url)) {
           items.push({ id: `${product.id}-${key}`, product, displayImage: url });
           addedUrls.add(url);
        }
      });
    });

    let shuffled = [...items].sort(() => Math.random() - 0.5);
    while (shuffled.length < maxItems) {
      shuffled = [...shuffled, ...[...items].sort(() => Math.random() - 0.5)];
    }
    // Limitar a maxItems
    setDisplayItems(shuffled.slice(0, maxItems));
  }, [maxItems]);

  const itemsPerRow = Math.ceil(displayItems.length / rowCount);
  const rows = Array.from({ length: rowCount }, (_, i) =>
    displayItems.slice(itemsPerRow * i, itemsPerRow * (i + 1))
  );

  return (
    <section 
      ref={containerRef}
      className={`relative w-full ${isMobile ? 'h-[70vh] py-10' : 'h-[120vh] py-20'} bg-black overflow-hidden flex items-center justify-center`}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.04)_0%,rgba(0,0,0,1)_70%)]" />
      </div>

      <div 
        className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto"
        style={{
          perspective: isMobile ? "1000px" : "2000px",
          transformStyle: isMobile ? "flat" : "preserve-3d",
        }}
      >
        <motion.div 
          initial={{ rotateX: isMobile ? 35 : 52, rotateZ: isMobile ? -15 : -25, scale: isMobile ? 0.8 : 0.7 }}
          animate={{ scale: isMobile ? 1 : 0.9 }}
          className="flex flex-col gap-8 w-full md:max-w-[60vw] pointer-events-none"
          style={{ transition: { duration: 1, ease: "easeOut" } }}
        >
          <div className="pointer-events-auto">
            {rows.map((products, idx) => (
              <Row 
               key={idx}
               products={products} 
               speed={isMobile ? (30 + idx * 10) : (40 + idx * 12)} 
               reverse={idx % 2 !== 0} 
               onOpenProduct={onOpenProduct}
               cardSize={cardSize}
               isMobile={isMobile}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_300px_rgba(0,0,0,1)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-100 pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      
      {/* Background Animated 'Void' Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
             backgroundSize: '40px 40px'
           }} />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse linear infinite;
        }
      `}</style>
      
      {!isMobile && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opacity-40">
           <div className="flex flex-col items-center gap-2">
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/20" />
              <span className="text-[8px] text-white/40 font-mono tracking-[0.5em] uppercase">FLUJO_SISTEMA_COMPRIMIDO</span>
           </div>
        </div>
      )}
    </section>
  );
}
