'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, RotateCcw, Globe, Shield, Zap, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

const NodeStatus = ({ status }) => (
  <div className="flex items-center space-x-2">
    <div className="relative flex items-center justify-center">
      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
      <motion.span 
        animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
      />
    </div>
    <span className="text-[9px] font-mono font-black text-cyan-400/80 tracking-widest">{status}</span>
  </div>
);

const ProtocolCard = ({ protocol, index }) => {
  const [latency, setLatency] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initialize latency on client side only
    setLatency(Math.floor(Math.random() * 20) + 5);
    
    const interval = setInterval(() => {
      setLatency(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'brightness(0.5)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "group relative p-6 bg-[#050505]/60 backdrop-blur-md border border-white/5 transition-all duration-500 cursor-pointer overflow-hidden",
        protocol.hoverBorder
      )}
    >
      {/* Dynamic Background Glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br",
        protocol.glowColor
      )} />

      {/* Background Tech Detail */}
      <div className="absolute top-0 right-0 p-2 opacity-[0.05] group-hover:opacity-20 transition-opacity">
        <Radio className="w-16 h-16 text-white" />
      </div>

      {/* Scanning Line Overlay */}
      <motion.div 
        className={cn(
          "absolute top-0 left-0 w-full h-[1px] z-20 pointer-events-none opacity-0 group-hover:opacity-100",
          protocol.scanColor
        )}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex items-start space-x-6">
        {/* Icon with Satellite Ring */}
        <div className="relative flex-shrink-0">
          <div className={cn(
            "w-14 h-14 rounded-sm bg-black border border-white/10 flex items-center justify-center transition-all duration-500",
            isHovered ? protocol.iconGlow : ""
          )}>
            <motion.div
              animate={{ rotate: isHovered ? [0, 360] : 0 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className={cn(
                "absolute inset--2 border border-dashed rounded-full pointer-events-none opacity-20",
                protocol.ringColor
              )}
            />
            <motion.div
              animate={isHovered ? {
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {protocol.icon}
            </motion.div>
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 bg-[#050505] border border-white/10 rounded-full">
            <Shield className={cn("w-2.5 h-2.5", protocol.textColor)} />
          </div>
        </div>

        <div className="flex-grow">
          {/* Header Metadata */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-white/20 tracking-widest font-black uppercase">NODE_ID: {protocol.id}</span>
            <NodeStatus status={protocol.status} />
          </div>

          <h3 className={cn(
            "text-lg font-black tracking-tighter text-white transition-colors duration-300 uppercase leading-none mb-2",
            isHovered ? protocol.textColor : ""
          )}>
            {protocol.title}
          </h3>
          
          <p className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-tight group-hover:text-white/80 transition-colors">
            {protocol.description}
          </p>

          {/* Technical Footer */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <span className={cn("text-[7px] font-mono uppercase leading-none mb-1", protocol.labelColor)}>Latency</span>
                <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">{latency}ms</span>
              </div>
              <div className="flex flex-col">
                <span className={cn("text-[7px] font-mono uppercase leading-none mb-1", protocol.labelColor)}>Encryption</span>
                <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">AES-256</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={cn("text-[7px] font-mono uppercase leading-none mb-1", protocol.labelColor)}>Access_Protocol</span>
              <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Layer_ST-04</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Brackets */}
      <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 transition-colors", isHovered ? protocol.borderColor : "")} />
      <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 transition-colors", isHovered ? protocol.borderColor : "")} />
      <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 transition-colors", isHovered ? protocol.borderColor : "")} />
      <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 transition-colors", isHovered ? protocol.borderColor : "")} />
    </motion.div>
  );
};

const LogisticProtocols = () => {
  const protocols = [
    {
      id: 'NVF-L01',
      icon: <Truck className="w-5 h-5" />,
      title: 'Despliegue Nacional',
      description: 'Logística de activos optimizada en todo el territorio nacional.',
      status: 'CARGO_ACTIVE',
      theme: 'cyan',
      glowColor: 'from-cyan-500 to-transparent',
      textColor: 'text-cyan-400',
      labelColor: 'text-cyan-500/50',
      borderColor: 'border-cyan-500/50',
      hoverBorder: 'hover:border-cyan-500/40',
      scanColor: 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent',
      ringColor: 'border-cyan-500/20',
      iconGlow: 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
    },
    {
      id: 'NVF-L02',
      icon: <RotateCcw className="w-5 h-5" />,
      title: 'Protocolo de Retorno',
      description: 'Gestión de logística inversa y activos en garantía sin costo.',
      status: 'SECURE_TRANS',
      theme: 'pink',
      glowColor: 'from-neon-pink to-transparent',
      textColor: 'text-neon-pink',
      labelColor: 'text-neon-pink/50',
      borderColor: 'border-neon-pink/50',
      hoverBorder: 'hover:border-neon-pink/40',
      scanColor: 'bg-gradient-to-r from-transparent via-neon-pink/40 to-transparent',
      ringColor: 'border-neon-pink/20',
      iconGlow: 'border-neon-pink/50 shadow-[0_0_20px_rgba(255,0,127,0.3)]'
    },
    {
      id: 'NVF-L03',
      icon: <Globe className="w-5 h-5" />,
      title: 'Cobertura Global',
      description: 'Exportación y despliegue de activos en redes internacionales.',
      status: 'NODE_READY',
      theme: 'yellow',
      glowColor: 'from-neon-yellow to-transparent',
      textColor: 'text-neon-yellow',
      labelColor: 'text-neon-yellow/50',
      borderColor: 'border-neon-yellow/50',
      hoverBorder: 'hover:border-neon-yellow/40',
      scanColor: 'bg-gradient-to-r from-transparent via-neon-yellow/40 to-transparent',
      ringColor: 'border-neon-yellow/20',
      iconGlow: 'border-neon-yellow/50 shadow-[0_0_20px_rgba(255,255,0,0.3)]'
    }
  ];

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} />
      
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-cyan-400" />
            <span className="text-cyan-400 text-xs font-black tracking-[0.4em] uppercase">Red de Soporte</span>
          </div>
          <motion.h2 
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black tracking-tighter uppercase"
          >
            PROTOCOLOS <br/>
            <motion.span 
                 initial={{ x: 10, color: '#0ff' }}
                 whileInView={{ x: 0, color: 'rgba(0, 255, 255, 0)' }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.2, delay: 0.4 }}
                 className="glitch-text-wrapper text-gradient inline-block" data-text="LOGÍSTICOS"
              >
              LOGÍSTICOS
            </motion.span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {protocols.map((protocol, index) => (
            <ProtocolCard key={protocol.id} protocol={protocol} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogisticProtocols;

