'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import { getAllDays, deleteMeal } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

const CALORIE_GOAL = 2000;

function MacroBar({ proteinas_g, carbohidratos_g, grasas_g }) {
  const total = proteinas_g + carbohidratos_g + grasas_g;
  if (total === 0) return null;
  const pPct = Math.round((proteinas_g / total) * 100);
  const cPct = Math.round((carbohidratos_g / total) * 100);
  const gPct = 100 - pPct - cPct;
  return (
    <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ width: `${pPct}%`, background: '#3b82f6' }} />
      <div style={{ width: `${cPct}%`, background: '#f59e0b' }} />
      <div style={{ width: `${gPct}%`, background: '#f43f5e' }} />
    </div>
  );
}

function DayCard({ day, onDeleteMeal }) {
  const [expanded, setExpanded] = useState(false);
  const { dateKey, meals, totals } = day;
  const hasMeals = meals.length > 0;
  const calPct = Math.min(100, Math.round((totals.calorias / CALORIE_GOAL) * 100));

  return (
    <div style={{ background: '#fff', borderRadius: 16, margin: '0 16px 12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <button
        onClick={() => hasMeals && setExpanded(v => !v)}
        style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', cursor: hasMeals ? 'pointer' : 'default', textAlign: 'left', display: 'flex', alignItems: 'center' }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{formatDate(dateKey)}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: hasMeals ? '#10b981' : '#d1d5db' }}>
              {hasMeals ? `${totals.calorias} kcal` : '—'}
            </span>
          </div>
          {hasMeals ? (
            <>
              <div style={{ height: 4, background: '#f3f4f6', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${calPct}%`, background: calPct >= 100 ? '#ef4444' : calPct >= 85 ? '#f59e0b' : '#10b981', borderRadius: 99 }} />
              </div>
              <MacroBar {...totals} />
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#3b82f6' }}>P {totals.proteinas_g}g</span>
                <span style={{ fontSize: 11, color: '#f59e0b' }}>C {totals.carbohidratos_g}g</span>
                <span style={{ fontSize: 11, color: '#f43f5e' }}>G {totals.grasas_g}g</span>
                <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>{meals.length} {meals.length === 1 ? 'comida' : 'comidas'}</span>
              </div>
            </>
          ) : (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>Sin registros</p>
          )}
        </div>
        {hasMeals && <div style={{ marginLeft: 12, color: '#9ca3af' }}>{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>}
      </button>
      {expanded && hasMeals && (
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 8, paddingBottom: 4 }}>
          {meals.map(meal => <FoodCard key={meal.id} meal={meal} onDelete={onDeleteMeal} />)}
        </div>
      )}
    </div>
  );
}

export default function HistorialPage() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    setDays(getAllDays().slice(0, 7));
  }, []);

  function handleDeleteMeal(mealId) {
    deleteMeal(mealId);
    setDays(getAllDays().slice(0, 7));
  }

  const totalDaysWithMeals = days.filter(d => d.meals.length > 0).length;

  return (
    <div>
      <div style={{ background: '#fff', padding: '16px 16px 12px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>Historial</h1>
        <p style={{ margin: 0, fontSize: 13, color: '#9ca3af', marginTop: 2 }}>Últimos 7 días · {totalDaysWithMeals} con registros</p>
      </div>
      <div style={{ paddingTop: 16 }}>
        {days.map(day => <DayCard key={day.dateKey} day={day} onDeleteMeal={handleDeleteMeal} />)}
      </div>
    </div>
  );
}
