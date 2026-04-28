'use client';

import React from 'react';
import { motion } from 'framer-motion';

const NODES = [
  { id: 'NYC_01', x: '25%', y: '35%', status: 'active' },
  { id: 'LDN_04', x: '45%', y: '30%', status: 'active' },
  { id: 'TKY_09', x: '85%', y: '40%', status: 'active' },
  { id: 'SYD_02', x: '88%', y: '75%', status: 'active' },
  { id: 'CDMX_01', x: '22%', y: '50%', status: 'active' },
  { id: 'SAO_05', x: '35%', y: '70%', status: 'active' },
  { id: 'BER_03', x: '50%', y: '28%', status: 'warning' },
];

export default function NodeMap() {
  return (
    <div className="relative aspect-[2/1] w-full bg-white/5 rounded border border-white/10 overflow-hidden p-4 group">
      {/* Background World Map (Stylized) */}
      <svg 
        viewBox="0 0 1000 500" 
        className="w-full h-full opacity-20 fill-white"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Simplified World Outlines (Abstract) */}
        <path d="M150,100 L250,100 L280,150 L220,200 L120,180 Z" opacity="0.5" /> {/* NA */}
        <path d="M220,220 L300,220 L350,350 L250,400 L200,300 Z" opacity="0.4" /> {/* SA */}
        <path d="M420,80 L550,80 L580,150 L500,200 L420,180 Z" opacity="0.5" /> {/* EU */}
        <path d="M450,220 L580,220 L600,380 L500,400 L450,300 Z" opacity="0.4" /> {/* AF */}
        <path d="M600,100 L850,100 L900,250 L750,350 L600,280 Z" opacity="0.5" /> {/* ASIA */}
        <path d="M820,380 L920,380 L950,450 L850,480 Z" opacity="0.4" /> {/* AUS */}
      </svg>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:10%_10%]" />

      {/* Pulsating Nodes */}
      {NODES.map((node) => (
        <motion.div
          key={node.id}
          className="absolute"
          style={{ left: node.x, top: node.y }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className={`relative flex items-center justify-center`}>
            <div className={`w-1.5 h-1.5 rounded-full z-20 ${
              node.status === 'active' ? 'bg-neon-cyan shadow-[0_0_8px_#06b6d4]' : 'bg-yellow-400 shadow-[0_0_8px_#fbbf24]'
            }`} />
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute w-4 h-4 rounded-full ${
                node.status === 'active' ? 'bg-neon-cyan/30' : 'bg-yellow-400/30'
              }`} 
            />
          </div>
          
          {/* Label on Hover */}
          <div className="absolute top-4 left-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 pointer-events-none">
            <span className="text-[6px] font-mono whitespace-nowrap text-white/60 tracking-widest">{node.id}</span>
          </div>
        </motion.div>
      ))}

      {/* Data Stats HUD */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
        <div className="flex flex-col gap-0.5">
          <span className="text-[6px] font-mono text-white/30 uppercase tracking-[0.2em]">NODE_TRAFFIC</span>
          <div className="flex gap-0.5 h-1">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className={`w-1 rounded-full ${i < 6 ? 'bg-neon-cyan' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[6px] font-mono text-white/30 uppercase tracking-[0.2em]">LATENCY</div>
          <div className="text-[10px] font-mono font-bold text-emerald-400 leading-none">12ms</div>
        </div>
      </div>
      
      {/* Title */}
      <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-sm border border-white/10 flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-neon-cyan animate-pulse" />
        <span className="text-[7px] font-mono text-white/60 uppercase tracking-widest">SURVEILLANCE_MAP_v0.9</span>
      </div>
    </div>
  );
}
