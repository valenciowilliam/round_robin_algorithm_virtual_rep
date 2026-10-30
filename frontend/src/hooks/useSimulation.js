import { useState, useEffect, useRef, useCallback } from 'react';
import { runRoundRobinAPI } from '../api/scheduleApi';

/**
 * useSimulation — Manages all scheduling simulation state.
 *
 * States: IDLE → READY → RUNNING/PAUSED → DONE
 * Exposes: controls, current step data, full results, error handling.
 */
export function useSimulation() {
  // ── Input state ──────────────────────────────────────────────────────────
  const [processes, setProcesses] = useState([
    { pid: 'P1', arrivalTime: 0, burstTime: 5 },
    { pid: 'P2', arrivalTime: 1, burstTime: 4 },
    { pid: 'P3', arrivalTime: 2, burstTime: 2 },
    { pid: 'P4', arrivalTime: 3, burstTime: 1 },
  ]);
  const [timeQuantum, setTimeQuantum] = useState(2);

  // ── API / loading state ──────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // ── Simulation data from backend ─────────────────────────────────────────
  const [scheduleData, setScheduleData] = useState(null); // full API response

  // ── Playback state ───────────────────────────────────────────────────────
  const [simStatus, setSimStatus] = useState('IDLE'); // IDLE | READY | RUNNING | PAUSED | DONE
  const [currentStep, setCurrentStep] = useState(0);  // index into steps[]
  const [animSpeed, setAnimSpeed] = useState(1000);    // ms per step
  const intervalRef = useRef(null);

  const totalSteps = scheduleData?.data?.steps?.length ?? 0;

  // ── Derived current-step data ────────────────────────────────────────────
  const currentStepData = scheduleData?.data?.steps?.[currentStep] ?? null;
  const visibleGantt = currentStepData?.ganttSoFar ?? [];
  const isLastStep = currentStep >= totalSteps - 1;

  // ── Clear interval helper ────────────────────────────────────────────────
  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Auto-advance when RUNNING ────────────────────────────────────────────
  useEffect(() => {
    if (simStatus === 'RUNNING') {
      clearPlayInterval();
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= totalSteps) {
            clearPlayInterval();
            setSimStatus('DONE');
            return totalSteps - 1;
          }
          return next;
        });
      }, animSpeed);
    } else {
      clearPlayInterval();
    }
    return clearPlayInterval;
  }, [simStatus, animSpeed, totalSteps, clearPlayInterval]);

  // ── Submit to backend ────────────────────────────────────────────────────
  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    setSimStatus('IDLE');
    setScheduleData(null);
    setCurrentStep(0);
    clearPlayInterval();

    try {
      const result = await runRoundRobinAPI(processes, timeQuantum);
      if (result.success) {
        setScheduleData(result);
        setSimStatus('READY');
      } else {
        setApiError(result.message || 'Scheduling failed.');
      }
    } catch (err) {
      if (err.response?.data) {
        const { message, errors } = err.response.data;
        setApiError(errors ? errors.join('\n') : message);
      } else {
        setApiError('Cannot connect to the backend. Make sure the server is running on port 5000.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [processes, timeQuantum, clearPlayInterval]);

  // ── Playback controls ─────────────────────────────────────────────────────
  const play = useCallback(() => {
    if (simStatus === 'READY' || simStatus === 'PAUSED') {
      if (isLastStep) {
        setCurrentStep(0);
      }
      setSimStatus('RUNNING');
    }
  }, [simStatus, isLastStep]);

  const pause = useCallback(() => {
    if (simStatus === 'RUNNING') setSimStatus('PAUSED');
  }, [simStatus]);

  const nextStep = useCallback(() => {
    if (simStatus === 'RUNNING') setSimStatus('PAUSED');
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, totalSteps - 1);
      if (next === totalSteps - 1) setSimStatus('DONE');
      return next;
    });
  }, [simStatus, totalSteps]);

  const prevStep = useCallback(() => {
    if (simStatus === 'RUNNING') setSimStatus('PAUSED');
    setCurrentStep((prev) => {
      const p = Math.max(prev - 1, 0);
      if (simStatus === 'DONE' && p < totalSteps - 1) setSimStatus('PAUSED');
      return p;
    });
  }, [simStatus, totalSteps]);

  const reset = useCallback(() => {
    clearPlayInterval();
    setCurrentStep(0);
    setSimStatus('READY');
  }, [clearPlayInterval]);

  const fullReset = useCallback(() => {
    clearPlayInterval();
    setCurrentStep(0);
    setSimStatus('IDLE');
    setScheduleData(null);
    setApiError(null);
  }, [clearPlayInterval]);

  return {
    // Input
    processes, setProcesses,
    timeQuantum, setTimeQuantum,

    // API state
    isLoading,
    apiError, setApiError,

    // Results
    scheduleData,
    currentStepData,
    visibleGantt,

    // Playback
    simStatus,
    currentStep,
    totalSteps,
    isLastStep,
    animSpeed, setAnimSpeed,

    // Actions
    runSimulation,
    play, pause,
    nextStep, prevStep,
    reset, fullReset,
  };
}
