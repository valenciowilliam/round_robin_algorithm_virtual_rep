import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SECTIONS = [
  {
    title: 'What is CPU Scheduling?',
    color: 'text-maroon-900',
    bg: 'bg-maroon-50 border-maroon-200',
    content: `CPU Scheduling is the process by which the operating system decides which process gets to use the CPU and for how long. Since modern systems run many processes concurrently (but typically only one can execute on a single core at a time), the scheduler must fairly and efficiently allocate CPU time. Good scheduling maximizes CPU utilization, minimizes waiting time, and ensures responsiveness.`,
  },
  {
    title: 'Round Robin Scheduling',
    color: 'text-rose-950',
    bg: 'bg-rose-50 border-rose-200',
    content: `Round Robin (RR) is one of the most widely used preemptive CPU scheduling algorithms. Each process is given a fixed time slice called the "time quantum" (Q). Processes are arranged in a FIFO circular queue. The CPU executes the front process for Q units; if it doesn't finish, it's preempted and placed at the back of the queue. This continues until all processes complete.`,
  },
  {
    title: 'Role of the Time Quantum',
    color: 'text-purple-950',
    bg: 'bg-purple-50 border-purple-200',
    content: `The time quantum Q is the most critical parameter in RR scheduling:\n• Small Q → More context switches, better responsiveness, higher overhead.\n• Large Q → Fewer context switches, behaves like FCFS, longer wait times for short jobs.\n• Ideal Q → Usually slightly larger than the typical CPU burst duration to minimize unnecessary switches while keeping response times low.`,
  },
  {
    title: 'Why Round Robin is Preemptive',
    color: 'text-amber-950',
    bg: 'bg-amber-50 border-amber-200',
    content: `Round Robin is preemptive because the OS can forcibly remove a running process from the CPU before it finishes — specifically when its time quantum expires. This prevents any single process from monopolizing the CPU (starvation prevention). Non-preemptive algorithms like FCFS allow a process to run until it voluntarily yields or completes.`,
  },
  {
    title: 'Advantages & Disadvantages',
    color: 'text-emerald-950',
    bg: 'bg-emerald-50 border-emerald-200',
    content: `Advantages:\n✓ Fair CPU distribution — every process gets equal time slices.\n✓ No starvation — every process eventually gets the CPU.\n✓ Good response time for interactive systems.\n✓ Simple and easy to implement.\n\nDisadvantages:\n✗ Higher context-switch overhead than non-preemptive algorithms.\n✗ Performance highly depends on choosing the right Q.\n✗ Longer average waiting time than SJF for CPU-bound processes.`,
  },
  {
    title: 'Real-World Use Cases',
    color: 'text-teal-950',
    bg: 'bg-teal-50 border-teal-200',
    content: `Round Robin is widely used in:\n• Time-sharing operating systems (Linux, Windows) — processes share CPU in slices.\n• Network packet scheduling — Round Robin queuing in routers.\n• Multi-threaded runtimes — Go's goroutine scheduler uses a variant of RR.\n• Game engines — Frame-budget scheduling with fixed time slices.\n• Cloud hypervisors — Virtual machine vCPU scheduling.`,
  },
];

function AccordionItem({ section, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-xl border transition-all duration-300 shadow-xs ${open ? section.bg : 'border-maroon-100 bg-white hover:border-maroon-200'}`}>
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen((o) => !o)}
        id={`edu-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className={`font-bold text-sm ${open ? section.color : 'text-maroon-950'}`}>
          {section.title}
        </span>
        {open ? (
          <ChevronUp size={16} className={section.color} />
        ) : (
          <ChevronDown size={16} className="text-maroon-400" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {section.content}
          </p>
        </div>
      )}
    </div>
  );
}

export default function EducationSection() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="education" className="glass-card p-5 flex flex-col gap-4">
      <h2 className="section-title">
        <BookOpen size={18} className="text-maroon-700" />
        Educational Reference
      </h2>

      <div className="flex flex-col gap-2">
        {SECTIONS.map((s, i) => (
          <AccordionItem key={s.title} section={s} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Time Quantum comparison table */}
      <div>
        <button
          className="w-full flex items-center justify-between p-4 rounded-xl bg-maroon-50/60 border border-maroon-100 text-left hover:bg-maroon-50 hover:border-maroon-200 transition-all duration-200 shadow-xs"
          onClick={() => setShowComparison((v) => !v)}
        >
          <span className="font-bold text-sm text-maroon-950">Time Quantum Impact Comparison</span>
          {showComparison ? (
            <ChevronUp size={16} className="text-maroon-700" />
          ) : (
            <ChevronDown size={16} className="text-maroon-400" />
          )}
        </button>

        {showComparison && (
          <div className="mt-2 overflow-x-auto animate-fade-in border border-maroon-100 rounded-xl bg-white shadow-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-maroon-50 border-b border-maroon-200">
                  {['Quantum (Q)', 'Context Switches', 'Responsiveness', 'Overhead', 'Behavior'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-bold text-maroon-900 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Very Small (1)', 'Very High', 'Excellent', 'Very High', 'Resembles RR with max fairness'],
                  ['Small (2–4)', 'High', 'Good', 'Moderate', 'Balanced for interactive systems'],
                  ['Medium (5–10)', 'Moderate', 'Acceptable', 'Low', 'Good for general-purpose OSes'],
                  ['Large (>BT)', 'Minimal', 'Poor', 'Negligible', 'Degenerates to FCFS behavior'],
                ].map(([q, cs, resp, oh, beh], i) => (
                  <tr
                    key={q}
                    className="border-b border-maroon-50 hover:bg-maroon-50/40 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-mono font-bold text-maroon-800">{q}</td>
                    <td className="px-3 py-2.5 font-semibold text-rose-700">{cs}</td>
                    <td className="px-3 py-2.5 font-semibold text-emerald-700">{resp}</td>
                    <td className="px-3 py-2.5 font-semibold text-amber-700">{oh}</td>
                    <td className="px-3 py-2.5 text-slate-700">{beh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-500 py-2 px-3">
              * This table describes general behavioral trends. Actual performance depends on process mix, system load, and hardware characteristics.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
