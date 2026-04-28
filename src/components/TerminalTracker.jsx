'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Terminal, Network, Lock, Crosshair } from 'lucide-react';

const SYSTEM_LOGS = [
  { msg: "RUTEO EN TRÁNSITO", sys: "ALICE_V2.0", type: "OK", color: "text-[#00ffff]" },
  { msg: "NODO SECTOR 09 ACTIVO", sys: "PROTOCOL_SYNC", type: "SYNC", color: "text-[#ff007f]" },
  { msg: "LAT:19.4N // LON:99.1W", sys: "UPLINK_SECURE", type: "OK", color: "text-[#00ffff]" },
  { msg: "CÓDIGO DESTELLO [LUCY]", sys: "ANOMALÍA_CERO", type: "SECURE", color: "text-white" },
  { msg: "ENSAMBLAJE DE LONA", sys: "PBN_MATRIX", type: "OK", color: "text-[#00ffff]" },
  { msg: "PÍXELES 144M ACTIVOS", sys: "CORE_STATUS", type: "SYNC", color: "text-[#ff007f]" },
  { msg: "INGRESO A BOVEDA", sys: "LOGÍSTICA_V3", type: "OK", color: "text-[#00ffff]" },
  { msg: "256-BIT NEURAL KEY", sys: "ENCRIPTACIÓN", type: "SECURE", color: "text-white" }
];

export default function TerminalTracker() {
  const [logs, setLogs] = useState([]);
  const [hexCode, setHexCode] = useState('0x0000');
  const [blips, setBlips] = useState([]);

  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 5 }).map((_, i) => ({
      id: `init-${i}`,
      timestamp: new Date(Date.now() - i * 1500).toISOString().split('T')[1].substring(0, 8),
      data: SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)],
      hex: Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0')
    }));
    setLogs(initialLogs);

    // Continuous loop
    const interval = setInterval(() => {
      const data = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
      const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
      const hex = Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
      
      const newLog = { id: `log-${Date.now()}`, timestamp, data, hex };
      setLogs(prev => [newLog, ...prev].slice(0, 5));
      setHexCode(`0x${hex}`);
      
      // Radar blips
      if (Math.random() > 0.5) {
        setBlips(prev => [
          ...prev.slice(-4), 
          { 
            id: Date.now(), 
            x: Math.random() * 80 + 10, 
            y: Math.random() * 80 + 10,
            color: data.color.replace('text-', 'bg-')
          }
        ]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[450px] border border-[#00ffff]/20 bg-black/60 backdrop-blur-2xl p-8 overflow-hidden flex flex-col group rounded-bl-3xl shadow-[0_0_50px_rgba(0,255,255,0.05),inset_0_0_20px_rgba(0,0,0,0.8)]">
      
      {/* High-Fidelity Tactical Borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ffff] drop-shadow-[0_0_8px_#00ffff]" />
      <div className="absolute top-0 right-0 w-16 h-2 bg-[#ff007f] shadow-[0_0_10px_#ff007f]" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ffff] drop-shadow-[0_0_8px_#00ffff]" />
      <div className="absolute bottom-6 left-0 w-2 h-16 bg-[#ff007f] shadow-[0_0_10px_#ff007f]" />
      <div className="absolute bottom-0 left-0 w-16 border-b-2 border-[#00ffff]" />
      <div className="absolute bottom-0 left-16 border-b-2 border-transparent border-t-[10px] border-t-transparent border-l-[10px] border-l-[#00ffff] h-0 w-0" />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[#00ffff]/[0.03] bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-[#00ffff]/10 to-transparent z-10 pointer-events-none" />

      {/* Vertical Data Stream (Left edge) */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 flex flex-col justify-between items-center opacity-50">
         {[1,2,3,4,5].map(i => (
           <div key={i} className={`w-0.5 h-4 ${i%2===0 ? 'bg-[#ff007f] animate-pulse' : 'bg-[#00ffff]'}`} />
         ))}
      </div>

      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-[#00ffff]/20 pb-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <Terminal size={14} className="text-[#00ffff]" />
             <span className="text-[10px] font-mono tracking-[0.3em] text-[#00ffff] uppercase">System Override</span>
             <span className="text-[8px] font-mono bg-[#ff007f] text-white px-1 ml-2">{hexCode}</span>
          </div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00ffff] to-[#ff007f] drop-shadow-[0_2px_10px_rgba(0,255,255,0.5)]"
          >
            NEXUS_TRACKER
          </motion.h2>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] font-bold font-mono tracking-widest text-[#00ffff] bg-[#00ffff]/10 px-3 py-1.5 border border-[#00ffff]/30 flex items-center gap-2 rounded-tl-lg rounded-br-lg backdrop-blur-md">
             <Activity size={12} className="animate-pulse" />
             VERIFIED
          </div>
          <div className="flex gap-1">
             <span className="w-2 h-1 bg-[#ff007f] animate-[ping_2s_infinite]" />
             <span className="w-2 h-1 bg-[#00ffff]" />
             <span className="w-2 h-1 bg-white" />
          </div>
        </div>
      </div>

      {/* LOGS FEED */}
      <div className="flex-1 flex flex-col gap-3 font-mono relative z-10 h-full overflow-hidden mask-image-b pb-4">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              layout
              key={log.id}
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: i === 0 ? 1 : 1 - (i * 0.2), x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`p-3 border flex flex-col md:flex-row md:items-center justify-between gap-2 backdrop-blur-md transition-all duration-300 ${
                i === 0 
                  ? 'border-[#00ffff]/50 bg-[#00ffff]/10 shadow-[0_0_15px_rgba(0,255,255,0.2)] ml-2' 
                  : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded ${i === 0 ? 'bg-[#00ffff] text-black' : 'bg-white/10 text-white/50'}`}>
                  {log.timestamp}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold tracking-widest ${log.data.color}`}>
                    {log.data.sys}
                  </span>
                  <span className={`text-xs ${i === 0 ? 'text-white' : 'text-white/60'}`}>
                    {log.data.msg}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[10px]">
                <span className="text-white/30 hidden sm:block">ID:{log.hex}</span>
                <span className={`border px-2 py-0.5 tracking-wider ${
                  log.data.type === 'OK' ? 'border-[#00ffff] text-[#00ffff]' : 
                  log.data.type === 'SYNC' ? 'border-[#ff007f] text-[#ff007f]' : 
                  'border-white text-white'
                }`}>
                  [{log.data.type}]
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LUXURY RADAR COMPONENT */}
      <div className="absolute bottom-8 right-8 w-40 h-40 pointer-events-none group-hover:scale-110 transition-transform duration-700 z-0">
         {/* Concentric rings */}
         <div className="absolute inset-0 rounded-full border border-dashed border-[#00ffff]/30 animate-[spin_15s_linear_infinite_reverse]" />
         <div className="absolute inset-4 rounded-full border border-[#00ffff]/20" />
         <div className="absolute inset-10 rounded-full border border-[#00ffff]/40 border-t-[#ff007f] animate-[spin_4s_linear_infinite]" />
         <div className="absolute inset-[48%] rounded-full bg-[#00ffff] shadow-[0_0_10px_#00ffff]" />
         
         {/* Crosshairs */}
         <Crosshair className="absolute inset-0 w-full h-full text-[#00ffff]/20" strokeWidth={1} />
         
         {/* Sweeping Conic Gradient */}
         <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 rounded-full opacity-60"
           style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0,255,255,0.1) 320deg, rgba(0,255,255,0.5) 360deg)' }}
         />
         
         {/* Blips */}
         <AnimatePresence>
           {blips.map(blip => (
             <motion.div
               key={blip.id}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: [0, 1, 0.8, 0], scale: [0, 1, 1.5, 0.5] }}
               transition={{ duration: 3, ease: "easeOut" }}
               className={`absolute w-1.5 h-1.5 rounded-full ${blip.color} shadow-[0_0_8px_currentColor]`}
               style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
             />
           ))}
         </AnimatePresence>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-2 left-8 text-[8px] font-mono tracking-[0.4em] text-white/40 uppercase flex items-center gap-2">
        <Lock size={10} className="text-[#00ffff]" />
        ENCRYPTED TERMINAL LINK V.9.3.4
      </div>
    </div>
  );
}
