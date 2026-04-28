'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Database, Search, ShieldCheck, Activity, Package, 
  ChevronRight, Calendar, Hash, MapPin, Phone, User,
  LayoutGrid, TrendingUp, DollarSign, Clock, CheckCircle2,
  Truck, Eye, Filter, ArrowUpDown, BarChart3, Zap,
  AlertTriangle, CircleDot, RefreshCw, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── STATUS PIPELINE CONFIG ─── */
const STATUS_CONFIG = {
  PENDING_VALIDATION: { 
    label: 'Pendiente', 
    color: 'amber', 
    icon: Clock, 
    bg: 'bg-amber-500', 
    text: 'text-amber-500',
    border: 'border-amber-500/20',
    bgSoft: 'bg-amber-500/10',
    glow: 'bg-amber-500',
    step: 0
  },
  VERIFIED_READY: { 
    label: 'Validada', 
    color: 'cyan', 
    icon: CheckCircle2, 
    bg: 'bg-neon-cyan', 
    text: 'text-neon-cyan',
    border: 'border-neon-cyan/20',
    bgSoft: 'bg-neon-cyan/10',
    glow: 'bg-neon-cyan',
    step: 1
  },
  IN_PRODUCTION: { 
    label: 'Producción', 
    color: 'purple', 
    icon: Zap, 
    bg: 'bg-purple-500', 
    text: 'text-purple-500',
    border: 'border-purple-500/20',
    bgSoft: 'bg-purple-500/10',
    glow: 'bg-purple-500',
    step: 2
  },
  SHIPPED: { 
    label: 'Enviado', 
    color: 'blue', 
    icon: Truck, 
    bg: 'bg-blue-500', 
    text: 'text-blue-500',
    border: 'border-blue-500/20',
    bgSoft: 'bg-blue-500/10',
    glow: 'bg-blue-500',
    step: 3
  },
  DELIVERED: { 
    label: 'Entregado', 
    color: 'green', 
    icon: ShieldCheck, 
    bg: 'bg-emerald-500', 
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
    bgSoft: 'bg-emerald-500/10',
    glow: 'bg-emerald-500',
    step: 4
  },
};

const PIPELINE_STEPS = ['PENDING_VALIDATION','VERIFIED_READY','IN_PRODUCTION','SHIPPED','DELIVERED'];

/* ─── MINI SPARKLINE ─── */
function Sparkline({ data, color = '#06b6d4', height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={w} height={height} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      <circle cx={parseFloat(points.split(' ').pop().split(',')[0])} cy={parseFloat(points.split(' ').pop().split(',')[1])} r="2.5" fill={color} />
    </svg>
  );
}

/* ─── METRIC CARD ─── */
function MetricCard({ label, value, icon: Icon, color, trend, sparkData, sparkColor, suffix = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className={cn("absolute top-0 right-0 w-28 h-28 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none", color)} />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-2.5 bg-white/[0.04] rounded-xl border border-white/5">
          <Icon size={16} className="text-white/40" />
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-[9px] font-black tracking-wider", trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            <TrendingUp size={10} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-[8px] font-black tracking-[0.25em] text-white/30 uppercase mb-1.5 relative z-10">{label}</p>
      <div className="flex items-end justify-between relative z-10">
        <p className="text-3xl font-black italic tracking-tighter">{value}<span className="text-lg text-white/30">{suffix}</span></p>
        {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
      </div>
    </motion.div>
  );
}

/* ─── STATUS PIPELINE INDICATOR ─── */
function StatusPipeline({ currentStatus }) {
  const currentStep = STATUS_CONFIG[currentStatus]?.step ?? 0;
  return (
    <div className="flex items-center gap-1 w-full">
      {PIPELINE_STEPS.map((step, i) => {
        const config = STATUS_CONFIG[step];
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="relative group/pip">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all",
                isCurrent ? cn(config.bg, "shadow-lg animate-pulse") : isActive ? "bg-white/40" : "bg-white/10"
              )} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/90 border border-white/10 rounded text-[7px] font-black uppercase tracking-wider text-white/60 opacity-0 group-hover/pip:opacity-100 transition-opacity pointer-events-none z-50">
                {config.label}
              </div>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className={cn("flex-1 h-[1px]", i < currentStep ? "bg-white/30" : "bg-white/5")} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── FILTER TABS ─── */
function FilterTabs({ active, onChange, counts }) {
  const tabs = [
    { key: 'ALL', label: 'Todas', icon: LayoutGrid },
    ...PIPELINE_STEPS.map(s => ({ key: s, label: STATUS_CONFIG[s].label, icon: STATUS_CONFIG[s].icon }))
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(tab => {
        const count = tab.key === 'ALL' ? counts.total : (counts[tab.key] || 0);
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border",
              isActive 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-white/[0.02] border-white/5 text-white/30 hover:text-white/50 hover:border-white/10"
            )}
          >
            <tab.icon size={12} />
            {tab.label}
            <span className={cn("ml-1 px-1.5 py-0.5 rounded-md text-[8px]", isActive ? "bg-white/10" : "bg-white/5")}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── ORDER CARD ─── */
function OrderCard({ order, index, onQuickStatus }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_VALIDATION;
  const StatusIcon = config.icon;
  const dateStr = order.createdAt?.toDate ? 
    order.createdAt.toDate().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' }) : 'Sin fecha';
  const timeStr = order.createdAt?.toDate ? 
    order.createdAt.toDate().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '';
  const itemCount = order.items?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/admin/orders?id=${order.id}`}>
        <div className="group relative bg-[#0a0a0a] p-7 rounded-[2rem] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer h-full flex flex-col overflow-hidden">
          
          {/* Glow */}
          <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-0 group-hover:opacity-25 pointer-events-none transition-opacity", config.glow)} />

          {/* Header Row */}
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl border", config.border, config.bgSoft)}>
                <StatusIcon size={14} className={config.text} />
              </div>
              <div>
                <span className="text-[8px] font-black text-white/25 tracking-[0.15em] uppercase font-mono flex items-center gap-1">
                  <Hash size={8} />{order.id.slice(0,10).toUpperCase()}
                </span>
                <div className={cn("text-[8px] font-black tracking-[0.1em] uppercase mt-0.5", config.text)}>
                  {config.label}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black italic tracking-tighter">${order.totalInvestment}</span>
              <span className="text-[8px] block text-white/20 font-mono uppercase">{dateStr}</span>
            </div>
          </div>

          {/* Pipeline */}
          <div className="mb-5 px-1 relative z-10">
            <StatusPipeline currentStatus={order.status} />
          </div>

          {/* Client Info */}
          <div className="space-y-2.5 flex-grow relative z-10">
            <div className="flex items-center gap-3">
              <User size={13} className="text-white/15 shrink-0" />
              <span className="text-sm font-bold uppercase tracking-tight truncate">{order.clientName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={13} className="text-white/15 shrink-0" />
              <span className="text-[10px] font-mono text-white/50 truncate">{order.clientPhone}</span>
            </div>
            {order.zone && order.zone !== 'No especificada' && (
              <div className="flex items-center gap-3">
                <MapPin size={13} className="text-white/15 shrink-0" />
                <span className="text-[10px] font-mono text-white/50 truncate">{order.zone}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[8px] font-black tracking-widest uppercase text-white/25">
                <Package size={10} />{itemCount} {itemCount === 1 ? 'Artefacto' : 'Artefactos'}
              </div>
              {timeStr && (
                <div className="flex items-center gap-1.5 text-[8px] font-black tracking-widest uppercase text-white/25">
                  <Clock size={10} />{timeStr}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase text-neon-cyan opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
              Ver <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Error de sincronización con Nexus:", err);
    } finally {
      setLoading(false);
      if (showRefresh) setTimeout(() => setRefreshing(false), 600);
    }
  }, []);

  useEffect(() => {
    document.title = "Terminal Administrativa // NovaFrame";
    fetchOrders();
  }, [fetchOrders]);

  /* ─── COMPUTED DATA ─── */
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalInvestment) || 0), 0);
    const totalItems = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0);
    const counts = { total: orders.length };
    PIPELINE_STEPS.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });
    
    // Sparkline data: revenue by last 7 orders
    const revenueByOrder = orders.slice(0, 8).map(o => parseFloat(o.totalInvestment) || 0).reverse();
    const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;

    return { totalRevenue, totalItems, counts, revenueByOrder, avgOrderValue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.status === statusFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(term) ||
        o.clientName?.toLowerCase().includes(term) ||
        o.clientPhone?.includes(term) ||
        o.zone?.toLowerCase().includes(term)
      );
    }
    if (sortOrder === 'asc') {
      result = [...result].reverse();
    }
    return result;
  }, [orders, searchTerm, statusFilter, sortOrder]);

  /* ─── LOADING STATE ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 border-t-2 border-r-2 border-neon-cyan rounded-full flex items-center justify-center"
          >
            <Database size={32} className="text-neon-cyan animate-pulse" />
          </motion.div>
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Conectando a Nexus</h2>
            <p className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">Extrayendo Datos Logísticos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-cyan/30 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* ═══ HEADER ═══ */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3 text-neon-cyan mb-4 font-mono text-[10px] tracking-[0.5em] uppercase">
              <ShieldCheck size={14} />
              <span>Nivel_Acceso: Administrador</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Hub <span className="text-white/15">Central</span>
            </h1>
            <p className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase mt-3">
              Sistema de Gestión de Órdenes // Nexus v3.0
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={() => {
                const headers = ['ID', 'Cliente', 'Teléfono', 'Zona', 'Total', 'Estado', 'Fecha', 'Items'];
                const rows = orders.map(o => [
                  o.id,
                  o.clientName,
                  `'${o.clientPhone}`, // Prefix to avoid scientific notation in Excel
                  o.zone || 'N/A',
                  o.totalInvestment,
                  STATUS_CONFIG[o.status]?.label || o.status,
                  o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : 'N/A',
                  (o.items || []).map(item => `${item.name} (${item.size})`).join('; ')
                ]);
                
                const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `novaframe_logistica_${new Date().toISOString().slice(0,10)}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-6 py-3.5 bg-white text-black text-[9px] font-black tracking-[0.2em] uppercase rounded-2xl hover:bg-neon-cyan transition-all flex items-center gap-2 group/export"
            >
              <Database size={14} className="group-hover:rotate-12 transition-transform" />
              Exportar Logística
            </button>

            <div className="relative group flex-1 lg:w-80">
              <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/15 group-focus-within:text-neon-cyan transition-colors" />
              <input 
                type="text"
                placeholder="BUSCAR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl py-3.5 pl-12 pr-10 text-[10px] font-black tracking-[0.15em] placeholder:text-white/15 focus:border-neon-cyan/40 focus:bg-white/[0.04] transition-all outline-none font-mono uppercase"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                  <X size={12} />
                </button>
              )}
            </div>
            <button 
              onClick={() => fetchOrders(true)}
              className={cn("p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all", refreshing && "animate-spin text-neon-cyan")}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* ═══ ANALYTICS ROW ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Órdenes Totales" 
            value={analytics.counts.total} 
            icon={Package} 
            color="bg-neon-cyan"
          />
          <MetricCard 
            label="Ingresos Totales" 
            value={`$${analytics.totalRevenue.toLocaleString('es-MX')}`} 
            icon={DollarSign} 
            color="bg-emerald-500"
            sparkData={analytics.revenueByOrder}
            sparkColor="#34d399"
          />
          <MetricCard 
            label="Ticket Promedio" 
            value={`$${Math.round(analytics.avgOrderValue).toLocaleString('es-MX')}`} 
            icon={BarChart3} 
            color="bg-purple-500"
          />
          <MetricCard 
            label="Artefactos Totales" 
            value={analytics.totalItems} 
            icon={LayoutGrid} 
            color="bg-amber-500"
          />
        </div>

        {/* ═══ STATUS SUMMARY BAR ═══ */}
        <div className="p-5 bg-white/[0.015] border border-white/5 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={12} className="text-white/20" />
            <span className="text-[8px] font-black tracking-[0.3em] text-white/25 uppercase">Pipeline de Estado</span>
          </div>
          <div className="flex items-center gap-2">
            {PIPELINE_STEPS.map((step, i) => {
              const config = STATUS_CONFIG[step];
              const count = analytics.counts[step] || 0;
              const pct = analytics.counts.total > 0 ? (count / analytics.counts.total * 100) : 0;
              return (
                <React.Fragment key={step}>
                  <button 
                    onClick={() => setStatusFilter(statusFilter === step ? 'ALL' : step)}
                    className={cn(
                      "flex-1 p-3 rounded-2xl border transition-all text-center",
                      statusFilter === step ? cn(config.border, config.bgSoft) : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                    )}
                  >
                    <div className={cn("text-lg font-black italic", statusFilter === step ? config.text : "text-white/60")}>{count}</div>
                    <div className="text-[7px] font-black tracking-[0.15em] text-white/25 uppercase mt-0.5">{config.label}</div>
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className={cn("h-full rounded-full", config.bg)}
                      />
                    </div>
                  </button>
                  {i < PIPELINE_STEPS.length - 1 && <ChevronRight size={10} className="text-white/10 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ═══ FILTERS + SORT ═══ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <FilterTabs active={statusFilter} onChange={setStatusFilter} counts={analytics.counts} />
          <button 
            onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-wider text-white/30 border border-white/5 bg-white/[0.02] hover:text-white/50 hover:border-white/10 transition-all"
          >
            <ArrowUpDown size={12} />
            {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguas'}
          </button>
        </div>

        {/* ═══ ORDERS GRID ═══ */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CircleDot size={14} className="text-white/20" />
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
                Registro de Órdenes
              </h2>
              <span className="px-2 py-0.5 bg-white/5 rounded-lg text-[9px] font-black text-white/30">
                {filteredOrders.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full py-20 text-center border border-white/5 rounded-[3rem] bg-white/[0.01]"
                >
                  <Search size={28} className="text-white/15 mx-auto mb-4" />
                  <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                    {searchTerm ? 'Sin resultados para esta búsqueda' : 'No hay órdenes en esta categoría'}
                  </p>
                  {(searchTerm || statusFilter !== 'ALL') && (
                    <button 
                      onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                      className="mt-4 text-[9px] font-black tracking-widest text-neon-cyan/60 hover:text-neon-cyan uppercase transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </motion.div>
              ) : (
                filteredOrders.map((order, idx) => (
                  <OrderCard key={order.id} order={order} index={idx} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-[8px] font-black tracking-[0.3em] text-white/15 uppercase">
            <Database size={10} />
            <span>Nexus Database // Firestore Sync Active</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[8px] font-mono text-white/10 tracking-wider uppercase">
            NovaFrame Admin Terminal v3.0 // {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
