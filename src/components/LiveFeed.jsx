'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Cpu, Hash } from 'lucide-react';

const MOCK_EVENTS = [
  { type: 'SYNTHESIS', artifact: 'GEISHA_V2.SYNT', node: 'CORE-01', user: 'ENG_44' },
  { type: 'ACQUISITION', artifact: 'REBEL_09.PROTO', node: 'VAULT-X', user: 'USER_129' },
  { type: 'SYNC', artifact: 'MONROE.GLITCH', node: 'SYD-NODE', user: 'SYSTEM' },
  { type: 'FORGE', artifact: 'BUSHIDO.OVR', node: 'GAMMA-7', user: 'ENG_09' },
  { type: 'METADATA_UPDATE', artifact: 'LUNAR.RETRO', node: 'BETA-VAULT', user: 'MAINTENANCE' }
];

export default function LiveFeed() {
  const [events, setEvents] = useState([MOCK_EVENTS[0], MOCK_EVENTS[1]]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      setEvents(prev => [randomEvent, ...prev.slice(0, 3)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-dark border border-white/5 rounded-3xl p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-neon-pink animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Telemetría de Síntesis</span>
        </div>
        <div className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-mono text-white/30 uppercase tracking-widest">
           LIVE_REPLAY
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout text-white overflow-hidden">
          {events.map((event, i) => (
            <motion.div
              key={`${event.artifact}-${i}`}
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                {event.type === 'SYNTHESIS' ? <Cpu size={12} /> : <Zap size={12} />}
              </div>
              <div className="flex-grow">
                 <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-neon-cyan uppercase tracking-widest">{event.type}</span>
                    <span className="text-[8px] font-mono text-white/20">{event.node}</span>
                 </div>
                 <h4 className="text-[10px] font-bold text-white mb-1 uppercase tracking-tighter">{event.artifact}</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[8px] text-white/30 font-mono">USER: {event.user}</span>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="text-[8px] text-white/30 font-mono">STATUS: SYNCED</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-0.5 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ x: ['-100%', '100%'] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                   className="w-1/2 h-full bg-neon-cyan"
                 />
              </div>
            ))}
         </div>
         <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Global_Sync_Stable</span>
      </div>
    </div>
  );
}
