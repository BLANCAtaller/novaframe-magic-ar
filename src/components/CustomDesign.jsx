'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Upload, ImageIcon, Sparkles, Hexagon, ScanLine, ChevronRight, FileCode, CheckCircle2, Activity, Box } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useDeployment } from '@/contexts/DeploymentContext';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';
import FrameSpecs from './FrameSpecs';
import FeaturesShowcase from './FeaturesShowcase';

export default function CustomDesign({ onPreview }) {
  const { lang } = useLang();
  const t = translations[lang].lab;
  const { deployArtifact } = useDeployment();
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [isAmbientReady, setIsAmbientReady] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('ninguno');


  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset sync state
    setIsSynced(false);
    setIsSyncing(false);

    // Simulate analysis
    setIsSimulatingUpload(true);
    setUploadProgress(0);
    
    const duration = 2000;
    const interval = 50;
    const stepsCount = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setUploadProgress((currentStep / stepsCount) * 100);
      
      if (currentStep >= stepsCount) {
        clearInterval(timer);
        
        // Finalize upload
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        setFileMetadata({
          name: file.name.toUpperCase(),
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type.split('/')[1].toUpperCase(),
          resolution: 'ANALYZING...' // Will update to 300 DPI or similar string
        });
        setIsSimulatingUpload(false);
        setUploadProgress(0);
      }
    }, interval);
  };

  const handleSync3D = () => {
    if (!uploadedImage || isSyncing || isSynced) return;
    setIsSyncing(true);
    
    // Simulate 3D mapping
    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
    }, 2500);
  };

  const launchPreview = () => {
    if (!uploadedImage || !onPreview) return;
    
    onPreview({
      id: 'custom-' + Date.now(),
      name: 'ARTEFACTO_PERSONALIZADO',
      imageUrl: uploadedImage,
      imageUrlColor: uploadedImage,
      price: 235 + (selectedFrame !== 'ninguno' ? 150 : 0), // Base price for custom + frame offset (+50 premium)
      description: `SÍNTESIS DE ALTA FIDELIDAD GENERADA EN LABORATORIO. MARCO: ${selectedFrame.toUpperCase()}.`,
      rarity: 'Zenith',
      category: 'CUSTOM',
      isCustom: true,
      frame: selectedFrame,
      onDeploy: () => setIsAmbientReady(true)
    });
  };

  return (
    <>
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-32 relative overflow-hidden bg-black font-sans"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] rounded-full pointer-events-none blur-3xl z-0" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          
          {/* Left Column: Technical Narrative */}
          <div className="lg:w-5/12 w-full relative">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="mb-10 flex items-center gap-4"
            >
              <div className="h-[2px] w-12 bg-neon-pink shadow-[0_0_10px_#f0abfc]" />
              <span className="font-mono text-[10px] font-black tracking-[0.4em] uppercase text-neon-pink">
                {t.hero.systemTitle}
              </span>
            </motion.div>
            
            <motion.h2 
               style={{ rotateX, rotateY }}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black italic tracking-tighter uppercase leading-[0.8] text-white flex flex-col mb-12 perspective-1000"
            >
              <motion.div 
                style={{ 
                  x: useTransform(mouseXSpring, [-0.5, 0.5], ["-35px", "35px"]), 
                  y: useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]),
                }}
                className="drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-20 flex"
              >
                {t.hero.title.split("").map((char, i) => (
                  <motion.span 
                    key={i}
                    style={{ 
                      x: useTransform(mouseXSpring, [-0.5, 0.5], [i * -2 + "px", i * 2 + "px"]),
                      y: useTransform(mouseYSpring, [-0.5, 0.5], [i * -1 + "px", i * 1 + "px"]),
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div 
                style={{ 
                  x: useTransform(mouseXSpring, [-0.5, 0.5], ["35px", "-35px"]), 
                  y: useTransform(mouseYSpring, [-0.5, 0.5], ["20px", "-20px"]),
                }}
                className="text-[#00f2ff] drop-shadow-[0_0_40px_rgba(0,242,255,0.4)] relative z-10 flex"
              >
                {t.hero.subtitle.split("").map((char, i) => (
                  <motion.span 
                    key={i}
                    style={{ 
                      x: useTransform(mouseXSpring, [-0.5, 0.5], [i * 2 + "px", i * -2 + "px"]),
                      y: useTransform(mouseYSpring, [-0.5, 0.5], [i * 1 + "px", i * -1 + "px"]),
                    }}
                    className={char === " " ? "mr-4" : ""}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </motion.h2>
            
            <motion.div 
               style={{ rotateX, rotateY }}
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="relative p-8 border-l-[3px] border-[#00f2ff] bg-[#00f2ff]/[0.03] backdrop-blur-md mb-16 max-w-xl group"
            >
              {/* Terminal Corners */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00f2ff]/30 group-hover:border-[#00f2ff]/60 transition-colors" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00f2ff]/30 group-hover:border-[#00f2ff]/60 transition-colors" />
              
              <p className="text-white/90 text-sm md:text-lg font-mono leading-relaxed uppercase tracking-widest">
                Protocolos de renderizado y síntesis para <span className="text-white font-black bg-white/10 px-2">{t.hero.authorPieces}</span>. 
                Sincroniza tu visión creativa y activa el motor de <span className="text-neon-pink font-black">{t.hero.highFidelity}</span> para materializar tu obra.
              </p>
            </motion.div>
            
            {/* Technical Steps */}
            <div className="space-y-12 relative">
              <motion.div 
                 initial={{ height: 0 }}
                 whileInView={{ height: 'calc(100% - 2rem)' }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 viewport={{ once: true }}
                 className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-[#06b6d4] via-[#f0abfc] to-[#a855f7] z-0 opacity-30" 
              />
              
              {[
                { 
                  num: "01", 
                  title: t.hero.steps[0].title, 
                  desc: t.hero.steps[0].desc, 
                  icon: Upload, 
                  hex: "#06b6d4", 
                  isDone: !!uploadedImage && !isSimulatingUpload,
                  isActive: !uploadedImage && !isSimulatingUpload
                },
                { 
                  num: "02", 
                  title: t.hero.steps[1].title, 
                  desc: isSynced ? t.hero.steps[1].done : t.hero.steps[1].desc, 
                  icon: ScanLine, 
                  hex: "#f0abfc", 
                  isDone: isSynced,
                  isActive: !!uploadedImage && !isSimulatingUpload && !isSynced,
                  action: handleSync3D,
                  isProcessing: isSyncing
                },
                { 
                  num: "03", 
                  title: t.hero.steps[2].title, 
                  desc: t.hero.steps[2].desc, 
                  icon: ImageIcon, 
                  hex: "#a855f7", 
                  isDone: isAmbientReady,
                  isActive: isSynced && !isAmbientReady
                }
              ].map((step, idx) => (
                <motion.div 
                   key={step.num}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.2 + 0.3 }}
                   viewport={{ once: true }}
                   onClick={step.action}
                   className={cn(
                     "flex items-start gap-8 relative z-10 group",
                     step.action ? "cursor-pointer" : "cursor-default"
                   )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 border-2 rounded-2xl flex items-center justify-center bg-black transition-all duration-500 relative overflow-hidden",
                    isMobile ? "" : "border-white/10 group-hover:scale-110",
                    step.isDone && "border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  )}
                  style={{
                    borderColor: (isMobile || step.isDone) ? (step.isDone ? "#22c55e" : step.hex) : undefined,
                    boxShadow: (!isMobile && !step.isDone) ? `0 0 0px transparent` : `0 0 20px ${step.isDone ? "#22c55e" : step.hex}66`
                  }}>
                    {/* Dynamic glow on hover */}
                    {!isMobile && (
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ boxShadow: `inset 0 0 15px ${step.hex}` }} 
                      />
                    )}
                    {/* Hover state for desktop */}
                    {!isMobile && !step.isDone && (
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-current transition-all duration-500 rounded-2xl" style={{ color: step.hex }} />
                    )}
                    <div 
                      className={cn("absolute inset-0 transition-opacity", (isMobile || step.isDone) ? "opacity-100" : "opacity-0 group-hover:opacity-100")} 
                      style={{ backgroundColor: step.isDone ? "rgba(34,197,94,0.1)" : `${step.hex}1a` }}
                    />
                    {step.isProcessing ? (
                      <Activity size={16} className="text-neon-pink animate-spin" />
                    ) : step.isDone ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <span className={cn("font-mono font-black text-sm relative z-10 transition-colors", (isMobile || step.isActive) ? "text-white" : "text-white/50 group-hover:text-white")}>{step.num}</span>
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className={cn(
                      "text-xl font-black uppercase tracking-tight mb-2 transition-colors flex items-center gap-2",
                      isMobile ? "" : "text-white/80"
                    )}
                    style={{ color: (isMobile || step.isActive || step.isDone) ? (step.isDone ? "#22c55e" : step.hex) : undefined }}>
                       <span className={cn(!isMobile && !step.isDone && "group-hover:text-[var(--hover-color)]")} style={{ "--hover-color": step.hex }}>{step.title}</span>
                       <step.icon 
                        size={14} 
                        className={cn(
                          "transition-all", 
                          (isMobile || step.isDone || step.isActive) ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                        )} 
                        style={{ color: step.isDone ? "#22c55e" : step.hex }}
                       />
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed font-light">{step.desc}</p>
                    {step.action && step.isActive && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-[8px] font-mono text-neon-pink animate-pulse tracking-[0.2em]"
                      >
                        [ CLICK PARA INICIAR ]
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
          
          {/* Right Column: Terminal Visualizer */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="lg:w-7/12 w-full"
             style={{ perspective: 1500 }}
          >
            <motion.div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative bg-[#020202] border border-white/20 rounded-[2rem] p-8 lg:p-14 shadow-2xl transition-all group/terminal"
            >
              {/* Noise overlay */}
              <div className="absolute inset-0 rounded-[2rem] opacity-[0.2] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

              <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/10" style={{ transform: "translateZ(30px)" }}>
                 <div className="flex items-center gap-3 text-[10px] font-mono text-neon-cyan tracking-widest uppercase">
                    <ScanLine size={14} className="animate-pulse" />
                     {t.hero.terminal.header}
                 </div>
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-neon-cyan/50 shadow-[0_0_10px_#06b6d4]" />
                 </div>
              </div>

              {/* Real Dropzone / File Picker */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/*" 
              />

              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHoveringDropzone(true)}
                onHoverEnd={() => setIsHoveringDropzone(false)}
                onClick={() => fileInputRef.current?.click()}
                style={{ transform: "translateZ(50px)" }}
                className={cn(
                  "relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden mb-12 min-h-[300px] flex flex-col items-center justify-center",
                  isHoveringDropzone ? "border-neon-cyan bg-neon-cyan/[0.03]" : "border-white/10 bg-black",
                  (isSimulatingUpload || uploadedImage) && "border-neon-cyan/50 bg-neon-cyan/[0.02]"
                )}
              >
                {uploadedImage && !isSimulatingUpload ? (
                  <div className="absolute inset-0 opacity-40 bg-[#050505]">
                    <Image src={uploadedImage} alt="Preview" fill className="object-contain" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                  </div>
                ) : null}

                <div className="mb-6 flex justify-center relative z-10">
                  <div className={cn(
                     "w-24 h-24 rounded-full flex items-center justify-center relative transition-all duration-500",
                     isSimulatingUpload ? "border-0 shadow-[0_0_30px_rgba(6,182,212,0.3)]" :
                     isHoveringDropzone ? "bg-neon-cyan/20 border border-neon-cyan text-neon-cyan" : "bg-white/5 border border-white/10 text-white/40"
                  )}>
                     {isSimulatingUpload ? (
                        <>
                           <svg className="absolute inset-0 w-full h-full -rotate-90">
                             <circle cx="48" cy="48" r="46" fill="transparent" stroke="rgba(6,182,212,0.2)" strokeWidth="4" />
                             <circle 
                                cx="48" cy="48" r="46" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (289 * uploadProgress) / 100}
                                className="transition-all duration-100" strokeLinecap="round" 
                             />
                           </svg>
                           <span className="relative z-10 text-neon-cyan font-mono font-black text-sm">{Math.floor(uploadProgress)}%</span>
                        </>
                     ) : uploadedImage ? (
                        <CheckCircle2 className="w-10 h-10 text-neon-cyan" />
                     ) : (
                        <Upload className={cn("w-10 h-10 transition-transform duration-300", isHoveringDropzone && "scale-110 -translate-y-1")} />
                     )}
                  </div>
                </div>
                
                <h3 className={cn(
                   "font-black uppercase tracking-[0.2em] text-xl mb-3 relative z-10 transition-colors",
                   (isSimulatingUpload || uploadedImage) ? "text-neon-cyan" : "text-white"
                )}>
                   {isSimulatingUpload ? t.hero.terminal.upload.analyzing : uploadedImage ? t.hero.terminal.upload.ready : t.hero.terminal.upload.initial}
                </h3>
                <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.3em] font-bold relative z-10">
                  {isSimulatingUpload ? t.hero.terminal.upload.analyzingDesc : uploadedImage ? t.hero.terminal.upload.readyDesc : t.hero.terminal.upload.initialDesc}
                </p>
              </motion.div>

              {/* Technical Analysis Section */}
              <AnimatePresence>
                {uploadedImage && !isSimulatingUpload && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       {[
                         { label: t.hero.terminal.metadata.file, val: fileMetadata.name, icon: FileCode },
                         { label: t.hero.terminal.metadata.weight, val: fileMetadata.size, icon: Hexagon },
                         { label: t.hero.terminal.metadata.structure, val: fileMetadata.type, icon: ScanLine },
                         { label: t.hero.terminal.metadata.resolution, val: t.hero.terminal.metadata.ultraHd, icon: Sparkles },
                       ].map((item, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group/item">
                           <item.icon size={16} className="text-neon-cyan group-hover/item:scale-110 transition-transform" />
                           <div>
                              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{item.label}</div>
                              <div className="text-[10px] font-black text-white/60 truncate max-w-[120px]">{item.val}</div>
                           </div>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Terminal Dynamic Button */}
              <div className="flex flex-col gap-4">
                <motion.button 
                  whileHover={(uploadedImage && !isSyncing) ? { scale: 1.02, boxShadow: `0 0 50px ${isSynced ? "rgba(168,85,247,0.3)" : "rgba(6,182,212,0.3)"}` } : {}}
                  whileTap={(uploadedImage && !isSyncing) ? { scale: 0.98 } : {}}
                  onClick={!isSynced ? handleSync3D : launchPreview}
                  disabled={!uploadedImage || isSyncing}
                  style={{ transform: "translateZ(60px)" }}
                  className={cn(
                    "w-full rounded-2xl py-6 text-[10px] font-mono font-black tracking-[0.4em] uppercase transition-all duration-300 relative overflow-hidden group/btn border",
                    !uploadedImage || isSyncing
                      ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                      : isSynced
                        ? "bg-[#a855f7] text-white border-[#a855f7] hover:shadow-[0_0_30px_#a855f766]"
                        : "bg-white text-black border-white hover:bg-neon-cyan hover:border-neon-cyan hover:text-white"
                  )}
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[scan_1.5s_ease-in-out_infinite]" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSyncing ? (
                      <>{t.hero.terminal.cta.processing} <Activity size={14} className="animate-spin" /></>
                    ) : !uploadedImage ? (
                      t.hero.terminal.cta.locked
                    ) : isSynced ? (
                      <>{t.hero.terminal.cta.done} <ImageIcon size={14} /></>
                    ) : (
                      <>{t.hero.terminal.cta.sync} <ScanLine size={14} /></>
                    )}
                  </span>
                </motion.button>

                {/* Final Deployment Button */}
                <AnimatePresence>
                  {isAmbientReady && (
                    <motion.button
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      whileHover={{ scale: 1.02, backgroundColor: "#22c55e", color: "white" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const artifact = {
                          id: 'custom-' + Date.now(),
                          name: t.hero.terminal.cta.artifactName,
                          imageUrl: uploadedImage,
                          price: 235 + (selectedFrame !== 'ninguno' ? 150 : 0),
                          rarity: 'Zenith',
                          isCustom: true,
                          frame: selectedFrame
                        };
                        deployArtifact(artifact);
                        
                        // Celebrate
                        import('canvas-confetti').then(confetti => {
                          confetti.default({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#06b6d4', '#f0abfc', '#a855f7']
                          });
                        });

                        // Reset
                        setTimeout(() => {
                          setUploadedImage(null);
                          setFileMetadata(null);
                          setIsSynced(false);
                          setIsSyncing(false);
                          setIsAmbientReady(false);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }, 2000);
                      }}
                      className="w-full rounded-2xl py-6 bg-green-500/10 border border-green-500/50 text-green-500 text-[10px] font-mono font-black tracking-[0.4em] uppercase transition-all"
                    >
                      <span className="flex items-center justify-center gap-3">
                        {t.hero.terminal.cta.deploy} <CheckCircle2 size={14} />
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
    <FeaturesShowcase />
    <FrameSpecs selectedColor={selectedFrame} onSelectColor={setSelectedFrame} />
    </>
  );
}
