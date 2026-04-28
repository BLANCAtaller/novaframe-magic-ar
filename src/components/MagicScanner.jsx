"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles as SparkleIcon, Info, ShieldCheck, Zap, Crosshair, Activity, Cpu } from "lucide-react";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { MAGIC_REGISTRY } from "@/config/magic-registry";

// Holographic Shader with Dynamic Reflection/Shine
const HologramShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    opacity: { value: 1.0 },
    shinePos: { value: new THREE.Vector2(0.5, 0.5) },
    shineIntensity: { value: 0.3 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float opacity;
    uniform vec2 shinePos;
    uniform float shineIntensity;
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float dist = distance(vUv, shinePos);
      float shine = smoothstep(0.3, 0.0, dist) * shineIntensity;
      float scanline = sin(vUv.y * 350.0 + time * 12.0) * 0.04;
      float flicker = sin(time * 55.0) * 0.015 + 0.985;
      vec3 baseColor = texel.rgb + vec3(0.0, 0.04, 0.08);
      vec3 finalColor = baseColor + (vec3(1.0) * shine) + scanline;
      gl_FragColor = vec4(finalColor, texel.a * opacity * flicker);
    }
  `
};

export default function MagicScanner({ id = "default" }) {
  const config = MAGIC_REGISTRY[id] || MAGIC_REGISTRY["default"];
  const containerRef = useRef(null);
  const [scanState, setScanState] = useState("loading"); // loading, scanning, found, error
  const [errorMessage, setErrorMessage] = useState("");
  const [telemetry, setTelemetry] = useState({ hex: "0x00", coord: "0,0,0" });

  useEffect(() => {
    let mindarThree;
    let isUnmounted = false;
    let startTime = Date.now();
    let shaderMaterial;

    const initAR = async () => {
      try {
        if (!containerRef.current) return;

        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: config.target,
          uiScanning: "no",
          uiLoading: "no",
          filterMinCF: 0.0001,
          filterBeta: 0.1,
        });

        const { renderer, scene, camera } = mindarThree;
        const anchor = mindarThree.addAnchor(0);

        const video = document.createElement("video");
        video.src = config.video;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.loop = true;
        video.setAttribute("webkit-playsinline", "true");
        video.setAttribute("playsinline", "true");

        const texture = new THREE.VideoTexture(video);
        let volume;

        shaderMaterial = new THREE.ShaderMaterial({
          uniforms: THREE.UniformsUtils.clone(HologramShader.uniforms),
          vertexShader: HologramShader.vertexShader,
          fragmentShader: HologramShader.fragmentShader,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        shaderMaterial.uniforms.tDiffuse.value = texture;

        const sideMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x002222, 
          transparent: true, 
          opacity: 0.7 
        });

        video.addEventListener("loadedmetadata", () => {
          if (isUnmounted) return;
          const aspectRatio = video.videoHeight / video.videoWidth;
          const geometry = new THREE.BoxGeometry(1.0, 1.0 * aspectRatio, 0.04);
          const materials = [
            sideMaterial, sideMaterial, sideMaterial, sideMaterial,
            shaderMaterial, sideMaterial
          ];
          
          if (volume) anchor.group.remove(volume);
          volume = new THREE.Mesh(geometry, materials);
          
          const basePos = config.position || [0, 0, 0.02];
          volume.position.set(...basePos);
          if (config.rotation) volume.rotation.set(...config.rotation);
          
          volume.scale.set(0, 0, 0); 
          anchor.group.add(volume);
        });

        const particleCount = 100;
        const particlesGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        for(let i=0; i<particleCount * 3; i++) {
          positions[i] = 0;
          velocities[i] = (Math.random() - 0.5) * 0.025;
        }
        particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: 0x00ffff,
          size: 0.007,
          transparent: true,
          blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particlesGeom, particleMat);
        particles.visible = false;
        anchor.group.add(particles);

        anchor.onTargetFound = () => {
          if (isUnmounted) return;
          video.play().catch(e => console.warn("Video play failed:", e));
          setScanState("found");
          if (volume) volume.userData.animating = true;
          particles.visible = true;
          for(let i=0; i<particleCount * 3; i++) positions[i] = 0;
          particlesGeom.attributes.position.needsUpdate = true;
        };

        anchor.onTargetLost = () => {
          if (isUnmounted) return;
          video.pause();
          setScanState("scanning");
          if (volume) {
            volume.scale.set(0, 0, 0);
            volume.userData.animating = false;
          }
          particles.visible = false;
        };

        await mindarThree.start();
        if (!isUnmounted) setScanState("scanning");

        renderer.setAnimationLoop(() => {
          if (isUnmounted) return;
          const time = (Date.now() - startTime) / 1000;
          
          if (shaderMaterial) {
            shaderMaterial.uniforms.time.value = time;
            if (volume) {
              const camPos = new THREE.Vector3();
              camera.getWorldPosition(camPos);
              const objPos = new THREE.Vector3();
              volume.getWorldPosition(objPos);
              const dir = camPos.sub(objPos).normalize();
              shaderMaterial.uniforms.shinePos.value.set(0.5 + dir.x * 0.4, 0.5 + dir.y * 0.4);
              shaderMaterial.uniforms.shineIntensity.value = 0.25 + Math.sin(time * 1.5) * 0.05;

              if (scanState === "found") {
                const targetScale = config.scale || 1.0;
                volume.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.04);
              }
            }
          }

          if (volume && volume.userData.animating) {
            volume.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
          }

          if (particles.visible) {
            const posAttr = particlesGeom.attributes.position;
            for(let i=0; i<particleCount; i++) {
              posAttr.array[i*3] += velocities[i*3];
              posAttr.array[i*3+1] += velocities[i*3+1];
              posAttr.array[i*3+2] += velocities[i*3+2];
            }
            posAttr.needsUpdate = true;
            particleMat.opacity = Math.max(0, 1 - (time % 1.5));
          }

          if (Math.random() > 0.96) {
            setTelemetry({
              hex: "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase(),
              coord: `${(Math.random()*10).toFixed(2)},${(Math.random()*10).toFixed(2)},${(Math.random()*10).toFixed(2)}`
            });
          }
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error("MindAR Error:", err);
        if (!isUnmounted) {
          setScanState("error");
          setErrorMessage("Error de compatibilidad. Usa Chrome/Safari y da permisos.");
        }
      }
    };

    initAR();

    return () => {
      isUnmounted = true;
      if (mindarThree) {
        try {
          if (mindarThree.renderer) {
            mindarThree.renderer.setAnimationLoop(null);
            mindarThree.renderer.dispose();
          }
          if (mindarThree.stop) mindarThree.stop();
        } catch (e) {
          if (!e.message?.includes('stopProcessVideo')) {
            console.warn("MindAR Cleanup Warning:", e);
          }
        }
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] bg-transparent flex flex-col items-center justify-center overflow-hidden font-sans">
      <style jsx global>{`
        nav, footer, .whatsapp-fab, #system-loader { display: none !important; }
        /* Forzar al video de MindAR a ser el fondo real sin barras negras */
        #mindar-container video { 
          object-fit: cover !important; 
          width: 100vw !important; 
          height: 100vh !important; 
          position: fixed !important; 
          top: 0 !important; 
          left: 0 !important;
          z-index: -1 !important;
        }
        canvas {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        }
        body { overflow: hidden !important; margin: 0 !important; background: black !important; }
        .glass-panel { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>

      {/* 1. MindAR Container */}
      <div id="mindar-container" ref={containerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* 2. HUD - Menos intrusivo para evitar barras negras */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 border-[10px] md:border-[20px] border-black/20" />
        
        {/* Targeting Corners */}
        <div className="absolute top-12 left-12 w-16 h-16 border-t border-l border-neon-cyan/40" />
        <div className="absolute top-12 right-12 w-16 h-16 border-t border-r border-neon-cyan/40" />
        <div className="absolute bottom-12 left-12 w-16 h-16 border-b border-l border-neon-cyan/40" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border-b border-r border-neon-cyan/40" />
      </div>

      {/* 3. Header UI */}
      <div className="absolute top-0 left-0 w-full p-6 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-neon-cyan animate-pulse" />
          <h1 className="text-white font-black text-[10px] tracking-[0.4em] uppercase">
            NovaFrame <span className="text-neon-cyan">Magic</span>
          </h1>
        </div>
        
        <button
          onClick={() => (window.location.href = "/")}
          className="p-2 rounded-full glass-panel hover:bg-neon-pink/20 transition-all pointer-events-auto"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 4. Scanner Indicator */}
      <AnimatePresence>
        {scanState === "scanning" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-neon-cyan font-black text-[8px] tracking-[0.2em] uppercase animate-pulse">Escaneando</p>
              </div>
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-neon-cyan/80 shadow-[0_0_10px_rgba(0,255,255,1)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Found UI - Flotante para no crear barras negras */}
      <div className="absolute bottom-10 left-0 w-full px-6 z-30 flex justify-center">
        <AnimatePresence>
          {scanState === "found" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="px-6 py-3 rounded-xl glass-panel border-neon-cyan/40 flex items-center gap-4 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
              <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                <SparkleIcon className="w-4 h-4 text-neon-cyan" />
              </div>
              <span className="text-white font-black text-[9px] uppercase tracking-widest">Alicia Sincronizada</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Error View */}
      {scanState === "error" && (
        <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 text-center">
          <Info className="w-12 h-12 text-red-500 mb-6" />
          <h2 className="text-white font-black text-xl mb-4 uppercase">Error de Sincronía</h2>
          <button onClick={() => (window.location.reload())} className="px-10 py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest text-[9px]">Reiniciar</button>
        </div>
      )}
    </div>
  );
}
