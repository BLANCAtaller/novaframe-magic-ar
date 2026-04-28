'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { EyeOff, Wrench, Box, ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

const TargetingGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
      }}
    />
  </div>
);

const ScanningCard = ({ spec, index, isHovered, onHover }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={onHover}
      onClick={onHover}
      className={cn(
        "group relative flex items-center p-6 transition-all duration-300 cursor-pointer border mb-2",
        isHovered 
          ? "bg-cyan-500/10 border-cyan-500/50" 
          : "bg-[#050505] border-white/5"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
        isHovered ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/40"
      )}>
        {React.cloneElement(spec.icon, { className: "w-5 h-5" })}
      </div>

      <div className="ml-6 flex-grow">
        <h3 className="text-lg font-bold text-white">{spec.title}</h3>
        <p className="text-sm text-white/50">{spec.description}</p>
      </div>
    </motion.div>
  );
};

const TechSpecs = () => {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const viewerRef = useRef(null);
  
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const smoothX = useSpring(xRaw, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(yRaw, { stiffness: 60, damping: 20 });
  
  const rotateX = useTransform(smoothY, [-300, 300], [5, -5]);
  const rotateY = useTransform(smoothX, [-300, 300], [-5, 5]);

  const specs = [
    {
      id: 'SPEC-R1',
      title: 'Lienzo Antirreflejante',
      description: 'Absorción lumínica del 99.9% para visualización nítida.',
      icon: <EyeOff />,
      image: '/images/products/courage-berserk/color/courage-berserk-v1.webp'
    },
    {
      id: 'SPEC-H2',
      title: 'Soporte de Instalación',
      description: 'Kit de montaje directo diseñado para un despliegue ágil.',
      icon: <Wrench />,
      image: '/images/products/mario-steampunk/paint-by-numbers/mario-pbn-v1.webp'
    },
    {
      id: 'SPEC-M3',
      title: 'Estructura de Pino',
      description: 'Bastidor de pino macizo con 4.5cm de perfil.',
      icon: <Box />,
      image: '/images/products/alice-awakening/color/alice_awakening_protocol.webp'
    },
    {
      id: 'SPEC-S4',
      title: 'Tensión Permanente',
      description: 'Fijación industrial reforzada para una planeidad total.',
      icon: <ShieldCheck />,
      image: '/images/products/matias-bubble-bath/color/matias-bubble-bath-v1.webp'
    }
  ];

  const activeSpec = specs[hoveredIdx];

  const handleMouseMove = (e) => {
    if (!viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    xRaw.set(e.clientX - (rect.left + rect.width / 2));
    yRaw.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <section className="py-24 bg-black relative">
      <TargetingGrid />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter">
              Especificaciones <br/>
              <span className="text-cyan-500">Técnicas</span>
            </h2>
            <div className="space-y-4">
              {specs.map((spec, idx) => (
                <ScanningCard 
                  key={spec.id} 
                  spec={spec} 
                  index={idx} 
                  isHovered={hoveredIdx === idx}
                  onHover={() => setHoveredIdx(idx)}
                />
              ))}
            </div>
          </div>

          <div 
            ref={viewerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { xRaw.set(0); yRaw.set(0); }}
            className="relative"
            style={{ perspective: '1000px' }}
          >
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative aspect-[4/5] w-full max-w-[500px] mx-auto border border-white/20 bg-[#0a0a0a] overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeSpec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeSpec.image}
                    alt={activeSpec.title}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </motion.div>
              </AnimatePresence>
              
              {/* Overlays */}
              <div className="absolute top-4 right-4 flex flex-col items-end">
                <span className="text-[10px] font-mono text-cyan-500 font-bold tracking-widest uppercase">Nodo_Activo</span>
                <span className="text-xs font-mono text-white/50">{activeSpec.id}</span>
              </div>
              
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20 pointer-events-none"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechSpecs;
