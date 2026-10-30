/**
 * Round Robin CPU Scheduling Algorithm
 * Implements the complete preemptive Round Robin scheduling with:
 * - Arrival time handling
 * - FIFO ready queue
 * - CPU idle periods
 * - Step-by-step timeline generation
 */

/**
 * Executes the Round Robin scheduling algorithm.
 * @param {Array} processes - Array of { pid, arrivalTime, burstTime }
 * @param {number} timeQuantum - Time quantum (positive integer)
 * @returns {Object} Full scheduling results with timeline and metrics
 */
function runRoundRobin(processes, timeQuantum) {
  // Deep copy and initialize process state
  const procs = processes.map((p) => ({
    pid: p.pid,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.burstTime),
    completionTime: null,
    firstStartTime: null,
    hasStarted: false,
  }));

  // Sort by arrival time (stable sort preserving original order for ties)
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime || processes.findIndex(p => p.pid === a.pid) - processes.findIndex(p => p.pid === b.pid));

  const n = procs.length;
  const timeline = []; // Gantt chart segments: { pid, start, end, isIdle }
  const readyQueue = []; // Queue of process indices
  const steps = []; // Step-by-step simulation states

  let currentTime = 0;
  let completedCount = 0;
  let lastEnqueued = new Set(); // Track what's already in queue or completed

  // Enqueue processes that have arrived by currentTime
  function enqueueArrivals(fromTime, toTime, excludePid = null) {
    procs.forEach((p, idx) => {
      if (
        p.arrivalTime > fromTime &&
        p.arrivalTime <= toTime &&
        p.remainingTime > 0 &&
        !readyQueue.includes(idx) &&
        p.pid !== excludePid
      ) {
        readyQueue.push(idx);
      }
    });
  }

  // Seed initial ready queue: processes that arrive at time 0
  procs.forEach((p, idx) => {
    if (p.arrivalTime <= currentTime && p.remainingTime > 0) {
      readyQueue.push(idx);
    }
  });

  // Build a snapshot of the current state for step recording
  function buildSnapshot(action, activeIdx) {
    return {
      time: currentTime,
      action,
      activePid: activeIdx !== null ? procs[activeIdx].pid : null,
      readyQueue: [...readyQueue].map((i) => ({
        pid: procs[i].pid,
        remainingTime: procs[i].remainingTime,
      })),
      processStates: procs.map((p) => ({
        pid: p.pid,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        remainingTime: p.remainingTime,
        completed: p.completionTime !== null,
        completionTime: p.completionTime,
      })),
      ganttSoFar: [...timeline],
    };
  }

  // Main scheduling loop
  const MAX_ITERATIONS = 100000; // safety guard
  let iterations = 0;

  while (completedCount < n && iterations < MAX_ITERATIONS) {
    iterations++;

    if (readyQueue.length === 0) {
      // CPU is idle — advance to next process arrival
      const nextArrival = procs
        .filter((p) => p.arrivalTime > currentTime && p.remainingTime > 0)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];

      if (!nextArrival) break; // no more processes

      const idleStart = currentTime;
      currentTime = nextArrival.arrivalTime;

      timeline.push({ pid: 'IDLE', start: idleStart, end: currentTime, isIdle: true });

      steps.push({
        ...buildSnapshot('CPU_IDLE', null),
        description: `CPU idle from t=${idleStart} to t=${currentTime}. Next arrival: ${nextArrival.pid}`,
      });

      // Enqueue all processes that have arrived by now
      procs.forEach((p, idx) => {
        if (p.arrivalTime <= currentTime && p.remainingTime > 0 && !readyQueue.includes(idx)) {
          readyQueue.push(idx);
        }
      });
      continue;
    }

    // Pick front of ready queue
    const idx = readyQueue.shift();
    const proc = procs[idx];

    // Record first start time (response time)
    if (!proc.hasStarted) {
      proc.firstStartTime = currentTime;
      proc.hasStarted = true;
    }

    // How long this process will run
    const execTime = Math.min(timeQuantum, proc.remainingTime);
    const startTime = currentTime;
    const endTime = currentTime + execTime;

    // Add segment to Gantt chart
    timeline.push({ pid: proc.pid, start: startTime, end: endTime, isIdle: false });

    // Advance time
    proc.remainingTime -= execTime;
    currentTime = endTime;

    // Enqueue newly arrived processes (excluding the currently running one if preempted)
    enqueueArrivals(startTime, endTime, proc.pid);

    if (proc.remainingTime === 0) {
      // Process completed
      proc.completionTime = currentTime;
      completedCount++;

      steps.push({
        ...buildSnapshot('PROCESS_COMPLETE', null),
        description: `${proc.pid} completed at t=${currentTime}. CT=${proc.completionTime}`,
        completedPid: proc.pid,
      });
    } else {
      // Process preempted — re-enqueue at the back
      readyQueue.push(idx);

      steps.push({
        ...buildSnapshot('PROCESS_PREEMPTED', idx),
        description: `${proc.pid} preempted at t=${currentTime}. Remaining: ${proc.remainingTime}. Re-queued.`,
        preemptedPid: proc.pid,
      });
    }
  }

  // ── Calculate Metrics ──────────────────────────────────────────────────────
  const results = procs.map((p) => {
    const tat = p.completionTime - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = p.firstStartTime - p.arrivalTime;
    return {
      pid: p.pid,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: p.completionTime,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
    };
  });

  const avgTAT = results.reduce((s, r) => s + r.turnaroundTime, 0) / n;
  const avgWT = results.reduce((s, r) => s + r.waitingTime, 0) / n;
  const avgRT = results.reduce((s, r) => s + r.responseTime, 0) / n;

  const totalTime = currentTime;
  const idleTime = timeline.filter((t) => t.isIdle).reduce((s, t) => s + (t.end - t.start), 0);
  const cpuBusyTime = totalTime - idleTime;
  const cpuUtilization = totalTime > 0 ? (cpuBusyTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? n / totalTime : 0;

  return {
    processes: results,
    timeline,
    steps,
    metrics: {
      avgTurnaroundTime: parseFloat(avgTAT.toFixed(2)),
      avgWaitingTime: parseFloat(avgWT.toFixed(2)),
      avgResponseTime: parseFloat(avgRT.toFixed(2)),
      cpuUtilization: parseFloat(cpuUtilization.toFixed(2)),
      throughput: parseFloat(throughput.toFixed(4)),
      totalTime,
      idleTime,
      cpuBusyTime,
      processCount: n,
      timeQuantum,
    },
  };
}

module.exports = { runRoundRobin };
