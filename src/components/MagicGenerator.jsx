"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { MAGIC_REGISTRY } from "@/config/magic-registry";
import { Download, Printer, Copy, Check, Sparkles, Layout } from "lucide-react";
import { motion } from "framer-motion";

export default function MagicGenerator() {
  const [selectedId, setSelectedId] = useState(Object.keys(MAGIC_REGISTRY)[0]);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const product = MAGIC_REGISTRY[selectedId];
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const magicUrl = `${baseUrl}/magic/${selectedId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCard = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    
    // Simple download of the QR for now, 
    // in a real scenario we'd use html2canvas for the whole card
    const link = document.createElement("a");
    link.download = `novaframe-magic-${selectedId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-[#0a0a0a] min-h-screen text-white font-mono">
      <header className="mb-12 border-b border-cyan-900/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-cyan-400 w-6 h-6" />
          <h1 className="text-3xl font-bold tracking-tighter uppercase">Magic AR Generator</h1>
        </div>
        <p className="text-cyan-600/70 text-sm">PRODUCCIÓN DE CREDENCIALES DE REALIDAD AUMENTADA</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Configuration */}
        <div className="space-y-8">
          <section>
            <label className="block text-xs uppercase tracking-widest text-cyan-500 mb-4">Seleccionar Producto</label>
            <div className="grid gap-2">
              {Object.keys(MAGIC_REGISTRY).map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedId(id)}
                  className={`p-4 border text-left transition-all ${
                    selectedId === id 
                      ? "bg-cyan-950/30 border-cyan-400 text-cyan-400" 
                      : "bg-transparent border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  <div className="font-bold">{MAGIC_REGISTRY[id].name}</div>
                  <div className="text-[10px] opacity-60 uppercase">{id}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="p-6 bg-white/5 border border-white/10 rounded-sm">
            <h3 className="text-sm font-bold mb-4 uppercase flex items-center gap-2">
              <Layout className="w-4 h-4 text-cyan-400" />
              Info de Despliegue
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">Target URL</p>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={magicUrl}
                    className="flex-1 bg-black border border-white/10 p-2 text-xs text-cyan-300 outline-none"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Preview Card */}
        <div className="flex flex-col items-center">
          <label className="block text-xs uppercase tracking-widest text-cyan-500 mb-4 w-full text-center">Vista Previa de Tarjeta</label>
          
          <motion.div 
            ref={cardRef}
            layoutId="preview-card"
            className="w-[300px] aspect-[2/3] bg-black border-2 border-white/20 p-8 flex flex-col items-center justify-between relative overflow-hidden group"
          >
            {/* Design Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="w-full">
              <div className="text-[10px] tracking-[0.3em] uppercase text-cyan-500/50 mb-1">NovaFrame</div>
              <div className="text-xl font-bold tracking-tighter uppercase leading-none border-b border-white/10 pb-2">Magic AR</div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <QRCodeCanvas 
                value={magicUrl} 
                size={160}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo.png", // Fallback if logo exists
                  x: undefined,
                  y: undefined,
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full text-center">
              <div className="text-[9px] uppercase tracking-widest text-white/40 mb-3 leading-relaxed">
                Apunta tu cámara aquí para<br/>activar la Realidad Aumentada
              </div>
              <div className="py-2 border-t border-white/10">
                <div className="text-[10px] font-bold uppercase truncate">{product.name}</div>
                <div className="text-[8px] text-white/30">ID: {selectedId}</div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex gap-4 w-full max-w-[300px]">
            <button 
              onClick={downloadCard}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 text-xs uppercase tracking-widest transition-all"
            >
              <Download className="w-4 h-4" /> Bajar QR
            </button>
            <button 
              onClick={() => window.print()}
              className="p-3 bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-4 text-[10px] text-white/30 uppercase">Imprimir en papel 300g para mejor acabado</p>
        </div>
      </div>
    </div>
  );
}
