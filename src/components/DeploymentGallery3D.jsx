'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  Float, 
  Text,
  useTexture,
  useCursor
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { WallBackground, SceneLighting } from './EnvironmentEngine3D';
import { useDeployment } from '@/contexts/DeploymentContext';
import { calculateArtifactPrice } from '@/lib/priceUtils';
import { 
  Database,
  Tag,
  ChevronRight,
  Maximize2,
  AlignCenter,
  Sun,
  Palette,
  Monitor,
  MoveHorizontal,
  RotateCcw,
  Box,
  Package,
  X,
  Check,
  Zap,
  Layers,
  ArrowRight,
  ShoppingCart,
  Grid,
  Layout,
  AlignJustify,
  AlertTriangle,
  Aperture,
  Network,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Crosshair,
  Gamepad2,
  Cpu,
  Trash2
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { SAMPLE_PRODUCTS, SIZE_PRICES, FINISH_PRICES } from '@/types';

/* ─── Patch for Deprecated Warnings ─── */
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('THREE.Clock') || 
      args[0].includes('THREE.Timer') ||
      args[0].includes('deprecated')
    )) return;
    originalWarn(...args);
  };
}

/* ─── Error Boundary for 3D Components ─── */
class PieceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { 
    console.error("3D Piece failed to load:", error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ─── Constants & Utils ─── */
const CM_TO_UNIT = 1.6 / 100;
const BASE_Z = -1.48; // Wall Position
const DEFAULT_FALLBACK_TEXTURE = '/dark_plant_art.png';

function parseSizeCm(sizeStr) {
  if (!sizeStr) return { wCm: 50, hCm: 70 };
  const match = sizeStr.match(/(\d+)x(\d+)/);
  if (!match) return { wCm: 50, hCm: 70 };
  return { wCm: parseInt(match[1], 10), hCm: parseInt(match[2], 10) };
}

/* ─── Piece Fallback / Loading Visual ─── */
function PiecePlaceholder({ position, color = "#222", label = "CARGANDO...", size = [0.8, 1.2] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[size[0], size[1], 0.05]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      <Text position={[0, 0, 0.06]} fontSize={0.04} color="white" opacity={0.5} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function PieceErrorPlaceholder({ position, size = [0.8, 1.2] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[size[0], size[1], 0.05]} />
        <meshStandardMaterial color="#330011" transparent opacity={0.6} />
      </mesh>
      <Text position={[0, 0, 0.06]} fontSize={0.04} color="#ff4444" anchorX="center" anchorY="middle">
        ASSET_EXPIRED
      </Text>
      <mesh position={[0, 0.1, 0.07]}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/* ─── Animated Piece Component ─── */
function Piece({ artifact, targetPosition, onEdit, onDragStart, isDragging }) {
  const groupRef = useRef();
  const { wCm, hCm } = useMemo(() => parseSizeCm(artifact.size), [artifact.size]);
  
  const textureUrl = artifact.imageUrl || DEFAULT_FALLBACK_TEXTURE;
  const texture = useTexture(textureUrl);
  
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 16;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
  }, [texture]);

  const W = wCm * CM_TO_UNIT;
  const H = hCm * CM_TO_UNIT;
  const D = 0.06;

  const _targetVec = useMemo(() => new THREE.Vector3(), []);
  const _scaleVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const posSpeed = isDragging ? 18 : 5;
      _targetVec.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      groupRef.current.position.lerp(_targetVec, Math.min(delta * posSpeed, 1));

      const s = isDragging ? 1.04 : 1;
      _scaleVec.set(s, s, s);
      groupRef.current.scale.lerp(_scaleVec, Math.min(delta * 12, 1));
    }
  });

  // 6 materials: [+X right, -X left, +Y top, -Y bottom, +Z front, -Z back]
  const materials = useMemo(() => {
    if (!texture) return null;

    const fX = D / W;
    const fY = D / H;

    // Standard Front with tiny overscan to hide seams
    const texFront = texture.clone();
    texFront.repeat.set(0.99, 0.99);
    texFront.offset.set(0.005, 0.005);

    const matFront = new THREE.MeshStandardMaterial({ 
      map: texFront, 
      roughness: 0.35, 
      metalness: 0.12,
      envMapIntensity: 1.2 
    });

    const createEdgeMat = (side) => {
      const tex = texture.clone();
      tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
      
      if (side === 'right') {
        tex.repeat.set(fX, 1);
        tex.offset.set(1.0, 0);
      } else if (side === 'left') {
        tex.repeat.set(fX, 1);
        tex.offset.set(1.0 - fX, 0);
      } else if (side === 'top') {
        tex.repeat.set(1, fY);
        tex.offset.set(0, 1.0);
      } else if (side === 'bottom') {
        tex.repeat.set(1, fY);
        tex.offset.set(0, 1.0 - fY);
      }

      return new THREE.MeshStandardMaterial({ 
        map: tex, 
        roughness: 0.45, 
        metalness: 0.08,
        envMapIntensity: 0.9,
        color: '#eeeeee'
      });
    };

    const matBack = new THREE.MeshStandardMaterial({ 
      color: '#1a120a', 
      roughness: 0.95 
    });

    return [
      createEdgeMat('right'),
      createEdgeMat('left'),
      createEdgeMat('top'),
      createEdgeMat('bottom'),
      matFront,
      matBack
    ];
  }, [texture, W, H, D]);

  return (
    <group 
      ref={groupRef} 
      position={[0, -5, 0]}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEdit(artifact.deploymentId);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (e.button === 0) {
          onDragStart(artifact.instanceId, e.point);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
       <Float 
         speed={isDragging ? 0 : 1.2} 
         rotationIntensity={isDragging ? 0 : 0.05} 
         floatIntensity={isDragging ? 0 : 0.1}
       >
          <mesh castShadow receiveShadow material={materials}>
            <boxGeometry args={[W, H, D]} />
          </mesh>
          
          <Text
            position={[0, -H/2 - 0.12, 0.05]}
            fontSize={0.05}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1}
            textAlign="center"
          >
            {`${artifact.name.toUpperCase()}`}
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.3} />
          </Text>
       </Float>
    </group>
  );
}

/* ─── DATA CONSTANTS ─── */
const ZENITH_SIZES = {
  '30x40cm': { name: 'Micro-40', code: 'M-40', color: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'bg-emerald-400' },
  '40x50cm': { name: 'Nano-50', code: 'N-50', color: 'text-purple-400', border: 'border-purple-500/30', glow: 'bg-purple-400' },
  '50x70cm': { name: 'Alpha-70', code: 'A-70', color: 'text-neon-cyan', border: 'border-cyan-500/30', glow: 'bg-cyan-400' },
  '70x100cm': { name: 'Beta-100', code: 'B-100', color: 'text-neon-pink', border: 'border-pink-500/30', glow: 'bg-pink-400' },
  '100x150cm': { name: 'Omega-150', code: 'O-150', color: 'text-neon-yellow', border: 'border-yellow-500/30', glow: 'bg-yellow-400' },
  '150x200cm': { name: 'Titan-200', code: 'T-200', color: 'text-red-500', border: 'border-red-500/30', glow: 'bg-red-500' }
};

const OFFICIAL_MATERIALS = [
  { id: 'Canvas Premium', name: 'CANVAS', desc: 'Textura Artística // 4.5cm', extra: 65 },
  { id: 'Lona HD', name: 'LONA', desc: 'Alta Definición // Vinilo', extra: 35 },
  { id: 'Digital', name: 'POSTER', desc: 'Archivo High-Res // Digital', extra: -50 }
];

/* ─── Quick Edit HUD Panel ─── */
function QuickEditHUD({ artifact, onClose, onUpdate, onRemove, onOpenCheckout }) {
  if (!artifact) return null;

  const product = useMemo(() => SAMPLE_PRODUCTS.find(p => p.id === artifact.productId), [artifact.productId]);
  
  const currentSizeKey = artifact.size || '50x70cm';
  const currentMaterial = artifact.finish || 'Lona HD';
  const currentVariantIndex = artifact.variantIndex || 0; // 0 for color, 1 for pbn
  const currentSubVariant = artifact.subVariant || 1;

  const subVariants = useMemo(() => {
    const prefix = currentVariantIndex === 1 ? 'imageUrlPBN' : 'imageUrlColor';
    const available = [];
    if (!product) return available;
    for (let i = 1; i <= 10; i++) {
        const key = i === 1 ? prefix : `${prefix}${i}`;
        if (product[key]) {
            available.push({
                index: i,
                url: product[key]
            });
        }
    }
    return available;
  }, [product, currentVariantIndex]);

  const totalPrice = useMemo(() => {
    return calculateArtifactPrice(product, {
      size: currentSizeKey,
      finish: currentMaterial,
      variantIndex: currentVariantIndex
    });
  }, [product, currentSizeKey, currentMaterial, currentVariantIndex]);

  const handleUpdate = (updates) => {
    let nextSize = updates.size || currentSizeKey;
    let nextFinish = updates.finish || currentMaterial;
    let nextVariantIdx = updates.variantIndex !== undefined ? updates.variantIndex : currentVariantIndex;
    let nextSubVariant = updates.subVariant !== undefined ? updates.subVariant : currentSubVariant;
    
    // Auto-select first subvariant if variant type changes
    if (updates.variantIndex !== undefined && updates.variantIndex !== currentVariantIndex) {
        nextSubVariant = 1;
    }

    const newTotal = calculateArtifactPrice(product, {
      size: nextSize,
      finish: nextFinish,
      variantIndex: nextVariantIdx
    });

    const finalUpdates = { ...updates, subVariant: nextSubVariant, price: newTotal };

    if (product) {
      const variantKey = nextVariantIdx === 0 ? 'color' : 'pbn';
      const prefix = variantKey === 'color' ? 'imageUrlColor' : `imageUrl${variantKey.toUpperCase()}`;
      const key = nextSubVariant === 1 ? prefix : `${prefix}${nextSubVariant}`;
      if (product[key]) {
        finalUpdates.imageUrl = product[key];
      }
    }
    
    onUpdate(artifact.deploymentId, finalUpdates);
  };

  return (
    <motion.div 
      initial={{ x: 450, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 450, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-black/98 backdrop-blur-3xl border-l border-white/10 p-6 sm:p-10 pt-24 sm:pt-32 z-[100] overflow-y-auto shadow-[-80px_0_150px_rgba(0,0,0,0.9)]"
    >
      <div className="flex justify-between items-start mb-10">
        <div className="pr-4">
          <p className="text-[10px] font-black text-cyan-400 tracking-[0.4em] uppercase mb-2">Edición Rápida</p>
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight uppercase mt-2">{artifact.name}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onRemove(artifact.deploymentId)}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/20 text-red-500 transition-all group"
            title="Eliminar Pieza"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
            <X className="w-5 h-5 text-white/50 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* VARIANT SECTION (Thumbnails) */}
        {subVariants.length > 0 && (
           <div className="animate-in fade-in slide-in-from-top-2 duration-500">
             <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]" />
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 leading-none">Variaciones de Serie Disponibles</label>
             </div>
             <div className="flex flex-wrap gap-2.5">
                {subVariants.map((sv) => (
                  <button
                    key={sv.index}
                    onClick={() => handleUpdate({ subVariant: sv.index })}
                    className={cn(
                      "w-12 h-16 rounded-lg border overflow-hidden transition-all relative group shrink-0",
                      currentSubVariant === sv.index 
                        ? "border-neon-cyan ring-1 ring-neon-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    )}
                  >
                    <img 
                      src={sv.url} 
                      className={cn(
                        "w-full h-full object-cover transition-all duration-300",
                        currentSubVariant === sv.index ? "opacity-100 scale-110" : "opacity-40 group-hover:opacity-100"
                      )} 
                      alt={`v${sv.index}`} 
                    />
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                      currentSubVariant === sv.index ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                    )}>
                       <span className="text-[9px] font-black">V{sv.index}</span>
                    </div>
                    {currentSubVariant === sv.index && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#06b6d4]" />
                    )}
                  </button>
                ))}
             </div>
           </div>
        )}

        {/* DIMENSION SECTION */}
        <div className="space-y-2">
            <div className="flex items-center gap-2.5 mb-3">
               <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#06b6d4]" />
               <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Protocolo de Dimensión</label>
            </div>
           <div className="relative group">
               <div className="grid grid-cols-2 gap-3 mt-2">
                  {Object.entries(ZENITH_SIZES).map(([key, info]) => (
                    <button 
                      key={key}
                      onClick={() => handleUpdate({ size: key })}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all relative group overflow-hidden",
                        currentSizeKey === key 
                          ? cn(info.border, info.color.replace('text-', 'bg-').split('-')[0] + "-500/10") 
                          : "border-white/5 bg-white/[0.02] hover:border-white/20"
                      )}
                    >
                       <div className={cn(
                         "text-[11px] font-black uppercase tracking-widest transition-colors",
                         currentSizeKey === key ? info.color : "text-white/70"
                       )}>
                          {key}
                       </div>
                       <div className="text-[8px] font-mono opacity-40 uppercase mt-1 tracking-tighter">
                          {info.name} — {info.code}
                       </div>
                       {currentSizeKey === key && (
                         <div className="absolute top-2 right-2">
                           <div className={cn(
                             "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                             info.glow,
                             info.color
                           )} />
                         </div>
                       )}
                    </button>
                  ))}
               </div>
           </div>
        </div>

        {/* MATERIAL SECTION */}
        <div className="space-y-2">
            <div className="flex items-center gap-2.5 mb-3">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
               <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Sustrato de Síntesis</label>
            </div>
           <div className="relative">
               <div className="grid grid-cols-3 gap-2 mt-2">
                  {OFFICIAL_MATERIALS.map((m) => {
                    const extra = m.extra;
                    const isSelected = currentMaterial === m.id;
                    const isDisabled = false; 
                    
                    return (
                      <button 
                        key={m.id}
                        onClick={() => !isDisabled && handleUpdate({ finish: m.id })}
                        disabled={isDisabled}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all relative group overflow-hidden flex flex-col items-center justify-center gap-1",
                          isSelected 
                            ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                            : isDisabled
                              ? "border-red-500 bg-red-500/10 cursor-not-allowed shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                              : "border-white/5 bg-white/[0.02] hover:border-white/20"
                        )}
                      >
                         <div className={cn(
                           "text-[10px] font-black uppercase tracking-widest transition-colors",
                           isSelected ? "text-neon-cyan" : isDisabled ? "text-red-500" : "text-white/50"
                         )}>
                            {m.name}
                         </div>
                         <div className={cn(
                           "text-[7px] font-mono opacity-30 uppercase tracking-tighter leading-none h-4 flex items-center",
                           isDisabled && "text-red-500/60"
                         )}>
                            {extra > 0 ? `+$${extra}` : extra < 0 ? `-$${Math.abs(extra)}` : 'PRO'}
                         </div>
                         
                         {isSelected && (
                           <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_5px_#06b6d4]" />
                         )}
                         
                         {isDisabled && (
                           <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                         )}
                      </button>
                    );
                  })}
               </div>
           </div>
        </div>

        {/* BASE VARIANTS (Color / PBN) */}
        {(product?.variants || artifact.hasVariants) && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-3 text-white/20">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
               <span className="text-[12px] font-black tracking-[0.4em] uppercase text-white/40 leading-none">Estilo Base</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {product.variants.map((vKey, idx) => {
                const isSelected = currentVariantIndex === idx;
                const name = vKey === 'color' ? 'COLOR' : 'PAINT BY NUMBERS';
                return (
                  <button
                    key={vKey}
                    onClick={() => handleUpdate({ variantIndex: idx })}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                      isSelected 
                        ? "bg-purple-600/20 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]" 
                        : "bg-white/2 border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className={cn("text-[10px] font-black mb-1", isSelected ? "text-purple-400" : "text-white/40")}>{name}</div>
                    <div className="text-[8px] font-bold opacity-40 tracking-[0.2em] font-mono uppercase">VERSIÓN BASE</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] bg-purple-500 text-purple-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase mb-3">Estimación_Final</p>
            <div className="text-5xl font-black text-white tabular-nums tracking-tighter">${formatNumber(totalPrice)}</div>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
             <span className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase">ID_{artifact.productId?.slice(-5).toUpperCase()}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-white/5 text-white/40 rounded-[2rem] font-black tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 border border-white/5 hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
        >
          OCULTAR PANEL
        </button>
        
        <button 
          onClick={onOpenCheckout}
          className="w-full mt-3 py-5 bg-white text-black rounded-[2rem] font-black tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all group active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          EJECUTAR_COMPRA
          <ShoppingCart size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Drag Controller (Camera-aligned raycasting — no invisible mesh) ─── */
function DragController({ dragState, positionedItems, customOffsets, spacing, onUpdateOffset, onDragEnd }) {
  const { camera, raycaster, pointer } = useThree();
  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const hitPt = useMemo(() => new THREE.Vector3(), []);
  const _normal = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!dragState) return;
    camera.getWorldDirection(_normal).negate();
    dragPlane.setFromNormalAndCoplanarPoint(
      _normal,
      new THREE.Vector3(dragState.startPoint.x, dragState.startPoint.y, dragState.startPoint.z)
    );
    const up = () => onDragEnd();
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, [dragState, camera, dragPlane, _normal, onDragEnd]);

  useFrame(() => {
    if (!dragState) return;
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(dragPlane, hitPt)) return;

    const dx = hitPt.x - dragState.startPoint.x;
    const dy = hitPt.y - dragState.startPoint.y;

    const dragging = positionedItems.find(i => i.artifact.instanceId === dragState.instanceId);
    if (!dragging) return;

    const cOff = customOffsets[dragging.artifact.instanceId] || { x: 0, y: 0 };
    const baseX = dragging.position[0] - cOff.x;
    const baseY = dragging.position[1] - cOff.y;

    let pX = baseX + dragState.startOffset.x + dx;
    let pY = baseY + dragState.startOffset.y + dy;

    const { wCm, hCm } = parseSizeCm(dragging.artifact.size);
    const W = wCm * CM_TO_UNIT;
    const H = hCm * CM_TO_UNIT;
    const SNAP = 0.15;
    
    // --- COLLISION DETECTION & RESOLUTION ---
    const checkOverlap = (testX, testY, excludeId) => {
      for (const o of positionedItems) {
        if (o.artifact.instanceId === excludeId) continue;
        const { wCm: oW, hCm: oH } = parseSizeCm(o.artifact.size);
        const minDx = (W + oW * CM_TO_UNIT) / 2 + spacing - 0.001;
        const minDy = (H + oH * CM_TO_UNIT) / 2 + spacing - 0.001;
        if (Math.abs(testX - o.position[0]) < minDx && Math.abs(testY - o.position[1]) < minDy) {
          return true;
        }
      }
      return false;
    };

    let sX = false, sY = false;

    // 1. Magnetic Snapping Seguro (solo si no causa solapamiento)
    for (const o of positionedItems) {
      if (o.artifact.instanceId === dragState.instanceId) continue;
      const { wCm: oW, hCm: oH } = parseSizeCm(o.artifact.size);
      const OW = oW * CM_TO_UNIT, OH = oH * CM_TO_UNIT;
      const oX = o.position[0], oY = o.position[1];

      if (!sX) {
        const snapPoints = [oX, oX - OW/2 + W/2, oX + OW/2 - W/2, oX + OW/2 + W/2 + spacing, oX - OW/2 - W/2 - spacing];
        for (const sp of snapPoints) {
          if (Math.abs(pX - sp) < SNAP && !checkOverlap(sp, pY, dragState.instanceId)) { pX = sp; sX = true; break; }
        }
      }
      if (!sY) {
        const snapPoints = [oY, oY + OH/2 - H/2, oY - OH/2 + H/2, oY + OH/2 + H/2 + spacing, oY - OH/2 - H/2 - spacing];
        for (const sp of snapPoints) {
          if (Math.abs(pY - sp) < SNAP && !checkOverlap(pX, sp, dragState.instanceId)) { pY = sp; sY = true; break; }
        }
      }
    }

    // 2. Hard Collision Push-Out (Empuja el cuadro si se empalma) con resolución iterativa
    for (let iter = 0; iter < 3; iter++) { // Hasta 3 pasadas para resolver colisiones múltiples
      for (const o of positionedItems) {
        if (o.artifact.instanceId === dragState.instanceId) continue;
        const { wCm: oW, hCm: oH } = parseSizeCm(o.artifact.size);
        const OW = oW * CM_TO_UNIT, OH = oH * CM_TO_UNIT;
        const oX = o.position[0], oY = o.position[1];

        const minDx = (W + OW) / 2 + spacing;
        const minDy = (H + OH) / 2 + spacing;
        const curDx = Math.abs(pX - oX);
        const curDy = Math.abs(pY - oY);

        if (curDx < minDx && curDy < minDy) {
          // Resolver por el eje de menor penetración
          if ((minDx - curDx) < (minDy - curDy)) {
             pX = pX > oX ? oX + minDx : oX - minDx;
          } else {
             pY = pY > oY ? oY + minDy : oY - minDy;
          }
        }
      }
    }

    onUpdateOffset(dragging.artifact.instanceId, { x: pX - baseX, y: pY - baseY });
  });

  return null;
}

/* ─── Main Component ─── */
export default function DeploymentGallery3D({ artifacts, onOpenCheckout }) {
  const { updateArtifact, removeArtifact } = useDeployment();
  const [activeEnv, setActiveEnv] = useState('modern');
  const [lightIntensity, setLightIntensity] = useState(100);
  const [arrangement, setArrangement] = useState('LINEAR_CENTER');
  const [spacing, setSpacing] = useState(0.8); // Incrementado de 0.5 a 0.8 para separación física clara
  const [globalOffset, setGlobalOffset] = useState({ x: 0, y: 0 });
  const [customOffsets, setCustomOffsets] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [arSupported, setArSupported] = useState(false);
  const controlsRef = useRef();

  // Check WebXR support without creating a store (prevents crashes)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setArSupported(supported))
        .catch(() => setArSupported(false));
    }
  }, []);

  const handleEnterAR = useCallback(async () => {
    if (!arSupported) {
      alert("Tu dispositivo o navegador no admite Realidad Aumentada (WebXR). Prueba con Chrome en Android.");
      return;
    }
    try {
      const { createXRStore } = await import('@react-three/xr');
      const store = createXRStore({ emulate: false, frameBufferScaling: 'default' });
      await store.enterAR();
    } catch (err) {
      console.error("AR Error:", err);
      alert("No se pudo iniciar la Realidad Aumentada. Verifica que Chrome tenga permisos de cámara.");
    }
  }, [arSupported]);

  const handleDragStart = useCallback((instanceId, point) => {
    setDragState({
      instanceId,
      startPoint: { x: point.x, y: point.y, z: point.z },
      startOffset: customOffsets[instanceId] || { x: 0, y: 0 }
    });
    setOrbitEnabled(false);
    if (controlsRef.current) controlsRef.current.enabled = false;
    document.body.style.cursor = 'grabbing';
  }, [customOffsets]);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setOrbitEnabled(true);
    if (controlsRef.current) controlsRef.current.enabled = true;
    document.body.style.cursor = 'auto';
  }, []);

  const handleDragOffset = useCallback((id, offset) => {
    // Basic collision prevention: ensure we don't overlap too much with neighbors
    // For now, we'll just allow the offset but we've increased default spacing
    setCustomOffsets(prev => ({ ...prev, [id]: offset }));
  }, []);

  const environments = {
    suite: { name: 'SUITE_ZENITH', img: '/images/environments/recamara_oscura.webp' },
    industrial: { name: 'TERMINAL 04', img: '/images/environments/oficina_industrial.webp' },
    modern: { name: 'PABELLÓN FUTURO', img: '/images/environments/sala_minimalista.webp' },
    standard: { name: 'VACÍO_ESTÁNDAR', img: null },
  };

  const arrangements = {
    LINEAR_CENTER: {
      name: 'Lineal (Centro)',
      calculate: (items, spacing) => {
        const totalWidth = items.reduce((sum, item) => sum + parseSizeCm(item.artifact.size).wCm * CM_TO_UNIT + spacing, 0) - spacing;
        let currentX = -totalWidth / 2;
        return items.map(item => {
          const w = parseSizeCm(item.artifact.size).wCm * CM_TO_UNIT;
          const pos = [currentX + w / 2, 0, 0];
          currentX += w + spacing;
          return pos;
        });
      }
    },
    LINEAR_BASE: {
      name: 'Lineal (Base)',
      calculate: (items, spacing) => {
        const totalWidth = items.reduce((sum, item) => sum + parseSizeCm(item.artifact.size).wCm * CM_TO_UNIT + spacing, 0) - spacing;
        let currentX = -totalWidth / 2;
        return items.map(item => {
          const { wCm, hCm } = parseSizeCm(item.artifact.size);
          const w = wCm * CM_TO_UNIT;
          const h = hCm * CM_TO_UNIT;
          const pos = [currentX + w / 2, h / 2, 0];
          currentX += w + spacing;
          return pos;
        });
      }
    },
    PYRAMID: {
      name: 'Pirámide Táctica',
      calculate: (items, spacing) => {
        const count = items.length;
        const rows = Math.ceil(Math.sqrt(count));
        return items.map((item, i) => {
          const row = Math.floor(i / rows);
          const col = i % rows;
          const { wCm, hCm } = parseSizeCm(item.artifact.size);
          const w = wCm * CM_TO_UNIT;
          const h = hCm * CM_TO_UNIT;
          const rowCount = Math.min(rows, count - row * rows);
          const rowWidth = rowCount * (w + spacing) - spacing;
          return [
            col * (w + spacing) - rowWidth / 2 + w / 2,
            -row * (h + spacing) + (rows * (h + spacing)) / 2,
            -row * 0.2
          ];
        });
      }
    },
    CIRCULAR: {
      name: 'Circular Nexus',
      calculate: (items, spacing) => {
        const radius = Math.max(2, items.length * (0.5 + spacing));
        return items.map((item, i) => {
          const angle = (i / items.length) * Math.PI * 2;
          return [
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.5,
            Math.sin(angle) * radius * -0.5
          ];
        });
      }
    },
    SPIRAL: {
      name: 'Espiral Fractal',
      calculate: (items, spacing) => {
        return items.map((item, i) => {
          const angle = 0.5 * i;
          const r = (1 + spacing * 5) * i * 0.2;
          return [
            Math.cos(angle) * r,
            Math.sin(angle) * r,
            -i * 0.1
          ];
        });
      }
    },
    SCALE_STEPS: {
      name: 'Por Escala',
      calculate: (items, spacing) => {
        const sorted = [...items].sort((a, b) => {
          const sA = parseSizeCm(a.artifact.size);
          const sB = parseSizeCm(b.artifact.size);
          return (sB.wCm * sB.hCm) - (sA.wCm * sA.hCm);
        });
        const totalWidth = sorted.reduce((sum, item) => sum + parseSizeCm(item.artifact.size).wCm * CM_TO_UNIT + spacing, 0) - spacing;
        let currentX = -totalWidth / 2;
        const positions = {};
        sorted.forEach(item => {
          const w = parseSizeCm(item.artifact.size).wCm * CM_TO_UNIT;
          positions[item.artifact.instanceId] = [currentX + w / 2, 0, 0];
          currentX += w + spacing;
        });
        return items.map(item => positions[item.artifact.instanceId]);
      }
    }
  };

  const positionedItems = useMemo(() => {
    // Artifacts are already split (quantity = 1 per deploymentId)
    let expanded = artifacts.map(art => ({
      ...art,
      instanceId: art.deploymentId
    }));

    let sorted = [...expanded];
    const SPACING = 0.5;

    if (arrangement === 'SCALE') {
       sorted.sort((a, b) => {
         const sA = parseSizeCm(a.size);
         const sB = parseSizeCm(b.size);
         return (sA.wCm * sA.hCm) - (sB.wCm * sB.hCm);
       });
    } else if (arrangement === 'PYRAMID') {
       sorted.sort((a, b) => {
         const sA = parseSizeCm(a.size);
         const sB = parseSizeCm(b.size);
         return (sB.wCm * sB.hCm) - (sA.wCm * sA.hCm);
       });
       const pyramid = [];
       sorted.forEach((item, i) => {
         if (i % 2 === 0) pyramid.push(item);
         else pyramid.unshift(item);
       });
       sorted = pyramid;
    } else if (arrangement === 'CLUSTER') {
      // Sort by size descending for cluster
      sorted.sort((a, b) => {
        const sA = parseSizeCm(a.size);
        const sB = parseSizeCm(b.size);
        return (sB.wCm * sB.hCm) - (sA.wCm * sA.hCm);
      });
    }

    const items = [];

    if (arrangement === 'CLUSTER') {
      // Cluster organic layout with rigorous collision detection
      const phi = 137.5 * (Math.PI / 180); // Golden angle
      let placed = [];
      
      sorted.forEach((art, i) => {
        const { wCm, hCm } = parseSizeCm(art.size);
        const W = wCm * CM_TO_UNIT;
        const H = hCm * CM_TO_UNIT;
        
        let x = 0;
        let y = 0.72; // Base height

        if (i > 0) {
          let a = 0;
          let r = 0;
          let collides = true;
          let attempts = 0;
          
          while (collides && attempts < 1000) {
            a += phi;
            r += 0.02; // Spiral outward step
            
            x = Math.cos(a) * r;
            y = 0.72 + (Math.sin(a) * r * 0.8); // slight ellipse for realism
            
            // Bounding box collision check
            collides = placed.some(p => {
              const padding = spacing; // Add spacing parameter
              return Math.abs(p.x - x) < ((p.W + W) / 2 + padding) &&
                     Math.abs(p.y - y) < ((p.H + H) / 2 + padding);
            });
            attempts++;
          }
        }

        placed.push({ x, y, W, H });
        
        // Add tiny jitter to Z to avoid Z-fighting in worst cases
        const zOffset = (Math.random() - 0.5) * 0.002;

        items.push({
          artifact: art,
          position: [x, y, BASE_Z + 0.1 + zOffset]
        });
      });
    } else {
      // Standard linear layouts
      let currentX = 0;
      sorted.forEach((art, i) => {
        const { wCm, hCm } = parseSizeCm(art.size);
        const W = wCm * CM_TO_UNIT;
        const H = hCm * CM_TO_UNIT;
        
        const x = currentX + W / 2;
        let y = 0.72;

        if (arrangement === 'LINEAR_BASE') {
          y = 0.72 + (H / 2); 
        } else if (arrangement === 'PYRAMID') {
          const offset = Math.abs(i - (sorted.length - 1) / 2);
          y = 0.72 - (offset * 0.15); 
        }

        items.push({
          artifact: art,
          position: [x, y, BASE_Z + 0.1]
        });
        
        currentX += W + spacing;
      });

      const totalWidth = currentX - spacing;
      items.forEach(item => { item.position[0] -= totalWidth / 2; });
    }

    // Apply global offset and custom individual offsets
    items.forEach(item => {
      item.position[0] += globalOffset.x;
      item.position[1] += globalOffset.y;
      
      const cOffset = customOffsets[item.artifact.instanceId];
      if (cOffset) {
        item.position[0] += cOffset.x;
        item.position[1] += cOffset.y;
      }
    });

    return items;
  }, [artifacts, arrangement, spacing, globalOffset, customOffsets]);

  const activeEditingArtifact = useMemo(() => 
    artifacts.find(a => a.deploymentId === editingId), 
  [artifacts, editingId]);

  return (
    <div className="relative w-full h-full bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] outline-none">
      
      {/* HUD: Compact Environment Selector (Top-Right) */}
      <div className="absolute top-4 right-4 z-40 flex gap-1.5 p-1.5 bg-black/60 backdrop-blur-2xl border border-white/[0.06] rounded-full pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {Object.entries(environments).map(([key, env]) => (
          <button
            key={key}
            onClick={() => setActiveEnv(key)}
            className={cn(
              "group relative w-8 h-8 rounded-full border overflow-hidden transition-all duration-300 flex items-center justify-center shrink-0",
              activeEnv === key 
                ? "border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)] scale-110" 
                : "border-white/10 opacity-40 hover:opacity-90 hover:scale-105"
            )}
            title={env.name}
          >
            {env.img ? (
              <img src={env.img} alt={env.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <Grid size={11} className="text-white/30" />
              </div>
            )}
            <div className={cn("absolute inset-0 rounded-full transition-colors", activeEnv === key ? "bg-transparent" : "bg-black/50 group-hover:bg-black/20")} />
            {activeEnv === key && <div className="absolute inset-0 border-[1.5px] border-cyan-400 rounded-full pointer-events-none" />}
          </button>
        ))}
      </div>

      {/* Main 3D Canvas — NO XR WRAPPER to prevent mobile crashes */}
      <Canvas
        shadows
        camera={{ position: [0, 0.7, 7.5], fov: 38, near: 0.05 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 1.5]}
        onPointerMissed={() => setEditingId(null)}
      >
        <Suspense fallback={null}>
          <SceneLighting intensity={lightIntensity} environment={activeEnv} />
          <WallBackground environment={activeEnv} />

          {dragState && (
            <DragController
              dragState={dragState}
              positionedItems={positionedItems}
              customOffsets={customOffsets}
              spacing={spacing}
              onUpdateOffset={handleDragOffset}
              onDragEnd={handleDragEnd}
            />
          )}

          {positionedItems.map((item) => (
            <PieceErrorBoundary 
              key={item.artifact.instanceId}
              fallback={<PieceErrorPlaceholder position={item.position} />}
            >
              <Suspense fallback={<PiecePlaceholder position={item.position} />}>
                <Piece 
                  artifact={item.artifact} 
                  targetPosition={item.position} 
                  onEdit={setEditingId}
                  onDragStart={handleDragStart}
                  isDragging={dragState?.instanceId === item.artifact.instanceId}
                />
              </Suspense>
            </PieceErrorBoundary>
          ))}

          <ContactShadows 
            position={[0, -1.99, 0]} 
            opacity={0.6} 
            scale={30} 
            blur={2.5} 
            far={10} 
            color="#000000"
          />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.995, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial 
              color="#050505" 
              transparent 
              opacity={0.4}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>

          <gridHelper 
            args={[50, 50, "#06b6d4", "#1a1a1a"]} 
            position={[0, -1.992, 0]} 
            rotation={[0, 0, 0]}
          />

          <OrbitControls 
            ref={controlsRef}
            enabled={orbitEnabled}
            target={[0, 0.7, 0]}
            enablePan={true}
            enableDamping
            dampingFactor={0.05}
            minDistance={4}
            maxDistance={12}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.1}
            minAzimuthAngle={-Math.PI / 3.5}
            maxAzimuthAngle={Math.PI / 3.5}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* AR Trigger Button - Only shown if device supports AR */}
      {arSupported && positionedItems.length > 0 && (
        <div className="absolute top-16 left-6 z-40 pointer-events-none">
          <button
            onClick={handleEnterAR}
            className="flex items-center gap-3 px-6 py-4 bg-neon-pink text-white font-black text-[11px] tracking-[0.25em] rounded-full uppercase pointer-events-auto hover:bg-white hover:text-neon-pink transition-all shadow-[0_0_40px_rgba(255,0,102,0.6)] border border-white/30 active:scale-95"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0 shadow-[0_0_10px_white]" />
            <span>ACTIVAR REALIDAD AUMENTADA</span>
          </button>
        </div>
      )}

      {/* Quick Edit Overlay */}
      <AnimatePresence>
        {editingId && activeEditingArtifact && (
          <QuickEditHUD 
            artifact={activeEditingArtifact} 
            onClose={() => setEditingId(null)} 
            onUpdate={updateArtifact}
            onRemove={(id) => {
              removeArtifact(id);
              setEditingId(null);
            }}
            onOpenCheckout={onOpenCheckout}
          />
        )}
      </AnimatePresence>

      {/* ─── Unified Compact Command Bar ─── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[96%]">
        <div className="flex items-center gap-0.5 bg-black/80 backdrop-blur-3xl border border-white/[0.06] rounded-2xl p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-sm font-black text-white tabular-nums leading-none">{positionedItems.length}</span>
            <span className="text-[7px] font-mono text-white/25 uppercase tracking-wider leading-none hidden sm:inline">Activos</span>
          </div>

          <div className="w-px h-5 bg-white/[0.06] shrink-0" />

          {/* Arrangement Modes */}
          <div className="flex items-center gap-0.5 px-1 overflow-x-auto no-scrollbar">
            {Object.entries(arrangements).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => setArrangement(key)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-[8px] font-bold tracking-wider uppercase transition-all whitespace-nowrap",
                  arrangement === key 
                    ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-white/25 hover:text-white/60 hover:bg-white/5"
                )}
              >
                {mode.name.length > 12 ? mode.name.split(' ')[0] : mode.name}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-white/[0.06] shrink-0" />

          {/* Spacing Slider */}
          <div className="flex items-center gap-1.5 px-2.5 shrink-0">
            <MoveHorizontal className="w-3 h-3 text-white/15 shrink-0" />
            <div className="w-14 h-[3px] bg-white/5 rounded-full relative">
              <div className="absolute inset-y-0 left-0 bg-cyan-500/40 rounded-full" style={{ width: `${(spacing / 1.5) * 100}%` }} />
              <input 
                type="range" min="0.05" max="1.5" step="0.05"
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Light Slider */}
          <div className="flex items-center gap-1.5 px-2.5 shrink-0">
            <Sun className="w-3 h-3 text-white/15 shrink-0" />
            <div className="w-14 h-[3px] bg-white/5 rounded-full relative">
              <div className="absolute inset-y-0 left-0 bg-amber-400/40 rounded-full" style={{ width: `${(lightIntensity / 250) * 100}%` }} />
              <input 
                type="range" min="20" max="250"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="w-px h-5 bg-white/[0.06] shrink-0" />

          {/* Reset Button */}
          <button 
            onClick={() => {
              setArrangement('LINEAR_CENTER');
              setLightIntensity(100);
              setSpacing(0.3);
              setGlobalOffset({ x: 0, y: 0 });
              setCustomOffsets({});
              if (controlsRef.current) controlsRef.current.reset();
            }}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/25 hover:text-cyan-400 transition-all shrink-0"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Compact Navigation Hint (top-left) */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <p className="text-[8px] font-mono text-white/15 tracking-wider uppercase">
          Click: Arrastrar · Doble click: Editar · Scroll: Zoom
        </p>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255,255,255,0.4);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

