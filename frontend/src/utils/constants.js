// Sample process sets for the "Load Example" feature
export const SAMPLE_PROCESSES = [
  { pid: 'P1', arrivalTime: 0, burstTime: 5 },
  { pid: 'P2', arrivalTime: 1, burstTime: 4 },
  { pid: 'P3', arrivalTime: 2, burstTime: 2 },
  { pid: 'P4', arrivalTime: 3, burstTime: 1 },
];

export const SAMPLE_QUANTUM = 2;

// Color palette tuned for white background with maroon aesthetic
export const PROCESS_COLORS = [
  { bg: '#8b102c', border: '#740c24', text: '#ffffff', light: '#fdf4f5' },  // Maroon (Hero)
  { bg: '#c2410c', border: '#9a3412', text: '#ffffff', light: '#fff7ed' },  // Rust / Terracotta
  { bg: '#be123c', border: '#9f1239', text: '#ffffff', light: '#fff1f2' },  // Berry Rose
  { bg: '#6b21a8', border: '#581c87', text: '#ffffff', light: '#faf5ff' },  // Deep Plum
  { bg: '#047857', border: '#065f46', text: '#ffffff', light: '#ecfdf5' },  // Emerald
  { bg: '#0e7490', border: '#155e75', text: '#ffffff', light: '#ecfeff' },  // Deep Teal
  { bg: '#b45309', border: '#92400e', text: '#ffffff', light: '#fffbeb' },  // Warm Bronze
  { bg: '#3730a3', border: '#312e81', text: '#ffffff', light: '#eef2ff' },  // Royal Indigo
  { bg: '#991b1b', border: '#7f1d1d', text: '#ffffff', light: '#fef2f2' },  // Ruby
  { bg: '#475569', border: '#334155', text: '#ffffff', light: '#f1f5f9' },  // Slate Charcoal
];

export const IDLE_COLOR = {
  bg: '#94a3b8', border: '#64748b', text: '#ffffff', light: '#f8fafc'
};

/**
 * Get the color object for a given PID.
 * Uses a deterministic hash to always assign the same color to the same PID.
 */
export function getProcessColor(pid, processList) {
  if (pid === 'IDLE') return IDLE_COLOR;
  const idx = processList ? processList.findIndex((p) => p.pid === pid) : -1;
  if (idx >= 0) return PROCESS_COLORS[idx % PROCESS_COLORS.length];
  // fallback: hash the string
  let h = 0;
  for (let i = 0; i < pid.length; i++) h = (h * 31 + pid.charCodeAt(i)) % PROCESS_COLORS.length;
  return PROCESS_COLORS[h];
}

export const SPEED_OPTIONS = [
  { label: '0.5×', value: 2000 },
  { label: '1×', value: 1000 },
  { label: '1.5×', value: 667 },
  { label: '2×', value: 500 },
  { label: '3×', value: 333 },
];
