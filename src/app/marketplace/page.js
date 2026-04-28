'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/top-deployments');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center font-mono">
        <div className="text-[10px] text-neon-cyan tracking-[0.4em] uppercase animate-pulse">
          REDIRIGIENDO_A_DESPLIEGUES...
        </div>
      </div>
    </div>
  );
}
