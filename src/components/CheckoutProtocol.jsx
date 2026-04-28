'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  Send, 
  Activity,
  ChevronRight,
  AlertCircle,
  Zap,
  Terminal,
  Cpu,
  Lock,
  Globe,
  Database
} from 'lucide-react';
import { generateWhatsAppLink, saveOrderToDb } from '@/lib/orderUtils';
import { cn, formatNumber } from '@/lib/utils';

/* ─── TECHNICAL SUB-COMPONENTS ─── */

const Scanline = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-50">
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.5)_50%)] bg-[length:100%_4px] animate-scan" />
  </div>
);

const MetadataTag = ({ label, value, color = "text-white/30" }) => (
  <div className="flex flex-col">
    <span className={cn("text-[7px] font-black uppercase tracking-[0.3em]", color)}>{label}</span>
    <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-wider">{value}</span>
  </div>
);

/* ─── MAIN COMPONENT ─── */

export default function CheckoutProtocol({ isOpen, onClose, artifacts, total, onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const isValid = formData.name.length > 3 && formData.phone.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsProcessing(true);
    
    try {
      // Step 1: Save to Cloud Firestore
      const newOrderId = await saveOrderToDb(artifacts, formData, total);
      setOrderId(newOrderId);
      
      // Step 2: Transition to success view
      setIsSubmitted(true);
    } catch (error) {
      console.error("Critical System Failure during DB synchronization:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalRedirect = () => {
    const waLink = generateWhatsAppLink(artifacts, formData, total, orderId);
    window.open(waLink, '_blank');
    onComplete();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl bg-[#080808] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row min-h-[600px]"
          >
            <Scanline />
            
            {/* Left: Interactive Form / Content */}
            <div className="flex-1 p-8 md:p-14 relative z-10 overflow-y-auto max-h-[90vh]">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div 
                    key="form-view"
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                    className="flex flex-col h-full"
                  >
                    {/* Header */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 text-neon-cyan mb-4">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          className="p-2 bg-neon-cyan/10 rounded-full"
                        >
                          <ShieldCheck size={16} />
                        </motion.div>
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase font-mono">Enlace_Logístico // v10.4.0</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-normal font-prata text-white tracking-tight leading-none mb-4 italic">Confirmar Adquisición</h2>
                      <p className="text-white/30 text-xs font-mono uppercase tracking-[0.3em]">Protocolo de Sincronización Nexus Prime</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid gap-6">
                        <div className="space-y-2 group">
                          <label className="text-[9px] font-black tracking-widest text-white/20 uppercase ml-4 group-focus-within:text-neon-cyan transition-colors">Operador</label>
                          <div className="relative">
                            <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-neon-cyan transition-colors" />
                            <input 
                              required
                              type="text"
                              placeholder="IDENTIFICACIÓN DE OPERADOR"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm font-bold tracking-[0.1em] placeholder:text-white/5 focus:border-neon-cyan/50 focus:bg-white/[0.06] transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 group">
                          <label className="text-[9px] font-black tracking-widest text-white/20 uppercase ml-4 group-focus-within:text-neon-pink transition-colors">Terminal de Contacto</label>
                          <div className="relative">
                            <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-neon-pink transition-colors" />
                            <input 
                              required
                              type="tel"
                              placeholder="ENLACE CELULAR (WHATSAPP)"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm font-bold tracking-[0.1em] placeholder:text-white/5 focus:border-neon-pink/50 focus:bg-white/[0.06] transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 group">
                          <label className="text-[9px] font-black tracking-widest text-white/20 uppercase ml-4 group-focus-within:text-neon-yellow transition-colors">Matriz Logística (Opcional)</label>
                          <div className="relative">
                            <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-neon-yellow transition-colors" />
                            <input 
                              type="text"
                              placeholder="ZONA DE DESPLIEGUE"
                              value={formData.zone}
                              onChange={(e) => setFormData({...formData, zone: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm font-bold tracking-[0.1em] placeholder:text-white/5 focus:border-neon-yellow/50 focus:bg-white/[0.06] transition-all outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6 pt-4">
                        <button 
                          disabled={!isValid || isProcessing}
                          className={cn(
                            "w-full group relative py-6 font-black text-xs tracking-[0.6em] uppercase rounded-[2rem] overflow-hidden transition-all duration-500",
                            isValid 
                              ? "bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:bg-neon-cyan hover:scale-[1.02]" 
                              : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed"
                          )}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-4">
                            {isProcessing ? (
                              <Activity size={18} className="animate-spin" />
                            ) : (
                              <>SINCRONIZAR CON NEXUS <Send size={16} className="group-hover:translate-x-2 transition-transform" /></>
                            )}
                          </span>
                        </button>
                        
                        <button 
                          type="button"
                          onClick={onClose}
                          className="text-[9px] font-black text-white/20 hover:text-white/40 tracking-[0.4em] uppercase transition-colors"
                        >
                          Abortar Protocolo
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <div className="relative mb-12">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-neon-cyan/20 blur-3xl rounded-full" 
                      />
                      <div className="w-28 h-28 bg-neon-cyan/10 rounded-full flex items-center justify-center border border-neon-cyan/30 relative z-10">
                        <ShieldCheck size={48} className="text-neon-cyan" />
                      </div>
                    </div>
                    
                    <h2 className="text-5xl font-normal font-prata text-white tracking-tight italic mb-3">Certificado de Despliegue</h2>
                    <p className="text-white/30 font-mono text-[9px] tracking-[0.6em] uppercase mb-12">TRANSMISIÓN EXITOSA // ID: {orderId || 'NULL'}</p>

                    <div className="w-full glass-dark border border-white/10 rounded-[2.5rem] p-10 text-left space-y-8 relative overflow-hidden group mb-12">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
                       
                       <div className="grid grid-cols-2 gap-10 relative z-10">
                          <MetadataTag label="OPERADOR_ASIGNADO" value={formData.name} />
                          <MetadataTag label="TERMINAL_ENLACE" value={formData.phone} />
                       </div>

                       <div className="space-y-4 pt-8 border-t border-white/5 relative z-10">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] block">Manifiesto_Carga</span>
                          <div className="max-h-[120px] overflow-y-auto space-y-3 custom-scrollbar pr-4">
                            {artifacts.map((art, i) => (
                              <div key={i} className="flex justify-between items-start text-[10px] font-mono group/item">
                                <div className="flex flex-col gap-1">
                                  <span className="text-white/60 uppercase font-black">{art.name} <span className="text-white/20 ml-2">[{art.size}]</span></span>
                                  <span className="text-[8px] text-neon-cyan/60 uppercase tracking-widest">
                                    {art.variant?.toUpperCase()} // VERSIÓN {art.subVariant || 1}
                                  </span>
                                </div>
                                <span className="text-neon-cyan font-bold">${formatNumber(art.price)}</span>
                              </div>
                            ))}
                          </div>
                       </div>

                       <div className="flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                          <span className="text-sm font-black uppercase tracking-[0.3em] font-prata italic">Inversión Final</span>
                          <div className="text-4xl font-black text-white italic tracking-tighter">${formatNumber(total)}</div>
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFinalRedirect}
                        className="flex-1 py-6 bg-white text-black font-black text-[11px] tracking-[0.4em] uppercase rounded-2xl hover:bg-neon-cyan shadow-[0_20px_40px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-3"
                      >
                        ACTUALIZAR EN WHATSAPP <ChevronRight size={16} />
                      </motion.button>
                      <button 
                         onClick={onClose}
                         className="px-8 py-6 border border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all"
                      >
                        Cerrar Reporte
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Technical Summary Side (Bento Style) */}
            <div className="w-full lg:w-[400px] bg-white/[0.02] border-l border-white/5 p-10 flex flex-col relative hidden lg:flex overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/[0.02] via-transparent to-neon-pink/[0.02] pointer-events-none" />
               
               <div className="relative z-10 flex-1 space-y-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase font-mono">Status_Panel</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green/20" />
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-4">
                        <Terminal size={20} className="text-neon-cyan opacity-40" />
                        <div>
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Queue_Integration</p>
                          <p className="text-lg font-bold uppercase">{artifacts.length} Artefactos Detectados</p>
                        </div>
                     </div>

                     <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-4">
                        <Cpu size={20} className="text-neon-pink opacity-40" />
                        <div>
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Processing_Power</p>
                          <p className="text-lg font-bold uppercase italic">Alta Fidelidad</p>
                        </div>
                     </div>

                     <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-4">
                        <Database size={20} className="text-neon-yellow opacity-40" />
                        <div>
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Sync_Node</p>
                          <p className="text-xs font-mono text-white/60">COL-BGT-092-X</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto space-y-8 pt-10 border-t border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-neon-cyan/5 rounded-2xl border border-neon-cyan/10">
                          <Lock size={16} className="text-neon-cyan" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black tracking-widest text-white/40 uppercase">Encriptación Nexus</p>
                          <p className="text-[7px] font-mono text-white/20 uppercase">AES-256 // END-TO-END</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-neon-pink/5 rounded-2xl border border-neon-pink/10">
                          <Globe size={16} className="text-neon-pink" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black tracking-widest text-white/40 uppercase">Red Global</p>
                          <p className="text-[7px] font-mono text-white/20 uppercase">Uptime 99.9% // LATENCY: 2ms</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-10 right-10 z-[60] p-4 glass-dark hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all border border-white/10 group bg-black md:hidden"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .glass-dark {
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(20px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        @keyframes scan {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </AnimatePresence>
  );
}
