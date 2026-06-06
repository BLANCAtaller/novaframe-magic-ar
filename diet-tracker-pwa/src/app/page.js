'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import MacroSummary from '@/components/MacroSummary';
import FoodCard from '@/components/FoodCard';
import AnalysisModal from '@/components/AnalysisModal';
import { getTodayMeals, addMeal, deleteMeal, getDayTotals } from '@/lib/storage';
import { formatDate, todayKey, compressImage } from '@/lib/utils';

export default function HomePage() {
  const [meals, setMeals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setMeals(getTodayMeals());
  }, []);

  const totals = getDayTotals(meals);
  const dateLabel = formatDate(todayKey());

  function openCamera() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const original = ev.target.result;

      let compressed;
      try {
        compressed = await compressImage(original, 800);
      } catch {
        compressed = original;
      }

      setImageDataUrl(compressed);
      setAnalysisResult(null);
      setAnalysisError(null);
      setIsLoading(true);
      setModalOpen(true);

      try {
        const apiImage = await compressImage(original, 400);
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: apiImage }),
        });
        const data = await res.json();
        if (!res.ok) {
          setAnalysisError(data.error || 'Error desconocido al analizar la imagen');
        } else {
          setAnalysisResult(data);
        }
      } catch {
        setAnalysisError('No se pudo conectar al servidor. Verifica tu conexión.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveMeal(result) {
    let imageThumb = null;
    if (imageDataUrl) {
      try {
        imageThumb = await compressImage(imageDataUrl, 200);
      } catch {
        imageThumb = imageDataUrl;
      }
    }

    const saved = addMeal({ ...result, imageThumb });
    setMeals(prev => [saved, ...prev]);
    setModalOpen(false);
  }

  function handleDeleteMeal(id) {
    deleteMeal(id);
    setMeals(prev => prev.filter(m => m.id !== id));
  }

  function handleRetry() {
    setModalOpen(false);
    setImageDataUrl(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setTimeout(() => fileInputRef.current?.click(), 100);
  }

  return (
    <div>
      <div
        style={{
          background: '#fff',
          padding: '16px 16px 12px',
          borderBottom: '1px solid #f3f4f6',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>Hoy</h1>
        <p style={{ margin: 0, fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{dateLabel}</p>
      </div>

      <MacroSummary totals={totals} />

      <div style={{ paddingTop: 4 }}>
        {meals.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 32px',
              gap: 12,
              color: '#9ca3af',
            }}
          >
            <span style={{ fontSize: 56 }}>📸</span>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: '#6b7280', textAlign: 'center' }}>
              ¡Toma una foto de tu comida!
            </p>
            <p style={{ margin: 0, fontSize: 13, textAlign: 'center' }}>
              Gemini Vision identificará el plato y estimará las calorías automáticamente.
            </p>
          </div>
        ) : (
          meals.map(meal => (
            <FoodCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
          ))
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        onClick={openCamera}
        aria-label="Fotografiar comida"
        style={{
          position: 'fixed',
          bottom: 'calc(4.5rem + env(safe-area-inset-bottom))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#10b981',
          border: 'none',
          boxShadow: '0 4px 14px rgba(16,185,129,0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          zIndex: 40,
        }}
      >
        <Camera size={28} />
      </button>

      {modalOpen && (
        <AnalysisModal
          imageDataUrl={imageDataUrl}
          analysisResult={analysisResult}
          isLoading={isLoading}
          error={analysisError}
          onSave={handleSaveMeal}
          onClose={() => setModalOpen(false)}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
