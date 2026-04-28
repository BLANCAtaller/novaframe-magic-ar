'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useTransform, useMotionTemplate, useSpring } from 'framer-motion';
import { Heart, ShoppingCart, User, Menu, X, Trash2, ChevronRight, Check, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDeployment } from '@/contexts/DeploymentContext';
import { useLang } from '@/contexts/LanguageContext';
import translations from '@/lib/translations';


const NavbarClient = () => {
  const { lang, setLang } = useLang();
  const [activeItem, setActiveItem] = useState('Inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { deploymentCount } = useDeployment();
  const router = useRouter();
  
  // High-performance scroll hooks
  const { scrollY, scrollYProgress } = useScroll();
  const rawScrollVelocity = useVelocity(scrollY);
  const scrollVelocity = useSpring(rawScrollVelocity, { damping: 50, stiffness: 400 });

  // Glitch effects restricted to client
  const glitchX = useTransform(scrollVelocity, [-2000, 0, 2000], [15, 0, -15], { clamp: true });
  const glitchOpacity = useTransform(scrollVelocity, [-1000, 0, 1000], [0.3, 0.05, 0.3]);
  const barScaleY = useTransform(scrollVelocity, [-2000, 0, 2000], [5, 1, 5], { clamp: true });
  const shadowSpread = useTransform(scrollVelocity, [-2000, 0, 2000], [8, 0, -8], { clamp: true });
  const glitchTextShadow = useMotionTemplate`${shadowSpread}px 0px 0px rgba(0,255,255,0.9), calc(-1 * ${shadowSpread}px) 0px 0px rgba(255,0,127,0.9)`;

  const currentNav = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      // Cerrar menú móvil al hacer scroll
      if (isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 border-b",
        isScrolled ? "py-2 bg-black border-neon-cyan/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]" : "py-4 bg-black border-transparent"
      )}
    >
      {/* Glitch Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
          x: glitchX, 
          opacity: glitchOpacity
        }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/" 
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => router.push('/')}
          >
            <div className="relative h-[31px] sm:h-[36px] md:h-[45px] w-[130px] sm:w-[156px] md:w-[200px] transition-transform group-hover:scale-105 overflow-hidden shrink-0">
              <Image 
                src="/images/branding/logo_v3.webp" 
                alt="NovaFrame" 
                fill
                sizes="(max-width: 640px) 130px, (max-width: 768px) 156px, 200px"
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                priority
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 glass-dark px-6 py-2 rounded-full border border-white/10 hover:border-white/30 transition-colors -translate-y-[3px]">
          {currentNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              style={{ textShadow: glitchTextShadow }}
              className="relative px-3 py-1 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              {item.name}
              {activeItem === item.name && (
                <motion.div 
                   layoutId="nav-active"
                   className="absolute inset-x-0 -bottom-[3px] h-[2px] bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                   transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 -translate-y-[3px]">
          <div className="flex items-center bg-black/50 backdrop-blur-md rounded border border-white/10 px-1 py-0.5 group hover:border-neon-pink/50 transition-colors">
            <button 
              onClick={() => setLang('ES')}
              className={cn(
                "px-2 py-1 text-[10px] font-black transition-all rounded",
                lang === 'ES' ? "bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,127,0.5)]" : "text-white/40 hover:text-white"
              )}
            >ES</button>
            <div className="w-[1px] h-3 bg-white/20 mx-1" />
            <button 
              onClick={() => setLang('EN')}
              className={cn(
                "px-2 py-1 text-[10px] font-black transition-all rounded",
                lang === 'EN' ? "bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,127,0.5)]" : "text-white/40 hover:text-white"
              )}
            >EN</button>
          </div>

          <motion.button 
            style={{ textShadow: glitchTextShadow }}
            onClick={() => router.push('/deployment-hub')}
            className="p-2 text-white/70 hover:text-neon-cyan transition-colors relative"
          >
            <ShoppingCart size={20} className="hover:filter hover:drop-shadow-[0_0_8px_rgba(0,255,255,1)]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff007f] rounded-full text-[10px] flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(255,0,127,0.8)]">
              {deploymentCount}
            </span>
          </motion.button>
          
          <button 
            className="lg:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-neon-cyan hover:text-neon-pink transition-colors active:scale-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú de navegación"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-yellow z-50 shadow-[0_0_15px_rgba(6,182,212,1)]"
        style={{ 
          scaleX: scrollYProgress, 
          transformOrigin: "0%",
          scaleY: barScaleY
        }}
      />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-neon-cyan/50 overflow-hidden backdrop-blur-xl"
          >
            <div className="flex flex-col p-6 gap-2">
              {currentNav.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-black uppercase tracking-tighter text-white/60 hover:text-neon-cyan active:text-neon-cyan block py-3 px-4 min-h-[48px] flex items-center border-b border-white/5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-neon-cyan/30 mr-4 shrink-0" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black border-b border-transparent h-[80px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-24 h-8 bg-white/5 animate-pulse rounded" />
          <div className="hidden lg:flex gap-8">
            <div className="w-16 h-4 bg-white/5 animate-pulse rounded" />
            <div className="w-16 h-4 bg-white/5 animate-pulse rounded" />
            <div className="w-16 h-4 bg-white/5 animate-pulse rounded" />
          </div>
          <div className="w-16 h-8 bg-white/5 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  return <NavbarClient />;
}
