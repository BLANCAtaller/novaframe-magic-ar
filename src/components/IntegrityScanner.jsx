'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntegrityScanner({ score, size }) {
  const isHealthy = score >= 80;
  const isWarning = score < 80 && score >= 60;
  const isCritical = score < 60;

  const statusLabel = isHealthy ? 'STABLE_PROTO' : isWarning ? 'LOW_FIDELITY' : 'CRITICAL_FAIL';
  const statusColor = isHealthy ? 'text-neon-green' : isWarning ? 'text-neon-yellow' : 'text-neon-pink';
  const borderColor = isHealthy ? 'border-neon-green/20' : isWarning ? 'border-neon-yellow/20' : 'border-neon-pink/20';
  const glowColor = isHealthy ? 'shadow-neon-green/10' : isWarning ? 'shadow-neon-yellow/10' : 'shadow-neon-pink/10';

  return (
    <div className={cn(
      "p-6 rounded-3xl border transition-all duration-500 bg-white/[0.02] backdrop-blur-sm",
      borderColor,
      glowColor,
      "shadow-[0_0_30px_rgba(0,0,0,0.2)]"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl bg-white/5 border", borderColor)}>
            {isHealthy ? <ShieldCheck size={16} className={statusColor} /> : 
             isWarning ? <Activity size={16} className={statusColor} /> : 
             <ShieldAlert size={16} className={statusColor} />}
          </div>
          <div>
            <div className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Estatus_Integridad</div>
            <div className={cn("text-xs font-black font-mono tracking-tighter", statusColor)}>
              {statusLabel} // {score}%
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">DPI_PROJECTED</div>
          <div className="text-xs font-black font-mono text-white">300 DPI</div>
        </div>
      </div>

      <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={cn(
            "h-full transition-all duration-1000",
            isHealthy ? "bg-neon-green" : isWarning ? "bg-neon-yellow" : "bg-neon-pink"
          )}
        />
        {/* Tech ticks */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-black/40" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <Info size={14} className="text-white/20 mt-1 shrink-0" />
          <p className="text-[10px] text-white/40 leading-relaxed font-mono">
            ANALISIS: El artefacto seleccionado ({size}) requiere un flujo de datos estable. 
            {isHealthy ? ' Integridad óptima para despliegue físico.' : 
             isWarning ? ' Se recomienda aplicar protocolo de síntesis (AI_ENHANCE).' : 
             ' Riesgo de artefactos visuales detectado. Requiere corrección.'}
          </p>
        </div>
        
        <div className="flex gap-2">
           <div className="flex-1 h-1 bg-white/5 rounded-full" />
           <div className="flex-1 h-1 bg-white/5 rounded-full" />
           <div className="flex-1 h-1 bg-white/5 rounded-full" />
           <div className="flex-1 h-1 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
