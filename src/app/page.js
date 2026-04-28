'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import { useTerminal } from '@/contexts/TerminalContext';

// Lazy load heavy below-the-fold components for better performance
const DualVariantSlider = dynamic(() => import('@/components/DualVariantSlider'), {
  loading: () => <div className="min-h-screen bg-black" />,
  ssr: false
});

const CollectionShowcase = dynamic(() => import('@/components/CollectionShowcase'), {
  loading: () => <div className="min-h-[60vh] bg-black" />,
  ssr: false
});

const RomanticCustomizer = dynamic(() => import('@/components/RomanticCustomizer'), {
  loading: () => <div className="min-h-[60vh] bg-black" />,
  ssr: false
});

const DataStreamTestimonials = dynamic(() => import('@/components/DataStreamTestimonials'), {
  loading: () => <div className="h-96 bg-black" />,
  ssr: false
});

const PerspectiveStream = dynamic(() => import('@/components/PerspectiveStream'), {
  loading: () => <div className="min-h-[60vh] bg-black" />,
  ssr: false
});

export default function Home() {
  const { openProduct } = useTerminal();

  return (
    <>
      <Hero />
      <DualVariantSlider />
      <CollectionShowcase onOpenProduct={openProduct} />
      <RomanticCustomizer />
      <DataStreamTestimonials />
      <PerspectiveStream onOpenProduct={openProduct} />
    </>
  );
}
