'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  RoundedBox,
  OrbitControls,
  Edges,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';

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

const BRAND_COLORS = ['#00ffff', '#ff007f', '#ff4d00', '#9d00ff'];
const SUB_CUBE_SIZE = 1.0;
const GAP = 0.08;

// Bypass optimizer for 3D textures as it fails with large files in dev
// Use Next.js Image Optimization API for 3D textures to save bandwidth and memory
const getOptimalTexture = (path, isMobile) => {
  return path; // Bypassing optimizer for 3D textures due to dev environment loading errors
};

const BASE_PATHS = {
  front: '/images/products/mario-steampunk/paint-by-numbers/mario-pbn-v1.webp',
  back: '/images/products/courage-berserk/color/courage-berserk-v1.webp',
  top: '/images/products/alice-geometric/color/alice-geometric-v1.webp',
  bottom: '/images/products/mona-lisa/color/savage-mona-lisa.webp',
  right: '/images/products/bunny-ambition/color/bunny_ambition_wealth_high_res.webp',
  left: '/images/products/white-rabbit-lego/color/white-rabbit-lego-v1.webp'
};

/**
 * Componente que ajusta los UVs de un plano para mostrar solo un cuadrante de la textura.
 * Evita el uso de texture.clone(), ahorrando memoria masivamente.
 */
const QuadrantPlane = ({ texture, uvOffset, color, ...props }) => {
  const geometryRef = useRef();

  useEffect(() => {
    if (geometryRef.current) {
      const uvs = geometryRef.current.attributes.uv.array;
      const [ox, oy] = uvOffset;
      // Definimos los UVs base para asegurar un cálculo idempotente
      // PlaneGeometry(1,1) tiene 4 vértices en este orden: (0,1), (1,1), (0,0), (1,0)
      const baseUVs = [0, 1, 1, 1, 0, 0, 1, 0];
      for (let i = 0; i < uvs.length; i += 2) {
        uvs[i] = baseUVs[i] * 0.5 + ox;
        uvs[i + 1] = baseUVs[i + 1] * 0.5 + oy;
      }
      geometryRef.current.attributes.uv.needsUpdate = true;
    }
  }, [uvOffset]);

  return (
    <mesh {...props}>
      <planeGeometry ref={geometryRef} args={[SUB_CUBE_SIZE - 0.08, SUB_CUBE_SIZE - 0.08]} />
      <meshStandardMaterial 
        map={texture || null} 
        color={!texture ? color : '#ffffff'}
        emissive={color}
        emissiveMap={texture || null}
        emissiveIntensity={texture ? 0.4 : 1.2}
        roughness={0.4}
        metalness={0.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const SubCube = React.forwardRef(({ position, quaternion, color, gridPos, textures }, ref) => {
  const { x, y, z } = gridPos;
  
  const isExterior = {
    px: x === 1, nx: x === 0,
    py: y === 1, ny: y === 0,
    pz: z === 1, nz: z === 0
  };

  const coreMaterial = useMemo(() => (
    <meshPhysicalMaterial
      color="#080808"
      metalness={1.0}
      roughness={0.2}
      envMapIntensity={1.2}
    />
  ), []);

  return (
    <group ref={ref} position={position} quaternion={quaternion}>
      {/* Reducimos smoothness de 4 a 2 para optimizar geometrÃ­a */}
      <RoundedBox args={[SUB_CUBE_SIZE, SUB_CUBE_SIZE, SUB_CUBE_SIZE]} radius={0.05} smoothness={2}>
        {coreMaterial}
        <Edges threshold={15} color={color} opacity={0.6} transparent />
      </RoundedBox>

      {isExterior.pz && (
        <QuadrantPlane 
          position={[0, 0, SUB_CUBE_SIZE / 2 + 0.01]} 
          texture={textures?.front} 
          uvOffset={[x * 0.5, y * 0.5]} 
          color={color}
        />
      )}
      {isExterior.nz && (
        <QuadrantPlane 
          position={[0, 0, -(SUB_CUBE_SIZE / 2 + 0.01)]} 
          rotation={[0, Math.PI, 0]} 
          texture={textures?.back} 
          uvOffset={[(1 - x) * 0.5, y * 0.5]} 
          color={color}
        />
      )}
      {isExterior.py && (
        <QuadrantPlane 
          position={[0, SUB_CUBE_SIZE / 2 + 0.01, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          texture={textures?.top} 
          uvOffset={[x * 0.5, (1 - z) * 0.5]} 
          color={color}
        />
      )}
      {isExterior.ny && (
        <QuadrantPlane 
          position={[0, -(SUB_CUBE_SIZE / 2 + 0.01), 0]} 
          rotation={[Math.PI / 2, 0, 0]} 
          texture={textures?.bottom} 
          uvOffset={[x * 0.5, z * 0.5]} 
          color={color}
        />
      )}
      {isExterior.px && (
        <QuadrantPlane 
          position={[SUB_CUBE_SIZE / 2 + 0.01, 0, 0]} 
          rotation={[0, Math.PI / 2, 0]} 
          texture={textures?.right} 
          uvOffset={[(1 - z) * 0.5, y * 0.5]} 
          color={color}
        />
      )}
      {isExterior.nx && (
        <QuadrantPlane 
          position={[-(SUB_CUBE_SIZE / 2 + 0.01), 0, 0]} 
          rotation={[0, -Math.PI / 2, 0]} 
          texture={textures?.left} 
          uvOffset={[z * 0.5, y * 0.5]} 
          color={color}
        />
      )}
    </group>
  );
});

const KineticCube = ({ scale, textures }) => {
  const groupRef = useRef();

  const [cubes, setCubes] = useState(() => {
    const initialCubes = [];
    const size = SUB_CUBE_SIZE + GAP;
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 2; z++) {
          initialCubes.push({
            id: `${x}-${y}-${z}`,
            gridPos: { x, y, z },
            pos: new THREE.Vector3(x - 0.5, y - 0.5, z - 0.5).multiplyScalar(size),
            quat: new THREE.Quaternion(),
            color: BRAND_COLORS[(x + y * 2 + z * 4) % BRAND_COLORS.length]
          });
        }
      }
    }
    return initialCubes;
  });

  const rotationRef = useRef({ 
    axis: 'y', layer: 0, angle: 0, target: 0, startTime: 0, isAnimating: false, isSyncing: false 
  });

  const cubeRefs = useRef({});
  const elapsedRef = useRef(0);

  // Objetos pre-asignados para evitar GC constante
  const sharedVec = useMemo(() => new THREE.Vector3(), []);
  const sharedQuat = useMemo(() => new THREE.Quaternion(), []);
  const sharedTempPos = useMemo(() => new THREE.Vector3(), []);
  const sharedTempQuat = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    if (rotationRef.current.isSyncing) {
      rotationRef.current.isSyncing = false;
    }
  }, [cubes]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (rotationRef.current.isAnimating) return;
      
      const axes = ['x', 'y', 'z'];
      const axis = axes[Math.floor(Math.random() * axes.length)];
      const layerChoices = [0.5, -0.5];
      const layer = layerChoices[Math.floor(Math.random() * 2)] * (SUB_CUBE_SIZE + GAP);
      const direction = Math.random() > 0.5 ? 1 : -1;

      rotationRef.current = {
        axis,
        layer,
        angle: 0,
        target: (Math.PI / 2) * direction,
        startTime: Date.now(),
        isAnimating: true
      };
    }, 2500);
    
    return () => clearInterval(timer);
  }, []);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.08;
      groupRef.current.position.y = Math.sin(elapsedRef.current * 1.2) * 0.1;
    }

    if (rotationRef.current.isAnimating) {
      const { startTime, target, axis, layer } = rotationRef.current;
      const duration = 600; 
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const currentAngle = ease * target;

      sharedVec.set(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0);

      if (progress >= 1) {
        sharedQuat.setFromAxisAngle(sharedVec, target);
        
        cubes.forEach(cube => {
          if (Math.abs(cube.pos[axis] - layer) < 0.1) {
            const el = cubeRefs.current[cube.id];
            if (el) {
              const finalPos = cube.pos.clone().applyAxisAngle(sharedVec, target);
              const finalQuat = cube.quat.clone().premultiply(sharedQuat).normalize();
              el.position.copy(finalPos);
              el.quaternion.copy(finalQuat);
            }
          }
        });

        rotationRef.current.isSyncing = true;
        rotationRef.current.isAnimating = false;

        setCubes(prev => prev.map(cube => {
          if (Math.abs(cube.pos[axis] - layer) < 0.1) {
            const newPos = cube.pos.clone().applyAxisAngle(sharedVec, target);
            const newQuat = cube.quat.clone().premultiply(sharedQuat).normalize();
            newPos.x = Math.round(newPos.x * 100) / 100;
            newPos.y = Math.round(newPos.y * 100) / 100;
            newPos.z = Math.round(newPos.z * 100) / 100;
            return { ...cube, pos: newPos, quat: newQuat };
          }
          return cube;
        }));
      } else {
        sharedTempQuat.setFromAxisAngle(sharedVec, currentAngle);
        cubes.forEach(cube => {
          const el = cubeRefs.current[cube.id];
          if (!el) return;
          
          if (Math.abs(cube.pos[axis] - layer) < 0.1) {
             sharedTempPos.copy(cube.pos).applyAxisAngle(sharedVec, currentAngle);
             el.position.copy(sharedTempPos);
             el.quaternion.multiplyQuaternions(sharedTempQuat, cube.quat);
          } else {
             el.position.copy(cube.pos);
             el.quaternion.copy(cube.quat);
          }
        });
      }
    } else if (!rotationRef.current.isSyncing) {
      cubes.forEach(cube => {
        const el = cubeRefs.current[cube.id];
        if (!el) return;
        el.position.copy(cube.pos);
        el.quaternion.copy(cube.quat);
      });
    }
  });

  // Scale state moved up to HolographicCube

  return (
    <group ref={groupRef} scale={scale}>
      {cubes.map((cube) => (
        <SubCube 
          key={cube.id} 
          ref={el => cubeRefs.current[cube.id] = el}
          position={cube.pos} 
          quaternion={cube.quat} 
          color={cube.color}
          gridPos={cube.gridPos}
          textures={textures}
        />
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, 5]} intensity={2} color="#00ffff" />
      <directionalLight position={[5, -5, 5]} intensity={2} color="#ff007f" />
    </group>
  );
};

export default function HolographicCube() {
  const [scale, setScale] = useState(1.4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setScale(mobile ? 1.0 : 1.4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const faceTextures = useMemo(() => ({
    front: getOptimalTexture(BASE_PATHS.front, isMobile),
    back: getOptimalTexture(BASE_PATHS.back, isMobile),
    top: getOptimalTexture(BASE_PATHS.top, isMobile),
    bottom: getOptimalTexture(BASE_PATHS.bottom, isMobile),
    right: getOptimalTexture(BASE_PATHS.right, isMobile),
    left: getOptimalTexture(BASE_PATHS.left, isMobile)
  }), [isMobile]);

  return (
    <div className="w-full h-[350px] sm:h-[500px] lg:h-[800px] relative">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 15], fov: isMobile ? 50 : 40 }}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false 
        }}
        dpr={[1, 2]}
      >
        <React.Suspense fallback={
          <KineticCube scale={scale} textures={null} />
        }>
          <CubeLoader textures={faceTextures} scale={scale} />
        </React.Suspense>

        <ContactShadows position={[0, -4, 0]} resolution={isMobile ? 256 : 512} scale={20} blur={2.5} opacity={0.4} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

function CubeLoader({ textures, scale }) {
  const loadedTextures = useTexture(textures);
  return <KineticCube scale={scale} textures={loadedTextures} />;
}
