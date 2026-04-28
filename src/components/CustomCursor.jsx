'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState('default');
  const [isMounted, setIsMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const mouseX = useSpring(0, { damping: 20, stiffness: 800 });
  const mouseY = useSpring(0, { damping: 20, stiffness: 800 });
  const dotX = useSpring(0, { damping: 10, stiffness: 2000 });
  const dotY = useSpring(0, { damping: 10, stiffness: 2000 });

  useEffect(() => {
    // Detectar dispositivos táctiles (móvil/tablet) — no renderizar cursor
    const isTouch = window.matchMedia('(hover: none)').matches || 
                    window.matchMedia('(pointer: coarse)').matches ||
                    'ontouchstart' in window;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const moveMouse = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      dotX.set(e.clientX - 2);
      dotY.set(e.clientY - 2);
    };

    const handleHover = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setHoverState('pointer');
      } else if (target.tagName === 'IMG' || target.closest('.canvas-texture')) {
        setHoverState('image');
      } else {
        setHoverState('default');
      }
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHover);
    setIsMounted(true);
    
    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [mouseX, mouseY, dotX, dotY]);

  // No renderizar en dispositivos táctiles ni antes del montaje
  if (isTouchDevice || !isMounted) return null;

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{
          x: mouseX,
          y: mouseY,
          scale: hoverState === 'pointer' ? 1.5 : hoverState === 'image' ? 2 : 1,
          borderColor: hoverState === 'pointer' ? '#c026d3' : hoverState === 'image' ? '#06b6d4' : 'rgba(255,255,255,0.5)',
          borderWidth: hoverState !== 'default' ? '1px' : '2px',
        }}
      />
      <motion.div
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          backgroundColor: hoverState === 'pointer' ? '#c026d3' : hoverState === 'image' ? '#06b6d4' : 'white',
          opacity: hoverState === 'image' ? 0 : 1,
        }}
      />
    </>
  );
}
