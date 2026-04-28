'use client';

import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Shared Configurations ─── */
export const ENV_CONFIGS = {
  modern: { name: 'PABELLÓN FUTURO', wall: '#4a5568', floor: '#2d3748' },
  industrial: { name: 'TERMINAL 04', wall: '#333336', floor: '#1a1a1c' },
  suite: { name: 'SUITE_ZENITH', wall: '#1a1a1a', floor: '#12100e' },
  office: { name: 'OFICINA INDUSTRIAL', wall: '#1c1c1e', floor: '#121214' },
  living: { name: 'SALA MINIMALISTA', wall: '#c8c8cc', floor: '#a9a9af' },
  standard: { name: 'VACÍO_ESTÁNDAR', wall: '#151515', floor: '#0a0a0a' },
};

/* ─── High-Fidelity Suite Zenith Furniture ─── */
function SuiteZenithFurniture() {
  return (
    <group>
      {/* Ceiling Wash Shadow effect */}
      <mesh position={[0, 3.8, -1.49]}>
        <planeGeometry args={[28, 0.5]} />
        <meshStandardMaterial color="#332211" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Rug */}
      <mesh position={[0, -1.98, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={1} metalness={0} />
      </mesh>

      {/* Bed Frame */}
      <group position={[0, -1.85, 0.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.38, 4.35]} />
          <meshPhysicalMaterial 
            color="#080808" 
            roughness={0.4} 
            metalness={0.05} 
            clearcoat={0.15} 
            reflectivity={0.5}
          />
        </mesh>
      </group>

      {/* Mattress */}
      <group position={[0, -1.45, 0.8]}>
        <RoundedBox args={[2.4, 0.35, 4.2]} radius={0.12} smoothness={8} castShadow receiveShadow>
          <meshPhysicalMaterial color="#0d0d0d" roughness={0.9} />
        </RoundedBox>
      </group>

      {/* Bedding Layers - Cozy Duvet */}
      <group position={[0, -1.15, 0.7]}>
        {/* Main Duvet covering the mattress */}
        <RoundedBox args={[2.5, 0.3, 3.4]} radius={0.14} smoothness={10} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#141414" 
            roughness={0.95} 
            sheen={0.8} 
            sheenRoughness={0.5} 
            sheenColor="#333"
          />
        </RoundedBox>
        {/* Folded blanket at the foot of the bed (Perfectly rounded edges to simulate soft thick fabric) */}
        <RoundedBox args={[2.54, 0.1, 0.9]} radius={0.05} smoothness={12} position={[0, 0.17, 1.0]} castShadow>
          <meshPhysicalMaterial color="#1a1816" roughness={1.0} sheen={0.3} sheenColor="#fff" />
        </RoundedBox>
        {/* Blanket draping fold layer */}
        <RoundedBox args={[2.52, 0.06, 0.85]} radius={0.03} smoothness={12} position={[0, 0.22, 0.95]} castShadow>
          <meshPhysicalMaterial color="#1f1d1a" roughness={1.0} sheen={0.3} />
        </RoundedBox>
      </group>

      {/* Luxury Wide Headboard */}
      <group position={[0, -1.1, -1.4]}>
        {/* Main large headboard spanning across */}
        <RoundedBox args={[3.2, 1.2, 0.15]} radius={0.05} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#080808" 
            roughness={0.8} 
            sheen={0.5} 
            clearcoat={0.1} 
            clearcoatRoughness={0.6}
          />
        </RoundedBox>
        {/* Vertical tufted padded panels on the headboard */}
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <RoundedBox key={i} args={[0.7, 1.0, 0.1]} radius={0.05} position={[x, 0, 0.08]} castShadow>
            <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} sheen={0.6} />
          </RoundedBox>
        ))}
      </group>

      {/* Ultra-Realistic Detailed Pillows Set */}
      <group position={[0, -0.85, -1.05]}>
        
        {/* Back sleeping pillows (Oxford Style with fabric flange/border) */}
        {[-0.55, 0.55].map((x, i) => (
          <group key={`pb-${i}`} position={[x, -0.05, -0.1]} rotation={[0.4, 0, 0]}>
            {/* Main puffy pillow body */}
            <RoundedBox args={[0.8, 0.12, 0.45]} radius={0.05} smoothness={8} castShadow>
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.9} sheen={1.0} sheenColor="#555" />
            </RoundedBox>
            {/* Oxford fabric flange (the flat border around the pillow) */}
            <RoundedBox args={[0.95, 0.02, 0.6]} radius={0.01} smoothness={4} castShadow>
              <meshPhysicalMaterial color="#151515" roughness={1.0} sheen={1.0} />
            </RoundedBox>
          </group>
        ))}

        {/* Front decorative pillows (Tufted with piping edge) */}
        {[-0.45, 0.45].map((x, i) => (
          <group key={`pf-${i}`} position={[x, 0.02, 0.2]} rotation={[0.55, i === 0 ? 0.08 : -0.08, 0]}>
            {/* Main cushion */}
            <RoundedBox args={[0.6, 0.14, 0.4]} radius={0.06} smoothness={8} castShadow>
              <meshPhysicalMaterial color="#221e1a" roughness={0.8} sheen={0.8} sheenColor="#7a6752" />
            </RoundedBox>
            {/* Decorative piping/stitching around the edge */}
            <RoundedBox args={[0.63, 0.03, 0.43]} radius={0.015} smoothness={4} castShadow>
              <meshPhysicalMaterial color="#4a3b2c" metalness={0.5} roughness={0.5} clearcoat={0.2} />
            </RoundedBox>
            {/* Center tufted button */}
            <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
              <meshPhysicalMaterial color="#110f0d" roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Center accent cushion (Luxury Leather Bolster / Rolled cushion) */}
        <group position={[0, 0.02, 0.45]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.55, 32]} />
            <meshPhysicalMaterial color="#1f1610" roughness={0.6} clearcoat={0.3} />
          </mesh>
          {/* Bolster end-caps with stitching detail */}
          {[-0.28, 0.28].map((y, i) => (
             <mesh key={`cap-${i}`} position={[0, y, 0]} castShadow>
               <torusGeometry args={[0.08, 0.015, 16, 32]} />
               <meshPhysicalMaterial color="#4a3b2c" metalness={0.6} roughness={0.4} />
             </mesh>
          ))}
        </group>
      </group>

      {/* Under-bed Ambient LED Strip */}
      <rectAreaLight
        position={[0, -1.9, 0.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={3.8}
        height={2.2}
        intensity={6}
        color="#ff7b00"
      />

      {/* Side Tables & Lamps */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={i} position={[x, -1.45, -1.05]}>
          {/* Side Table */}
          <RoundedBox args={[0.8, 0.35, 0.6]} radius={0.05} castShadow receiveShadow>
            <meshPhysicalMaterial color="#050403" roughness={0.4} clearcoat={0.5} />
          </RoundedBox>
          {/* Metallic Trim */}
          <RoundedBox args={[0.82, 0.05, 0.62]} radius={0.02} position={[0, 0.15, 0]} castShadow>
            <meshPhysicalMaterial color="#4a3b2c" metalness={0.9} roughness={0.3} clearcoat={1} />
          </RoundedBox>
          
          {/* Premium Lamp */}
          <group position={[0, 0.18, 0.05]}>
            {/* Lamp Base */}
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.14, 0.55, 32]} />
              <meshPhysicalMaterial color="#020202" roughness={0.1} metalness={0.8} clearcoat={1} />
            </mesh>
            
            {/* Lamp Shade & Glow */}
            <group position={[0, 0.45, 0]}>
              {/* Inner Light Core (The Bulb) */}
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              
              {/* The Shade */}
              <mesh>
                <cylinderGeometry args={[0.22, 0.35, 0.5, 32, 1, true]} />
                <meshPhysicalMaterial 
                  color="#ffd4aa" 
                  emissive="#ff9a44" 
                  emissiveIntensity={1.5} 
                  side={THREE.DoubleSide} 
                  transparent 
                  opacity={0.85} 
                  roughness={0.8}
                />
              </mesh>

              {/* Point Light (No cast shadow to avoid hard artifacts on the wall) */}
              <pointLight intensity={12} distance={4} color="#ffaa55" decay={1.5} />
              
              {/* Downward light pooling on the table */}
              <spotLight 
                position={[0, 0, 0]} 
                rotation={[-Math.PI / 2, 0, 0]}
                angle={0.6} 
                penumbra={0.5} 
                intensity={8} 
                color="#ffaa55" 
                distance={3} 
                castShadow 
                shadow-bias={-0.0005}
                shadow-mapSize={[1024, 1024]}
              />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ─── Office Industrial Furniture ─── */
function OfficeIndustrialFurniture() {
  return (
    <group>
      {/* Side Window Light (Natural Fill) */}
      <rectAreaLight
        position={[-14, 2.5, 2]}
        rotation={[0, -Math.PI / 2, 0]}
        width={8}
        height={6}
        intensity={15}
        color="#cceeff"
      />

      {/* Physical Window Frame on the Left Wall */}
      <group position={[-14.9, 2.5, 2]} rotation={[0, Math.PI / 2, 0]}>
         {/* Window glass */}
         <mesh>
           <planeGeometry args={[8, 6]} />
           <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
         </mesh>
         {/* Window frames */}
         <mesh position={[0, 0, 0.05]}>
           <boxGeometry args={[8.2, 0.2, 0.1]} />
           <meshStandardMaterial color="#111111" metalness={0.8} />
         </mesh>
         <mesh position={[0, 3, 0.05]}>
           <boxGeometry args={[8.2, 0.2, 0.1]} />
           <meshStandardMaterial color="#111111" metalness={0.8} />
         </mesh>
         <mesh position={[0, -3, 0.05]}>
           <boxGeometry args={[8.2, 0.2, 0.1]} />
           <meshStandardMaterial color="#111111" metalness={0.8} />
         </mesh>
         <mesh position={[-4, 0, 0.05]}>
           <boxGeometry args={[0.2, 6.2, 0.1]} />
           <meshStandardMaterial color="#111111" metalness={0.8} />
         </mesh>
         <mesh position={[4, 0, 0.05]}>
           <boxGeometry args={[0.2, 6.2, 0.1]} />
           <meshStandardMaterial color="#111111" metalness={0.8} />
         </mesh>
         {/* Emissive backdrop behind window to simulate outside light */}
         <mesh position={[0, 0, -2]}>
           <planeGeometry args={[20, 15]} />
           <meshBasicMaterial color="#dcf0ff" />
         </mesh>
      </group>

      {/* Desk Top */}
      <group position={[0, -0.85, -0.6]}>
        <RoundedBox args={[3.8, 0.1, 1.4]} radius={0.03} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#2a1d12" 
            roughness={0.65} 
            metalness={0.1}
            clearcoat={0.2}
            clearcoatRoughness={0.3}
          />
        </RoundedBox>
      </group>

      {/* Desk Legs - Industrial Style */}
      {[-1.6, 1.6].map((x, i) => (
        <group key={i} position={[x, -1.45, -0.6]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.08, 1.1, 1.1]} />
            <meshPhysicalMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[0.12, 0.04, 1.2]} />
            <meshPhysicalMaterial color="#111" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* High-Detail Laptop */}
      <group position={[0.7, -0.79, -0.7]} rotation={[0, -0.3, 0]}>
        {/* Base */}
        <RoundedBox args={[0.48, 0.025, 0.36]} radius={0.01} position={[0, 0.012, 0]} castShadow>
          <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Screen */}
        <group position={[0, 0.02, -0.17]} rotation={[0.2, 0, 0]}>
          <RoundedBox args={[0.48, 0.32, 0.02]} radius={0.01} position={[0, 0.16, 0]} castShadow>
            <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          {/* Screen Content / Glow */}
          <mesh position={[0, 0.16, 0.011]}>
            <planeGeometry args={[0.45, 0.29]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Subtle emission light from screen onto desk */}
          <rectAreaLight position={[0, 0.1, 0.05]} width={0.4} height={0.3} intensity={2} color="#ffffff" />
        </group>
      </group>

      {/* Industrial Desk Lamp */}
      <group position={[-1.3, -0.79, -0.9]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 32]} />
          <meshPhysicalMaterial color="#050505" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
          <meshPhysicalMaterial color="#050505" metalness={0.9} />
        </mesh>
        <group position={[0.08, 0.65, 0]} rotation={[0, 0, -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 16]} />
            <meshPhysicalMaterial color="#050505" metalness={0.9} />
          </mesh>
          <group position={[0, 0.25, 0]} rotation={[0.4, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.15, 0.18, 32, 1, true]} />
              <meshPhysicalMaterial color="#050505" metalness={0.9} side={THREE.DoubleSide} />
            </mesh>
            <spotLight position={[0, 0.1, 0]} angle={0.6} penumbra={0.5} intensity={12} color="#fff4e0" shadow-bias={-0.0005} shadow-mapSize={[1024, 1024]} />
          </group>
        </group>
      </group>

      {/* Ergonomic Stool */}
      <group position={[0.2, -1.6, -0.1]}>
        <RoundedBox args={[0.65, 0.08, 0.65]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#0a0a0a" roughness={0.8} sheen={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.45, 16]} />
          <meshPhysicalMaterial color="#111" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.05, 32]} />
          <meshPhysicalMaterial color="#0a0a0a" metalness={0.8} />
        </mesh>
      </group>
      
      {/* Small Succulent */}
      <group position={[1.4, -0.79, -1.0]}>
         <mesh castShadow>
           <cylinderGeometry args={[0.09, 0.07, 0.16, 16]} />
           <meshPhysicalMaterial color="#f0f0f0" roughness={0.4} />
         </mesh>
         <mesh position={[0, 0.18, 0]}>
           <sphereGeometry args={[0.13, 16, 16]} />
           <meshPhysicalMaterial color="#3a5a2a" roughness={0.9} sheen={1} sheenColor="#2d4c1e" />
         </mesh>
      </group>
    </group>
  );
}

/* ─── Living Room Minimalist Furniture ─── */
function LivingRoomFurniture() {
  return (
    <group>
      {/* Polished Floor Base - Expanded and raised slightly to prevent Z-fighting (glitching) */}
      <mesh position={[0, -1.99, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 60]} />
        <meshPhysicalMaterial 
          color="#d0ccc5" 
          roughness={0.15} 
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Large Soft Rug */}
      <mesh position={[0, -1.98, 2.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial 
          color="#8c857d" 
          roughness={1} 
        />
      </mesh>

      {/* Right Wall with Architectural Window to fill the space */}
      <group position={[8.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        
        {/* Solid Wall Parts around the window */}
        <mesh position={[-25, 1.5, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#c8c8cc" roughness={0.9} />
        </mesh>
        <mesh position={[25, 1.5, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#c8c8cc" roughness={0.9} />
        </mesh>
        <mesh position={[0, 22.5, 0]} receiveShadow>
          <planeGeometry args={[10, 36]} />
          <meshStandardMaterial color="#c8c8cc" roughness={0.9} />
        </mesh>
        <mesh position={[0, -1.75, 0]} receiveShadow>
          <planeGeometry args={[10, 0.5]} />
          <meshStandardMaterial color="#c8c8cc" roughness={0.9} />
        </mesh>

        {/* The Window Itself */}
        <group position={[0, 1.5, 0]}>
          {/* Outdoor Bright Background (Prevents black void) */}
          <mesh position={[0, 0, -2]}>
            <planeGeometry args={[14, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Glass panel */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[10, 6]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transmission={0.9} 
              opacity={1} 
              transparent 
              roughness={0.1}
              ior={1.5}
            />
          </mesh>
          
          {/* Window Frames */}
          <mesh position={[0, 3, 0]} receiveShadow castShadow>
            <boxGeometry args={[10.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[0, -3, 0]} receiveShadow castShadow>
            <boxGeometry args={[10.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[-5, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.2, 6, 0.2]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[5, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.2, 6, 0.2]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[-1.66, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.1, 6, 0.1]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[1.66, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.1, 6, 0.1]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[10, 0.1, 0.1]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Sofa - Rotated 180 deg to face camera and moved to a safe distance */}
      <group position={[0, -1.6, -0.8]} rotation={[0, Math.PI, 0]}>
        {/* Main Base (Premium Matte Leather) */}
        <RoundedBox args={[4.2, 0.45, 1.4]} radius={0.1} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#8c5a3b" 
            roughness={0.85} 
            sheen={0.4} 
            sheenRoughness={0.9}
            sheenColor="#b88365"
            clearcoat={0.05}
            clearcoatRoughness={0.8}
          />
        </RoundedBox>
        {/* Backrest */}
        <RoundedBox args={[4.2, 0.8, 0.4]} radius={0.1} position={[0, 0.6, 0.5]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#8c5a3b" roughness={0.85} sheen={0.4} sheenColor="#b88365" />
        </RoundedBox>
        {/* Armrests */}
        {[-2.0, 2.0].map((x, i) => (
          <RoundedBox key={i} args={[0.3, 0.7, 1.4]} radius={0.1} position={[x, 0.4, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial color="#8c5a3b" roughness={0.85} sheen={0.4} sheenColor="#b88365" />
          </RoundedBox>
        ))}
        {/* Main Cushions (High Quality Matte Fabric) */}
        {[-0.95, 0.95].map((x, i) => (
          <RoundedBox key={i} args={[1.8, 0.25, 1.0]} radius={0.12} position={[x, 0.28, -0.1]} castShadow receiveShadow>
            <meshPhysicalMaterial color="#c4bcb1" roughness={1.0} sheen={0.2} sheenColor="#ffffff" />
          </RoundedBox>
        ))}
      </group>

      {/* Designer Coffee Table - In front of sofa */}
      <group position={[0, -1.75, 0.8]}>
        <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.04, 32]} />
          <meshPhysicalMaterial color="#5e3a21" roughness={0.7} metalness={0.05} clearcoat={0.2} />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.45, 32]} />
          <meshPhysicalMaterial color="#2d221c" metalness={0.1} roughness={0.8} />
        </mesh>
      </group>

      {/* Large Studio Plant - Flanking Left */}
      <group position={[-2.8, -1.6, -0.8]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.25, 0.8, 32]} />
          <meshPhysicalMaterial color="#eeeeee" roughness={0.3} metalness={0.1} clearcoat={0.5} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 1.0 + i * 0.2, 0]} rotation={[0, i * 1.5, 0.5]}>
            <sphereGeometry args={[0.5 - i * 0.1, 16, 16]} />
            <meshPhysicalMaterial color="#3a5a2a" roughness={0.8} sheen={1} sheenColor="#2d4c1e" />
          </mesh>
        ))}
      </group>

      {/* Minimalist Floor Lamp - Flanking Right */}
      <group position={[2.8, -1.6, -0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshPhysicalMaterial color="#050505" metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 3.0, 16]} />
          <meshPhysicalMaterial color="#050505" metalness={0.9} />
        </mesh>
        <mesh position={[0, 3.0, 0]} castShadow>
           <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
           <meshPhysicalMaterial color="#f0f0f0" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 3.0, 0]} intensity={15} color="#fff4e0" distance={8} castShadow />
      </group>
    </group>
  );
}


/* ─── Main Environment Engine Comp ─── */
import { useLoader, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function WallBackground({ environment, xrStore }) {
  const c = ENV_CONFIGS[environment] || ENV_CONFIGS.modern;
  const groupRef = useRef();
  
  // Try to load texture if wallImage exists
  const texture = c.wallImage ? useLoader(THREE.TextureLoader, c.wallImage) : null;
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  useFrame(() => {
    if (groupRef.current && xrStore) {
      // Ocultar entorno si estamos en Realidad Aumentada (sesión activa)
      const mode = xrStore.getState().mode || xrStore.getState().session ? 'AR' : 'inline';
      groupRef.current.visible = mode !== 'AR';
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Wall / Background Image */}
      <mesh position={[0, 0, -1.5]} receiveShadow>
        <planeGeometry args={[100, 40]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={c.wall} roughness={environment === 'suite' ? 0.9 : 0.8} />
        )}
      </mesh>

      {/* Complete Room Box (Seals the environment 100%) */}
      {!texture && (
        <mesh position={[0, 18, 0]}>
          <boxGeometry args={[100, 40, 100]} />
          <meshStandardMaterial color={c.wall} roughness={0.9} side={THREE.BackSide} />
        </mesh>
      )}
      
      {/* Floor - only if not using an image background */}
      {!texture && (
        <mesh position={[0, -1.99, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 60]} />
          {environment === 'suite' ? (
            <meshPhysicalMaterial 
              color="#0a0a0a" 
              roughness={0.2} 
              metalness={0.05} 
              reflectivity={0.6} 
              clearcoat={0.1}
            />
          ) : (
            <meshStandardMaterial color={c.floor} roughness={0.6} metalness={0.1} />
          )}
        </mesh>
      )}

      {/* Specific Decor */}
      {environment === 'suite' && <SuiteZenithFurniture />}
      {environment === 'office' && <OfficeIndustrialFurniture />}
      {environment === 'living' && <LivingRoomFurniture />}
      
      {/* Ceiling is handled by the room box */}
    </group>
  );
}

export function SceneLighting({ intensity, environment }) {
  const mult = intensity / 80;
  const isSuite = environment === 'suite';
  const isOffice = environment === 'office';
  const isLiving = environment === 'living';

  const hasExtraLighting = isSuite || isOffice || isLiving;

  return (
    <>
      <spotLight position={[0, 5, 4]} angle={1.2} penumbra={1}
        intensity={hasExtraLighting ? mult * 4 : mult * 15} color="#fff5e6" castShadow
        shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} shadow-normalBias={0.04} />
      
      {isSuite && (
        <>
          <rectAreaLight
            position={[0, 4.0, -1.48]}
            rotation={[-Math.PI / 2, 0, 0]}
            width={100}
            height={0.8}
            intensity={mult * 8}
            color="#ffd4aa"
          />
          <pointLight position={[-1.75, 0.0, 1.3]} intensity={mult * 10} color="#ff9a44" distance={30} decay={1.6} castShadow shadow-bias={-0.0005} shadow-mapSize={[1024, 1024]} />
        </>
      )}

      {isOffice && (
        <>
          <rectAreaLight
            position={[0, 4.0, -1.48]}
            rotation={[-Math.PI / 2, 0, 0]}
            width={100}
            height={0.8}
            intensity={mult * 6}
            color="#b2d8ff"
          />
          <pointLight position={[0, 0.5, 1.0]} intensity={mult * 8} color="#ffffff" distance={30} decay={1.5} castShadow shadow-bias={-0.0005} shadow-mapSize={[1024, 1024]} />
        </>
      )}

      {isLiving && (
        <>
          <rectAreaLight
            position={[0, 4.0, -1.48]}
            rotation={[-Math.PI / 2, 0, 0]}
            width={100}
            height={1.0}
            intensity={mult * 1.5}
            color="#fffcf5"
          />
          <pointLight position={[0, 1.5, 1.5]} intensity={mult * 5} color="#fffcf5" distance={30} decay={1.4} castShadow />
        </>
      )}

      <ambientLight intensity={hasExtraLighting ? mult * 1.0 : mult * 1.5} color={isLiving ? "#ffffff" : "#f5f0eb"} />
      <hemisphereLight color="#ffffff" groundColor={isLiving ? "#e0e0e0" : "#443322"} intensity={mult * 1.2} />
    </>
  );
}
