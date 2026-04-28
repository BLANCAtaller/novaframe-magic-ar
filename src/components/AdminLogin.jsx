import React, { useState } from 'react';
import { ShieldAlert, KeyRound, ArrowRight, Loader2, CheckSquare, Square } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const auth = getAuth(app);
    try {
      // Set persistence based on checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Validate if it's the admin email
      if (userCredential.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        if (onLoginSuccess) onLoginSuccess(userCredential.user);
      } else {
        setError('ACCESO DENEGADO: Credenciales no autorizadas en el Nexus.');
        auth.signOut();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('AUTENTICACIÓN FALLIDA: Verifique sus credenciales e intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-neon-cyan/30">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <KeyRound size={28} className="text-neon-cyan" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Acceso Restringido</h1>
            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Admin Nexus // Hub Central</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30 block mb-2">Identificación</label>
                <input 
                  type="email" 
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@novaframe.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30 block mb-2">Clave de Acceso</label>
                <input 
                  type="password" 
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div 
              className="flex items-center gap-2 cursor-pointer group w-max"
              onClick={() => setRememberMe(!rememberMe)}
            >
              {rememberMe ? (
                <CheckSquare size={16} className="text-neon-cyan" />
              ) : (
                <Square size={16} className="text-white/30 group-hover:text-white/50 transition-colors" />
              )}
              <span className="text-[10px] font-mono text-white/50 group-hover:text-white/80 transition-colors select-none uppercase tracking-wider">
                Mantener conexión activa
              </span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-400 font-mono tracking-wide leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-neon-cyan text-black font-black text-[11px] tracking-[0.3em] uppercase rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Verificando...</>
              ) : (
                <>INICIAR SESIÓN <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="text-[8px] font-mono tracking-[0.5em] text-white/15 uppercase">Protocolo de Seguridad v3.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
