'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileImage, ShieldCheck, Zap, Activity, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import DiagnosticOverlay from './DiagnosticOverlay';

export default function SynthesisTerminal({ isOpen, onClose, onSynthesize }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
        processFile(droppedFile);
    }
  };

  const processFile = (file) => {
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsScanning(true);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    // Prepare a mock "product" for the custom synthesis
    const customProduct = {
      id: 'custom-sys-' + Date.now(),
      name: 'Custom Synthesis Artifact',
      description: 'Obra de arte generada a partir de datos externos procesados por el núcleo NovaFrame.',
      price: 1200, // Base custom price
      imageUrl: previewUrl,
      rarity: 'Custom',
      nodeId: 'USER_CORE_UPLOAD'
    };
    
    // Close this terminal and open the configurator with this custom product
    onSynthesize(customProduct);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-2xl h-[600px] glass-dark rounded-[3rem] border border-white/10 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
             <div className="flex items-center gap-3 text-neon-pink">
                <Terminal size={18} />
                <span className="text-[10px] font-black tracking-[0.5em] uppercase">Synthesis_Terminal_v4.2</span>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                <X size={20} />
             </button>
          </div>

          <div className="flex-1 relative p-12 flex flex-col items-center justify-center text-center">
            {isScanning ? (
                <div className="absolute inset-0 z-20">
                    <DiagnosticOverlay 
                        isVisible={true}
                        product={{ nodeId: 'EXTERNAL_FILE_0x1' }}
                        finish="CUSTOM_PIGMENT"
                        onComplete={handleScanComplete}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <img loading="lazy" decoding="async" src={previewUrl} className="max-h-[300px] opacity-40 blur-md rounded-2xl" />
                    </div>
                </div>
            ) : (
                <>
                  <motion.div 
                    onClick={() => document.getElementById('file-input').click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "w-full h-80 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500",
                      isDragging ? "bg-neon-cyan/5 border-neon-cyan shadow-[0_0_50px_rgba(6,182,212,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className={cn(
                      "p-8 rounded-full bg-white/5 transition-all duration-500",
                      isDragging ? "scale-110 bg-neon-cyan/20" : "scale-100"
                    )}>
                      <Upload size={40} className={isDragging ? "text-neon-cyan" : "text-white/20"} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold text-white tracking-tight">SOLTAR ARCHIVO DE DATOS</h3>
                       <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">Awaiting PNG/JPG Input // No Limits</p>
                    </div>
                    <input id="file-input" type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
                  </motion.div>

                  <div className="mt-12 grid grid-cols-2 gap-8 w-full group">
                     <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/5">
                        <Activity size={24} className="text-neon-pink opacity-50" />
                        <div className="text-[9px] font-black tracking-widest uppercase text-white/40">Sintonización de resolución automática</div>
                     </div>
                     <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/5">
                        <ShieldCheck size={24} className="text-neon-cyan opacity-50" />
                        <div className="text-[9px] font-black tracking-widest uppercase text-white/40">Protocolo de Integridad de Color</div>
                     </div>
                  </div>
                </>
            )}
          </div>

          <div className="p-8 bg-black/40 text-center border-t border-white/5">
              <span className="text-[8px] font-mono text-white/10 tracking-[0.6em] uppercase">Awaits_User_Command_...</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
