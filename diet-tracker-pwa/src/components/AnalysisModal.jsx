'use client';

import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

function Spinner() {
  return (
    <div style={{ width: 44, height: 44, border: '3px solid #d1fae5', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  );
}

function Field({ label, value, onChange, unit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: 10, overflow: 'hidden' }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value) || 0)}
          style={{ flex: 1, border: 'none', background: 'transparent', padding: '8px 10px', fontSize: 16, fontWeight: 600, color: '#111827', outline: 'none', width: 0 }}
          inputMode="numeric"
          min={0}
        />
        <span style={{ paddingRight: 10, fontSize: 12, color: '#9ca3af' }}>{unit}</span>
      </div>
    </div>
  );
}

export default function AnalysisModal({ imageDataUrl, analysisResult, isLoading, error, onSave, onClose, onRetry }) {
  const [calorias, setCalorias] = useState(analysisResult?.calorias ?? 0);
  const [proteinas, setProteinas] = useState(analysisResult?.proteinas_g ?? 0);
  const [carbos, setCarbos] = useState(analysisResult?.carbohidratos_g ?? 0);
  const [grasas, setGrasas] = useState(analysisResult?.grasas_g ?? 0);

  const [prevResult, setPrevResult] = useState(analysisResult);
  if (analysisResult !== prevResult) {
    setPrevResult(analysisResult);
    setCalorias(analysisResult?.calorias ?? 0);
    setProteinas(analysisResult?.proteinas_g ?? 0);
    setCarbos(analysisResult?.carbohidratos_g ?? 0);
    setGrasas(analysisResult?.grasas_g ?? 0);
  }

  function handleSave() {
    onSave({ ...analysisResult, calorias, proteinas_g: proteinas, carbohidratos_g: carbos, grasas_g: grasas });
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 430, maxHeight: '90vh', overflowY: 'auto', padding: '0 0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 99 }} />
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={{ position: 'absolute', top: 16, right: 16, zIndex: 110, background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>
            <X size={16} />
          </button>
          {imageDataUrl && (
            <img src={imageDataUrl} alt="Tu comida" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
          )}
          <div style={{ padding: '16px 20px 0' }}>
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
                <Spinner />
                <p style={{ color: '#374151', fontWeight: 600, fontSize: 16, margin: 0 }}>Analizando tu plato...</p>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Gemini Vision está identificando los ingredientes</p>
              </div>
            )}
            {!isLoading && error && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0' }}>
                <span style={{ fontSize: 40 }}>⚠️</span>
                <p style={{ color: '#ef4444', fontWeight: 600, fontSize: 15, margin: 0, textAlign: 'center' }}>{error}</p>
                <button onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f3f4f6', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#374151' }}>
                  <RefreshCw size={16} /> Intentar de nuevo
                </button>
              </div>
            )}
            {!isLoading && !error && analysisResult && (
              <>
                <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{analysisResult.nombre}</h2>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6b7280' }}>{analysisResult.descripcion}</p>
                {analysisResult.porcion_estimada && (
                  <p style={{ margin: '0 0 16px', fontSize: 12, color: '#9ca3af' }}>
                    📏 {analysisResult.porcion_estimada}
                    {analysisResult.confianza && (
                      <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: analysisResult.confianza === 'alta' ? '#10b981' : analysisResult.confianza === 'media' ? '#f59e0b' : '#ef4444', background: analysisResult.confianza === 'alta' ? '#d1fae5' : analysisResult.confianza === 'media' ? '#fef3c7' : '#fee2e2', borderRadius: 6, padding: '1px 6px' }}>
                        {analysisResult.confianza === 'alta' ? 'Alta precisión' : analysisResult.confianza === 'media' ? 'Precisión media' : 'Baja precisión'}
                      </span>
                    )}
                  </p>
                )}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Field label="Calorías" value={calorias} onChange={setCalorias} unit="kcal" />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Field label="Proteínas" value={proteinas} onChange={setProteinas} unit="g" />
                    <Field label="Carbos" value={carbos} onChange={setCarbos} unit="g" />
                    <Field label="Grasas" value={grasas} onChange={setGrasas} unit="g" />
                  </div>
                </div>
                <button onClick={handleSave} style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 0', fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
                  Guardar comida
                </button>
                <button onClick={onRetry} style={{ width: '100%', background: 'none', color: '#6b7280', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '12px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <RefreshCw size={15} /> Repetir foto
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
