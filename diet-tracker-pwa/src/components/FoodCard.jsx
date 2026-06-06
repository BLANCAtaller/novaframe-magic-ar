'use client';

import { Trash2 } from 'lucide-react';

function MacroBadge({ label, value, color }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, color, background: `${color}18`, borderRadius: 6, padding: '2px 5px', whiteSpace: 'nowrap' }}>
      {label} {value}g
    </span>
  );
}

export default function FoodCard({ meal, onDelete }) {
  const { id, nombre, descripcion, calorias, proteinas_g, carbohidratos_g, grasas_g, imageThumb } = meal;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 14, padding: '10px 12px', margin: '0 16px 10px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      {imageThumb ? (
        <img src={imageThumb} alt={nombre} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{ width: 64, height: 64, borderRadius: 10, background: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🍽️</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{nombre}</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1, marginBottom: 5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{descripcion}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <MacroBadge label="P" value={proteinas_g} color="#3b82f6" />
          <MacroBadge label="C" value={carbohidratos_g} color="#f59e0b" />
          <MacroBadge label="G" value={grasas_g} color="#f43f5e" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#10b981' }}>{calorias}<span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', marginLeft: 2 }}>kcal</span></span>
        <button onClick={() => onDelete && onDelete(id)} aria-label="Eliminar comida" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#d1d5db', display: 'flex', alignItems: 'center', borderRadius: 6 }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
