import { useState, useEffect } from 'react';
import { Cpu, Server, Wifi, WifiOff } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { checkHealth } from '../api/scheduleApi';
import ProcessInputForm from './ProcessInputForm';
import SimulationControls from './SimulationControls';
import CPUStatus from './CPUStatus';
import ReadyQueue from './ReadyQueue';
import GanttChart from './GanttChart';
import SchedulingResults from './SchedulingResults';
import PerformanceMetrics from './PerformanceMetrics';
import EducationSection from './EducationSection';
import ErrorMessage from './ErrorMessage';

function BackendStatusBadge() {
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    checkHealth()
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  if (connected === null) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border shadow-xs ${
        connected
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}
    >
      {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
      {connected ? 'Backend Connected' : 'Backend Offline — start the server on port 5000'}
    </div>
  );
}

export default function Dashboard() {
  const {
    processes, setProcesses,
    timeQuantum, setTimeQuantum,
    isLoading, apiError, setApiError,
    scheduleData, currentStepData, visibleGantt,
    simStatus, currentStep, totalSteps, isLastStep,
    animSpeed, setAnimSpeed,
    runSimulation, play, pause, nextStep, prevStep, reset, fullReset,
  } = useSimulation();

  const results = scheduleData?.data?.processes ?? null;
  const metrics = scheduleData?.data?.metrics ?? null;
  const fullGantt = scheduleData?.data?.timeline ?? [];

  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="text-center flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-50 border border-maroon-200/80 text-maroon-800 text-xs font-bold tracking-wide uppercase">
          <Cpu size={14} className="text-maroon-700" />
          Operating Systems Mini Project
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gradient leading-tight max-w-3xl">
          Virtual Round Robin CPU Scheduling Simulator
        </h1>
        <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
          An interactive, step-by-step educational simulator of the preemptive Round Robin algorithm.
          Configure processes, press <strong className="text-maroon-900 font-bold">Run Simulation</strong>, and watch the
          CPU, ready queue, and Gantt chart update in real time.
        </p>
        <BackendStatusBadge />
      </section>

      {/* ── Global Error ─────────────────────────────────────────────────── */}
      {apiError && (
        <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />
      )}

      {/* ── Input + Controls ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessInputForm
          processes={processes}
          setProcesses={setProcesses}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
          disabled={isLoading || simStatus === 'RUNNING'}
        />
        <SimulationControls
          simStatus={simStatus}
          isLoading={isLoading}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLastStep={isLastStep}
          animSpeed={animSpeed}
          setAnimSpeed={setAnimSpeed}
          onRun={runSimulation}
          onPlay={play}
          onPause={pause}
          onNext={nextStep}
          onPrev={prevStep}
          onReset={reset}
          onFullReset={fullReset}
        />
      </div>

      {/* ── CPU + Ready Queue ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <CPUStatus
            stepData={currentStepData}
            processes={processes}
            simStatus={simStatus}
          />
        </div>
        <div className="lg:col-span-3">
          <ReadyQueue
            stepData={currentStepData}
            processes={processes}
            simStatus={simStatus}
          />
        </div>
      </div>

      {/* ── Gantt Chart ──────────────────────────────────────────────────── */}
      <GanttChart
        visibleGantt={visibleGantt}
        fullGantt={fullGantt}
        processes={processes}
        simStatus={simStatus}
        currentStep={currentStep}
      />

      {/* ── Results & Metrics ────────────────────────────────────────────── */}
      {results && (
        <>
          <SchedulingResults results={results} processes={processes} />
          <PerformanceMetrics metrics={metrics} results={results} processes={processes} />
        </>
      )}

      {/* ── Educational Content ──────────────────────────────────────────── */}
      <EducationSection />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="text-center py-6 border-t border-maroon-100">
        <p className="text-xs text-maroon-800/80 font-medium">
          Round Robin CPU Scheduling Simulator · React + Vite + Express.js · OS Mini Project
        </p>
        <p className="text-xs text-slate-500 mt-1">
          All scheduling calculations are performed by the Node.js backend.
        </p>
      </footer>
    </main>
  );
}
