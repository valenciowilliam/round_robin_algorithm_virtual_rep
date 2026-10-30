import { List, ArrowRight } from 'lucide-react';
import { getProcessColor } from '../utils/constants';

export default function ReadyQueue({ stepData, processes, simStatus }) {
  const isActive = simStatus === 'RUNNING' || simStatus === 'PAUSED' || simStatus === 'DONE';

  if (!isActive || !stepData) {
    return (
      <div className="glass-card p-5 flex flex-col gap-3">
        <h2 className="section-title">
          <List size={18} className="text-maroon-700" />
          Ready Queue
        </h2>
        <div className="flex items-center justify-center h-20 text-slate-500 text-sm font-medium">
          Queue will appear during simulation
        </div>
      </div>
    );
  }

  const { readyQueue, activePid } = stepData;
  const completedPids = new Set(
    stepData.processStates?.filter((p) => p.completed).map((p) => p.pid) ?? []
  );

  // Processes not yet arrived and not completed and not in queue and not active
  const allPids = processes.map((p) => p.pid);
  const inQueuePids = new Set(readyQueue.map((q) => q.pid));
  const waitingPids = allPids.filter(
    (pid) => !completedPids.has(pid) && !inQueuePids.has(pid) && pid !== activePid
  );

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">
          <List size={18} className="text-maroon-700" />
          Ready Queue
        </h2>
        <span className="badge bg-maroon-50 border border-maroon-200 text-maroon-800 font-semibold">
          {readyQueue.length} waiting
        </span>
      </div>

      {/* CPU → Queue flow diagram */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* CPU block */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <span className="text-[10px] text-maroon-800 font-bold uppercase tracking-wider">CPU</span>
          {activePid && activePid !== 'IDLE' ? (
            <ProcessBlock
              pid={activePid}
              processes={processes}
              subtitle="Running"
              isActive
              glow
            />
          ) : (
            <div className="process-tag border-slate-300 text-slate-500 bg-slate-100 text-xs">
              IDLE
            </div>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight size={16} className="flex-shrink-0 text-maroon-400 mt-4" />

        {/* Queue label */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <span className="text-[10px] text-maroon-800 font-bold uppercase tracking-wider">
            Front
          </span>
          <div className="w-px h-10 border-l-2 border-dashed border-maroon-300" />
        </div>

        {/* Queue items */}
        <div className="flex items-center gap-2">
          {readyQueue.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-maroon-200 text-slate-500 text-xs font-medium bg-maroon-50/30">
              Empty Queue
            </div>
          ) : (
            readyQueue.map((item, i) => (
              <div key={`${item.pid}-${i}`} className="flex items-center gap-2 animate-slide-in">
                <ProcessBlock
                  pid={item.pid}
                  processes={processes}
                  subtitle={`rem: ${item.remainingTime}`}
                  position={i + 1}
                />
                {i < readyQueue.length - 1 && (
                  <ArrowRight size={14} className="text-maroon-400 flex-shrink-0" />
                )}
              </div>
            ))
          )}

          {readyQueue.length > 0 && (
            <>
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <span className="text-[10px] text-maroon-800 font-bold uppercase tracking-wider">
                  Tail
                </span>
                <div className="w-px h-10 border-l-2 border-dashed border-maroon-300" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Not arrived / Completed legend row */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-maroon-100">
        {waitingPids.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Not arrived:</span>
            <div className="flex gap-1.5">
              {waitingPids.map((pid) => {
                const c = getProcessColor(pid, processes);
                return (
                  <span
                    key={pid}
                    className="px-2 py-0.5 rounded-lg text-xs font-bold border opacity-70"
                    style={{ borderColor: c.border, color: c.border, background: c.light }}
                  >
                    {pid}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {completedPids.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Done:</span>
            <div className="flex gap-1.5">
              {[...completedPids].map((pid) => (
                <span
                  key={pid}
                  className="px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-200 text-emerald-800 bg-emerald-50"
                >
                  {pid} ✓
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {stepData.description && (
        <div className="p-3 rounded-xl bg-maroon-50/70 border border-maroon-100">
          <p className="text-xs text-maroon-950 leading-relaxed font-medium">
            <span className="text-maroon-800 font-bold">Event: </span>
            {stepData.description}
          </p>
        </div>
      )}
    </div>
  );
}

function ProcessBlock({ pid, processes, subtitle, isActive, glow, position }) {
  const c = getProcessColor(pid, processes);

  return (
    <div className="flex flex-col items-center gap-0.5">
      {position && (
        <span className="text-[9px] text-slate-500 font-bold">#{position}</span>
      )}
      <div
        className="process-tag transition-all duration-300"
        style={{
          borderColor: c.border,
          color: isActive ? '#ffffff' : c.border,
          background: isActive ? c.bg : c.light,
          boxShadow: glow ? `0 0 12px ${c.bg}40` : 'none',
          transform: isActive ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {pid}
      </div>
      <span className="text-[10px] text-slate-600 font-mono font-medium">{subtitle}</span>
    </div>
  );
}
