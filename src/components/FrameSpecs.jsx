'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, Maximize, Palette, Leaf, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';

const FrameCard = ({ title, description, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="relative group p-6 glass-panel border border-white/10 hover:border-neon-cyan/50 transition-all bg-black/40 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 flex items-start gap-4">
      <div className="p-3 rounded bg-white/5 text-neon-cyan group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold font-mono text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 leading-relaxed font-sans">{description}</p>
      </div>
    </div>
  </motion.div>
);

const ColorSwatch = ({ color, name, hex, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={cn(
      "w-12 h-12 rounded-full border-2 transition-transform group-hover:scale-110 shadow-lg",
      hex === 'madera' ? "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-[#8b5a2b] border-[#5c3a18]" :
      hex === 'blanco' ? "bg-white border-gray-200" :
      hex === 'negro' ? "bg-black border-gray-800" :
      hex === 'plateado' ? "bg-gradient-to-br from-gray-300 to-gray-500 border-gray-400" :
      "bg-gradient-to-br from-yellow-300 to-yellow-600 border-yellow-500"
    )} />
    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest group-hover:text-neon-cyan transition-colors">{name}</span>
  </motion.div>
);

export default function FrameSpecs({ selectedColor, onSelectColor }) {
  const { lang } = useLang();
  const t = translations[lang].lab;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-32 bg-[#020202] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div style={{ y, opacity }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-mono font-bold tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            {t.frames.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 glitch-text" data-text={t.frames.title}>
            {t.frames.title}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/50 font-sans">
            {t.frames.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div>
              <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">{t.frames.materialBase}</h3>
              <FrameCard 
                title={t.frames.polyTitle}
                description={t.frames.polyDesc}
                icon={Leaf}
                delay={0.1}
              />
            </div>

            <div>
              <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">{t.frames.colorPalette}</h3>
              <div className="flex flex-wrap gap-6 justify-between items-center glass-panel p-6 border border-white/5 rounded-xl">
                {[
                  { name: t.frames.colors.ninguno, id: "ninguno" },
                  { name: t.frames.colors.madera, id: "madera" },
                  { name: t.frames.colors.blanco, id: "blanco" },
                  { name: t.frames.colors.negro, id: "negro" },
                  { name: t.frames.colors.plata, id: "plata" },
                  { name: t.frames.colors.oro, id: "oro" }
                ].map((color, i) => (
                  <motion.div
                    key={color.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                    onClick={() => onSelectColor?.(color.id)}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full border-2 transition-transform group-hover:scale-110 shadow-lg relative flex items-center justify-center",
                      color.id === 'ninguno' ? "bg-transparent border-dashed border-white/20" :
                      color.id === 'madera' ? "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-[#8b5a2b] border-[#5c3a18]" :
                      color.id === 'blanco' ? "bg-white border-gray-200" :
                      color.id === 'negro' ? "bg-black border-gray-800" :
                      color.id === 'plata' ? "bg-gradient-to-br from-gray-300 to-gray-500 border-gray-400" :
                      "bg-gradient-to-br from-yellow-300 to-yellow-600 border-yellow-500",
                      selectedColor === color.id && "ring-2 ring-neon-cyan ring-offset-4 ring-offset-black"
                    )}>
                      {color.id === 'ninguno' && <X className="text-white/20" size={14} />}
                      {selectedColor === color.id && (
                        <motion.div 
                          layoutId="active-spec-color"
                          className="absolute -inset-1 border border-neon-cyan rounded-full"
                        />
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-mono uppercase tracking-widest transition-colors",
                      selectedColor === color.id ? "text-neon-cyan font-black" : "text-white/50 group-hover:text-neon-cyan"
                    )}>
                      {color.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">{t.frames.dimParams}</h3>
            <div className="space-y-6">
              <FrameCard 
                title={t.frames.largeFormat}
                description={t.frames.largeDesc}
                icon={Maximize}
                delay={0.3}
              />
              <FrameCard 
                title={t.frames.standardFormat}
                description={t.frames.standardDesc}
                icon={Layers}
                delay={0.4}
              />
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 border border-dashed border-neon-cyan/30 rounded bg-neon-cyan/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Palette className="text-neon-cyan" size={24} />
                <div>
                  <h4 className="font-mono text-neon-cyan font-bold">{t.frames.configCustom}</h4>
                  <p className="text-xs text-white/60">{t.frames.configDesc}</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
