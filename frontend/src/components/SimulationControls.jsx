import {
  Play, Pause, SkipForward, SkipBack,
  RotateCcw, Loader2, Zap, ChevronRight
} from 'lucide-react';
import { SPEED_OPTIONS } from '../utils/constants';

export default function SimulationControls({
  simStatus, isLoading, currentStep, totalSteps, isLastStep,
  animSpeed, setAnimSpeed,
  onRun, onPlay, onPause, onNext, onPrev, onReset, onFullReset,
}) {
  const isIdle = simStatus === 'IDLE';
  const isReady = simStatus === 'READY';
  const isRunning = simStatus === 'RUNNING';
  const isPaused = simStatus === 'PAUSED';
  const isDone = simStatus === 'DONE';
  const hasData = !isIdle;

  const progressPct = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="section-title">
          <Zap size={18} className="text-maroon-700" />
          Simulation Controls
        </h2>
        {hasData && (
          <span className="badge bg-maroon-50 border border-maroon-200 text-maroon-800 font-semibold">
            Step {currentStep + 1} / {totalSteps}
          </span>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={isLoading || isRunning}
        className="btn-primary w-full justify-center py-3 text-base font-bold"
        id="run-simulation-btn"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Computing Schedule…
          </>
        ) : (
          <>
            <ChevronRight size={18} />
            {isIdle ? 'Run Simulation' : 'Re-run Simulation'}
          </>
        )}
      </button>

      {/* Progress bar */}
      {hasData && (
        <div className="space-y-1">
          <div className="h-2.5 w-full bg-maroon-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(to right, #8b102c, #dd6d84)',
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>t = 0</span>
            <span className={isDone ? 'text-maroon-700 font-bold' : ''}>
              {isDone ? '✓ Complete' : `${Math.round(progressPct)}%`}
            </span>
          </div>
        </div>
      )}

      {/* Playback controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!hasData || currentStep === 0 || isRunning}
          className="btn-secondary flex-1 justify-center"
          id="prev-step-btn"
          title="Previous Step"
        >
          <SkipBack size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {isRunning ? (
          <button
            onClick={onPause}
            className="btn-primary flex-[2] justify-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-900/20"
            id="pause-btn"
          >
            <Pause size={16} />
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={!hasData || isLoading}
            className="btn-primary flex-[2] justify-center"
            id="play-btn"
          >
            <Play size={16} />
            {isDone ? 'Replay' : isReady ? 'Play' : 'Resume'}
          </button>
        )}

        <button
          onClick={onNext}
          disabled={!hasData || isLastStep || isRunning}
          className="btn-secondary flex-1 justify-center"
          id="next-step-btn"
          title="Next Step"
        >
          <span className="hidden sm:inline">Next</span>
          <SkipForward size={16} />
        </button>
      </div>

      {/* Reset controls */}
      {hasData && (
        <div className="flex gap-2">
          <button onClick={onReset} disabled={isRunning} className="btn-secondary flex-1 justify-center text-xs" id="reset-btn">
            <RotateCcw size={14} />
            Reset Steps
          </button>
          <button onClick={onFullReset} disabled={isRunning} className="btn-danger flex-1 justify-center text-xs" id="full-reset-btn">
            <RotateCcw size={14} />
            Full Reset
          </button>
        </div>
      )}

      {/* Speed control */}
      {hasData && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-maroon-50/60 border border-maroon-100">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-maroon-900">Animation Speed</span>
            <span className="font-mono font-bold text-maroon-700">
              {SPEED_OPTIONS.find((s) => s.value === animSpeed)?.label ?? 'Custom'}
            </span>
          </div>
          <div className="flex gap-1.5">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setAnimSpeed(s.value)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all duration-200
                  ${animSpeed === s.value
                    ? 'bg-maroon-800 border border-maroon-900 text-white shadow-sm'
                    : 'bg-white border border-maroon-200 text-maroon-900 hover:bg-maroon-100'
                  }`}
                id={`speed-${s.label.replace('×', 'x')}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status badge */}
      <div className="flex justify-center">
        <StatusBadge status={simStatus} isLoading={isLoading} />
      </div>
    </div>
  );
}

function StatusBadge({ status, isLoading }) {
  const map = {
    IDLE:    { label: 'Idle',         color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-200' },
    READY:   { label: 'Ready',        color: 'text-maroon-800',  bg: 'bg-maroon-100 border-maroon-200' },
    RUNNING: { label: 'Running',      color: 'text-rose-800',    bg: 'bg-rose-100 border-rose-200' },
    PAUSED:  { label: 'Paused',       color: 'text-amber-800',   bg: 'bg-amber-100 border-amber-200' },
    DONE:    { label: 'Completed',    color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-200' },
  };
  const { label, color, bg } = isLoading
    ? { label: 'Computing…', color: 'text-maroon-800', bg: 'bg-maroon-100 border-maroon-200' }
    : (map[status] ?? map.IDLE);

  return (
    <span className={`badge border ${bg} ${color} text-xs px-3 py-1 font-semibold`}>
      {status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse mr-1.5" />}
      {label}
    </span>
  );
}
