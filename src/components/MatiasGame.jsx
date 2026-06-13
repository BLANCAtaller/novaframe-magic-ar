'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const CANVAS_W = 800;
const CANVAS_H = 600;
const PUG_SIZE = 48;
const BULLET_R = 6;
const CAT_SIZE = 40;
const PUG_X = CANVAS_W / 2;
const PUG_Y = CANVAS_H - 80;
const FIRE_RATE = 600; // ms between shots
const BASE_CAT_SPEED = 1.2;
const BASE_SPAWN_INTERVAL = 2200;
const MIN_SPAWN_INTERVAL = 600;

function drawPug(ctx, x, y, angle, frame) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, 18, 22, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 4, 18, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a882';
  ctx.fill();
  ctx.strokeStyle = '#8a6a4a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(0, -12, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a882';
  ctx.fill();
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.ellipse(-12, -22, 7, 6, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#8a6a4a';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(12, -22, 7, 6, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#8a6a4a';
  ctx.fill();

  // Muzzle
  ctx.beginPath();
  ctx.ellipse(0, -8, 9, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#b89070';
  ctx.fill();

  // Eyes
  ctx.beginPath();
  ctx.arc(-6, -15, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -15, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  // Eye shine
  ctx.beginPath();
  ctx.arc(-5, -16, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -16, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Nose
  ctx.beginPath();
  ctx.ellipse(0, -7, 4, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();

  // Forehead wrinkle
  ctx.beginPath();
  ctx.moveTo(-5, -20);
  ctx.quadraticCurveTo(0, -22, 5, -20);
  ctx.strokeStyle = '#8a6a4a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Gun (bone-shaped stick pointing up)
  ctx.beginPath();
  ctx.roundRect(-3, -30, 6, 18, 3);
  ctx.fillStyle = '#e8e8e8';
  ctx.fill();
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Gun tip glow
  const glowR = 4 + Math.sin(frame * 0.3) * 1.5;
  const grad = ctx.createRadialGradient(0, -30, 0, 0, -30, glowR * 2);
  grad.addColorStop(0, 'rgba(255,230,50,0.9)');
  grad.addColorStop(1, 'rgba(255,230,50,0)');
  ctx.beginPath();
  ctx.arc(0, -30, glowR * 2, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Paw animation
  const pawOff = Math.sin(frame * 0.15) * 3;
  ctx.beginPath();
  ctx.ellipse(-14, 10 + pawOff, 7, 5, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a882';
  ctx.fill();
  ctx.strokeStyle = '#8a6a4a';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(14, 10 - pawOff, 7, 5, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a882';
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawZombieCat(ctx, cat, frame) {
  const { x, y, hp, maxHp, angle } = cat;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, 16, 18, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 4, 14, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#4a7a4a';
  ctx.fill();
  ctx.strokeStyle = '#2a4a2a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Torn fur patches
  ctx.beginPath();
  ctx.ellipse(-8, 0, 4, 3, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#2a4a2a';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7, 6, 3, 4, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#2a4a2a';
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -10, 13, 0, Math.PI * 2);
  ctx.fillStyle = '#5a8a5a';
  ctx.fill();
  ctx.strokeStyle = '#2a4a2a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Ears (pointed)
  ctx.beginPath();
  ctx.moveTo(-10, -18);
  ctx.lineTo(-6, -28);
  ctx.lineTo(-2, -18);
  ctx.closePath();
  ctx.fillStyle = '#3a6a3a';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(10, -18);
  ctx.lineTo(6, -28);
  ctx.lineTo(2, -18);
  ctx.closePath();
  ctx.fillStyle = '#3a6a3a';
  ctx.fill();

  // Glowing red eyes
  const eyeGlow = 0.7 + Math.sin(frame * 0.2) * 0.3;
  ctx.beginPath();
  ctx.arc(-5, -12, 4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 50, 50, ${eyeGlow})`;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5, -12, 4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 50, 50, ${eyeGlow})`;
  ctx.fill();
  // Eye slit
  ctx.beginPath();
  ctx.moveTo(-5, -13);
  ctx.lineTo(-5, -11);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5, -13);
  ctx.lineTo(5, -11);
  ctx.stroke();

  // Muzzle with fangs
  ctx.beginPath();
  ctx.ellipse(0, -6, 6, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#4a7a4a';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-3, -5);
  ctx.lineTo(-2, -1);
  ctx.lineTo(-1, -5);
  ctx.fillStyle = 'ivory';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(1, -5);
  ctx.lineTo(2, -1);
  ctx.lineTo(3, -5);
  ctx.fillStyle = 'ivory';
  ctx.fill();

  // Tail
  const tailWag = Math.sin(frame * 0.25) * 20;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.quadraticCurveTo(20, 14 + tailWag, 18, 4 + tailWag * 0.5);
  ctx.strokeStyle = '#3a6a3a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();

  // HP bar
  const barW = 36;
  const barH = 5;
  const bx = x - barW / 2;
  const by = y - CAT_SIZE / 2 - 14;
  ctx.fillStyle = '#333';
  ctx.fillRect(bx, by, barW, barH);
  const ratio = hp / maxHp;
  const hpColor = ratio > 0.5 ? '#44ff44' : ratio > 0.25 ? '#ffaa00' : '#ff4444';
  ctx.fillStyle = hpColor;
  ctx.fillRect(bx, by, barW * ratio, barH);
}

function drawBullet(ctx, bullet, frame) {
  const { x, y } = bullet;
  const pulse = 1 + Math.sin(frame * 0.5) * 0.2;
  ctx.save();
  // Glow
  const grad = ctx.createRadialGradient(x, y, 0, x, y, BULLET_R * 3 * pulse);
  grad.addColorStop(0, 'rgba(255,230,50,1)');
  grad.addColorStop(0.4, 'rgba(255,150,0,0.8)');
  grad.addColorStop(1, 'rgba(255,50,0,0)');
  ctx.beginPath();
  ctx.arc(x, y, BULLET_R * 3 * pulse, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  // Core
  ctx.beginPath();
  ctx.arc(x, y, BULLET_R, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }
}

function drawBackground(ctx, frame) {
  // Grass-like top-down floor
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#0d1a0d');
  grad.addColorStop(1, '#1a2a1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Grid lines
  ctx.strokeStyle = 'rgba(0,255,0,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CANVAS_W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }
  for (let y = 0; y < CANVAS_H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }

  // Pug home base circle
  const baseGrad = ctx.createRadialGradient(PUG_X, PUG_Y, 0, PUG_X, PUG_Y, 60);
  baseGrad.addColorStop(0, 'rgba(255,200,50,0.15)');
  baseGrad.addColorStop(1, 'rgba(255,200,50,0)');
  ctx.beginPath();
  ctx.arc(PUG_X, PUG_Y, 60, 0, Math.PI * 2);
  ctx.fillStyle = baseGrad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(PUG_X, PUG_Y, 60, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255,200,50,${0.3 + Math.sin(frame * 0.05) * 0.1})`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHUD(ctx, score, wave, health, maxHealth, combo) {
  // Score
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(10, 10, 180, 50);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('🐾 MATÍAS DEFENDE', 20, 28);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`SCORE: ${score}`, 20, 52);

  // Wave
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(CANVAS_W / 2 - 60, 10, 120, 36);
  ctx.fillStyle = '#ff6644';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`OLEADA ${wave}`, CANVAS_W / 2, 33);
  ctx.textAlign = 'left';

  // Health bar
  const hbW = 180;
  const hbH = 18;
  const hbX = CANVAS_W - hbW - 10;
  const hbY = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(hbX - 5, hbY - 5, hbW + 10, hbH + 24);
  ctx.fillStyle = '#555';
  ctx.fillRect(hbX, hbY + 18, hbW, hbH);
  const ratio = health / maxHealth;
  const hpC = ratio > 0.5 ? '#44ff44' : ratio > 0.25 ? '#ffaa00' : '#ff4444';
  ctx.fillStyle = hpC;
  ctx.fillRect(hbX, hbY + 18, hbW * ratio, hbH);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(hbX, hbY + 18, hbW, hbH);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`❤️  MATÍAS  ${health}/${maxHealth}`, hbX, hbY + 14);

  // Combo
  if (combo > 1) {
    ctx.fillStyle = `rgba(255,200,50,${Math.min(1, combo / 5)})`;
    ctx.font = `bold ${14 + combo}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`x${combo} COMBO!`, CANVAS_W / 2, CANVAS_H - 20);
    ctx.textAlign = 'left';
  }
}

function drawGameOver(ctx, score, wave) {
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 52px monospace';
  ctx.fillText('¡MATÍAS CAYÓ!', CANVAS_W / 2, CANVAS_H / 2 - 80);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`Puntuación: ${score}`, CANVAS_W / 2, CANVAS_H / 2 - 20);
  ctx.fillStyle = '#aaa';
  ctx.font = '20px monospace';
  ctx.fillText(`Oleada alcanzada: ${wave}`, CANVAS_W / 2, CANVAS_H / 2 + 20);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('Presiona ESPACIO o toca para reiniciar', CANVAS_W / 2, CANVAS_H / 2 + 80);
  ctx.textAlign = 'left';
}

function drawStartScreen(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.88)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 40px monospace';
  ctx.fillText('🐾 MATÍAS EL PUG', CANVAS_W / 2, CANVAS_H / 2 - 100);
  ctx.fillStyle = '#ff6644';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('DEFENSOR ZOMBIE', CANVAS_W / 2, CANVAS_H / 2 - 60);
  ctx.fillStyle = '#aaffaa';
  ctx.font = '16px monospace';
  ctx.fillText('Los gatos zombie vienen por Matías...', CANVAS_W / 2, CANVAS_H / 2 - 10);
  ctx.fillText('¡Él dispara automáticamente!', CANVAS_W / 2, CANVAS_H / 2 + 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('Presiona ESPACIO o toca para empezar', CANVAS_W / 2, CANVAS_H / 2 + 80);
  ctx.textAlign = 'left';
}

export default function MatiasGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [gamePhase, setGamePhase] = useState('start'); // start | playing | gameover
  const gamePhaseRef = useRef('start');

  const setPhase = (p) => {
    gamePhaseRef.current = p;
    setGamePhase(p);
  };

  const initState = useCallback(() => {
    stateRef.current = {
      cats: [],
      bullets: [],
      particles: [],
      score: 0,
      health: 5,
      maxHealth: 5,
      wave: 1,
      frame: 0,
      lastShot: 0,
      lastSpawn: 0,
      spawnInterval: BASE_SPAWN_INTERVAL,
      catSpeed: BASE_CAT_SPEED,
      nextWaveScore: 10,
      combo: 0,
      comboTimer: 0,
      pugAngle: -Math.PI / 2,
    };
  }, []);

  const spawnCat = useCallback(() => {
    const s = stateRef.current;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * CANVAS_W; y = -CAT_SIZE; }
    else if (side === 1) { x = CANVAS_W + CAT_SIZE; y = Math.random() * CANVAS_H; }
    else if (side === 2) { x = Math.random() * CANVAS_W; y = CANVAS_H + CAT_SIZE; }
    else { x = -CAT_SIZE; y = Math.random() * CANVAS_H; }
    const hp = 2 + Math.floor(s.wave * 0.8);
    s.cats.push({ x, y, hp, maxHp: hp, angle: 0, id: Math.random() });
  }, []);

  const addParticles = useCallback((x, y, color, count = 8) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 4,
        color,
        life: 30 + Math.random() * 20,
        maxLife: 50,
      });
    }
  }, []);

  const tick = useCallback((now) => {
    const s = stateRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !s) return;

    s.frame++;

    // Spawn cats
    if (now - s.lastSpawn > s.spawnInterval) {
      spawnCat();
      s.lastSpawn = now;
    }

    // Find nearest cat & aim
    let nearest = null;
    let nearestDist = Infinity;
    for (const cat of s.cats) {
      const dx = cat.x - PUG_X;
      const dy = cat.y - PUG_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) { nearestDist = dist; nearest = cat; }
    }
    if (nearest) {
      s.pugAngle = Math.atan2(nearest.y - PUG_Y, nearest.x - PUG_X) + Math.PI / 2;
    }

    // Auto shoot
    if (nearest && now - s.lastShot > FIRE_RATE) {
      s.lastShot = now;
      const angle = Math.atan2(nearest.y - PUG_Y, nearest.x - PUG_X);
      s.bullets.push({ x: PUG_X, y: PUG_Y, vx: Math.cos(angle) * 9, vy: Math.sin(angle) * 9 });
      addParticles(PUG_X, PUG_Y, '#ffd700', 4);
    }

    // Move bullets
    s.bullets = s.bullets.filter(b => {
      b.x += b.vx; b.y += b.vy;
      return b.x > -20 && b.x < CANVAS_W + 20 && b.y > -20 && b.y < CANVAS_H + 20;
    });

    // Move cats
    for (const cat of s.cats) {
      const dx = PUG_X - cat.x;
      const dy = PUG_Y - cat.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      cat.angle = Math.atan2(dy, dx) + Math.PI / 2;
      cat.x += (dx / dist) * s.catSpeed;
      cat.y += (dy / dist) * s.catSpeed;
    }

    // Bullet-cat collision
    const deadCatIds = new Set();
    for (const cat of s.cats) {
      for (let bi = s.bullets.length - 1; bi >= 0; bi--) {
        const b = s.bullets[bi];
        const dx = b.x - cat.x;
        const dy = b.y - cat.y;
        if (Math.sqrt(dx * dx + dy * dy) < CAT_SIZE / 2 + BULLET_R) {
          cat.hp--;
          s.bullets.splice(bi, 1);
          addParticles(cat.x, cat.y, '#44ff44', 5);
          if (cat.hp <= 0) {
            deadCatIds.add(cat.id);
            s.combo++;
            s.comboTimer = 90;
            s.score += 10 * Math.max(1, s.combo);
            addParticles(cat.x, cat.y, '#ff4444', 14);
          }
          break;
        }
      }
    }
    s.cats = s.cats.filter(c => !deadCatIds.has(c.id));

    // Cat-pug collision
    for (let i = s.cats.length - 1; i >= 0; i--) {
      const cat = s.cats[i];
      const dx = cat.x - PUG_X;
      const dy = cat.y - PUG_Y;
      if (Math.sqrt(dx * dx + dy * dy) < PUG_SIZE / 2 + CAT_SIZE / 2 - 8) {
        s.cats.splice(i, 1);
        s.health--;
        s.combo = 0;
        addParticles(PUG_X, PUG_Y, '#ff4444', 12);
        if (s.health <= 0) {
          setPhase('gameover');
          return;
        }
      }
    }

    // Wave progression
    if (s.score >= s.nextWaveScore) {
      s.wave++;
      s.nextWaveScore = s.score + 10 + s.wave * 8;
      s.catSpeed = BASE_CAT_SPEED + s.wave * 0.25;
      s.spawnInterval = Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL - s.wave * 120);
    }

    // Combo decay
    if (s.comboTimer > 0) { s.comboTimer--; }
    else { s.combo = 0; }

    // Particles
    for (const p of s.particles) { p.x += p.vx; p.y += p.vy; p.vx *= 0.92; p.vy *= 0.92; p.life--; }
    s.particles = s.particles.filter(p => p.life > 0);

    // Draw
    drawBackground(ctx, s.frame);
    drawParticles(ctx, s.particles);
    for (const b of s.bullets) drawBullet(ctx, b, s.frame);
    for (const cat of s.cats) drawZombieCat(ctx, cat, s.frame);
    drawPug(ctx, PUG_X, PUG_Y, s.pugAngle, s.frame);
    drawHUD(ctx, s.score, s.wave, s.health, s.maxHealth, s.combo);

    animRef.current = requestAnimationFrame(tick);
  }, [spawnCat, addParticles]);

  const startGame = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    initState();
    setPhase('playing');
    animRef.current = requestAnimationFrame(tick);
  }, [initState, tick]);

  // Draw static screens
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (gamePhase === 'start') {
      drawBackground(ctx, 0);
      drawPug(ctx, PUG_X, PUG_Y, -Math.PI / 2, 0);
      drawStartScreen(ctx);
    } else if (gamePhase === 'gameover') {
      const s = stateRef.current;
      drawGameOver(ctx, s?.score ?? 0, s?.wave ?? 1);
    }
  }, [gamePhase]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gamePhaseRef.current !== 'playing') startGame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [startGame]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const handleCanvas = () => {
    if (gamePhaseRef.current !== 'playing') startGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-yellow-400 font-mono tracking-widest">
          🐾 MATÍAS EL PUG: DEFENSOR ZOMBIE
        </h1>
        <p className="text-green-400 text-sm font-mono mt-1">
          Matías dispara automáticamente al gato zombie más cercano
        </p>
      </div>

      <div
        className="relative cursor-pointer"
        style={{ border: '2px solid #ffd700', borderRadius: 8, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
        onClick={handleCanvas}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="mt-4 text-center text-gray-400 font-mono text-xs space-y-1">
        <p>Presiona <kbd className="bg-gray-700 text-white px-2 py-0.5 rounded">ESPACIO</kbd> o toca el canvas para iniciar/reiniciar</p>
        <p>¡Sobrevive las oleadas de gatos zombie que vienen a atacar a Matías!</p>
      </div>
    </div>
  );
}
