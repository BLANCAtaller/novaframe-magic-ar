'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Maximize, Box, Fingerprint } from 'lucide-react';

const ARTWORKS = [
  { id: 'white-rabbit-lego-v1', title: 'The White Rabbit // Lego Protocol', path: '/images/products/white-rabbit-lego/color/white-rabbit-lego-v1.webp' },
  { id: 'courage-berserk-v1', title: 'Courage // Berserk Phase', path: '/images/products/courage-berserk/color/courage-berserk-v1.webp' },
  { id: 'pikachu-steampunk', title: 'Pikachu // Steampunk Odyssey', path: '/images/products/pikachu-steampunk/color/pikachu-steampunk.webp' },
  { id: 'lego-alice-v1', title: 'Lego Alice // Wonderland Edition', path: '/images/products/lego-alice/color/lego-alice-v1.webp' },
  { id: 'alice-geometric-v1', title: 'Geometric Alice // Polygon', path: '/images/products/alice-geometric/color/alice-geometric-v1.webp' },
];

/* ─── Canvas texture noise (subtle print texture) ─── */
const CANVAS_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Per-Environment Wall Mapping ───
   Calibrated to the actual photograph's architecture:
   
   SALA MINIMALISTA: 
     - Large dark textured wall, centered. Couch at bottom ~35% of frame.
     - Painting should hang in the CENTER of the wall, well ABOVE the couch.
     - The wall is frontal (no perspective angle).
   
   OFICINA INDUSTRIAL:
     - Concrete wall occupies right ~65% of image, angled slightly inward.
     - Desk runs horizontally at bottom ~30%.
     - Painting should be centered on the concrete wall, larger, with a 
       rotation that follows the wall's vanishing point (~-10deg).
   
   RECÁMARA OSCURA:
     - Dark wall behind bed. Headboard is at vertical center.
     - Painting must be ABOVE the headboard, centered horizontally with the bed.
     - The wall is frontal (no perspective angle needed).
*/
const ENVIRONMENTS = [
  {
    id: 'living',
    name: 'Sala Minimalista',
    icon: Maximize,
    bgClass: 'bg-[#111]',
    buttonColor: 'group-hover:text-white group-hover:border-white/50',
    // Wall: frontal, painting centered above the couch
    canvasWidth: 280,
    offsetX: 20,        // slightly right of center (wall has a slight right bias)
    offsetY: -110,      // well above the couch
    baseRotateY: 0,     // frontal wall, no angle needed
    overlay: (
      <Image priority src="/images/environments/sala_minimalista.webp" alt="Sala Minimalista" fill className="object-cover object-center opacity-[0.85]" />
    )
  },
  {
    id: 'office',
    name: 'Oficina Industrial',
    icon: Box,
    bgClass: 'bg-zinc-950',
    buttonColor: 'group-hover:text-amber-400 group-hover:border-amber-500/50',
    // Wall: concrete, right side, angled perspective going back-right
    canvasWidth: 260,
    offsetX: 70,        // centered on the concrete wall (right portion of photo)
    offsetY: -80,       // above the desk, in the visual center of the wall
    baseRotateY: -10,   // follows the concrete wall's vanishing point
    overlay: (
      <Image src="/images/environments/oficina_industrial.webp" alt="Oficina Industrial" fill className="object-cover object-center opacity-90" />
    )
  },
  {
    id: 'bedroom',
    name: 'Recámara Oscura',
    icon: Fingerprint,
    bgClass: 'bg-[#030308]',
    buttonColor: 'group-hover:text-fuchsia-400 group-hover:border-fuchsia-500/50',
    // Wall: dark, frontal, painting centered above headboard
    canvasWidth: 240,
    offsetX: 30,        // centered with the bed (bed is slightly right of center)
    offsetY: -140,      // well above the headboard, in the wall's vertical center
    baseRotateY: 0,     // frontal wall
    overlay: (
      <Image src="/images/environments/recamara_oscura.webp" alt="Recámara Oscura" fill className="object-cover object-center opacity-100" />
    )
  }
];

/* ─── Canvas Geometry ─── */
const CANVAS_DEPTH = 22; // px — depth of the stretched canvas sides

export default function ArVisualizer() {
  const [activeEnv, setActiveEnv] = useState('living');
  const [activeArt, setActiveArt] = useState('white-rabbit-lego-v1');
  const currEnv = ENVIRONMENTS.find(e => e.id === activeEnv) || ENVIRONMENTS[0];
  const currArt = ARTWORKS.find(a => a.id === activeArt) || ARTWORKS[0];

  // 3D Parallax & Camera Perspective
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Camera perspective movement (moves vanishing point instead of rotating object)
  const originX = useTransform(smoothX, [0, 1], [30, 70]);
  const originY = useTransform(smoothY, [0, 1], [30, 70]);
  const perspectiveOrigin = useMotionTemplate`${originX}% ${originY}%`;

  // Subtle background parallax to enhance depth
  const bgTranslateX = useTransform(smoothX, [0, 1], [-8, 8]);
  const bgTranslateY = useTransform(smoothY, [0, 1], [-6, 6]);

  // Shadow moves very little to stay "pinned" to the wall surface
  const shadowX = useTransform(smoothX, [0, 1], [2, -2]);
  const shadowY = useTransform(smoothY, [0, 1], [2, -2]);
  const isLight = activeEnv === 'living';

  // Specular gloss
  const specX = useTransform(smoothX, [0, 1], [0, 100]);
  const specY = useTransform(smoothY, [0, 1], [0, 100]);
  const glossGradient = useMotionTemplate`radial-gradient(circle at ${specX}% ${specY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const artSrc = currArt.path;

  return (
    <section className="relative w-full py-24 border-t border-white/5 bg-[#020202]">
      <div className="max-w-7xl mx-auto px-6 relative z-20 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-neon-pink" />
              <span className="text-neon-pink text-xs font-black tracking-[0.4em] uppercase">Simulador Holográfico</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              PROYECCIÓN <br/>
              <span className="text-white/30">ESPACIAL.</span>
            </h2>
          </div>

          {/* Environment Tabs */}
          <div className="flex bg-[#0a0a0a]/80 border border-white/10 rounded-xl p-1.5 backdrop-blur-md shadow-2xl">
            {ENVIRONMENTS.map(env => {
              const isActive = activeEnv === env.id;
              const Icon = env.icon;
              return (
                <button
                  key={env.id}
                  onClick={() => setActiveEnv(env.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] tracking-widest uppercase rounded-lg transition-all duration-300 relative group",
                    isActive
                      ? "bg-white/10 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                      : "text-white/40 hover:text-white/80 border border-transparent"
                  )}
                >
                  <Icon size={14} className={cn("transition-colors", !isActive && env.buttonColor.split(' ')[0])} />
                  <span className="hidden md:inline">{env.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeEnvIndicator"
                      className={cn(
                        "absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1/2 h-[2px] rounded-full",
                        env.id === 'bedroom' ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' :
                        env.id === 'office' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' :
                        'bg-white shadow-[0_0_10px_#ffffff]'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-[85vh] min-h-[700px]">
        <motion.div
          className="w-full h-full relative rounded-3xl overflow-hidden ring-1 ring-white/10 flex items-center justify-center bg-[#050505]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            perspective: "1200px",
            perspectiveOrigin: perspectiveOrigin
          }}
        >
          {/* Background Photo */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currEnv.id}
              initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={cn("absolute inset-0 pointer-events-none", currEnv.bgClass)}
              style={{ x: bgTranslateX, y: bgTranslateY, scale: 1.08 }}
            >
              {currEnv.overlay}
            </motion.div>
          </AnimatePresence>

          {/* ════════════════════════════════════════════════════════
              WALL SHADOW — Soft diffused shadow behind the canvas
              ════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute pointer-events-none z-[5]"
            style={{
              width: `${currEnv.canvasWidth + 30}px`,
              aspectRatio: '4/5',
              left: `calc(50% + ${currEnv.offsetX}px)`,
              top: `calc(50% + ${currEnv.offsetY}px)`,
              x: shadowX,
              y: shadowY,
              translateX: '-50%',
              translateY: '-50%',
              filter: isLight ? 'blur(15px)' : 'blur(25px)',
              opacity: isLight ? 0.35 : 0.65,
              background: 'black',
            }}
          />

          {/* ════════════════════════════════════════════════════════
              3D CANVAS — Pure printed canvas, NO frame
              Structure: Front (art) + 4 gallery-wrap sides + back
              ════════════════════════════════════════════════════════ */}
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              left: `calc(50% + ${currEnv.offsetX}px)`,
              top: `calc(50% + ${currEnv.offsetY}px)`,
            }}
            className="absolute z-10 cursor-pointer"
            initial={false}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Pivot Centering — offset the geometry so rotation feels centered */}
            <div
              style={{
                width: `${currEnv.canvasWidth}px`,
                aspectRatio: '4/5',
                transform: `translate(-50%, -50%) rotateY(${currEnv.baseRotateY}deg) translateZ(${CANVAS_DEPTH / 2}px)`,
                transformStyle: "preserve-3d",
                position: 'relative',
              }}
            >
              {/* ── FRONT FACE: The printed artwork ── */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ transform: "translateZ(0px)", backfaceVisibility: "hidden" }}
              >
                <Image
                  src={artSrc}
                  alt={currArt.title}
                  fill
                  className="object-cover object-center"
                />
                {/* Specular gloss — simulates light reflecting off the canvas coating */}
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
                  style={{ background: glossGradient }}
                />
                {/* Canvas print texture */}
                <div
                  className="absolute inset-0 z-30 opacity-[0.08] mix-blend-multiply pointer-events-none"
                  style={{ backgroundImage: CANVAS_NOISE }}
                />
              </div>

              {/* ── GALLERY WRAP SIDES: Art image continues onto edges ── */}

              {/* Top edge */}
              <div
                className="absolute top-0 left-0 right-0 origin-top overflow-hidden"
                style={{ height: `${CANVAS_DEPTH}px`, transform: "rotateX(-90deg)", backfaceVisibility: "hidden" }}
              >
                <img loading="lazy" decoding="async" src={artSrc} alt="" className="w-full object-cover object-top brightness-[0.55]" style={{ height: '600%' }} />
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: CANVAS_NOISE }} />
              </div>

              {/* Bottom edge */}
              <div
                className="absolute bottom-0 left-0 right-0 origin-bottom overflow-hidden"
                style={{ height: `${CANVAS_DEPTH}px`, transform: "rotateX(90deg)", backfaceVisibility: "hidden" }}
              >
                <img loading="lazy" decoding="async" src={artSrc} alt="" className="w-full object-cover object-bottom brightness-[0.35]" style={{ height: '600%', objectPosition: 'center bottom' }} />
                <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: CANVAS_NOISE }} />
              </div>

              {/* Left edge */}
              <div
                className="absolute left-0 top-0 bottom-0 origin-left overflow-hidden"
                style={{ width: `${CANVAS_DEPTH}px`, transform: "rotateY(90deg)", backfaceVisibility: "hidden" }}
              >
                <img loading="lazy" decoding="async" src={artSrc} alt="" className="h-full object-cover object-left brightness-[0.5]" style={{ width: '600%' }} />
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: CANVAS_NOISE }} />
              </div>

              {/* Right edge */}
              <div
                className="absolute right-0 top-0 bottom-0 origin-right overflow-hidden"
                style={{ width: `${CANVAS_DEPTH}px`, transform: "rotateY(-90deg)", backfaceVisibility: "hidden" }}
              >
                <img loading="lazy" decoding="async" src={artSrc} alt="" className="h-full object-cover object-right brightness-[0.4]" style={{ width: '600%' }} />
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: CANVAS_NOISE }} />
              </div>

              {/* ── BACK FACE: Raw canvas back with stretcher bars ── */}
              <div
                className="absolute inset-0 bg-[#f0ebe3]"
                style={{ transform: `translateZ(-${CANVAS_DEPTH}px) rotateY(180deg)`, backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: CANVAS_NOISE }} />
                {/* Stretcher bar cross pattern */}
                <div className="absolute inset-[12%] border-[5px] border-[#8b7355]/30" />
                <div className="absolute top-[12%] bottom-[12%] left-1/2 w-[5px] bg-[#8b7355]/25 -translate-x-1/2" />
                <div className="absolute left-[12%] right-[12%] top-1/2 h-[5px] bg-[#8b7355]/25 -translate-y-1/2" />
              </div>
            </div>
          </motion.div>

          {/* ════════════════════ HUD OVERLAY ════════════════════ */}
          <div className="absolute inset-0 pointer-events-none z-30 ring-1 ring-inset ring-white/5 rounded-3xl" />

          <div className="absolute top-6 left-6 z-20 flex gap-2">
            <span className={cn("w-2 h-2 rounded-full animate-pulse", isLight ? "bg-blue-500" : "bg-neon-pink")} />
            <span className={cn("font-mono text-[9px] uppercase tracking-widest", isLight ? "text-black/50" : "text-white/40")}>
              Engine_Activo
            </span>
          </div>

          <div className={cn("absolute bottom-6 right-6 z-20 font-mono text-[9px] uppercase tracking-widest text-right pointer-events-none", isLight ? "text-zinc-500" : "text-white/30")}>
            ID: {currArt.title.toUpperCase()} <br/>
            RENDER: VOLUMETRIC
          </div>

          {/* Art Selector */}
          <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2">
            <span className={cn("font-mono text-[9px] uppercase tracking-widest pointer-events-none", isLight ? "text-zinc-500" : "text-white/40")}>SELECCIONAR OBRA:</span>
            <div className="flex gap-2">
              {ARTWORKS.map(art => (
                <button
                  key={art.id}
                  onClick={() => setActiveArt(art.id)}
                  className={cn(
                    "w-10 h-10 rounded-md overflow-hidden ring-1 transition-all duration-300",
                    activeArt === art.id ? "ring-white ring-offset-2 ring-offset-[#050505] scale-110" : "ring-white/20 hover:ring-white/50 opacity-50 hover:opacity-100"
                  )}
                >
                  <Image src={art.path} alt={art.title} fill className="object-cover object-center" />
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
