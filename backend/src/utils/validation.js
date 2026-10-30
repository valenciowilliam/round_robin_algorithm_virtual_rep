/**
 * Input validation utilities for the scheduling API
 */

/**
 * Validates the scheduling request payload.
 * @param {any} body - Request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateScheduleInput(body) {
  const errors = [];

  // Check top-level structure
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { processes, timeQuantum } = body;

  // Validate timeQuantum
  if (timeQuantum === undefined || timeQuantum === null) {
    errors.push('timeQuantum is required.');
  } else {
    const tq = Number(timeQuantum);
    if (!Number.isFinite(tq) || !Number.isInteger(tq) || tq <= 0) {
      errors.push('timeQuantum must be a positive integer.');
    }
  }

  // Validate processes array
  if (!Array.isArray(processes)) {
    errors.push('processes must be an array.');
  } else if (processes.length === 0) {
    errors.push('At least one process is required.');
  } else if (processes.length > 20) {
    errors.push('Maximum 20 processes are supported.');
  } else {
    const seenPids = new Set();

    processes.forEach((p, i) => {
      const label = `Process[${i}]`;

      if (!p || typeof p !== 'object') {
        errors.push(`${label}: must be an object.`);
        return;
      }

      // PID
      if (p.pid === undefined || p.pid === null || String(p.pid).trim() === '') {
        errors.push(`${label}: pid is required.`);
      } else {
        const pidStr = String(p.pid).trim();
        if (seenPids.has(pidStr)) {
          errors.push(`Duplicate pid "${pidStr}" found. All process IDs must be unique.`);
        }
        seenPids.add(pidStr);
      }

      // Arrival Time
      if (p.arrivalTime === undefined || p.arrivalTime === null || p.arrivalTime === '') {
        errors.push(`${label} (${p.pid ?? 'unknown'}): arrivalTime is required.`);
      } else {
        const at = Number(p.arrivalTime);
        if (!Number.isFinite(at) || at < 0 || !Number.isInteger(at)) {
          errors.push(
            `${label} (${p.pid ?? 'unknown'}): arrivalTime must be a non-negative integer. Got: ${p.arrivalTime}`
          );
        }
      }

      // Burst Time
      if (p.burstTime === undefined || p.burstTime === null || p.burstTime === '') {
        errors.push(`${label} (${p.pid ?? 'unknown'}): burstTime is required.`);
      } else {
        const bt = Number(p.burstTime);
        if (!Number.isFinite(bt) || bt <= 0 || !Number.isInteger(bt)) {
          errors.push(
            `${label} (${p.pid ?? 'unknown'}): burstTime must be a positive integer. Got: ${p.burstTime}`
          );
        }
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateScheduleInput };
