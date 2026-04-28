'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import SynthesisTerminal from '@/components/SynthesisTerminal';

const TerminalContext = createContext();

export function TerminalProvider({ children }) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSynthesisOpen, setIsSynthesisOpen] = useState(false);

  const openProduct = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    // Navigate to the standalone configurator page with slug for persistence
    router.push(`/laboratorio/configurar?slug=${product.slug || product.id}`);
  };

  const openSynthesis = () => setIsSynthesisOpen(true);
  const closeSynthesis = () => setIsSynthesisOpen(false);

  const handleSynthesize = (customProduct) => {
    if (!customProduct) return;
    setIsSynthesisOpen(false);
    setSelectedProduct(customProduct);
    // Small delay to allow the synthesis terminal to close smoothly
    setTimeout(() => {
      router.push(`/laboratorio/configurar?slug=${customProduct.slug || customProduct.id}`);
    }, 500);
  };

  return (
    <TerminalContext.Provider value={{ 
      openProduct, 
      openModal: openProduct, // Legacy alias
      selectedProduct,
      setSelectedProduct,
      openSynthesis,
      closeSynthesis,
      isSynthesisOpen
    }}>
      {children}
      <SynthesisTerminal 
        isOpen={isSynthesisOpen}
        onClose={closeSynthesis}
        onSynthesize={handleSynthesize}
      />
    </TerminalContext.Provider>
  );
}

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};
