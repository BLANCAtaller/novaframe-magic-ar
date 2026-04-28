import { Geist, Geist_Mono, Prata } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prata = Prata({
  weight: "400",
  variable: "--font-prata",
  subsets: ["latin"],
});

import { TerminalProvider } from "@/contexts/TerminalContext";
import { DeploymentProvider } from "@/contexts/DeploymentContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import SystemLoader from "@/components/SystemLoader";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export const metadata = {
  title: {
    default: "NovaFrame — Cuadros Premium en Canvas y Lona HD",
    template: "%s — NovaFrame",
  },
  description:
    "Cuadros decorativos premium impresos en lona HD y canvas de alta fidelidad. Diseños únicos con tecnología de impresión avanzada. Envíos a todo México.",
  keywords: ["cuadros", "canvas", "lona HD", "arte decorativo", "cuadros personalizados", "decoración", "México", "NovaFrame"],
  authors: [{ name: "NovaFrame" }],
  creator: "NovaFrame",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://novaframe.pages.dev",
    siteName: "NovaFrame",
    title: "NovaFrame — Cuadros Premium en Canvas y Lona HD",
    description: "Cuadros decorativos premium impresos en lona HD y canvas de alta fidelidad. Diseños únicos con envío a todo México.",
    images: [
      {
        url: "/images/branding/logo_v3.webp",
        width: 1200,
        height: 630,
        alt: "NovaFrame — Arte Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaFrame — Cuadros Premium",
    description: "Arte decorativo de alta fidelidad impreso en canvas y lona HD.",
    images: ["/images/branding/logo_v3.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
  metadataBase: new URL("https://novaframe.pages.dev"),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${prata.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-black text-white selection:bg-neon-pink selection:text-white overflow-x-hidden">
        <LanguageProvider>
        <DeploymentProvider>
          <TerminalProvider>
            {/* Persistent UI Primitives */}
            <SystemLoader />
            <CustomCursor />
            <ParticleBackground />
            
            {/* Background Grid Overlay (Global Zenith Style) */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ filter: 'url(#noiseFilter)' }} />
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]">
              <div 
                className="w-full h-full" 
                style={{ 
                  backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', 
                  backgroundSize: '100px 100px' 
                }} 
              />
            </div>

            <Navbar />
            <main className="flex-grow relative z-10 pt-20">
              {children}
            </main>
            {/* GLOBAL NOISE ENGINE (SVG Filter) */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <filter id="noiseFilter">
                <feTurbulence 
                  type="fractalNoise" 
                  baseFrequency="0.65" 
                  numOctaves="3" 
                  stitchTiles="stitch" 
                />
              </filter>
            </svg>

            <WhatsAppFAB />
            <Footer />
          </TerminalProvider>
        </DeploymentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
