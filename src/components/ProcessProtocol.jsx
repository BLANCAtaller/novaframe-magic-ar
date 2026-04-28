'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Cpu, Layout, PackageSearch, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 'S-01',
    title: 'SINCRONIZACIÓN',
    desc: 'Carga tus datos visuales (.JPG, .PNG, .RAW) a nuestro núcleo de procesamiento distribuido.',
    icon: Layout,
    status: 'COMPLETE',
    color: 'text-neon-cyan'
  },
  {
    id: 'S-02',
    title: 'OPTIMIZACIÓN NEURONAL',
    desc: 'Escalado avanzado e IA para reconstruir píxeles y asegurar una fidelidad cromática absoluta.',
    icon: Cpu,
    status: 'PROCESSING',
    color: 'text-neon-pink'
  },
  {
    id: 'S-03',
    title: 'DESPLIEGUE TÁCTICO',
    desc: 'Impresión de alta densidad y despliegue logístico directo a la ubicación de tu sede central.',
    icon: PackageSearch,
    status: 'PENDING',
    color: 'text-neon-yellow'
  }
];

export default function ProcessProtocol() {
  return (
    <section id="proceso-v2" className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <div className="flex items-center gap-2 text-neon-cyan mb-4">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Pipeline v4.2</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              PROTOCOLO DE <br /> <span className="text-gradient">SINTETIZACIÓN</span>
            </h2>
          </div>
          <p className="max-w-md text-white/40 text-sm leading-relaxed font-light text-right">
            Nuestra infraestructura automatizada garantiza que cada bit de información sea transformado en una obra maestra física de grado industrial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-[60px] -right-[15%] w-[30%] h-[1px] bg-gradient-to-r from-white/20 to-transparent z-0" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all group-hover:scale-110 ${step.color}`}>
                    <step.icon size={32} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-white/20 font-black block mb-1">STEP {step.id}</span>
                    <div className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-black tracking-widest text-white/50 uppercase border border-white/5">
                      {step.status}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-white group-hover:text-neon-cyan transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed font-light mb-6 group-hover:text-white/60 transition-colors">
                  {step.desc}
                </p>

                <div className="flex items-center gap-4 py-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border border-black bg-white/10" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-white/30 uppercase">Verified Nodes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
