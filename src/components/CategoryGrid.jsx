'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Layers, History, Users, Activity, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const CategoryGrid = () => {
  const categories = [
    {
      id: 'C-SEC-01',
      title: 'MÓDULOS_PERSONALIZADOS',
      subtitle: 'SINCRONIZACIÓN DE MEMORIA',
      image: '/images/gallery/monroe_glitch.webp',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      items: ['Individuales', 'Dípticos', 'Configuración Libre'],
      description: 'Convierte tus archivos visuales en artefactos táctiles de alta densidad.'
    },
    {
      id: 'C-SEC-02',
      title: 'ARCHIVOS_HISTÓRICOS',
      subtitle: 'RECONSTRUCCIÓN CLÁSICA',
      image: '/images/gallery/pop_geisha_v2.webp',
      icon: <History className="w-4 h-4 text-amber-400" />,
      items: ['Neo-Impresionismo', 'Archivos de Museo', 'Líneas del Tiempo'],
      description: 'Obras maestras sintetizadas con tecnología de preservación molecular.'
    },
    {
      id: 'C-SEC-03',
      title: 'NODOS_COLABORATIVOS',
      subtitle: 'SINDICATO DE ARTISTAS',
      image: '/images/gallery/alice_lego_steampunk_fidelity.webp',
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      items: ['David Aste', 'Gina Villalobos', 'Adriana Sosa'],
      description: 'Acceso exclusivo a la red nodal de creadores certificados por NovaFrame.'
    },
    {
      id: 'C-SEC-04',
      title: 'SECTORES_TENDENCIA',
      subtitle: 'VECTORES_FUTURISTAS',
      image: '/images/gallery/napoleon_empire_rebellion_high_res.webp',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      items: ['Abstracción Glitch', 'Bauhaus Cyber', 'Mapas Estelares'],
      description: 'Explora las narrativas visuales más demandadas en el sector central.'
    }

  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase">Directorio de Catálogo</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">
            Exploración de Sectores
          </h2>
          <div className="w-24 h-1 bg-cyan-500 rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pt-12">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              style={{ perspective: "1200px" }}
              className="group relative cursor-pointer"
            >
              {/* 3D Canvas Frame Container */}
              <motion.div
                whileHover={{ 
                  rotateY: 15, 
                  rotateX: -10,
                  z: 50,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] transition-all duration-500"
              >
                {/* Canvas Side Depth (Top) */}
                <div className="absolute top-0 left-0 w-full h-[6px] bg-white/10 origin-top transform -skew-x-[45deg] translate-y-[-100%] opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Canvas Side Depth (Right) */}
                <div className="absolute top-0 right-0 h-full w-[6px] bg-white/5 origin-right transform -skew-y-[45deg] translate-x-[100%] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Image Preview with Texture */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-100"
                  />
                  
                  {/* Canvas Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/canvas-fabric.png')] group-hover:opacity-40 transition-opacity" />
                  
                  {/* Vignette & Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-0 ring-inset ring-1 ring-white/10" />
                  
                  {/* Protocol Header over Image */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                     <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 border-l-2 border-cyan-500">
                        <span className="text-[10px] font-mono text-cyan-400 font-black tracking-widest flex items-center">
                          {cat.id}
                        </span>
                     </div>
                     <div className="bg-black/80 rounded-full p-2.5 border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-all duration-500 group-hover:scale-110">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                     </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 rounded bg-white/5 backdrop-blur-sm">
                        {cat.icon}
                      </div>
                      <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
                         {cat.subtitle}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter leading-none group-hover:text-cyan-400 transition-colors uppercase">
                       {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Details Pane */}
                <div className="p-8 space-y-6 flex flex-col justify-between flex-grow bg-gradient-to-b from-transparent to-black/40">
                  <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                  
                  <div className="space-y-3">
                    {cat.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group/item py-2 border-b border-white/[0.05]">
                        <span className="text-[10px] font-mono font-black text-white/30 group-hover/item:text-cyan-400 transition-colors uppercase tracking-widest">
                          {item}
                        </span>
                        <div className="w-1.5 h-1.5 bg-white/10 rounded-full group-hover/item:bg-cyan-500 group-hover/item:shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" />
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-4 text-[10px] font-black tracking-[0.4em] text-center border border-white/10 group-hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-black transition-all uppercase relative overflow-hidden backdrop-blur-sm">
                    <span className="relative z-10">Acceder al Sector</span>
                  </button>
                </div>

                {/* Animated Edge Highlights */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent animate-pulse" />
                  <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-pink-500/50 to-transparent animate-pulse delay-75" />
                </div>
              </motion.div>

              {/* Physical Floor Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-cyan-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
