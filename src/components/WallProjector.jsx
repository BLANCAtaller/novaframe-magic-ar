'use client';

import React, { useState, useRef, useMemo, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Lamp, RotateCcw, RotateCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

import { WallBackground, SceneLighting } from './EnvironmentEngine3D';

/* ─── Error Boundary for 3D Components ─── */
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { 
    console.error("3D Projector failed:", error);
  }
  render() {
    if (this.state.hasError) return (
      <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center justify-center p-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-white font-black uppercase tracking-tighter">Error en Visualizador 3D</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest max-w-[240px]">
          Tu dispositivo agotó la memoria gráfica. Recarga la página para reintentar.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-black font-black text-[10px] tracking-widest rounded-full uppercase"
        >
          RECARGAR LABORATORIO
        </button>
      </div>
    );
    return this.props.children;
  }
}

// Parche temporal para silenciar el warning de de react-three-fiber deprecado en "Clock".
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
      return;
    }
    originalWarn(...args);
  };
}

/* ─── Shared Utils ─── */
function parseSizeCm(sizeStr) {
  if (!sizeStr) return { wCm: 50, hCm: 70 };
  const match = sizeStr.match(/(\d+)x(\d+)/);
  if (!match) return { wCm: 50, hCm: 70 };
  return { wCm: parseInt(match[1], 10), hCm: parseInt(match[2], 10) };
}
const CM_TO_UNIT = 1.5 / 100;
function getCanvasDepth(heightCm) {
  const t = THREE.MathUtils.clamp((heightCm - 40) / 160, 0, 1);
  return THREE.MathUtils.lerp(0.05, 0.09, t);
}

/* ═══════════════════════════════════════════════════════════
   3D Canvas Frame — SINGLE BOX with multi-material
   No overlapping planes = no glitch lines
   ═══════════════════════════════════════════════════════════ */
function CanvasFrame({ imageUrl, widthCm, heightCm }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;
    
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    
    loader.load(imageUrl, (tex) => {
      if (!isMounted) {
        tex.dispose();
        return;
      }
      
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
      
      setTexture((oldTex) => {
        if (oldTex) oldTex.dispose();
        return tex;
      });
    });

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  const W = widthCm * CM_TO_UNIT;
  const H = heightCm * CM_TO_UNIT;
  const D = getCanvasDepth(heightCm);
  const halfD = D / 2;
  const barThick = Math.max(0.03, D * 0.3);

  // Subtle "breathing" animation that keeps the piece flush to the wall
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Set Z fixed to the wall
      groupRef.current.position.z = -1.5 + halfD;
      // Raising the baseline Y for better visibility in the suite
      groupRef.current.position.y = 0.72 + Math.sin(t * 0.5) * 0.015; 
    }
  });

    // 6 materials: [+X right, -X left, +Y top, -Y bottom, +Z front, -Z back]
    const materials = useMemo(() => {
      if (!texture) return null;

      // Depth-to-Width/Height ratios for edge sampling
      const fX = D / W;
      const fY = D / H;

      // Standard Front: Subtle 0.5% overscan to eliminate white edge lines (bleeding)
      const texFront = texture.clone();
      texFront.repeat.set(0.99, 0.99);
      texFront.offset.set(0.005, 0.005);

      const matFront = new THREE.MeshStandardMaterial({ 
        map: texFront, 
        roughness: 0.35, 
        metalness: 0.12,
        envMapIntensity: 1.2 
      });

      // Helper to create mirrored edge textures
      const createEdgeMat = (side) => {
        const tex = texture.clone();
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        
        if (side === 'right') {
          // Sample the last 'fX' portion and mirror it
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
          color: '#eeeeee' // Slight tint to distinguish sides slightly
        });
      };

      const matBack = new THREE.MeshStandardMaterial({ 
        color: '#2a221a', 
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

  if (!texture) {
    return (
      <group position={[0, 0, -1.5 + halfD]}>
        <mesh>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#1a1a1a" wireframe opacity={0.3} transparent />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Single box — texture on front face, cream sides, dark back */}
      <mesh ref={meshRef} castShadow receiveShadow material={materials}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* Stretcher bars (back only) */}
      <mesh position={[0, 0, -halfD + barThick / 2 + 0.005]}>
        <boxGeometry args={[W * 0.9, barThick, barThick]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, -halfD + barThick / 2 + 0.005]}>
        <boxGeometry args={[barThick, H * 0.9, barThick]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Corner braces */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => (
        <mesh
          key={i}
          position={[sx * W * 0.2, sy * H * 0.2, -halfD + barThick / 2 + 0.005]}
          rotation={[0, 0, (sx * sy > 0 ? 1 : -1) * Math.PI / 4]}
        >
          <boxGeometry args={[0.025, Math.min(W, H) * 0.15, barThick * 0.7]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.75} metalness={0.05} />
        </mesh>
      ))}

      {/* Hanging wire */}
      <mesh position={[0, H * 0.32, -halfD + 0.008]}>
        <torusGeometry args={[Math.min(W, H) * 0.12, 0.004, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <mesh key={`a-${i}`} position={[s * W * 0.25, H * 0.32, -halfD + 0.01]}>
          <cylinderGeometry args={[0.012, 0.012, 0.015, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}


/* ─── OrbitControls with wall collision prevention ─── */
const WALL_Z = -1.5;       // Wall plane position
const CAM_Z_MIN = -0.4;    // Camera must stay well in front of this Z to avoid clipping

function CameraClamp() {
  useFrame(({ camera }) => {
    // Prevent camera from crossing behind the wall
    if (camera.position.z < CAM_Z_MIN) {
      camera.position.z = CAM_Z_MIN;
    }
    // Prevent camera from going too far below the floor
    if (camera.position.y < -0.1) {
      camera.position.y = -0.1;
    }
    // Prevent camera from crossing the ceiling
    if (camera.position.y > 3.2) {
      camera.position.y = 3.2;
    }
  });
  return null;
}

function ControlsWrapper({ controlsRef, autoRotate, targetZ = 0 }) {
  return (
    <>
      <CameraClamp />
      <OrbitControls
        ref={controlsRef}
        target={[0, 0.7, targetZ]}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={1.4}
        maxDistance={10}
        minPolarAngle={0.5}
        maxPolarAngle={Math.PI / 1.85}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        rotateSpeed={1.8}
        zoomSpeed={1.5}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main WallProjector Component
   
   KEY FIX: No longer wraps the scene in <XR>. 
   The XR store and <XR> component were causing crashes on 
   mobile devices that don't fully support WebXR.
   Instead, AR is launched via a separate window using the 
   native browser AR capabilities (model-viewer pattern).
   ═══════════════════════════════════════════════════════════ */
export default function WallProjector({ imageUrl, product, size, finish, activeVariant, forcedEnv }) {
  const [activeEnv, setActiveEnv] = useState('modern');
  const [lightIntensity, setLightIntensity] = useState(100);
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef();
  const [arSupported, setArSupported] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    const existingVideo = document.getElementById('ar-camera-video');
    if (existingVideo) existingVideo.remove();
    
    // Restore body and parents
    document.body.style.backgroundColor = '';
    const main = document.querySelector('main');
    if (main) main.style.backgroundColor = '';
    
    setCameraActive(false);
  }, []);
  
  useEffect(() => {
    // Check WebXR support without creating a store
    if (typeof navigator !== 'undefined' && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setArSupported(supported))
        .catch(() => setArSupported(false));
    }
  }, []);

  const handleEnterAR = useCallback(async () => {
    if (!arSupported) {
      // PREMIUM FALLBACK: Camera Simulation Mode for iOS/Non-WebXR
      if (cameraActive) {
        stopCamera();
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        
        const container = document.getElementById('wall-projector-container');
        
        if (!videoRef.current) {
          videoRef.current = document.createElement('video');
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.style.position = 'absolute';
          videoRef.current.style.top = '0';
          videoRef.current.style.left = '0';
          videoRef.current.style.width = '100%';
          videoRef.current.style.height = '100%';
          videoRef.current.style.objectFit = 'cover';
          videoRef.current.style.zIndex = '0';
          videoRef.current.style.pointerEvents = 'none';
          videoRef.current.id = 'ar-camera-video';
        }
        
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        if (container && !container.contains(videoRef.current)) {
          container.prepend(videoRef.current);
        }
        
        // Force body and parents to be transparent
        document.body.style.backgroundColor = 'transparent';
        const main = document.querySelector('main');
        if (main) main.style.backgroundColor = 'transparent';
        
        setCameraActive(true);
        setActiveEnv('zen');
        
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission();
        }
      } catch (err) {
        console.error("Camera Error:", err);
        alert("Para ver el cuadro en tu espacio, necesitamos permiso para acceder a la cámara.");
      }
      return;
    }
    
    try {
      // Lazy-load XR dependencies only when user requests AR
      const { createXRStore } = await import('@react-three/xr');
      const store = createXRStore({ emulate: false, frameBufferScaling: 'default' });
      await store.enterAR();
    } catch (err) {
      console.error("AR Error:", err);
      alert("No se pudo iniciar la Realidad Aumentada. Verifica los permisos de tu navegador.");
    }
  }, [arSupported, cameraActive, stopCamera]);

  const environments = {
    modern: { name: 'PABELLÓN FUTURO' },
    industrial: { name: 'TERMINAL 04' },
    suite: { name: 'SUITE_ZENITH' },
    office: { name: 'OFICINA_INDUSTRIAL' },
    bedroom: { name: 'RECÁMARA_OSCURA' },
    living: { name: 'SALA_MINIMALISTA' },
    zen: { name: 'VACÍO_ESTÁNDAR' },
  };

  useEffect(() => {
    if (forcedEnv && environments[forcedEnv]) {
      setActiveEnv(forcedEnv);
    }
  }, [forcedEnv]);

  const handleReset = useCallback(() => {
    if (controlsRef.current) controlsRef.current.reset();
  }, []);

  const { wCm, hCm } = useMemo(() => parseSizeCm(size), [size]);

  const displayUrl = useMemo(() => {
    // 1. If imageUrl is provided and it's NOT the base product image, 
    // it means the parent (like ConfiguratorLayout) already calculated a specific 
    // variant or sub-variant URL. We trust it completely.
    if (imageUrl && imageUrl !== product?.imageUrl) return imageUrl;

    // 2. Fallback: If imageUrl is the base image or missing, use activeVariant 
    // to find the right file in the product object (legacy support for ProductModal).
    if (activeVariant === 'pbn2') return product?.imageUrlPBN2 || product?.imageUrlPBN || imageUrl;
    if (activeVariant === 'pbn') return product?.imageUrlPBN || imageUrl;
    if (activeVariant === 'color5') return product?.imageUrlColor5 || product?.imageUrl || imageUrl;
    if (activeVariant === 'color4') return product?.imageUrlColor4 || product?.imageUrl || imageUrl;
    if (activeVariant === 'color3') return product?.imageUrlColor3 || product?.imageUrl || imageUrl;
    if (activeVariant === 'color2') return product?.imageUrlColor2 || product?.imageUrl || imageUrl;
    
    // 3. Final fallback: Use imageUrl or whatever color variant we can find
    return imageUrl || product?.imageUrlColor || product?.imageUrl;
  }, [activeVariant, product, imageUrl]);

  return (
    <div 
      id="wall-projector-container"
      className={cn(
        "relative w-full h-full flex flex-col overflow-hidden transition-colors duration-500",
        cameraActive ? "bg-transparent" : "bg-black"
      )}
    >
      {/* Header - Compact on mobile */}
      <div className="absolute top-4 left-5 md:top-5 md:left-7 z-30 text-white/20 font-mono text-[7px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em]">
        PROYECCIÓN_SINTÉTICA // {environments[activeEnv].name}
      </div>

      {/* Variant indicator */}
      <div className="absolute top-4 right-4 md:top-5 md:right-7 z-30">
        <div className={cn(
          "px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[6px] md:text-[8px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase border transition-all duration-300",
          activeVariant === 'color5' ? "text-neon-pink border-neon-pink/30 bg-neon-pink/10" :
          activeVariant === 'color4' ? "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10" :
          activeVariant === 'color3' ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" :
          activeVariant === 'color2' ? "text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10" : 
          "text-neon-pink border-neon-pink/30 bg-neon-pink/10"
        )}>
          {activeVariant?.includes('color') ? '◉ COLOR' : '◇ PBN'}
        </div>
      </div>

      {/* Size indicator */}
      <div className="absolute top-10 right-4 md:top-14 md:right-7 z-30">
        <div className="text-[7px] md:text-[10px] font-mono text-white/15 tracking-widest">
          {wCm}×{hCm}CM
        </div>
      </div>

      {/* Instructions overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center w-[90%] max-w-[300px]"
      >
        <div className="bg-black/60 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/10">
          <p className="text-white/50 text-[9px] md:text-[11px] font-mono tracking-widest uppercase">
            Arrastra para rotar 360°<br className="md:hidden" />
            <span className="hidden md:inline"> · </span>
            Scroll para zoom
          </p>
        </div>
      </motion.div>

      {/* 3D Canvas — NO XR WRAPPER to prevent mobile crashes */}
      <div className="flex-1 w-full cursor-grab active:cursor-grabbing">
        <CanvasErrorBoundary>
          <Canvas
            shadows
            camera={{ position: [1.2, 0.4, 2.3], fov: 38, near: 0.05 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            }}
            onCreated={({ gl }) => {
              if (cameraActive) gl.setClearColor(0x000000, 0);
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <SceneLighting intensity={lightIntensity} environment={activeEnv} />
              
              {!cameraActive && <WallBackground environment={activeEnv} />}
              
              <CanvasFrame
                imageUrl={displayUrl}
                widthCm={wCm}
                heightCm={hCm}
              />

              {!cameraActive && (
                <ContactShadows
                  position={[0, -1.99, -1.5]}
                  opacity={0.45}
                  scale={10}
                  blur={2}
                  far={4}
                />
              )}

              <ControlsWrapper 
                controlsRef={controlsRef} 
                autoRotate={autoRotate} 
                targetZ={-1.5 + getCanvasDepth(hCm) / 2} 
              />
              
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* AR Button - Label changes if camera simulation is active */}
      <div className="absolute top-12 left-4 md:bottom-8 md:top-auto md:left-6 z-40 pointer-events-none">
        <button
          onClick={handleEnterAR}
          className={cn(
            "flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 text-white font-black text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] rounded-full uppercase pointer-events-auto transition-all border border-white/40 active:scale-95",
            cameraActive ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]" : "bg-neon-pink shadow-[0_0_30px_rgba(255,0,102,0.5)] hover:bg-white hover:text-neon-pink"
          )}
        >
          <div className={cn("w-2 h-2 rounded-full bg-white animate-pulse shrink-0 shadow-[0_0_8px_white]", cameraActive && "animate-none bg-white")} />
          <span>{cameraActive ? 'Salir de AR' : 'Ver en AR'}</span>
        </button>
      </div>

      {/* Light & Rotation Controls - Top right on mobile, bottom right on desktop */}
      <div className="absolute top-12 right-4 md:right-6 md:bottom-8 md:top-auto flex items-center gap-2 p-1.5 md:p-2 bg-black/60 backdrop-blur-2xl border border-white/5 rounded-full z-40 pointer-events-auto">
        <div className="flex items-center gap-2 border-r border-white/5 pr-2 pl-1">
          <Lamp size={11} className="text-white/20 shrink-0" />
          <input
            type="range" min="30" max="150"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(Number(e.target.value))}
            className="w-12 md:w-20 accent-neon-cyan h-[2px] bg-white/10 rounded-full cursor-pointer"
          />
        </div>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={cn(
            "p-1.5 rounded-full border transition-all flex items-center justify-center",
            autoRotate
              ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
              : "bg-white/5 border-white/5 text-white/20 hover:text-white"
          )}
        >
          <RotateCw size={11} />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-full bg-white/5 border border-white/5 text-white/20 hover:text-white transition-all flex items-center justify-center"
        >
          <RotateCcw size={11} />
        </button>
      </div>
    </div>
  );
}
