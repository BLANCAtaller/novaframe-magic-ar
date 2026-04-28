'use client';

import React, { useEffect } from 'react';
import CustomDesign from '@/components/CustomDesign';
import { useTerminal } from '@/contexts/TerminalContext';

export default function LaboratorioPage() {
  const { openProduct } = useTerminal();

  useEffect(() => {
    document.title = "Laboratorio de Arte // Zenith v4.0 — NovaFrame";
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-cyan/30 overflow-x-hidden">
      <main>
        <CustomDesign onPreview={openProduct} />
      </main>
    </div>
  );
}
