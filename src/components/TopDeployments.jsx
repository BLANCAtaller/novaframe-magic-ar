'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ChevronRight,
  Database,
  Layers,
  Terminal as TerminalIcon,
  Filter,
  Package,
  RotateCcw,
  Truck,
  Headset,
  Maximize2,
  Grid,
  Globe,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Eye,
  Star,
  ArrowUpRight,
  Sparkles,
  X
} from 'lucide-react';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/types';
import Image from 'next/image';
import { useTerminal } from '@/contexts/TerminalContext';
import CustomDesign from './CustomDesign';
import { cn, formatNumber } from '@/lib/utils';
import dynamic from 'next/dynamic';

const TechSpecs = dynamic(() => import('./TechSpecs'), {
  loading: () => <div className="h-96 bg-black" />,
  ssr: false
});

const SHAPES = ['Cuadrado', 'Horizontal', 'Vertical', 'Panoramico'];
const THEMES = ['Abstracto', 'Cine', 'Música', 'Cultura Geek'];
const SORT_OPTIONS = [
  { label: 'MÁS VENDIDOS', value: 'sales' },
  { label: 'RECIENTES', value: 'recent' },
];

const RARITY_COLORS = {
  'Zenith': { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]' },
  'Legendary': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-[0_0_12px_rgba(250,204,21,0.4)]' },
  'Epic': { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', text: 'text-fuchsia-400', glow: 'shadow-[0_0_12px_rgba(192,38,211,0.4)]' },
  'Common': { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/50', glow: '' },
};

export default function TopDeployments() {
  useEffect(() => {
    document.title = "Catálogo // Despliegues — NovaFrame";
  }, []);

  const [selectedShape, setSelectedShape] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState([]);
  const [selectedRarity, setSelectedRarity] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const { openProduct } = useTerminal();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allProducts = useMemo(() => {
    let result = SAMPLE_PRODUCTS
      .filter(p => selectedShape.length === 0 || selectedShape.includes(p.shape))
      .filter(p => selectedTheme.length === 0 || selectedTheme.includes(p.theme))
      .filter(p => selectedRarity.length === 0 || selectedRarity.includes(p.rarity))
      .filter(p => !searchQuery || (p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())));

    switch (sortBy) {
      case 'sales': return result.sort((a, b) => b.salesCount - a.salesCount);
      case 'recent': return result.sort((a, b) => b.id.localeCompare(a.id));
      default: return result;
    }
  }, [selectedShape, selectedTheme, selectedRarity, searchQuery, sortBy]);

  const bestSellers = useMemo(() => SAMPLE_PRODUCTS.filter(p => p.isBestSeller).sort((a, b) => b.salesCount - a.salesCount).slice(0, 4), []);

  const toggleFilter = (item, state, setState) => {
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const clearAllFilters = () => {
    setSelectedShape([]);
    setSelectedTheme([]);
    setSelectedRarity([]);
    setSearchQuery('');
    setSortBy('sales');
  };

  const activeFilterCount = selectedShape.length + selectedTheme.length + selectedRarity.length + (searchQuery ? 1 : 0);

  // Sidebar filter component (reused for mobile drawer)
  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-cyan transition-colors" size={16} />
          <input 
            type="text"
            placeholder="BUSCAR ARTEFACTO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-cyan/40 focus:bg-white/[0.08] transition-all placeholder:text-white/15 text-xs font-bold tracking-widest text-white"
          />
        </div>
      </div>

      {/* Theme Filter */}
      <div>
        <h3 className="text-[10px] font-bold mb-4 flex items-center gap-2 text-white/40 tracking-[0.2em] uppercase">
          <Star size={12} className="text-yellow-400" /> RAREZA
        </h3>
        <div className="space-y-2">
          {Object.keys(RARITY_COLORS).map(rarity => (
            <button key={rarity} onClick={() => toggleFilter(rarity, selectedRarity, setSelectedRarity)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-[10px] font-mono",
                selectedRarity.includes(rarity) 
                  ? cn(RARITY_COLORS[rarity].bg, RARITY_COLORS[rarity].border, RARITY_COLORS[rarity].text)
                  : "bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/[0.06]"
              )}>
              <span className="font-bold tracking-widest">{rarity.toUpperCase()}</span>
              {selectedRarity.includes(rarity) && <div className={cn("w-2 h-2 rounded-full", RARITY_COLORS[rarity].text, "bg-current")} />}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Filter */}
      <div>
        <h3 className="text-[10px] font-bold mb-4 flex items-center gap-2 text-white/40 tracking-[0.2em] uppercase">
          <Grid size={12} className="text-neon-pink" /> COLECCIÓN
        </h3>
        <div className="space-y-2">
          {THEMES.map(theme => (
            <button key={theme} onClick={() => toggleFilter(theme, selectedTheme, setSelectedTheme)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-[10px] font-mono font-bold",
                selectedTheme.includes(theme) 
                  ? "bg-neon-pink/10 border-neon-pink/40 text-neon-pink"
                  : "bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/[0.06]"
              )}>
              <span>{theme.toUpperCase()}</span>
              {selectedTheme.includes(theme) && <div className="w-2 h-2 rounded-full bg-neon-pink" />}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      {activeFilterCount > 0 && (
        <button onClick={clearAllFilters} className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-mono text-white/40 hover:text-white hover:border-white/30 transition-all tracking-widest uppercase">
          LIMPIAR FILTROS ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-neon-cyan/30 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(192,38,211,0.05),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 pt-8 pb-20">

        {/* ═══════════════════════════════════════════ */}
        {/* HERO HEADER */}
        {/* ═══════════════════════════════════════════ */}
        <header className="pt-8 pb-16 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-neon-cyan mb-6 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Activity size={12} className="animate-pulse" />
            <span>CATÁLOGO NOVAFRAME // {allProducts.length} ARTEFACTOS</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-[6rem] font-black tracking-tighter leading-[0.85] mb-6">
            NUESTRA <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink">COLECCIÓN</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
            Cuadros de arte pop y cultura visual, impresas en canvas de alta fidelidad. Cada pieza es única, limitada, y lista para transformar cualquier espacio.
          </motion.p>
        </header>

        {/* ═══════════════════════════════════════════ */}
        {/* FEATURED / BESTSELLERS SHOWCASE */}
        {/* ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-neon-pink" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Más Vendidos</h2>
            </div>
            <div className="text-[10px] font-mono text-white/20 tracking-widest uppercase hidden md:block">
              TOP_{bestSellers.length}_ARTIFACTS
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => openProduct(product)}
                className="group cursor-pointer relative"
              >
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-2 z-20">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-sm rounded-lg shadow-[0_4px_20px_rgba(255,255,255,0.2)]">
                    {idx + 1}
                  </div>
                </div>

                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 group-hover:border-white/30 transition-all duration-500 bg-[#050505]">
                  <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Rarity Pill */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-md",
                      RARITY_COLORS[product.rarity]?.bg, RARITY_COLORS[product.rarity]?.border, RARITY_COLORS[product.rarity]?.text, RARITY_COLORS[product.rarity]?.glow
                    )}>{product.rarity}</span>
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">{product.category || 'GENERAL'}</div>
                    <h3 className="text-lg font-black tracking-tight text-white mb-3 leading-tight uppercase group-hover:text-neon-cyan transition-colors">{product.name || 'UNKNOWN ARTIFACT'}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-white/40 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <Eye size={12} className="text-neon-cyan" /> {product.salesCount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 pointer-events-none">
                    <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black tracking-widest uppercase text-white">
                      VER DETALLE <ArrowUpRight size={12} className="inline ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* MAIN CATALOG: SIDEBAR + GRID */}
        {/* ═══════════════════════════════════════════ */}
        <section id="all-artifacts">
          {/* Section Header + Sort + Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Todos los Artefactos</h2>
              <div className="text-[10px] font-mono text-white/20 tracking-widest mt-2 uppercase">{allProducts.length} RESULTADOS</div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors relative">
                <Filter size={14} /> FILTROS
                {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neon-pink text-white font-black text-[8px] rounded-full flex items-center justify-center">{activeFilterCount}</span>}
              </button>
              {/* Sort Buttons */}
              <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-xl p-1">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-[9px] font-black tracking-widest transition-all",
                      sortBy === opt.value ? "bg-white text-black" : "text-white/30 hover:text-white/60"
                    )}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <AnimatePresence mode='popLayout'>
                {allProducts.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                    <div className="text-5xl mb-6 opacity-20">∅</div>
                    <h3 className="text-xl font-black tracking-tight mb-2 text-white/60">SIN RESULTADOS</h3>
                    <p className="text-sm text-white/30 mb-8">Ajusta los filtros para explorar más artefactos.</p>
                    <button onClick={clearAllFilters} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-white/50 hover:text-white hover:border-white/20 transition-all tracking-widest uppercase">
                      RESETEAR FILTROS
                    </button>
                  </motion.div>
                ) : (
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {allProducts.map((product, idx) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        onClick={() => openProduct(product)}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] group-hover:border-white/20 transition-all duration-500 bg-[#080808]">
                          {/* Image */}
                          <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#050505]">
                            <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-contain transition-transform duration-700 group-hover:scale-105" />
                            
                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
                            
                            {/* Rarity */}
                            <div className="absolute top-4 left-4 z-10">
                              <span className={cn("px-2.5 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase border backdrop-blur-sm",
                                RARITY_COLORS[product.rarity]?.bg, RARITY_COLORS[product.rarity]?.border, RARITY_COLORS[product.rarity]?.text
                              )}>{product.rarity}</span>
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                              <button className="w-9 h-9 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-neon-pink hover:border-neon-pink/30 transition-all">
                                <Heart size={14} />
                              </button>
                              <button className="w-9 h-9 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all">
                                <ShoppingCart size={14} />
                              </button>
                            </div>

                            {/* Bottom CTA Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-16 group-hover:translate-y-0 transition-transform duration-500">
                              <button className="w-full py-3.5 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-neon-cyan transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                CONFIGURAR <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{product.category || 'GENERAL'}</span>
                              <span className="text-[8px] font-mono text-white/15 uppercase">{product.shape || 'STANDAR'}</span>
                            </div>
                            <h3 className="text-base font-black tracking-tight text-white mb-3 uppercase group-hover:text-neon-cyan transition-colors leading-tight">{product.name || 'UNKNOWN ARTIFACT'}</h3>
                            <p className="text-[11px] text-white/30 leading-relaxed line-clamp-2 mb-4">{product.description || 'No data available.'}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <div className="flex items-center gap-3 text-[9px] font-mono text-white/20">
                                <span className="flex items-center gap-1"><Eye size={10} /> {formatNumber(product.salesCount)}</span>
                                <span className="flex items-center gap-1"><Database size={10} /> {product.nodeId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Removed CustomDesign from here to move it to Laboratorio */}

        {/* ═══════════════════════════════════════════ */}
        {/* TECH SPECS — MOVED FROM HOME */}
        {/* ═══════════════════════════════════════════ */}
        <TechSpecs />

        {/* ═══════════════════════════════════════════ */}
        {/* TRUST / BENEFITS BAR */}
        {/* ═══════════════════════════════════════════ */}
        <section className="mt-40 pt-24 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-10 py-2 flex items-center gap-6 text-[11px] font-black text-white/20 whitespace-nowrap tracking-[0.5em] border border-white/5 rounded-full backdrop-blur-xl">
            <span className="w-16 h-[2px] bg-gradient-to-r from-transparent to-white/10" />
            SECURE_TRUST_PROTOCOL_v4.2
            <span className="w-16 h-[2px] bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Truck, 
                title: 'ENVÍO EXPRESS', 
                desc: 'Transmisión física priorizada a todo el territorio nacional con seguimiento en tiempo real.', 
                tag: 'LOGÍSTICA',
                color: 'cyan',
                techId: 'L-PATH_44',
                glow: 'shadow-[0_0_40px_rgba(6,182,212,0.1)]',
                classes: {
                  border: 'border-cyan-500/20 md:border-white/5 md:hover:border-cyan-500/40',
                  bg: 'bg-cyan-500/5 md:bg-white/[0.01] md:hover:bg-cyan-500/[0.02]',
                  iconBg: 'bg-cyan-500/20 md:bg-white/5 md:group-hover:bg-cyan-500/20',
                  iconText: 'text-cyan-400 md:text-white md:group-hover:text-cyan-400',
                  title: 'text-cyan-400 md:text-white md:group-hover:text-cyan-400',
                  accent: 'bg-cyan-500'
                }
              },
              { 
                icon: RotateCcw, 
                title: 'CAMBIOS GRATIS', 
                desc: 'Protocolo de re-sincronización activo por 30 días sin coste en todos los activos físicos.', 
                tag: 'GARANTÍA',
                color: 'fuchsia',
                techId: 'R-SYNC_01',
                glow: 'shadow-[0_0_40px_rgba(217,70,239,0.1)]',
                classes: {
                  border: 'border-fuchsia-500/20 md:border-white/5 md:hover:border-fuchsia-500/40',
                  bg: 'bg-fuchsia-500/5 md:bg-white/[0.01] md:hover:bg-fuchsia-500/[0.02]',
                  iconBg: 'bg-fuchsia-500/20 md:bg-white/5 md:group-hover:bg-fuchsia-500/20',
                  iconText: 'text-fuchsia-400 md:text-white md:group-hover:text-fuchsia-400',
                  title: 'text-fuchsia-400 md:text-white md:group-hover:text-fuchsia-400',
                  accent: 'bg-fuchsia-500'
                }
              },
              { 
                icon: Headset, 
                title: 'SOPORTE DIRECTO', 
                desc: 'Consola de soporte técnica activa 24/5 para resolución inmediata de incidencias.', 
                tag: 'ASISTENCIA',
                color: 'amber',
                techId: 'T-CORE_SUP',
                glow: 'shadow-[0_0_40px_rgba(245,158,11,0.1)]',
                classes: {
                  border: 'border-amber-500/20 md:border-white/5 md:hover:border-amber-500/40',
                  bg: 'bg-amber-500/5 md:bg-white/[0.01] md:hover:bg-amber-500/[0.02]',
                  iconBg: 'bg-amber-500/20 md:bg-white/5 md:group-hover:bg-amber-500/20',
                  iconText: 'text-amber-400 md:text-white md:group-hover:text-amber-400',
                  title: 'text-amber-400 md:text-white md:group-hover:text-amber-400',
                  accent: 'bg-amber-500'
                }
              },
              { 
                icon: Package, 
                title: 'CALIDAD ZENITH', 
                desc: 'Impresión ultra-HD con 12 canales de color en materiales canvas y lona de alta resistencia.', 
                tag: 'CALIDAD',
                color: 'emerald',
                techId: 'Q-NODE_MAX',
                glow: 'shadow-[0_0_40px_rgba(16,185,129,0.1)]',
                classes: {
                  border: 'border-emerald-500/20 md:border-white/5 md:hover:border-emerald-500/40',
                  bg: 'bg-emerald-500/5 md:bg-white/[0.01] md:hover:bg-emerald-500/[0.02]',
                  iconBg: 'bg-emerald-500/20 md:bg-white/5 md:group-hover:bg-emerald-500/20',
                  iconText: 'text-emerald-400 md:text-white md:group-hover:text-emerald-400',
                  title: 'text-emerald-400 md:text-white md:group-hover:text-emerald-400',
                  accent: 'bg-emerald-500'
                }
              }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={cn(
                  "group p-10 rounded-3xl transition-all duration-700 relative overflow-hidden cursor-pointer",
                  benefit.classes.bg,
                  benefit.classes.border,
                  benefit.glow
                )}
              >
                {/* Background Tech Accent */}
                <div className={cn(
                  "absolute -right-4 -bottom-4 transition-opacity duration-700",
                  benefit.classes.iconText,
                  isMobile ? "opacity-[0.05]" : "opacity-[0.02] group-hover:opacity-[0.08]"
                )}>
                  <benefit.icon size={160} strokeWidth={1} />
                </div>

                <div className="relative z-10">
                  <div className="mb-8 flex items-center justify-between">
                    <div className={cn(
                      "p-5 rounded-2xl transition-all duration-500 shadow-2xl",
                      benefit.classes.iconBg,
                      benefit.classes.iconText,
                      !isMobile && "group-hover:scale-110"
                    )}>
                      <benefit.icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-mono text-white/10 tracking-widest">{benefit.techId}</span>
                  </div>

                  <h3 className={cn(
                    "text-xl font-black tracking-tighter mb-4 uppercase transition-colors duration-500",
                    benefit.classes.title
                  )}>
                    {benefit.title}
                  </h3>
                  
                  <p className="text-[12px] text-white/30 leading-relaxed group-hover:text-white/60 transition-colors duration-500 mb-8 max-w-[90%]">
                    {benefit.desc}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className={cn(
                      "text-[9px] font-mono tracking-[0.4em] uppercase transition-colors duration-500",
                      isMobile ? benefit.classes.iconText : "text-white/15 group-hover:text-white/40",
                      !isMobile && `group-hover:text-${benefit.color}-400/50`
                    )}>
                      {benefit.tag}
                    </span>
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", isMobile ? benefit.classes.accent : "bg-white/10 group-hover:bg-current", !isMobile && `group-hover:bg-${benefit.color}-500 group-hover:animate-pulse`)} />
                  </div>
                </div>

                {/* Corner Decor */}
                <div className={cn(
                  "absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity",
                  `bg-gradient-to-bl from-${benefit.color}-500/20 to-transparent`
                )} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* FOOTER METADATA */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono tracking-widest text-white/15">
          <div className="flex flex-wrap justify-center gap-8">
            <span className="flex items-center gap-2"><TerminalIcon size={10}/> DATA: STABLE</span>
            <span className="flex items-center gap-2"><Layers size={10}/> CRYPTO: AES-256</span>
            <span className="flex items-center gap-2"><Globe size={10}/> RENDER: ULTRA-HD</span>
          </div>
          <span>NOVAFRAME_v4.0 // 2026</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* MOBILE FILTER DRAWER */}
      {/* ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={() => setIsMobileFilterOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-[#0a0a0a] border-r border-white/10 z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black tracking-widest uppercase">FILTROS</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <FilterPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
