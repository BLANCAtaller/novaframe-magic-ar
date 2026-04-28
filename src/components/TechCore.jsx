'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap, Globe, Database, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const coreValues = [
  {
    icon: Terminal,
    title: "SÍNTESIS DIGITAL",
    value: "01001 / CORE",
    desc: "Algoritmos de escalado neuronal que preservan la intención artística original en resoluciones extremas.",
    color: "from-neon-cyan/20 to-transparent",
    accent: "bg-neon-cyan",
    textAccent: "text-neon-cyan"
  },
  {
    icon: Cpu,
    title: "PROCESADO CUÁNTICO",
    value: "99.8% FIDELITY",
    desc: "Fusión de pigmentos físicos con perfiles de color cinemáticos para una profundidad visual inalcanzable.",
    color: "from-neon-pink/20 to-transparent",
    accent: "bg-neon-pink",
    textAccent: "text-neon-pink"
  },
  {
    icon: Database,
    title: "ARCHIVO ARCH",
    value: "IMMUTABLE_LOG",
    desc: "Cada pieza está vinculada a un registro inmutable que certifica su procedencia y serie limitada.",
    color: "from-neon-yellow/20 to-transparent",
    accent: "bg-neon-yellow",
    textAccent: "text-neon-yellow"
  }
];

export default function TechCore() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute inset-y-0 left-0 w-px bg-white/[0.03] ml-[10%]" />
      <div className="absolute inset-y-0 right-0 w-px bg-white/[0.03] mr-[10%]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-neon-cyan" />
              <span className="text-neon-cyan text-xs font-black tracking-[0.4em] uppercase">Tech_Infrastructure // Alpha</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              EL NÚCLEO DE LA <br /> 
              <span className="text-gradient">INNOVACIÓN</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <p className="text-white/40 text-lg leading-relaxed font-light max-w-md italic">
              "La tecnología no es el fin, sino el medio para materializar mutaciones visuales que desafían la percepción tradicional del arte físico."
            </p>
            <div className="flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-white/5 backdrop-blur-md flex items-center justify-center">
                    <Shield size={16} className="text-white/20" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                Protocolos_Seguridad: <span className="text-neon-cyan">ENCRIPTADOS</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative group h-[400px]"
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-b rounded-3xl transition-all duration-500",
                value.color,
                "group-hover:translate-y-[-8px] border border-white/5 group-hover:border-white/20"
              )} />
              
              <div className="relative h-full p-10 flex flex-col justify-between">
                <div>
                  <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-2xl transition-transform group-hover:scale-110", value.accent, "bg-opacity-20")}>
                    <value.icon className={value.textAccent} size={28} />
                  </div>
                  <div className={cn("text-[10px] font-mono mb-2 uppercase tracking-[0.3em]", value.textAccent)}>
                    {value.value}
                  </div>
                  <h3 className="text-2xl font-black tracking-widest text-white mb-4 uppercase">{value.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light group-hover:text-white/60 transition-colors">
                    {value.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black tracking-widest text-white/20">ESTADO: OPERATIVO</span>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-current" style={{ backgroundColor: 'currentColor' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative large text background */}
      <div className="absolute -bottom-20 -right-20 text-[20vw] font-black text-white/5 select-none pointer-events-none tracking-tighter mix-blend-overlay">
        CORE
      </div>
    </section>
  );
}
