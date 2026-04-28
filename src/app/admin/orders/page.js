'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, User, Phone, MapPin, Package, Activity, AlertCircle,
  ChevronLeft, Calendar, CreditCard, Hash, Download, CheckCircle2,
  Clock, Truck, Zap, ChevronRight, MessageSquare, Eye, Copy
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ─── STATUS CONFIG ─── */
const STATUS_CONFIG = {
  PENDING_VALIDATION: { label: 'Pendiente de Validación', short: 'Pendiente', icon: Clock, text: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500/20', bgSoft: 'bg-amber-500/10', step: 0 },
  VERIFIED_READY: { label: 'Validada y Lista', short: 'Validada', icon: CheckCircle2, text: 'text-neon-cyan', bg: 'bg-neon-cyan', border: 'border-neon-cyan/20', bgSoft: 'bg-neon-cyan/10', step: 1 },
  IN_PRODUCTION: { label: 'En Producción', short: 'Producción', icon: Zap, text: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500/20', bgSoft: 'bg-purple-500/10', step: 2 },
  SHIPPED: { label: 'Enviado al Cliente', short: 'Enviado', icon: Truck, text: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/20', bgSoft: 'bg-blue-500/10', step: 3 },
  DELIVERED: { label: 'Entregado', short: 'Entregado', icon: ShieldCheck, text: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500/20', bgSoft: 'bg-emerald-500/10', step: 4 },
};
const PIPELINE = ['PENDING_VALIDATION','VERIFIED_READY','IN_PRODUCTION','SHIPPED','DELIVERED'];

/* ─── STATUS TIMELINE ─── */
function StatusTimeline({ currentStatus, onAdvance, onRevert }) {
  const currentStep = STATUS_CONFIG[currentStatus]?.step ?? 0;
  const canAdvance = currentStep < PIPELINE.length - 1;
  const canRevert = currentStep > 0;
  const nextStatus = canAdvance ? PIPELINE[currentStep + 1] : null;
  const prevStatus = canRevert ? PIPELINE[currentStep - 1] : null;

  return (
    <div className="space-y-8">
      {/* Visual Pipeline */}
      <div className="flex items-center gap-0 w-full">
        {PIPELINE.map((step, i) => {
          const config = STATUS_CONFIG[step];
          const Icon = config.icon;
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2 relative">
                <motion.div 
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all",
                    isCurrent ? cn(config.border, config.bgSoft, "shadow-lg") : isCompleted ? "border-white/20 bg-white/10" : "border-white/5 bg-white/[0.02]"
                  )}
                >
                  <Icon size={16} className={cn(isCurrent ? config.text : isCompleted ? "text-white/50" : "text-white/15")} />
                </motion.div>
                <span className={cn("text-[6px] sm:text-[7px] font-black uppercase tracking-wider text-center w-12 sm:w-16", isCurrent ? config.text : "text-white/20")}>
                  {config.short}
                </span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className={cn("flex-1 h-[2px] mx-1 rounded-full -mt-5", i < currentStep ? "bg-white/20" : "bg-white/5")} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {canRevert && (
          <button 
            onClick={() => onRevert(prevStatus)}
            className="flex-1 py-4 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase border border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={14} /> Retroceder a {STATUS_CONFIG[prevStatus].short}
          </button>
        )}
        {canAdvance && (
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAdvance(nextStatus)}
            className={cn(
              "flex-1 py-4 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2",
              STATUS_CONFIG[nextStatus].bg, "text-black hover:opacity-90 shadow-lg"
            )}
          >
            Avanzar a {STATUS_CONFIG[nextStatus].short} <ChevronRight size={14} />
          </motion.button>
        )}
        {!canAdvance && (
          <div className="flex-1 py-4 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> Orden Completada
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── INFO FIELD ─── */
function InfoField({ label, value, icon: Icon, accent = false, href }) {
  const content = (
    <div className="space-y-1.5">
      <span className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase">{label}</span>
      <p className={cn("text-lg font-bold uppercase flex items-center gap-2.5 leading-tight", accent ? "text-neon-cyan" : "text-white/80")}>
        {Icon && <Icon size={16} className={accent ? "text-neon-cyan" : "text-white/20"} />}
        {value || 'N/A'}
      </p>
    </div>
  );
  if (href) return <a href={href} className="hover:opacity-70 transition-all block">{content}</a>;
  return content;
}

/* ─── MAIN CONTENT ─── */
function AdminOrderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("ORDEN NO ENCONTRADA EN EL NEXUS");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("FALLO CRÍTICO EN LA CONEXIÓN");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, "orders", id), { 
        status: newStatus,
        [`statusHistory.${newStatus}`]: now
      });
      setOrder(prev => ({ 
        ...prev, 
        status: newStatus,
        statusHistory: {
          ...(prev.statusHistory || {}),
          [newStatus]: now
        }
      }));

      // Auto-send WhatsApp notification to client
      if (order?.clientPhone) {
        const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
        const msg = encodeURIComponent(
          `🔔 *ACTUALIZACIÓN DE ORDEN - NOVAFRAME*\n\nHola ${order.clientName},\nTu orden #${order.id.slice(0,8).toUpperCase()} ha sido actualizada.\n\n📦 Estado actual: *${statusLabel}*\n💰 Total: $${order.totalInvestment}\n\n_Gracias por confiar en NovaFrame._`
        );
        window.open(`https://wa.me/${order.clientPhone}?text=${msg}`, '_blank');
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setTimeout(() => setUpdating(false), 400);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hola ${order.clientName}, tu orden de NovaFrame #${order.id.slice(0,8).toUpperCase()} ha sido actualizada.\n\nEstado actual: ${STATUS_CONFIG[order.status]?.label}\nTotal: $${order.totalInvestment}\n\nGracias por tu preferencia.`
    );
    window.open(`https://wa.me/${order.clientPhone}?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Activity size={36} className="text-neon-cyan animate-spin" />
          <p className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Sincronizando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 rounded-[3rem] p-12 text-center">
          <AlertCircle size={42} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{error}</h1>
          <Link href="/admin" className="text-[10px] font-black tracking-widest text-white/40 hover:text-neon-cyan uppercase transition-colors">
            Volver al Hub Central
          </Link>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_VALIDATION;
  const StatusIcon = config.icon;
  const dateStr = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Sin fecha';

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 pt-28 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ═══ TOP NAV ═══ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link href="/admin" className="group flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase text-white/30 hover:text-neon-cyan transition-all">
            <div className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-neon-cyan/40 transition-all">
              <ChevronLeft size={14} />
            </div>
            Hub Central
          </Link>
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border", config.border, config.bgSoft)}>
              <StatusIcon size={12} className={config.text} />
              <span className={cn("text-[9px] font-black tracking-wider uppercase", config.text)}>{config.short}</span>
            </div>
            {updating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[9px] text-neon-cyan font-black tracking-wider uppercase">
                <Activity size={12} className="animate-spin" /> Actualizando...
              </motion.div>
            )}
          </div>
        </div>

        {/* ═══ MAIN CARD ═══ */}
        <div className="bg-[#080808] border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-white/[0.06] bg-white/[0.015]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 text-neon-cyan mb-3">
                  <ShieldCheck size={16} />
                  <span className="text-[9px] font-black tracking-[0.4em] uppercase">NovaFrame // Orden de Despliegue</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Orden #{order.id.slice(0,8).toUpperCase()}
                </h1>
              </div>
              <div className="text-left lg:text-right space-y-3">
                <div>
                  <span className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase block">ID Completo</span>
                  <button onClick={copyOrderId} className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-all group">
                    {order.id} <Copy size={12} className="opacity-0 group-hover:opacity-100" />
                    {copied && <span className="text-neon-cyan text-[8px] font-black">Copiado!</span>}
                  </button>
                </div>
                <div>
                  <span className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase block">Fecha</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                    <Calendar size={12} /> {dateStr}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0">
            
            {/* ─── LEFT SIDEBAR ─── */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/[0.06] p-6 md:p-10 space-y-10">
              
              {/* Client Data */}
              <div>
                <h3 className="text-[9px] font-black tracking-[0.3em] text-neon-cyan uppercase mb-6 pb-3 border-b border-neon-cyan/15">
                  01 // Datos del Cliente
                </h3>
                <div className="space-y-6">
                  <InfoField label="Nombre" value={order.clientName} icon={User} />
                  <InfoField label="Teléfono" value={order.clientPhone} icon={Phone} accent href={`tel:${order.clientPhone}`} />
                  <InfoField label="Zona" value={order.zone} icon={MapPin} />
                </div>
              </div>

              {/* Status Pipeline */}
              <div>
                <h3 className="text-[9px] font-black tracking-[0.3em] text-neon-cyan uppercase mb-6 pb-3 border-b border-neon-cyan/15">
                  02 // Pipeline de Estado
                </h3>
                <StatusTimeline 
                  currentStatus={order.status} 
                  onAdvance={updateStatus} 
                  onRevert={updateStatus} 
                />
              </div>

              {/* Status History Log */}
              {order.statusHistory && Object.keys(order.statusHistory).length > 0 && (
                <div>
                  <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase mb-6 pb-3 border-b border-white/5">
                    Historial de Estados
                  </h3>
                  <div className="space-y-3">
                    {PIPELINE.filter(step => order.statusHistory[step]).map((step, i) => {
                      const cfg = STATUS_CONFIG[step];
                      const Icon = cfg.icon;
                      const date = new Date(order.statusHistory[step]);
                      const dateFormatted = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
                      const timeFormatted = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                      return (
                        <motion.div 
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn("flex items-start gap-3 p-3 rounded-xl border", cfg.border, cfg.bgSoft)}
                        >
                          <Icon size={14} className={cn(cfg.text, "mt-0.5 shrink-0")} />
                          <div className="min-w-0">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider block", cfg.text)}>{cfg.short}</span>
                            <span className="text-[8px] font-mono text-white/30">{dateFormatted} — {timeFormatted}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase mb-6 pb-3 border-b border-white/5">
                  03 // Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={openWhatsApp}
                    className="w-full py-3.5 rounded-xl font-black text-[9px] tracking-[0.15em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={13} /> Contactar por WhatsApp
                  </button>
                  <button className="w-full py-3.5 rounded-xl font-black text-[9px] tracking-[0.15em] uppercase bg-white/[0.03] border border-white/5 text-white/30 hover:text-white/50 hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
                    <Download size={13} /> Descargar Manifiesto
                  </button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: MANIFEST ─── */}
            <div className="p-8 md:p-10 flex flex-col">
              <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase mb-6 pb-3 border-b border-white/5">
                Manifiesto de Carga // {order.items?.length || 0} Artefactos
              </h3>
              
              <div className="space-y-4 flex-grow">
                {order.items?.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="group relative bg-white/[0.015] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-center hover:bg-white/[0.03] hover:border-white/10 transition-all overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={item.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-white/15" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow text-center sm:text-left space-y-1.5">
                      <h4 className="text-lg font-black italic uppercase tracking-tighter">{item.name}</h4>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {item.size && (
                          <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[8px] font-bold text-white/35 border border-white/5 uppercase tracking-widest">{item.size}</span>
                        )}
                        {item.finish && (
                          <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[8px] font-bold text-white/35 border border-white/5 uppercase tracking-widest">{item.finish}</span>
                        )}
                        {item.variant && (
                          <span className="px-2.5 py-1 bg-neon-pink/10 rounded-lg text-[8px] font-bold text-neon-pink/60 border border-neon-pink/15 uppercase tracking-widest">{item.variant}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-center sm:text-right shrink-0">
                      <span className="text-[7px] font-black text-white/15 uppercase tracking-[0.3em] block mb-0.5">Inversión</span>
                      <span className="text-2xl font-black font-mono tracking-tighter">${item.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-8 pt-8 border-t border-white/[0.06]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Inversión Total</span>
                    <p className="text-[9px] font-mono text-white/25 uppercase max-w-sm">
                      Valor consolidado bajo protocolos Zenith v3.0
                    </p>
                  </div>
                  <span className="text-5xl md:text-6xl font-black text-neon-cyan italic tracking-tighter leading-none neon-text">
                    ${order.totalInvestment}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-8 py-5 bg-white/[0.02] border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-neon-cyan" />
                <span className="text-[8px] font-black tracking-widest uppercase text-white/25 italic">NovaFrame // Certified Asset</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black tracking-widest uppercase text-white/15">Nexus Active</span>
              </div>
            </div>
            <span className="text-[8px] font-mono text-white/10 tracking-wider uppercase">
              Admin Terminal v3.0
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .neon-text { text-shadow: 0 0 30px rgba(6, 182, 212, 0.25); }
      `}</style>
    </div>
  );
}

export default function AdminOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Activity size={36} className="text-neon-cyan animate-spin" />
      </div>
    }>
      <AdminOrderContent />
    </Suspense>
  );
}
