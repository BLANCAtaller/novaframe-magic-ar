'use client';
import dynamic from 'next/dynamic';

const MatiasGame = dynamic(() => import('@/components/MatiasGame'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black text-yellow-400 font-mono text-xl">
      Cargando a Matías...
    </div>
  ),
});

export default function JuegoMatiasPage() {
  return <MatiasGame />;
}
