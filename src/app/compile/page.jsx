'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Deshabilitar SSR para evitar errores de 'window is not defined' con el compilador de MindAR
const CompileView = dynamic(() => import('@/components/CompileView'), { ssr: false });

export default function CompilePage() {
  return <CompileView />;
}
