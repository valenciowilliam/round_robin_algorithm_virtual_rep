import { TrendingUp } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';
import { getProcessColor } from '../utils/constants';

export default function PerformanceMetrics({ metrics, results, processes }) {
  if (!metrics) return null;

  const {
    avgTurnaroundTime, avgWaitingTime, avgResponseTime,
    cpuUtilization, throughput, totalTime, idleTime, cpuBusyTime, timeQuantum
  } = metrics;

  const metricCards = [
    { label: 'Avg Turnaround', value: avgTurnaroundTime, unit: 'units', color: '#8b102c', icon: '↕' },
    { label: 'Avg Waiting',    value: avgWaitingTime,    unit: 'units', color: '#c73856', icon: '⏳' },
    { label: 'Avg Response',   value: avgResponseTime,   unit: 'units', color: '#c2410c', icon: '⚡' },
    { label: 'CPU Utilization',value: cpuUtilization,    unit: '%',     color: '#740c24', icon: '🖥' },
    { label: 'Throughput',     value: throughput,        unit: 'proc/u',color: '#047857', icon: '📈' },
    { label: 'Time Quantum',   value: timeQuantum,       unit: 'units', color: '#6b21a8', icon: 'Q' },
  ];

  // Bar chart data per process
  const barData = results?.map((r) => ({
    pid: r.pid,
    TAT: r.turnaroundTime,
    WT: r.waitingTime,
    RT: r.responseTime,
  })) ?? [];

  // CPU utilization ring data
  const ringData = [{ value: cpuUtilization, fill: '#8b102c' }];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-maroon-950 border border-maroon-800 rounded-xl p-3 text-xs shadow-xl text-white">
          <p className="font-bold text-rose-300 mb-1">{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.fill }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-5">
      <h2 className="section-title">
        <TrendingUp size={18} className="text-maroon-700" />
        Performance Metrics
      </h2>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricCards.map(({ label, value, unit, color, icon }) => (
          <div
            key={label}
            className="metric-card rounded-xl border border-maroon-100 bg-white hover:border-maroon-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="text-lg">{icon}</div>
            <p className="text-[10px] text-maroon-900 uppercase font-bold tracking-wider leading-tight">
              {label}
            </p>
            <p className="text-2xl font-black font-mono" style={{ color }}>
              {typeof value === 'number' ? value : '—'}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">{unit}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CPU Utilization Ring */}
        <div className="glass-card p-4 flex flex-col gap-2 bg-white border-maroon-100 shadow-xs">
          <p className="text-xs font-bold text-maroon-900 text-center">CPU Utilization</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                startAngle={90} endAngle={-270} data={ringData}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-maroon-800 font-mono">
              {cpuUtilization.toFixed(1)}%
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Busy: {cpuBusyTime}u / Total: {totalTime}u
            </p>
          </div>
        </div>

        {/* Per-process bar chart — spans 2 cols */}
        {barData.length > 0 && (
          <div className="glass-card p-4 flex flex-col gap-2 lg:col-span-2 bg-white border-maroon-100 shadow-xs">
            <p className="text-xs font-bold text-maroon-900">Per-Process Time Metrics</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={16} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 16, 44, 0.08)" />
                  <XAxis dataKey="pid" tick={{ fill: '#740c24', fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 16, 44, 0.04)' }} />
                  <Bar dataKey="TAT" name="Turnaround" fill="#8b102c" radius={[3, 3, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill="#8b102c" />
                    ))}
                  </Bar>
                  <Bar dataKey="WT" name="Waiting" fill="#c73856" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="RT" name="Response" fill="#c2410c" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center text-[10px] font-semibold">
              {[['Turnaround (TAT)', '#8b102c'], ['Waiting (WT)', '#c73856'], ['Response (RT)', '#c2410c']].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded shadow-xs" style={{ background: c }} />
                  <span className="text-maroon-900">{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CPU time breakdown */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        {[
          { label: 'Total Time', value: totalTime, color: 'text-maroon-950' },
          { label: 'Busy Time', value: cpuBusyTime, color: 'text-maroon-800' },
          { label: 'Idle Time', value: idleTime, color: 'text-slate-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl bg-maroon-50/60 border border-maroon-100">
            <p className="text-slate-600 font-semibold mb-1">{label}</p>
            <p className={`text-xl font-black font-mono ${color}`}>{value}</p>
            <p className="text-slate-500 font-medium">units</p>
          </div>
        ))}
      </div>
    </div>
  );
}
