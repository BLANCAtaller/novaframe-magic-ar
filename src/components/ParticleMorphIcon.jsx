'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Optimized noise function for flow field
const noise2D = (x, y, seed = 0) => {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const h = (X * 123.45 + Y * 678.9) + seed;
  return Math.sin(h) * 0.5 + 0.5;
};

const ParticleMorphIcon = ({ 
  type = 'globe', 
  color = '#00ffff', 
  isActive = false, 
  size = 120,
  particleCount = 800,
  mouseX,
  mouseY
}) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const sparks = useRef([]);
  const targetPoints = useRef([]);
  const requestRef = useRef();
  const timeRef = useRef(0);
  
  // Physics constants v3.0 - Mathematical Precision
  const FRICTION = 0.90;
  const EASE = 0.15;
  const FLOW_FORCE = 0.12; 
  const MOUSE_RADIUS = 60;

  // 1. Mathematical Generator (Solid, Reliable silhouettes)
  const generatePoints = (type, size, count) => {
    const pts = [];
    const center = size / 2;
    const padding = 15;
    const r = (size - padding * 2) / 2;

    if (type === 'globe') {
      // Main Circle
      for(let i = 0; i < count * 0.4; i++) {
        const a = Math.random() * Math.PI * 2;
        pts.push({ x: center + r * Math.cos(a), y: center + r * Math.sin(a) });
      }
      // Latitudes / Longitudes
      for(let i = 0; i < count * 0.6; i++) {
        const t = Math.random();
        const a = Math.random() * Math.PI * 2;
        if (i % 2 === 0) {
          // Vertical Arcs
          const xOffset = (Math.random() - 0.5) * r * 0.8;
          const arcX = center + xOffset;
          const arcY = center + Math.sin(a) * Math.sqrt(r*r - xOffset*xOffset);
          pts.push({ x: arcX, y: arcY });
        } else {
          // Horizontal Arcs
          const yOffset = (Math.random() - 0.5) * r * 0.8;
          const arcX = center + Math.cos(a) * Math.sqrt(r*r - yOffset*yOffset);
          const arcY = center + yOffset;
          pts.push({ x: arcX, y: arcY });
        }
      }
    } else if (type === 'shield') {
      const shieldPoints = [
        [center, padding], [size - padding, padding + 15], 
        [size - padding, center], [center, size - padding],
        [padding, center], [padding, padding + 15], [center, padding]
      ];
      for(let i = 0; i < count; i++) {
        const seg = Math.floor(Math.random() * (shieldPoints.length - 1));
        const p1 = shieldPoints[seg]; const p2 = shieldPoints[seg+1];
        const t = Math.random();
        pts.push({ x: p1[0] + (p2[0]-p1[0])*t, y: p1[1] + (p2[1]-p1[1])*t });
      }
    } else if (type === 'zap') {
      const zapPoints = [
        [size * 0.70, padding], [size * 0.25, center], [size * 0.55, center],
        [size * 0.35, size - padding], [size * 0.85, center * 0.9], [size * 0.50, center * 0.9],
        [size * 0.70, padding]
      ];
      for(let i = 0; i < count; i++) {
        const seg = Math.floor(Math.random() * (zapPoints.length - 1));
        const p1 = zapPoints[seg]; const p2 = zapPoints[seg+1];
        const t = Math.random();
        pts.push({ x: p1[0] + (p2[0]-p1[0])*t, y: p1[1] + (p2[1]-p1[1])*t });
      }
    }
    return pts;
  };

  // 2. Initialize particles
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < particleCount; i++) {
      pts.push({
        x: Math.random() * size, y: Math.random() * size,
        vx: 0, vy: 0,
        targetX: size / 2, targetY: size / 2,
        originalTargetX: size / 2, originalTargetY: size / 2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        noiseOffset: Math.random() * 1000,
      });
    }
    particles.current = pts;
    targetPoints.current = generatePoints(type, size, particleCount);
    
    // Assign targets
    if (targetPoints.current.length > 0) {
      particles.current.forEach((p, i) => {
        const t = targetPoints.current[i % targetPoints.current.length];
        p.originalTargetX = t.x; p.originalTargetY = t.y;
        p.targetX = t.x; p.targetY = t.y;
      });
    }
  }, [type, size, particleCount]);

  const animate = (time) => {
    timeRef.current = time;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    // Coordinate Mapping (Relative to Canvas)
    let localMX = -1000, localMY = -1000;
    if (mouseX && mouseY && canvas) {
      const rect = canvas.getBoundingClientRect();
      const parentRect = canvas.parentElement.parentElement.getBoundingClientRect();
      // mouseX is relative to CARD. localMX should be relative to CANVAS.
      localMX = mouseX.get() - (rect.left - parentRect.left);
      localMY = mouseY.get() - (rect.top - parentRect.top);
    }

    // 1. Particle Logic
    particles.current.forEach((p, i) => {
      const noise = noise2D(p.x * 0.05, p.y * 0.05, time / 2000 + p.noiseOffset);
      const flowAge = noise * Math.PI * 4;

      // Mouse Physics
      const dist = Math.hypot(p.originalTargetX - localMX, p.originalTargetY - localMY);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.targetX = p.originalTargetX + (p.originalTargetX - localMX) * force * 1.2;
        p.targetY = p.originalTargetY + (p.originalTargetY - localMY) * force * 1.2;
      } else {
        p.targetX = p.originalTargetX;
        p.targetY = p.originalTargetY;
      }

      if (isActive) {
        // Target seeking + subtle noise flow
        const ax = (p.targetX - p.x) * EASE + Math.cos(flowAge) * FLOW_FORCE;
        const ay = (p.targetY - p.y) * EASE + Math.sin(flowAge) * FLOW_FORCE;
        p.vx = (p.vx + ax) * FRICTION;
        p.vy = (p.vy + ay) * FRICTION;
        p.opacity = Math.min(1, p.opacity + 0.05);
      } else {
        // Drifting state
        p.vx += Math.sin(time / 1000 + p.noiseOffset) * 0.01;
        p.vy += Math.cos(time / 1000 + p.noiseOffset) * 0.01;
        p.vx *= 0.98; p.vy *= 0.98;
        p.opacity = Math.max(0.1, p.opacity - 0.01);
      }

      p.x += p.vx; p.y += p.vy;

      // Draw
      ctx.fillStyle = color;
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Connecting Mesh (Subtle)
      if (isActive && i % 40 === 0) {
        const next = particles.current[(i + 40) % particles.current.length];
        if (Math.hypot(p.x - next.x, p.y - next.y) < 20) {
          ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.1;
          ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y); ctx.stroke();
        }
      }
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, color]);

  return (
    <div className="relative flex items-center justify-center p-4">
      <canvas ref={canvasRef} width={size} height={size} className="relative z-10" />
      <motion.div 
        animate={{ scale: isActive ? [1, 1.2, 1] : 1, opacity: isActive ? [0.1, 0.3, 0.1] : 0.05 }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default ParticleMorphIcon;
