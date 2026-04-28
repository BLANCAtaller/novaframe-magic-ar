'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Layers, 
  Trash2, 
  Monitor, 
  Grid, 
  ArrowRight, 
  Activity, 
  Database,
  Tag,
  ChevronRight,
  Maximize2,
  Minimize2,
  ShoppingCart
} from 'lucide-react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { cn, formatNumber } from '@/lib/utils';
import DeploymentGallery3D from './DeploymentGallery3D';
import CheckoutProtocol from './CheckoutProtocol';
import { useRouter } from 'next/navigation';

export default function DeploymentHub() {
  const router = useRouter();
  const { deployedArtifacts, deploymentCount, removeArtifact, clearQueue } = useDeployment();

  useEffect(() => {
    document.title = "Gestión de Cola // Operaciones — NovaFrame";
  }, []);

  const [viewMode, setViewMode] = useState('list'); // 'list' or '3d'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const totalPrice = useMemo(() => {
    return deployedArtifacts.reduce((sum, art) => sum + (art.price || 0), 0);
  }, [deployedArtifacts]);

  if (deploymentCount === 0 && viewMode === 'list') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10"
        >
          <ShoppingCart size={40} className="text-white/20" />
        </motion.div>
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Cola de Despliegue Vacía</h2>
        <p className="text-white/40 max-w-md font-mono text-xs uppercase tracking-widest leading-loose">
          No se han detectado artefactos sincronizados en la red local. <br/> 
          Explora el catálogo para iniciar un nuevo protocolo de adquisición.
        </p>
        <button 
          onClick={() => router.push('/top-deployments')}
          className="mt-10 px-8 py-4 bg-white text-black font-black text-xs tracking-[0.3em] uppercase rounded-xl hover:bg-neon-cyan transition-all"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-neon-cyan/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-pink/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 text-neon-cyan mb-4 font-mono text-[10px] tracking-[0.5em] uppercase">
              <Activity size={14} className="animate-pulse" />
              <span>HUB_OPERACIONES // SECURE_ACCESS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Gestión de <span className="text-white/20">cola</span>
            </h1>
          </div>

          <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all",
                viewMode === 'list' ? "bg-white text-black" : "text-white/40 hover:text-white"
              )}
            >
              <Grid size={14} /> LISTA_TÁCTICA
            </button>
            <button 
              onClick={() => setViewMode('3d')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all",
                viewMode === '3d' ? "bg-white text-black" : "text-white/40 hover:text-white"
              )}
            >
              <Monitor size={14} /> HOLODECK_3D
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-12"
            >
              {/* Artifacts List */}
              <div className="lg:col-span-2 space-y-6">
                 {deployedArtifacts.map((artifact, idx) => (
                   <motion.div 
                     key={artifact.deploymentId}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     className="group relative flex flex-col md:flex-row gap-6 p-6 glass-dark rounded-3xl border border-white/5 hover:border-white/20 transition-all overflow-hidden"
                   >
                     {/* Artifact Shadow Overlay */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
                     
                     <div className="w-full md:w-32 h-40 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/5 relative">
                        <img loading="lazy" decoding="async" 
                          src={artifact.imageUrl} 
                          alt={artifact.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[7px] font-black text-white/50 tracking-tighter">
                          {artifact.deploymentId}
                        </div>
                     </div>

                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-neon-cyan transition-colors italic flex items-center gap-3">
                                {artifact.name} 
                                {artifact.quantity > 1 && (
                                  <motion.span 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    className="px-3 py-1 bg-neon-cyan text-black not-italic text-[10px] rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/20"
                                  >
                                    X{artifact.quantity}
                                  </motion.span>
                                )}
                              </h3>
                              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1">Status: Sincronizado // Ready</p>
                           </div>
                           <button 
                             onClick={() => removeArtifact(artifact.deploymentId)}
                             className="p-3 text-white/20 hover:text-neon-pink hover:bg-neon-pink/10 rounded-xl transition-all border border-transparent hover:border-neon-pink/20"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="space-y-1">
                              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase block">Protocolo</span>
                              <span className="text-[10px] font-bold text-white/60">{artifact.size}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase block">Material</span>
                              <span className="text-[10px] font-bold text-white/60">{artifact.finish}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase block">Variante</span>
                              <span className="text-[10px] font-bold text-white/60">{artifact.variant?.toUpperCase()} {artifact.subVariant ? `(V${artifact.subVariant})` : ''}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase block">Inversión</span>
                              <span className="text-[10px] font-black text-neon-cyan">${formatNumber(artifact.price)}</span>
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
                 
                 <div className="flex justify-center pt-8">
                    <button 
                      onClick={() => router.push('/top-deployments')}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-white hover:border-white/30 transition-all"
                    >
                      Continuar Adquisiciones <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-8">
                 <div className="glass-dark border border-white/10 rounded-[3rem] p-8 space-y-8 relative overflow-hidden sticky top-32">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-neon-cyan/[0.03] blur-3xl pointer-events-none" />
                    
                    <div>
                       <div className="flex items-center gap-2 text-neon-cyan mb-2">
                          <Layers size={16} />
                          <span className="text-[9px] font-black tracking-[0.5em] uppercase">Summary_v4.2</span>
                       </div>
                       <h2 className="text-3xl font-black uppercase tracking-tighter">Total Despliegue</h2>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-[10px] font-mono text-white/30 uppercase">Cod. Activos</span>
                          <span className="text-xs font-bold">{deploymentCount} UNIDADES</span>
                       </div>
                       <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-[10px] font-mono text-white/30 uppercase">Sincronización</span>
                          <span className="text-xs font-bold text-neon-green">REAL_TIME</span>
                       </div>
                       <div className="flex justify-between items-center pt-6">
                          <span className="text-[10px] font-mono text-white/30 uppercase font-black">Monto Final</span>
                          <div className="text-5xl font-black text-white tabular-nums tracking-tighter">${formatNumber(totalPrice)}</div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full py-6 bg-white text-black font-black text-lg tracking-[0.4em] uppercase rounded-2xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-neon-cyan transition-all"
                    >
                       Ejecutar Despliegue
                    </button>

                    <button 
                      onClick={clearQueue}
                      className="w-full py-4 text-white/20 hover:text-neon-pink text-[9px] font-black tracking-widest uppercase transition-colors"
                    >
                       Abortar Protocolos
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="3d-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[75vh] w-full relative group"
            >
               {/* 3D Gallery Engine */}
               <DeploymentGallery3D 
                 artifacts={deployedArtifacts} 
                 onOpenCheckout={() => setIsCheckoutOpen(true)}
               />

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CheckoutProtocol 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        artifacts={deployedArtifacts}
        total={totalPrice}
        onComplete={() => {
          clearQueue();
          setIsCheckoutOpen(false);
        }}
      />

      <style jsx>{`
        .glass-dark {
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
