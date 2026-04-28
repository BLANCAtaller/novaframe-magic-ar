'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, ArrowRight, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const SynthesisPortal = () => {
  const router = useRouter();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });

  const cards = [
    {
      id: 'gallery',
      title: 'Colecciones Flagship',
      subtitle: 'Series Limitadas',
      description: 'Piezas icónicas producidas en tirajes cortos para los coleccionistas más exigentes.',
      icon: <Cpu className="w-5 h-5" />,
      tag: 'DROP_READY',
      color: 'cyan'
    },
    {
      id: 'custom',
      title: 'Laboratorio Custom',
      subtitle: 'Tu Visión, Nuestro Frame',
      description: 'Configura tu propio protocolo visual y adapta el arte a las dimensiones de tu espacio.',
      icon: <Globe className="w-5 h-5" />,
      tag: 'BETA_LAB',
      color: 'purple'
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor(x, y) {
        this.homeX = x;
        this.homeY = y;
        this.x = x + (Math.random() - 0.5) * 100;
        this.y = y + (Math.random() - 0.5) * 100;
        this.targetX = x;
        this.targetY = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseSize = this.size;
        this.color = 'rgba(34, 211, 238, 0.2)';
        this.baseAlpha = Math.random() * 0.3 + 0.1;
        this.alpha = this.baseAlpha;
      }

      update(activeCardRect) {
        let targetX = this.homeX;
        let targetY = this.homeY;

        if (activeCardRect) {
          const dx = (activeCardRect.left + activeCardRect.width / 2) - this.x;
          const dy = (activeCardRect.top + activeCardRect.height / 2) - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 400) {
            const force = (400 - dist) / 400;
            targetX += dx * force * 0.4;
            targetY += dy * force * 0.4;
            this.alpha = Math.min(0.8, this.alpha + 0.05);
            this.size = this.baseSize * (1 + force * 2);
          } else {
            this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            this.size += (this.baseSize - this.size) * 0.05;
          }
        } else {
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
          this.size += (this.baseSize - this.size) * 0.05;
        }

        // Apply mouse repulsion slightly
        const mdx = mouse.current.x - this.x;
        const mdy = mouse.current.y - this.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
            const mforce = (100 - mdist) / 100;
            targetX -= mdx * mforce * 0.5;
            targetY -= mdy * mforce * 0.5;
        }

        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('0.2', this.alpha.toString());
        ctx.fill();
      }
    }

    const init = () => {
      particles.current = [];
      const spacing = 35;
      for (let x = spacing / 2; x < canvas.width; x += spacing) {
        for (let y = spacing / 2; y < canvas.height; y += spacing) {
          particles.current.push(new Particle(x, y));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeCardRect = null;
      if (hoveredCard) {
        const cardEl = document.getElementById(`portal-card-${hoveredCard}`);
        if (cardEl) {
          const canvasRect = canvas.getBoundingClientRect();
          const elRect = cardEl.getBoundingClientRect();
          activeCardRect = {
            left: elRect.left - canvasRect.left,
            top: elRect.top - canvasRect.top,
            width: elRect.width,
            height: elRect.height
          };
        }
      }

      particles.current.forEach(p => {
        p.update(activeCardRect);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredCard]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-32 bg-[#020202] overflow-hidden border-t border-white/5"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-6"
          >
            <Zap className="w-3 h-3" />
            <span>Interfaz de Usuario</span>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-6">
            Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Operaciones</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/40 text-lg leading-relaxed">
            Toma el control de tu entorno visual a través de nuestras terminales de selección y diseño personalizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              id={`portal-card-${card.id}`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl transition-all duration-500",
                hoveredCard === card.id 
                  ? card.color === 'cyan' ? "border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.1)]" : "border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.1)]"
                  : "hover:border-white/20"
              )}
            >
              {/* Card Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-tr-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-8">
                <div className={cn(
                  "p-3 rounded-xl border transition-colors duration-500",
                  hoveredCard === card.id 
                    ? card.color === 'cyan' ? "bg-cyan-500/20 border-cyan-500" : "bg-purple-500/20 border-purple-500"
                    : "bg-white/5 border-white/10"
                )}>
                  {React.cloneElement(card.icon, { 
                    className: cn("w-6 h-6", hoveredCard === card.id ? "text-white" : "text-white/40") 
                  })}
                </div>
                <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase py-1 px-2 border border-white/5 rounded">
                  {card.tag}
                </span>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors uppercase">
                  {card.title}
                </h3>
                <p className="text-sm font-mono text-white/40 uppercase tracking-wider">
                  {card.subtitle}
                </p>
                <div className="h-[1px] w-12 bg-white/10 mt-4 group-hover:w-full transition-all duration-700" />
              </div>

              <p className="text-white/50 text-base leading-relaxed mb-10">
                {card.description}
              </p>

              <button 
                onClick={() => router.push(card.id === 'gallery' ? '/marketplace' : '/laboratorio')}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all duration-300",
                  card.color === 'cyan' 
                    ? "bg-white text-black hover:bg-cyan-400" 
                    : "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_10px_20px_rgba(168,85,247,0.2)]"
                )}
              >
                <span>{card.id === 'gallery' ? 'Ver Catálogo' : 'Iniciar Editor'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Corner tech details */}
              <div className="absolute bottom-2 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <span className="text-[8px] font-mono text-white">INTEGRITY_INDEX: 0.9928</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating tech background details */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 border border-white/5 rotate-45 pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 border border-white/5 -rotate-12 pointer-events-none hidden lg:block" />
      </div>

      <style jsx>{`
        section::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, #020202 90%);
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default SynthesisPortal;
