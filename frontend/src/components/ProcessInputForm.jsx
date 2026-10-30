import { useState } from 'react';
import { Plus, Trash2, RefreshCw, Database } from 'lucide-react';
import { SAMPLE_PROCESSES, SAMPLE_QUANTUM } from '../utils/constants';

export default function ProcessInputForm({ processes, setProcesses, timeQuantum, setTimeQuantum, disabled }) {
  const [localError, setLocalError] = useState('');

  function updateProcess(index, field, value) {
    setLocalError('');
    setProcesses((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function addProcess() {
    if (processes.length >= 20) {
      setLocalError('Maximum 20 processes allowed.');
      return;
    }
    const nextNum = processes.length + 1;
    setProcesses((prev) => [
      ...prev,
      { pid: `P${nextNum}`, arrivalTime: 0, burstTime: 1 },
    ]);
  }

  function removeProcess(index) {
    if (processes.length <= 1) {
      setLocalError('At least one process is required.');
      return;
    }
    setLocalError('');
    setProcesses((prev) => prev.filter((_, i) => i !== index));
  }

  function loadSample() {
    setProcesses(SAMPLE_PROCESSES.map((p) => ({ ...p })));
    setTimeQuantum(SAMPLE_QUANTUM);
    setLocalError('');
  }

  function clearAll() {
    setProcesses([{ pid: 'P1', arrivalTime: 0, burstTime: 1 }]);
    setTimeQuantum(2);
    setLocalError('');
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="section-title">
          <Database size={18} className="text-maroon-700" />
          Process Configuration
        </h2>
        <div className="flex gap-2">
          <button onClick={loadSample} disabled={disabled} className="btn-secondary text-xs">
            <RefreshCw size={13} />
            Load Example
          </button>
          <button onClick={clearAll} disabled={disabled} className="btn-danger text-xs">
            <Trash2 size={13} />
            Clear
          </button>
        </div>
      </div>

      {/* Time Quantum */}
      <div className="flex items-center gap-4 p-3 rounded-xl bg-maroon-50/60 border border-maroon-100">
        <label className="text-sm font-semibold text-maroon-950 whitespace-nowrap min-w-[120px]">
          Time Quantum (Q)
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(Number(e.target.value))}
          disabled={disabled}
          className="input-field max-w-[100px] text-center font-mono font-bold text-maroon-900 border-maroon-300"
          id="time-quantum-input"
        />
        <p className="text-xs text-slate-500">
          Max CPU burst per process per round. Smaller Q → more context switches.
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2 px-1">
        {['Process ID', 'Arrival Time', 'Burst Time', ''].map((h) => (
          <span key={h} className="text-xs font-bold text-maroon-800 uppercase tracking-wider">
            {h}
          </span>
        ))}
      </div>

      {/* Process rows */}
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {processes.map((proc, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2 items-center animate-fade-in"
          >
            <input
              type="text"
              placeholder="P1"
              value={proc.pid}
              onChange={(e) => updateProcess(idx, 'pid', e.target.value.trim())}
              disabled={disabled}
              className="input-field font-mono font-bold text-maroon-900"
              id={`pid-input-${idx}`}
              maxLength={8}
            />
            <input
              type="number"
              min={0}
              placeholder="0"
              value={proc.arrivalTime}
              onChange={(e) => updateProcess(idx, 'arrivalTime', e.target.value)}
              disabled={disabled}
              className="input-field font-mono text-center text-maroon-950"
              id={`at-input-${idx}`}
            />
            <input
              type="number"
              min={1}
              placeholder="1"
              value={proc.burstTime}
              onChange={(e) => updateProcess(idx, 'burstTime', e.target.value)}
              disabled={disabled}
              className="input-field font-mono text-center text-maroon-950"
              id={`bt-input-${idx}`}
            />
            <button
              onClick={() => removeProcess(idx)}
              disabled={disabled || processes.length === 1}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 
                         transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              id={`remove-process-${idx}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Process Button */}
      <button
        onClick={addProcess}
        disabled={disabled || processes.length >= 20}
        className="btn-success w-full justify-center py-2.5"
        id="add-process-btn"
      >
        <Plus size={16} />
        Add Process
      </button>

      {localError && (
        <p className="text-xs text-rose-600 font-semibold text-center">{localError}</p>
      )}

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-maroon-100">
        <div className="text-xs text-slate-500">
          <span className="block font-bold text-maroon-800">AT</span> Arrival Time
        </div>
        <div className="text-xs text-slate-500">
          <span className="block font-bold text-maroon-800">BT</span> Burst Time
        </div>
        <div className="text-xs text-slate-500">
          <span className="block font-bold text-maroon-800">Q</span> Time Quantum
        </div>
      </div>
    </div>
  );
}
