import { todayKey } from './utils';

const STORAGE_KEY = 'diet_log';

function readLog() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeLog(log) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export function getTodayMeals() {
  const log = readLog();
  return log[todayKey()] || [];
}

export function getAllDays() {
  const log = readLog();
  const days = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;
    const meals = log[dateKey] || [];
    days.push({ dateKey, meals, totals: getDayTotals(meals) });
  }
  return days;
}

export function addMeal(meal) {
  const log = readLog();
  const key = todayKey();
  const entry = { id: Date.now(), timestamp: new Date().toISOString(), ...meal };
  log[key] = [entry, ...(log[key] || [])];
  writeLog(log);
  return entry;
}

export function deleteMeal(mealId) {
  const log = readLog();
  for (const key of Object.keys(log)) {
    log[key] = log[key].filter(m => m.id !== mealId);
    if (log[key].length === 0) delete log[key];
  }
  writeLog(log);
}

export function getDayTotals(meals) {
  return meals.reduce(
    (acc, m) => ({
      calorias: acc.calorias + (Number(m.calorias) || 0),
      proteinas_g: acc.proteinas_g + (Number(m.proteinas_g) || 0),
      carbohidratos_g: acc.carbohidratos_g + (Number(m.carbohidratos_g) || 0),
      grasas_g: acc.grasas_g + (Number(m.grasas_g) || 0),
    }),
    { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 }
  );
}
