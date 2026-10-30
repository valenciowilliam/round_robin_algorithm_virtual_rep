import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * Runs the Round Robin scheduling algorithm via the backend API.
 * @param {Array} processes - Array of { pid, arrivalTime, burstTime }
 * @param {number} timeQuantum - Time quantum
 * @returns {Promise<Object>} Scheduling results
 */
export async function runRoundRobinAPI(processes, timeQuantum) {
  const response = await api.post('/schedule/round-robin', { processes, timeQuantum });
  return response.data;
}

/**
 * Checks the backend server health.
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export default api;
