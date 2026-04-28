/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── STATIC EXPORT ──
  // Genera un build 100% estático (HTML/CSS/JS) que se puede subir
  // a Hostinger, Netlify, Cloudflare Pages o cualquier hosting.
  // Elimina la dependencia del Image Optimization API de Vercel.
  output: 'export',

  // Permitir trailing slash para compatibilidad con hosting estático
  trailingSlash: true,

  images: {
    // Las imágenes se sirven directamente sin proxy de Next.js.
    // Esto elimina el pipeline /_next/image que fallaba en móvil.
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
