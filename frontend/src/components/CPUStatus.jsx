import { Cpu, Clock, CheckCircle2, Hourglass } from 'lucide-react';
import { getProcessColor } from '../utils/constants';

export default function CPUStatus({ stepData, processes, simStatus }) {
  const isRunning = simStatus === 'RUNNING' || simStatus === 'PAUSED' || simStatus === 'DONE';

  if (!stepData || !isRunning) {
    return (
      <div className="glass-card p-5 flex flex-col gap-3">
        <h2 className="section-title">
          <Cpu size={18} className="text-maroon-700" />
          CPU Status
        </h2>
        <div className="flex flex-col items-center justify-center h-28 gap-3 text-slate-400">
          <Cpu size={36} className="text-maroon-200" />
          <p className="text-sm font-medium text-slate-500">Awaiting simulation…</p>
        </div>
      </div>
    );
  }

  const { activePid, time, action } = stepData;
  const isIdle = activePid === null || activePid === 'IDLE';
  const color = isIdle ? null : getProcessColor(activePid, processes);

  const activeState = stepData.processStates?.find((p) => p.pid === activePid);

  const actionLabel = {
    CPU_IDLE: 'CPU Idle — No Process Ready',
    PROCESS_COMPLETE: 'Process Completed',
    PROCESS_PREEMPTED: 'Process Preempted',
  }[action] ?? 'Executing on CPU';

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">
          <Cpu size={18} className="text-maroon-700" />
          CPU Status
        </h2>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-maroon-800 bg-maroon-50 px-2.5 py-1 rounded-lg border border-maroon-200">
          <Clock size={12} />
          t = {time}
        </div>
      </div>

      {/* CPU Core Visualizer */}
      <div
        className="relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-500"
        style={
          isIdle
            ? { borderColor: '#e2e8f0', background: '#f8fafc' }
            : {
                borderColor: color.border,
                background: color.light,
                boxShadow: `0 8px 24px ${color.bg}25`,
              }
        }
      >
        {/* Pulsing ring for running state */}
        {!isIdle && simStatus === 'RUNNING' && (
          <div
            className="absolute inset-0 rounded-2xl animate-ping opacity-25"
            style={{ border: `2px solid ${color.border}` }}
          />
        )}

        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black border-2 mb-3 transition-all duration-500 shadow-sm"
          style={
            isIdle
              ? { borderColor: '#cbd5e1', background: '#f1f5f9', color: '#64748b' }
              : {
                  borderColor: color.border,
                  background: color.bg,
                  color: color.text,
                }
          }
        >
          {isIdle ? '—' : activePid}
        </div>

        <p className="text-sm font-bold text-maroon-950">
          {isIdle ? 'CPU Idle' : `Running ${activePid}`}
        </p>
        <p className="text-xs text-slate-500 mt-1 text-center font-medium">{actionLabel}</p>

        {activeState && (
          <div className="mt-4 flex gap-4 text-xs bg-white/80 px-4 py-2 rounded-xl border border-maroon-100 shadow-xs">
            <div className="text-center">
              <p className="text-slate-500">Remaining</p>
              <p className="font-mono font-bold" style={{ color: color?.border ?? '#8b102c' }}>
                {activeState.remainingTime} units
              </p>
            </div>
            <div className="w-px bg-maroon-200" />
            <div className="text-center">
              <p className="text-slate-500">Burst</p>
              <p className="font-mono font-bold text-maroon-950">{activeState.burstTime} units</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
