'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  Shield, 
  Zap, 
  Layers, 
  Cpu,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/types';

const RARITIES = ['All', 'Zenith', 'Legendary', 'Epic', 'Common'];

export default function MarketplaceSidebar({ onFilterChange, activeCategory, activeRarity }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [glitchLevel, setGlitchLevel] = useState(45);
  const [chromaLevel, setChromaLevel] = useState(72);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '320px' }}
      className="relative h-[calc(100vh-120px)] sticky top-24 z-30 transition-all duration-500 ease-in-out"
    >
      <div className="absolute inset-y-0 right-0 left-0 glass-dark border border-white/10 rounded-[2rem] flex flex-col overflow-hidden">
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] z-50 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Sidebar Content */}
        <div className={cn(
          "p-8 flex flex-col h-full transition-opacity duration-300",
          isCollapsed ? "opacity-0 invisible pointer-events-none" : "opacity-100"
        )}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-neon-cyan/10 rounded-xl text-neon-cyan">
              <Filter size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tighter text-white">Filtros de Sector</h3>
              <p className="text-[10px] text-white/30 font-mono uppercase">Zenith_Refinement.v4</p>
            </div>
          </div>

          <div className="space-y-10 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {/* Categories */}
            <section>
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Layers size={12} /> Colecciones
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => onFilterChange('category', 'All')}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border",
                    activeCategory === 'All' 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 text-white/60 border-transparent hover:border-white/20"
                  )}
                >
                  Todos los Artefactos
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => onFilterChange('category', cat)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border",
                      activeCategory === cat 
                        ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50" 
                        : "bg-white/5 text-white/60 border-transparent hover:border-white/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Rarity */}
            <section>
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Shield size={12} /> Grado de Integridad
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {RARITIES.map(rarity => (
                  <button
                    key={rarity}
                    onClick={() => onFilterChange('rarity', rarity)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                      activeRarity === rarity
                        ? "bg-neon-pink/20 text-neon-pink border-neon-pink/50"
                        : "bg-white/5 text-white/40 border-transparent hover:border-white/10"
                    )}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </section>

            {/* System Sliders (Aesthetic Only) */}
            <section className="space-y-6">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Cpu size={12} /> Telemetría Visual
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2">
                    <span>GLITCH_DENSITY</span>
                    <span>{glitchLevel}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={glitchLevel}
                    onChange={(e) => setGlitchLevel(e.target.value)}
                    className="w-full accent-neon-cyan"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2">
                    <span>CHROMA_YIELD</span>
                    <span>{chromaLevel}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={chromaLevel}
                    onChange={(e) => setChromaLevel(e.target.value)}
                    className="w-full accent-neon-pink"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer - System Info */}
          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="flex items-center justify-between text-[9px] font-mono mb-2">
                <span className="text-white/20">NODE_STATUS:</span>
                <span className="text-neon-cyan animate-pulse">OPTIMIZED</span>
             </div>
             <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-white/20">SYSTEM_LOAD:</span>
                <span className="text-white">12.4%</span>
             </div>
          </div>
        </div>

        {/* Collapsed View Mini Icons */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-10 gap-8 h-full">
            <div className="p-3 bg-neon-cyan/20 text-neon-cyan rounded-full">
              <Zap size={20} />
            </div>
            <div className="space-y-6 flex flex-col items-center opacity-30">
              <Database size={20} />
              <Shield size={20} />
              <Layers size={20} />
              <Activity size={20} />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
