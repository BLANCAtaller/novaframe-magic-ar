'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'ELENA V.',
    role: 'COLECCIONISTA DIGITAL',
    nodeId: 'NX-4402',
    content: 'La calidad del lienzo superó mis expectativas. El acabado en marco flotante le da una dimensión que no encuentras en lo tradicional.',
    rating: 5,
    verified: true
  },
  {
    name: 'MARCUS R.',
    role: 'DISEÑADOR DE ESPACIOS',
    nodeId: 'NX-9182',
    content: 'NovaFrame es mi recurso principal para proyectos de interiorismo moderno. La curaduría de diseños pop art es simplemente de otro nivel.',
    rating: 5,
    verified: true
  },
  {
    name: 'SOPHIA K.',
    role: 'ARTISTA VISUAL',
    nodeId: 'NX-2209',
    content: 'Como artista, valoro la fidelidad del color. La mutación cromática en sus impresiones es impecable y vibrante.',
    rating: 5,
    verified: true
  }
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-neon-pink/5 via-transparent to-neon-cyan/5 blur-[150px] pointer-events-none" />

       <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 text-neon-cyan mb-4 uppercase tracking-[0.4em] font-black text-[10px]">
                VOCES DE EXCELENCIA
             </div>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 text-white">RED DE <br /> <span className="text-gradient">ALTA FIDELIDAD</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="glass p-8 rounded-3xl border border-white/5 relative group hover:border-white/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute top-6 right-8 text-white/5 group-hover:text-neon-pink/20 transition-colors">
                  <Quote size={60} fill="currentColor" />
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-neon-yellow fill-neon-yellow" />
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">ID:{t.nodeId}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_5px_rgba(34,197,94,1)]" />
                  </div>
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-8 italic">"{t.content}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan p-[1px]">
                    <div className="w-full h-full bg-black rounded-xl flex items-center justify-center font-black text-xs text-white">
                      {t.name[0]}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white tracking-widest">{t.name}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
       </div>
    </section>
  );
}
