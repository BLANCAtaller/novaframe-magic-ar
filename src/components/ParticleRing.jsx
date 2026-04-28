'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Generate static particle positions outside of the React render cycle to avoid purity errors
const generateRing = (count, r1, r2, noiseY = 0.5) => {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    
    // Torus math
    const x = (r1 + r2 * Math.cos(phi)) * Math.cos(theta);
    const y = r2 * Math.sin(phi) + (Math.random() - 0.5) * noiseY;
    const z = (r1 + r2 * Math.cos(phi)) * Math.sin(theta);
    
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
};

const INITIAL_OUTER_POINTS = generateRing(4000, 3.5, 0.4, 0.8);
const INITIAL_INNER_POINTS = generateRing(2500, 2.0, 0.3, 0.5);
const INITIAL_CORE_POINTS = generateRing(1000, 0.5, 1.2, 2.0);

const ParticleSystem = () => {
  const outerRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (outerRef.current && innerRef.current && coreRef.current) {
      outerRef.current.rotation.y += delta * 0.15;
      outerRef.current.rotation.z += delta * 0.1;
      
      innerRef.current.rotation.y -= delta * 0.2;
      innerRef.current.rotation.x += delta * 0.15;
      
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.z -= delta * 0.4;
      
      // Zero-gravity float
      outerRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      innerRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.7) * 0.2;
    }
  });

  return (
    <group rotation={[Math.PI / 5, Math.PI / 4, 0]} scale={1.2}>
      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={INITIAL_OUTER_POINTS.length / 3} array={INITIAL_OUTER_POINTS} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={2.5} sizeAttenuation={false} transparent color="#00ffff" depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={INITIAL_INNER_POINTS.length / 3} array={INITIAL_INNER_POINTS} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={3} sizeAttenuation={false} transparent color="#ff007f" depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={INITIAL_CORE_POINTS.length / 3} array={INITIAL_CORE_POINTS} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={1.5} sizeAttenuation={false} transparent color="#ffffff" depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

export default function ParticleRing() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[700px] relative pointer-events-none">
      <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <React.Suspense fallback={null}>
          <ParticleSystem />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
