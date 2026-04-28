'use client';

import React, { useEffect, useState } from 'react';
import { useTerminal } from '@/contexts/TerminalContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { SAMPLE_PRODUCTS } from '@/types';
import ConfiguratorLayout from '@/components/ConfiguratorLayout';
import { motion } from 'framer-motion';
import { Terminal, Loader2 } from 'lucide-react';

function ConfiguratorContent() {
  const { selectedProduct, setSelectedProduct } = useTerminal();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // If we have a product in context, we're good
    if (selectedProduct) {
      setIsInitializing(false);
      return;
    }

    // Otherwise, check if there's a slug in the URL
    const slug = searchParams.get('slug');
    if (slug) {
      const product = SAMPLE_PRODUCTS.find(p => p.id === slug || p.slug === slug);
      if (product) {
        setSelectedProduct(product);
        setIsInitializing(false);
        return;
      }
    }

    // If no product and no slug, we might need to redirect back
    const timer = setTimeout(() => {
        if (!selectedProduct) {
            router.push('/marketplace');
        }
    }, 6000);

    return () => clearTimeout(timer);
  }, [selectedProduct, searchParams, setSelectedProduct, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 font-mono">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-neon-cyan"
        >
          <Loader2 size={48} />
        </motion.div>
        
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 text-white/40">
                <Terminal size={14} />
                <span className="text-[10px] font-black tracking-[0.5em] uppercase">Booting_Laboratory_Kernel...</span>
            </div>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-neon-cyan"
                />
            </div>
        </div>
      </div>
    );
  }

  return <ConfiguratorLayout product={selectedProduct} />;
}

export default function ConfiguratorPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
        <Loader2 size={48} className="text-neon-cyan animate-spin" />
      </div>
    }>
      <ConfiguratorContent />
    </React.Suspense>
  );
}
