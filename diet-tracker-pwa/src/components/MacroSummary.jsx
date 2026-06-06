'use client';

const CALORIE_GOAL = 2000;

function MacroPill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: 12, padding: '6px 14px', minWidth: 72, gap: 2 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color }}>{value}g</span>
      <span style={{ fontSize: 11, color: '#6b7280' }}>{label}</span>
    </div>
  );
}

export default function MacroSummary({ totals }) {
  const { calorias = 0, proteinas_g = 0, carbohidratos_g = 0, grasas_g = 0 } = totals || {};
  const pct = Math.min(100, Math.round((calorias / CALORIE_GOAL) * 100));
  const barColor = pct >= 100 ? '#ef4444' : pct >= 85 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ background: '#f0fdf4', borderRadius: 16, padding: '16px 16px 12px', margin: '12px 16px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Calorías</span>
        <span style={{ fontSize: 13, color: '#6b7280' }}><strong style={{ color: '#111827', fontSize: 20 }}>{calorias}</strong> / {CALORIE_GOAL} kcal</span>
      </div>
      <div style={{ height: 8, background: '#d1fae5', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <MacroPill label="Proteínas" value={proteinas_g} color="#3b82f6" />
        <MacroPill label="Carbos" value={carbohidratos_g} color="#f59e0b" />
        <MacroPill label="Grasas" value={grasas_g} color="#f43f5e" />
      </div>
    </div>
  );
}
