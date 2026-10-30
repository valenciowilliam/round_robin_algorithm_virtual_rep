import { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { getProcessColor, IDLE_COLOR } from '../utils/constants';

export default function GanttChart({ visibleGantt, fullGantt, processes, simStatus, currentStep }) {
  const [tooltip, setTooltip] = useState(null);

  const isActive = simStatus === 'RUNNING' || simStatus === 'PAUSED' || simStatus === 'DONE';
  const displayGantt = simStatus === 'DONE' ? fullGantt : visibleGantt;

  if (!isActive || !displayGantt?.length) {
    return (
      <div className="glass-card p-5 flex flex-col gap-3">
        <h2 className="section-title">
          <BarChart2 size={18} className="text-maroon-700" />
          Gantt Chart
        </h2>
        <div className="flex items-center justify-center h-24 text-slate-500 text-sm font-medium border border-dashed border-maroon-200 rounded-xl bg-maroon-50/20">
          Gantt chart will render as the simulation progresses
        </div>
      </div>
    );
  }

  const totalTime = displayGantt[displayGantt.length - 1]?.end ?? 0;
  const minWidth = 40; // minimum px width per unit of time
  const chartWidth = Math.max(totalTime * minWidth, 400);

  return (
    <div className="glass-card p-5 flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="section-title">
          <BarChart2 size={18} className="text-maroon-700" />
          Gantt Chart
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-3 flex-wrap">
            {processes.map((p) => {
              const c = getProcessColor(p.pid, processes);
              return (
                <div key={p.pid} className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded shadow-xs" style={{ background: c.bg }} />
                  <span className="text-xs text-maroon-900 font-semibold">{p.pid}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded shadow-xs" style={{ background: IDLE_COLOR.bg }} />
              <span className="text-xs text-slate-600 font-medium">Idle</span>
            </div>
          </div>
          {simStatus === 'DONE' && (
            <span className="badge bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              ✓ Full Timeline
            </span>
          )}
        </div>
      </div>

      {/* Scrollable chart area */}
      <div className="overflow-x-auto rounded-xl border border-maroon-100 bg-white p-3">
        <div style={{ minWidth: `${chartWidth + 40}px`, padding: '4px 8px 0' }}>
          {/* Blocks row */}
          <div className="relative flex h-14 gap-0.5">
            {displayGantt.map((seg, i) => {
              const c = seg.isIdle ? IDLE_COLOR : getProcessColor(seg.pid, processes);
              const isLast = i === displayGantt.length - 1;
              const duration = seg.end - seg.start;
              const widthPct = totalTime > 0 ? (duration / totalTime) * 100 : 0;

              return (
                <div
                  key={i}
                  className="gantt-block relative animate-fade-in cursor-pointer group shadow-xs"
                  style={{
                    width: `${widthPct}%`,
                    minWidth: `${Math.max(duration * minWidth - 2, 30)}px`,
                    background: seg.isIdle
                      ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)'
                      : `linear-gradient(135deg, ${c.bg}, ${c.border})`,
                    borderColor: 'rgba(255,255,255,0.4)',
                    boxShadow: isLast && !seg.isIdle ? `0 0 14px ${c.bg}70` : '0 2px 4px rgba(0,0,0,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ seg, x: rect.left, y: rect.top, c });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <span
                    className="text-xs font-black select-none text-white drop-shadow-xs"
                  >
                    {seg.pid}
                  </span>
                  <span className="text-[10px] font-bold text-white/90">
                    {duration}u
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time scale */}
          <div className="relative flex h-6 mt-1">
            {displayGantt.map((seg, i) => {
              const widthPct = totalTime > 0 ? ((seg.end - seg.start) / totalTime) * 100 : 0;
              return (
                <div
                  key={i}
                  className="relative flex-shrink-0"
                  style={{
                    width: `${widthPct}%`,
                    minWidth: `${Math.max((seg.end - seg.start) * minWidth - 2, 30)}px`,
                  }}
                >
                  {/* Start tick */}
                  <div className="absolute left-0 top-0 flex flex-col items-center">
                    <div className="w-px h-2 bg-maroon-300" />
                    <span className="text-[10px] font-mono font-bold text-maroon-900">{seg.start}</span>
                  </div>
                  {/* End tick for last item */}
                  {i === displayGantt.length - 1 && (
                    <div className="absolute right-0 top-0 flex flex-col items-center">
                      <div className="w-px h-2 bg-maroon-300" />
                      <span className="text-[10px] font-mono font-bold text-maroon-900">{seg.end}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline base line */}
          <div className="h-0.5 bg-maroon-200 mx-0 mt-0.5 rounded-full" />
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-maroon-950 border border-maroon-800 rounded-xl text-xs text-white shadow-xl pointer-events-none"
          style={{ top: tooltip.y - 80, left: tooltip.x + 10 }}
        >
          <p className="font-bold text-rose-300">{tooltip.seg.pid}</p>
          <p>Start: t={tooltip.seg.start}</p>
          <p>End: t={tooltip.seg.end}</p>
          <p>Duration: {tooltip.seg.end - tooltip.seg.start} unit(s)</p>
        </div>
      )}
    </div>
  );
}
