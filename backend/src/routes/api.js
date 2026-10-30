const express = require('express');
const router = express.Router();
const { scheduleRoundRobin, healthCheck } = require('../controllers/scheduleController');

// Health check
router.get('/health', healthCheck);

// Round Robin scheduling
router.post('/schedule/round-robin', scheduleRoundRobin);

module.exports = router;
