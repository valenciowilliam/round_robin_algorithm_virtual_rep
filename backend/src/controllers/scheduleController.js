const { runRoundRobin } = require('../utils/roundRobin');
const { validateScheduleInput } = require('../utils/validation');

/**
 * POST /api/schedule/round-robin
 * Accepts process list + timeQuantum, runs algorithm, returns full results.
 */
async function scheduleRoundRobin(req, res) {
  try {
    const { valid, errors } = validateScheduleInput(req.body);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    const { processes, timeQuantum } = req.body;

    const result = runRoundRobin(processes, Number(timeQuantum));

    return res.status(200).json({
      success: true,
      data: {
        ...result,
        input: {
          processes,
          timeQuantum: Number(timeQuantum),
        },
      },
    });
  } catch (err) {
    console.error('[scheduleRoundRobin] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while running the scheduling algorithm.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

/**
 * GET /api/health
 * Returns server health status.
 */
async function healthCheck(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Round Robin Scheduler API is running.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}

module.exports = { scheduleRoundRobin, healthCheck };
