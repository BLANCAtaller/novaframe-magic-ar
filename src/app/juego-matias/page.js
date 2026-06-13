import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Matías el Pug: Defensor Zombie',
  description: 'Videojuego de Matías el Pug disparando a gatos zombie. ¡Sobrevive las oleadas!',
};

const MatiasGame = dynamic(() => import('@/components/MatiasGame'), { ssr: false });

export default function JuegoMatiasPage() {
  return <MatiasGame />;
}
