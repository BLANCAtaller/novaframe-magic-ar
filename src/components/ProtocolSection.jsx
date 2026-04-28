'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Microscope, Cpu, Layers, HardDrive } from 'lucide-react';

const protocols = [
  {
    id: 'P-01',
    title: 'Lienzo Pro-Evo',
    desc: 'Fibra de alta densidad (Museum Grade) con base de polímero aeroespacial para estabilidad dimensional absoluta.',
    icon: Layers,
    color: 'text-neon-pink'
  },
  {
    id: 'P-02',
    title: 'Pigmentación Quantum',
    desc: 'Micro-encapsulación de 12 canales de color con protección UV-C, garantizando una vida útil de +200 años.',
    icon: Microscope,
    color: 'text-neon-cyan'
  },
  {
    id: 'P-03',
    title: 'Bastidor de Grado Industrial',
    desc: 'Madera de pino tratada al vacío para eliminar humedad y deformaciones estructurales en condiciones extremas.',
    icon: ShieldCheck,
    color: 'text-neon-yellow'
  },
  {
    id: 'P-04',
    title: 'Autenticación NFC',
    desc: 'Cada artefacto incluye un chip pasivo con certificado de autoría vinculado a la red central NOVAFRAME.',
    icon: Cpu,
    color: 'text-neon-green'
  }
];

export default function ProtocolSection() {
  return (
    <section id="proceso" className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Background Tech Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-0.5 bg-neon-green" />
            <span className="text-neon-green text-xs font-black tracking-[0.5em] uppercase animate-data-pulse">System Protocol v3.0</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
            ESPECIFICACIONES <br /> <span className="text-gradient">DE GRADO MUSEO</span>
          </h2>
          <p className="max-w-xl text-white/40 leading-relaxed font-light">
            No producimos arte decorativo; sintetizamos artefactos visuales bajo estándares de ingeniería de precisión. 
            Cada unidad es sometida a un riguroso <span className="text-white">control de fidelidad cromática</span> antes del despliegue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          {protocols.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-black p-10 hover:bg-white/[0.02] transition-all group relative"
            >
              <div className="absolute top-6 right-8 text-[10px] font-mono text-white/10 group-hover:text-white/30 transition-colors uppercase">
                {p.id}
              </div>
              <div className={`mb-8 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform ${p.color}`}>
                <p.icon size={24} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-widest group-hover:text-white transition-colors">{p.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/50 transition-colors font-light">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
