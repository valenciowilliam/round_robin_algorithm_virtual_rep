import { LayoutGrid } from 'lucide-react';
import { getProcessColor } from '../utils/constants';

export default function SchedulingResults({ results, processes }) {
  if (!results?.length) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 pb-0 flex items-center gap-2">
        <h2 className="section-title">
          <LayoutGrid size={18} className="text-maroon-700" />
          Scheduling Results
        </h2>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full" id="scheduling-results-table">
          <thead>
            <tr className="border-b border-maroon-100 bg-maroon-50/80">
              {['PID', 'AT', 'BT', 'CT', 'TAT', 'WT', 'RT'].map((h, i) => (
                <th key={h} className={`table-header ${i === 0 ? 'text-left' : 'text-center'}`}>
                  <div className="flex flex-col">
                    <span className="text-maroon-900 font-black">{h}</span>
                    <span className="text-[10px] text-maroon-700 font-semibold normal-case tracking-normal">
                      {
                        { AT: 'Arrival', BT: 'Burst', CT: 'Completion', TAT: 'Turnaround', WT: 'Waiting', RT: 'Response' }[h] ?? ''
                      }
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const c = getProcessColor(r.pid, processes);
              return (
                <tr
                  key={r.pid}
                  className="border-b border-maroon-50 hover:bg-maroon-50/50 transition-colors duration-150 animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-6 rounded-full shadow-xs"
                        style={{ background: c.bg }}
                      />
                      <span className="font-bold text-sm" style={{ color: c.border }}>
                        {r.pid}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-center text-slate-600">{r.arrivalTime}</td>
                  <td className="table-cell text-center text-slate-600">{r.burstTime}</td>
                  <td className="table-cell text-center">
                    <span className="text-maroon-900 font-bold">{r.completionTime}</span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-maroon-800 font-bold">{r.turnaroundTime}</span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-rose-700 font-bold">{r.waitingTime}</span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-amber-800 font-bold">{r.responseTime}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-maroon-200 bg-maroon-50/70">
              <td colSpan={3} className="table-cell text-maroon-900 text-xs uppercase font-black">
                Averages
              </td>
              <td className="table-cell text-center font-bold text-maroon-900">—</td>
              <td className="table-cell text-center text-maroon-800 font-black text-sm">
                {(results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length).toFixed(2)}
              </td>
              <td className="table-cell text-center text-rose-700 font-black text-sm">
                {(results.reduce((s, r) => s + r.waitingTime, 0) / results.length).toFixed(2)}
              </td>
              <td className="table-cell text-center text-amber-800 font-black text-sm">
                {(results.reduce((s, r) => s + r.responseTime, 0) / results.length).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Formulas */}
      <div className="p-5 pt-3 border-t border-maroon-100 mt-2">
        <p className="text-xs text-maroon-800 font-bold uppercase tracking-wider mb-2">Formulas</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: 'Turnaround Time', formula: 'CT − AT' },
            { label: 'Waiting Time', formula: 'TAT − BT' },
            { label: 'Response Time', formula: 'First Start − AT' },
          ].map(({ label, formula }) => (
            <div key={label} className="px-3 py-2 rounded-xl bg-maroon-50/60 border border-maroon-100 text-xs">
              <span className="text-slate-600 font-medium">{label} = </span>
              <span className="font-mono font-bold text-maroon-800">{formula}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
