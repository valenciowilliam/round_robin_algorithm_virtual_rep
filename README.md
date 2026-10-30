# 🖥️ Round Robin CPU Scheduling Simulator

**An interactive, educational web application that visualizes the preemptive Round Robin CPU Scheduling Algorithm step by step.**

Built as an Operating Systems mini-project using **React + Vite** (frontend) and **Node.js + Express.js** (backend), with Tailwind CSS, Recharts, and Lucide React.

---

## 📋 Table of Contents

- [Features](#features)
- [Algorithm Overview](#algorithm-overview)
- [Scheduling Formulas](#scheduling-formulas)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Sample Inputs & Expected Results](#sample-inputs--expected-results)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Interactive Simulator** | Step-by-step animation with Play/Pause/Next/Prev/Reset |
| **Dynamic Gantt Chart** | Progressive Gantt chart reveal with hover tooltips |
| **Ready Queue Visualization** | Animated FIFO queue with CPU flow diagram |
| **CPU Status Panel** | Shows active process, remaining burst time, and state |
| **Process Input Form** | Add/edit/remove up to 20 processes dynamically |
| **Scheduling Results Table** | CT, TAT, WT, RT per process with averages |
| **Performance Metrics** | CPU utilization radial chart, per-process bar chart |
| **Educational Section** | Algorithm explanation, Q impact comparison table |
| **Backend API** | All scheduling computed server-side in Express.js |
| **Input Validation** | Full validation with helpful error messages |
| **Speed Control** | 0.5×, 1×, 1.5×, 2×, 3× animation speeds |
| **Sample Data** | One-click load of example processes |

---

## 📐 Algorithm Overview

Round Robin (RR) is a **preemptive** CPU scheduling algorithm:

1. Processes are arranged in a **FIFO circular queue**
2. The CPU executes each process for a fixed **Time Quantum (Q)**
3. If a process doesn't finish within Q, it is **preempted** and moved to the back of the queue
4. Newly arrived processes during execution are added **after** the preempted process
5. If no process is ready, the CPU remains **idle** until the next arrival

---

## 📊 Scheduling Formulas

| Metric | Formula |
|---|---|
| **Completion Time (CT)** | Time when process finishes execution |
| **Turnaround Time (TAT)** | CT − Arrival Time |
| **Waiting Time (WT)** | TAT − Burst Time |
| **Response Time (RT)** | First CPU Start Time − Arrival Time |
| **CPU Utilization** | (Busy Time / Total Time) × 100% |
| **Throughput** | Number of Processes / Total Time |

---

## 📁 Project Structure

```
round-robin-scheduler/
│
├── backend/                          # Express.js API Server
│   ├── src/
│   │   ├── server.js                 # Entry point, middleware, routes
│   │   ├── routes/
│   │   │   └── api.js                # Route definitions
│   │   ├── controllers/
│   │   │   └── scheduleController.js # Request handlers
│   │   └── utils/
│   │       ├── roundRobin.js         # ✅ Core RR scheduling algorithm
│   │       └── validation.js         # Input validation
│   ├── .env.example
│   └── package.json
│
└── frontend/                         # React + Vite Application
    ├── src/
    │   ├── main.jsx                  # React entry point
    │   ├── App.jsx                   # Root component
    │   ├── index.css                 # Global styles + Tailwind
    │   ├── api/
    │   │   └── scheduleApi.js        # Axios API client
    │   ├── hooks/
    │   │   └── useSimulation.js      # Central simulation state hook
    │   ├── utils/
    │   │   └── constants.js          # Colors, sample data, config
    │   └── components/
    │       ├── Navbar.jsx            # Navigation bar
    │       ├── Dashboard.jsx         # Main layout orchestrator
    │       ├── ProcessInputForm.jsx  # Process configuration UI
    │       ├── SimulationControls.jsx # Play/Pause/Step controls
    │       ├── CPUStatus.jsx         # Active CPU process display
    │       ├── ReadyQueue.jsx        # FIFO queue visualization
    │       ├── GanttChart.jsx        # Animated Gantt chart
    │       ├── SchedulingResults.jsx # Metrics table
    │       ├── PerformanceMetrics.jsx # Charts and averages
    │       ├── EducationSection.jsx  # Educational accordion
    │       └── ErrorMessage.jsx      # Error display component
    ├── index.html
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

---

## 🔧 Prerequisites

- **Node.js** v18 or higher  
- **npm** v9 or higher

---

## 📦 Installation & Setup

### 1. Clone/Navigate to the project

```bash
cd round-robin-scheduler
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment (optional)

```bash
cp .env.example .env
# Edit .env if you want to change the port (default: 5000)
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Configure Frontend Environment (optional)

```bash
cp .env.example .env
# Edit VITE_API_URL if your backend runs on a different port
```

---

## 🚀 Running the Application

Open **two terminal windows**:

### Terminal 1 — Start the Backend

```bash
cd round-robin-scheduler/backend
npm start
# OR for development with auto-restart:
npm run dev
```

✅ Backend will be running at: `http://localhost:5000`

### Terminal 2 — Start the Frontend

```bash
cd round-robin-scheduler/frontend
npm run dev
```

✅ Frontend will be available at: `http://localhost:5173`

### Verify Connection

Open your browser at `http://localhost:5173`. You should see a green **"Backend Connected"** badge in the header.

---

## 🌐 API Reference

### `GET /api/health`

Returns server health status.

**Response:**
```json
{
  "success": true,
  "message": "Round Robin Scheduler API is running.",
  "timestamp": "2026-10-28T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

### `POST /api/schedule/round-robin`

Runs the Round Robin scheduling algorithm.

**Request Body:**
```json
{
  "processes": [
    { "pid": "P1", "arrivalTime": 0, "burstTime": 5 },
    { "pid": "P2", "arrivalTime": 1, "burstTime": 4 },
    { "pid": "P3", "arrivalTime": 2, "burstTime": 2 },
    { "pid": "P4", "arrivalTime": 3, "burstTime": 1 }
  ],
  "timeQuantum": 2
}
```

**Constraints:**
- `pid`: non-empty string, unique across all processes
- `arrivalTime`: non-negative integer
- `burstTime`: positive integer
- `timeQuantum`: positive integer
- Max 20 processes

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "processes": [
      {
        "pid": "P1",
        "arrivalTime": 0,
        "burstTime": 5,
        "completionTime": 12,
        "turnaroundTime": 12,
        "waitingTime": 7,
        "responseTime": 0
      }
    ],
    "timeline": [
      { "pid": "P1", "start": 0, "end": 2, "isIdle": false },
      { "pid": "P2", "start": 2, "end": 4, "isIdle": false }
    ],
    "steps": [...],
    "metrics": {
      "avgTurnaroundTime": 8.0,
      "avgWaitingTime": 5.0,
      "avgResponseTime": 2.0,
      "cpuUtilization": 100.0,
      "throughput": 0.3333,
      "totalTime": 12,
      "idleTime": 0,
      "cpuBusyTime": 12,
      "processCount": 4,
      "timeQuantum": 2
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "timeQuantum must be a positive integer.",
    "Duplicate pid \"P1\" found."
  ]
}
```

---

## 🧪 Sample Inputs & Expected Results

### Test Case 1: Standard Example (Q=2)

**Input:**

| PID | AT | BT |
|---|---:|---:|
| P1 | 0 | 5 |
| P2 | 1 | 4 |
| P3 | 2 | 2 |
| P4 | 3 | 1 |

**Expected Gantt:** P1(0-2) → P2(2-4) → P3(4-6) → P1(6-8) → P4(8-9) → P2(9-11) → P1(11-12)

**Expected Results:**

| PID | CT | TAT | WT | RT |
|---|---:|---:|---:|---:|
| P1 | 12 | 12 | 7 | 0 |
| P2 | 11 | 10 | 6 | 1 |
| P3 | 6 | 4 | 2 | 2 |
| P4 | 9 | 6 | 5 | 5 |

**Averages:** TAT=8.00, WT=5.00, RT=2.00 | CPU Utilization=100%

---

### Test Case 2: Single Process (Q=3)

**Input:** P1, AT=0, BT=6

**Expected Gantt:** P1(0-3) → P1(3-6)  
**Expected:** CT=6, TAT=6, WT=0, RT=0

---

### Test Case 3: CPU Idle Period (Q=2)

**Input:** P1 (AT=0, BT=2), P2 (AT=5, BT=3)

**Expected Gantt:** P1(0-2) → IDLE(2-5) → P2(5-7) → P2(7-8)  
**CPU Utilization:** 5/8 = 62.5%

---

### Test Case 4: Process Completes Before Quantum

**Input:** P1 (AT=0, BT=1), P2 (AT=0, BT=4), Q=3

**Expected:** P1 completes in 1 unit (< Q=3), no preemption

---

## 🔗 Frontend ↔ Backend Connection

The frontend is pre-configured to connect to `http://localhost:5000/api`.

To change the API URL:
1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_URL=http://your-backend-url/api`
3. Restart the Vite dev server

The CORS configuration in `backend/src/server.js` allows requests from `http://localhost:5173`. If your frontend runs on a different port, update `FRONTEND_URL` in `backend/.env`.

---

## ❓ Troubleshooting

### "Backend Offline" badge shown

- Ensure the backend server is running: `cd backend && npm start`
- Check that port 5000 is not in use: `netstat -ano | findstr :5000` (Windows)
- Verify the `.env` file in the frontend has the correct `VITE_API_URL`

### Port already in use

```bash
# Windows — find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS errors in browser console

- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Restart the backend after changing `.env`

### npm install fails

- Ensure Node.js ≥ 18: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

### Gantt chart not visible

- Run the simulation first by clicking **Run Simulation**
- Then press **Play** or step through with **Next**

### Results table shows wrong values

- All calculations are performed on the backend
- Re-run the simulation after changing process inputs
- Verify input values (non-negative AT, positive BT, positive Q)

---

## 🎓 Academic Context

This project demonstrates:

- **Preemptive scheduling** with time-based CPU preemption
- **FIFO queue** discipline for ready processes
- **Context switching** represented by quantum boundaries
- **Starvation prevention** inherent in Round Robin
- **Performance metrics** standard in OS literature (TAT, WT, RT, CPU Utilization, Throughput)

---

*Built with ❤️ as an Operating Systems Mini Project*
