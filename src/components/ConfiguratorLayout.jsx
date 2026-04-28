'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, Check, Zap, Sparkles, Eye, ShieldCheck, Box, Tag, Layers, Share2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { cn, formatNumber } from '@/lib/utils';
import { SIZE_PRICES } from '@/types';
import { useDeployment } from '@/contexts/DeploymentContext';
import { calculateArtifactPrice } from '@/lib/priceUtils';
import WallProjector from './WallProjector';
import DiagnosticOverlay from './DiagnosticOverlay';

const ZENITH_SIZES = {
  '36x46cm': { name: 'Porta-46', code: 'P-46', color: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'bg-emerald-400' },
  '40x50cm': { name: 'Nano-50', code: 'N-50', color: 'text-purple-400', border: 'border-purple-500/30', glow: 'bg-purple-400' },
  '38x78cm': { name: 'Porta-78', code: 'P-78', color: 'text-neon-cyan', border: 'border-cyan-500/30', glow: 'bg-cyan-400' },
  '70x100cm': { name: 'Beta-100', code: 'B-100', color: 'text-neon-pink', border: 'border-pink-500/30', glow: 'bg-pink-400' },
  '100x150cm': { name: 'Omega-150', code: 'O-150', color: 'text-neon-yellow', border: 'border-yellow-500/30', glow: 'bg-yellow-400' },
  '150x200cm': { name: 'Titan-200', code: 'T-200', color: 'text-red-500', border: 'border-red-500/30', glow: 'bg-red-500' }
};

const MATERIALS = [
  { id: 'Canvas Premium', name: 'CANVAS', desc: 'Textura Artística // 4.5cm' },
  { id: 'Lona HD', name: 'LONA', desc: 'Alta Definición // Vinilo' },
  { id: 'Digital', name: 'POSTER', desc: 'Archivo High-Res // Digital' }
];

const FRAMES = [
  { id: 'ninguno', name: 'Sin Marco', hex: 'transparent', class: "bg-transparent border-dashed border-white/40 flex items-center justify-center after:content-['✕'] after:text-[10px] after:text-white/40" },
  { id: 'madera', name: 'Madera', hex: '#8b5a2b', class: "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-[#8b5a2b] border-[#5c3a18]" },
  { id: 'blanco', name: 'Blanco', hex: '#ffffff', class: "bg-white border-gray-200" },
  { id: 'negro', name: 'Negro', hex: '#000000', class: "bg-black border-gray-800" },
  { id: 'plata', name: 'Plata', hex: '#9ca3af', class: "bg-gradient-to-br from-gray-300 to-gray-500 border-gray-400" },
  { id: 'oro', name: 'Oro', hex: '#d4af37', class: "bg-gradient-to-br from-yellow-300 to-yellow-600 border-yellow-500" },
];

const LED_OPTIONS = [
  { id: 'none', name: 'SIN LED', desc: 'Neutral', color: 'text-white/50', border: 'border-white/10', glow: 'bg-white/50' },
  { id: 'comun', name: 'COMÚN', desc: 'RGB', color: 'text-purple-400', border: 'border-purple-500/30', glow: 'bg-purple-500' },
  { id: 'audio', name: 'RÍTMICO', desc: 'Sensor', color: 'text-amber-400', border: 'border-amber-500/30', glow: 'bg-amber-500' },
  { id: 'bluetooth', name: 'SMART', desc: 'App', color: 'text-blue-400', border: 'border-blue-500/30', glow: 'bg-blue-500' }
];

export default function ConfiguratorLayout({ product }) {
  const router = useRouter();
  const { deployArtifact } = useDeployment();
  const [selectedSize, setSelectedSize] = useState('38x78cm');
  const [selectedFinish, setSelectedFinish] = useState('Lona HD');
  const [viewMode, setViewMode] = useState('technical'); 
  const [selectedEnv, setSelectedEnv] = useState('suite');
  const [selectedSubVariant, setSelectedSubVariant] = useState(1);
  const [zipCode, setZipCode] = useState('');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeVariant, setActiveVariant] = useState('color');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('ninguno');
  const [selectedLed, setSelectedLed] = useState('none');
  const [quantity, setQuantity] = useState(1);

  // Sub-variants logic (for series like Courage with multiple versions)
  const subVariants = useMemo(() => {
    const prefix = activeVariant === 'pbn' ? 'imageUrlPBN' : 'imageUrlColor';
    const available = [];
    for (let i = 1; i <= 10; i++) {
        const key = i === 1 ? prefix : `${prefix}${i}`;
        if (product[key]) {
            available.push({
                index: i,
                url: product[key]
            });
        }
    }
    return available;
  }, [product, activeVariant]);

  const activeImageUrl = useMemo(() => {
    const prefix = activeVariant === 'pbn' ? 'imageUrlPBN' : 'imageUrlColor';
    const key = selectedSubVariant === 1 ? prefix : `${prefix}${selectedSubVariant}`;
    return product[key] || product.imageUrl;
  }, [product, activeVariant, selectedSubVariant]);

  // Environments for thumbnails
  const environmentThumbs = useMemo(() => [
    { id: 'technical', label: 'Estudio', img: activeImageUrl },
    { id: 'suite', label: 'SUITE_ZENITH', img: '/images/environments/recamara_oscura.webp' }, // Using recamara as placeholder for suite
    { id: 'office', label: 'Oficina', img: '/images/environments/oficina_industrial.webp' },
    { id: 'living', label: 'Sala', img: '/images/environments/sala_minimalista.webp' },
  ], [activeImageUrl]);

  // 3D Tilt Logic for Title
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const titleContainerRef = useRef(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xPct = (e.clientX / innerWidth) - 0.5;
      const yPct = (e.clientY / innerHeight) - 0.5;
      x.set(xPct);
      y.set(yPct);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [x, y]);

  // Pricing logic
  const totalPrice = useMemo(() => {
    return calculateArtifactPrice(product, {
      size: selectedSize,
      finish: selectedFinish,
      count: quantity,
      variant: activeVariant,
      frame: selectedFrame,
      led: selectedLed
    });
  }, [product, selectedSize, selectedFinish, activeVariant, selectedFrame, selectedLed, quantity]);

  const handlePurchase = () => {
    setIsSynthesizing(true);
  };

  const handleSynthesisComplete = useCallback(() => {
    setIsSynthesizing(false);
    setIsComplete(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c026d3', '#06b6d4', '#f0abfc']
    });
  }, []);

  const finalizeDeployment = useCallback(() => {
    const unitPrice = totalPrice / quantity;
    for (let i = 0; i < quantity; i++) {
        deployArtifact({
            productId: product.id,
            name: product.name,
            size: selectedSize,
            finish: selectedFinish,
            variant: activeVariant,
            subVariant: selectedSubVariant,
            frame: selectedFrame,
            led: selectedLed,
            price: unitPrice,
            imageUrl: activeImageUrl,
            quantity: 1
        });
    }
    router.push('/marketplace');
  }, [deployArtifact, product, selectedSize, selectedFinish, activeVariant, selectedSubVariant, selectedFrame, selectedLed, totalPrice, activeImageUrl, router, quantity]);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-neon-cyan selection:text-black">
      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Main Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLUMN 1: SIDEBAR THUMBNAILS (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
             {environmentThumbs.map((env) => (
                <button 
                  key={env.id} 
                  onClick={() => {
                     if (env.id === 'technical') {
                        setViewMode('technical');
                     } else {
                        setViewMode('realistic');
                        setSelectedEnv(env.id);
                     }
                  }}
                  className={cn(
                     "aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 bg-white/5 group relative",
                     (viewMode === 'technical' && env.id === 'technical') || (viewMode === 'realistic' && selectedEnv === env.id)
                        ? "border-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                        : "border-white/10 hover:border-white/30"
                  )}
                >
                   <img 
                     src={env.img} 
                     className={cn(
                        "w-full h-full object-cover transition-opacity duration-500",
                        (viewMode === 'technical' && env.id === 'technical') || (viewMode === 'realistic' && selectedEnv === env.id)
                           ? "opacity-100" 
                           : "opacity-40 group-hover:opacity-100"
                     )} 
                     alt={env.label} 
                   />
                   <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-black uppercase tracking-widest">{env.label}</span>
                   </div>
                </button>
             ))}
          </div>

          {/* COLUMN 2: MAIN PREVIEW */}
          <div className="lg:col-span-6 relative group">

             <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl group/preview">
                {/* Product Badge Overlay - Only in Technical View */}
                {viewMode === 'technical' && (
                  <div className="absolute bottom-8 right-8 z-40 pointer-events-none">
                     <motion.div 
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="w-32 h-32 rounded-full bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center border-4 border-white/20 shadow-2xl text-center"
                     >
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none whitespace-pre-wrap px-2">{product.name}</span>
                        <div className="h-[1px] w-8 bg-white/30 my-1" />
                        <span className="text-xs font-bold">{selectedSize}</span>
                     </motion.div>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  {viewMode === 'technical' ? (
                    <motion.div 
                      key="technical"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="relative w-full h-full flex items-center justify-center p-8 cursor-zoom-in"
                      onMouseMove={(e) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        setMousePos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
                        setIsHovering(true);
                      }}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                        <Image 
                          src={activeImageUrl} 
                          fill
                          className="object-contain relative z-10 p-8" 
                          alt={product.name}
                          priority
                          loading="eager"
                        />
                       
                       {/* Magnifier */}
                       {isHovering && (
                         <motion.div 
                           className="absolute w-48 h-48 rounded-full border-2 border-neon-cyan z-50 pointer-events-none shadow-2xl overflow-hidden"
                           style={{ 
                             left: `${mousePos.x}%`, top: `${mousePos.y}%`,
                             backgroundImage: `url(${activeImageUrl})`,
                             backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                             backgroundSize: '400%',
                             transform: 'translate(-50%, -50%)'
                           }}
                         />
                       )}
                    </motion.div>
                  ) : (
                    <motion.div key="realistic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                        <WallProjector 
                           imageUrl={activeImageUrl} 
                           product={product}
                           size={selectedSize} 
                           activeVariant={activeVariant}
                           forcedEnv={selectedEnv}
                        />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Perspective Toggles */}
                <div className="absolute bottom-10 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                   <button onClick={() => setViewMode('technical')} className={cn("px-4 py-2 rounded-full text-[9px] font-black tracking-widest transition-all", viewMode === 'technical' ? "bg-white text-black" : "bg-black/50 backdrop-blur-md text-white/40 border border-white/10")}>PIEZA</button>
                   <button onClick={() => setViewMode('realistic')} className={cn("px-4 py-2 rounded-full text-[9px] font-black tracking-widest transition-all", viewMode === 'realistic' ? "bg-white text-black" : "bg-black/50 backdrop-blur-md text-white/40 border border-white/10")}>AMBIENTE_3D</button>
                </div>
             </div>
          </div>

          {/* COLUMN 3: CONFIGURATION DETAILS */}
          <div className="lg:col-span-5 flex flex-col space-y-8 lg:pl-4">
             {/* Breadcrumbs */}
             <nav className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <span 
                  onClick={() => router.push('/')}
                  className="hover:text-neon-cyan cursor-pointer transition-colors"
                >
                  Inicio
                </span>
                <span>/</span>
                <span 
                  onClick={() => router.push('/marketplace')}
                  className="hover:text-neon-cyan cursor-pointer transition-colors"
                >
                  Catálogo
                </span>
                <span>/</span>
                <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
             </nav>

             <div 
               ref={titleContainerRef}
               className="space-y-6 perspective-1000"
             >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative group/title cursor-default">
                  <div className="relative flex-1">
                  <motion.h1 
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white flex flex-col relative z-20"
                  >
                    <motion.div 
                      style={{ 
                        x: useTransform(mouseXSpring, [-0.5, 0.5], ["-15px", "15px"]), 
                        y: useTransform(mouseYSpring, [-0.5, 0.5], ["-10px", "10px"]),
                      }}
                      className="drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                      {product.name}
                    </motion.div>
                  </motion.h1>

                  {/* Ghost/Glitch Layer */}
                  <motion.div 
                    style={{ 
                      rotateX, rotateY,
                      x: useTransform(mouseXSpring, [-0.5, 0.5], ["15px", "-15px"]), 
                      y: useTransform(mouseYSpring, [-0.5, 0.5], ["10px", "-10px"]),
                      transformStyle: "preserve-3d"
                    }}
                    className="absolute top-0 left-0 text-neon-cyan opacity-30 blur-[1px] select-none pointer-events-none text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] z-10"
                  >
                    {product.name}
                  </motion.div>
                  </div>

                  {/* Price on the right */}
                  <div className="flex flex-col items-end gap-1 mb-2">
                     <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">${formatNumber(totalPrice)}</span>
                     <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Credit_Tokens_Required</span>
                  </div>
                </div>

                 {/* Sub-Variation Selector */}
                 {subVariants.length > 1 && (
                   <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]" />
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 leading-none">Variaciones de Serie Disponibles</label>
                     </div>
                     <div className="flex flex-wrap gap-2.5">
                        {subVariants.map((sv) => (
                          <button
                            key={sv.index}
                            onClick={() => setSelectedSubVariant(sv.index)}
                            className={cn(
                              "w-12 h-16 rounded-lg border overflow-hidden transition-all relative group shrink-0",
                              selectedSubVariant === sv.index 
                                ? "border-neon-cyan ring-1 ring-neon-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                                : "border-white/10 hover:border-white/30 bg-white/5"
                            )}
                          >
                            <img 
                              src={sv.url} 
                              className={cn(
                                "w-full h-full object-cover transition-all duration-300",
                                selectedSubVariant === sv.index ? "opacity-100 scale-110" : "opacity-40 group-hover:opacity-100"
                              )} 
                              alt={`v${sv.index}`} 
                            />
                            <div className={cn(
                              "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                              selectedSubVariant === sv.index ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                            )}>
                               <span className="text-[9px] font-black">V{sv.index}</span>
                            </div>
                            {selectedSubVariant === sv.index && (
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#06b6d4]" />
                            )}
                          </button>
                        ))}
                     </div>
                   </div>
                 )}


             </div>

             {/* Configuration Controls */}
             <div className="space-y-6 pt-4">
                {/* Size Selector */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 mb-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]" />
                       <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Protocolo de Dimensión</label>
                    </div>
                   <div className="relative group">
                       <div className="grid grid-cols-2 gap-3 mt-2">
                          {Object.entries(ZENITH_SIZES).map(([key, info]) => (
                            <button 
                              key={key}
                              onClick={() => setSelectedSize(key)}
                              className={cn(
                                "p-4 rounded-2xl border text-left transition-all relative group overflow-hidden",
                                selectedSize === key 
                                  ? cn(info.border, info.color.replace('text-', 'bg-').split('-')[0] + "-500/10") 
                                  : "border-white/5 bg-white/[0.02] hover:border-white/20"
                              )}
                            >
                               <div className={cn(
                                 "text-[11px] font-black uppercase tracking-widest transition-colors",
                                 selectedSize === key ? info.color : "text-white/70"
                               )}>
                                  {key}
                               </div>
                               <div className="text-[8px] font-mono opacity-40 uppercase mt-1 tracking-tighter">
                                  {info.name} — {info.code}
                               </div>
                               {selectedSize === key && (
                                 <div className="absolute top-2 right-2">
                                   <div className={cn(
                                     "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                                     info.glow,
                                     info.color
                                   )} />
                                 </div>
                               )}
                            </button>
                          ))}
                       </div>
                   </div>
                </div>

                {/* Material Selector */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 mb-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                       <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Sustrato de Síntesis</label>
                    </div>
                   <div className="relative">
                       <div className="grid grid-cols-3 gap-2 mt-2">
                          {MATERIALS.map((m) => {
                            const isSelected = selectedFinish === m.id;
                            const isDisabled = m.name === 'CANVAS' || m.name === 'POSTER';
                            
                            return (
                              <button 
                                key={m.id}
                                onClick={() => !isDisabled && setSelectedFinish(m.id)}
                                disabled={isDisabled}
                                className={cn(
                                  "p-3 rounded-xl border text-center transition-all relative group overflow-hidden flex flex-col items-center justify-center gap-1",
                                  isSelected 
                                    ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                                    : isDisabled
                                      ? "border-red-500 bg-red-500/10 cursor-not-allowed shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                      : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                )}
                              >
                                 <div className={cn(
                                   "text-[10px] font-black uppercase tracking-widest transition-colors",
                                   isSelected ? "text-neon-cyan" : isDisabled ? "text-red-500" : "text-white/50"
                                 )}>
                                    {m.name}
                                 </div>
                                 <div className={cn(
                                   "text-[7px] font-mono opacity-30 uppercase tracking-tighter leading-none h-4 flex items-center",
                                   isDisabled && "text-red-500/60"
                                 )}>
                                    {m.name === 'CANVAS' ? '4.5CM' : m.name === 'LONA' ? 'VINILO' : 'DIGITAL'}
                                 </div>
                                 
                                 {isSelected && (
                                   <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_5px_#06b6d4]" />
                                 )}
                                 
                                 {isDisabled && (
                                   <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                 )}
                              </button>
                            );
                          })}
                       </div>
                   </div>
                </div>

                {/* LED Selector */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 mb-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                       <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Protocolo Lumínico (LED)</label>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                       {LED_OPTIONS.map((opt) => (
                         <button 
                           key={opt.id}
                           onClick={() => setSelectedLed(opt.id)}
                           className={cn(
                             "p-2.5 rounded-xl border text-center transition-all relative group overflow-hidden flex flex-col items-center justify-center gap-0.5",
                             selectedLed === opt.id 
                               ? cn(opt.border, opt.color.replace('text-', 'bg-').split('-')[0] + "-500/10") 
                               : "border-white/5 bg-white/[0.02] hover:border-white/20"
                           )}
                           style={{
                             backgroundColor: selectedLed === opt.id ? `${opt.color.includes('purple') ? 'rgba(168, 85, 247, 0.1)' : opt.color.includes('amber') ? 'rgba(251, 191, 36, 0.1)' : opt.color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)'}` : ''
                           }}
                         >
                            <div className={cn(
                              "text-[9px] font-black uppercase tracking-tight transition-colors",
                              selectedLed === opt.id ? opt.color : "text-white/40"
                            )}>
                               {opt.name}
                            </div>
                            <div className="text-[7px] font-mono opacity-30 uppercase tracking-tighter leading-tight">
                               {opt.desc}
                            </div>
                            
                            {selectedLed === opt.id && (
                              <div className={cn(
                                "absolute top-1 right-1 w-1 h-1 rounded-full shadow-[0_0_8px_currentColor]",
                                opt.glow,
                                opt.color
                              )} />
                            )}
                         </button>
                       ))}
                    </div>
                 </div>

                {/* Frame Selector */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 mb-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                       <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Estructura Externa (Marco)</label>
                    </div>
                   <div className="flex gap-3 flex-wrap">
                      {FRAMES.map((f) => (
                        <button 
                          key={f.id}
                          onClick={() => setSelectedFrame(f.id)}
                          className={cn(
                            "w-12 h-12 rounded-full border-2 transition-all p-1",
                            selectedFrame === f.id ? "border-neon-cyan scale-110" : "border-transparent opacity-40 hover:opacity-100"
                          )}
                          title={f.name}
                        >
                           <div className={cn("w-full h-full rounded-full", f.class)} />
                        </button>
                      ))}
                   </div>
                </div>

                {/* Quantity & CTA */}
                <div className="flex gap-4 pt-4">
                   <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-xl font-bold hover:text-neon-cyan">-</button>
                      <span className="w-12 text-center font-black text-lg">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-xl font-bold hover:text-neon-cyan">+</button>
                   </div>
                   <button 
                     onClick={handlePurchase}
                     disabled={isSynthesizing}
                     className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-neon-cyan hover:text-white transition-all shadow-[0_10px_40px_rgba(255,255,255,0.05)] active:scale-[0.98]"
                   >
                     {isSynthesizing ? 'SINTETIZANDO...' : 'AGREGAR AL CARRITO'}
                   </button>
                </div>

                {/* Shipping Calc */}
                <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-2.5 mb-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                       <div className="flex items-center gap-2 text-[12px] font-black text-white/40 uppercase tracking-[0.4em] leading-none">
                          <Box size={14} className="opacity-50" />
                          Medios de envío
                       </div>
                    </div>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Tu código postal" 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-white/30 transition-colors"
                      />
                      <button className="px-6 py-3 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">CALCULAR</button>
                   </div>
                   <p className="text-[9px] text-white/20 uppercase tracking-widest">No sé mi código postal</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Synthesis Modal (Portal to payment) */}
      <DiagnosticOverlay 
        isVisible={isSynthesizing} 
        product={product} 
        finish={selectedFinish}
        size={selectedSize}
        onComplete={handleSynthesisComplete}
      />

      {/* Complete View (Confirmation) */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
             <div className="max-w-md w-full glass-dark border border-white/10 rounded-[3rem] p-12 text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green mx-auto">
                   <Check size={48} strokeWidth={3} />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter">Pedido Sintetizado</h3>
                <p className="text-white/40 text-sm uppercase tracking-widest">Tu pieza ha sido reservada en el laboratorio de NovaFrame.</p>
                <button 
                  onClick={finalizeDeployment}
                  className="w-full py-6 bg-neon-cyan text-black font-black uppercase tracking-[0.3em] rounded-2xl"
                >
                  IR AL CARRITO
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Back Button */}
      <button 
        onClick={() => router.back()}
        className="fixed top-8 left-8 z-50 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
}
