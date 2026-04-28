'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TRANSMISSIONS = [
  { id: 'T-892', msg: 'Calidad del lienzo excede los parámetros estándar.', user: 'K.Reeves', sector: 4 },
  { id: 'T-911', msg: 'Integración lumínica perfecta. El nivel de detalle es irreal.', user: 'S.Motoko', sector: 9 },
  { id: 'T-104', msg: 'Protocolo de pintura PBN completado. Resultado: Obras de calidad profesional.', user: 'E.Tyrell', sector: 1 },
  { id: 'T-77X', msg: 'Envío interceptado a tiempo. Embalaje industrial resistió impacto.', user: 'C.Gibson', sector: 2 },
  { id: 'T-33A', msg: 'Mutación artística lograda. La sala se siente viva.', user: 'J.Mnemonic', sector: 7 }
];

export default function DataStreamTestimonials() {
  // Duplicate array to make seamless scrolling
  const scrollItems = [...TRANSMISSIONS, ...TRANSMISSIONS, ...TRANSMISSIONS];

  return (
    <section className="relative w-full bg-black py-12 overflow-hidden border-t border-white/5">
      
      {/* Decorative Headers */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-6 py-2 text-[8px] font-mono uppercase tracking-[0.4em] text-white/20 select-none pointer-events-none">
        <span>Monitor_Frecuencias</span>
        <span className="text-neon-cyan animate-pulse">Red_Activa</span>
      </div>

      {/* Main Scroller */}
      <div className="flex whitespace-nowrap pt-8 pb-4 relative z-10 w-full overflow-hidden">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-12"
        >
          {scrollItems.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-4">
              <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-neon-pink uppercase tracking-wider">
                [{item.id}]
              </div>
              <span className="text-sm md:text-base font-light text-white/70 italic">"{item.msg}"</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">USR: {item.user}</span>
                <span className="text-[8px] font-mono text-neon-cyan uppercase tracking-widest">Sector_{item.sector}</span>
              </div>
              <div className="w-1 h-3 bg-neon-cyan animate-pulse ml-4" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}
