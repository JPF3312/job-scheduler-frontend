#  Distributed Job Scheduler & Real-Time Dashboard (Frontend)

An interactive, real-time monitoring and control interface built with **React**, **Vite**, and **Tailwind CSS**. This dashboard serves as the frontend client for the **Distributed Job Scheduler** microservices ecosystem, allowing operators to dispatch background asynchronous jobs, monitor worker processing metrics, and visualize queue status in real time.

---

##  Features

- **🚀 Live Job Dispatcher:** Send and enqueue asynchronous processing jobs (e.g., reports generation, email notifications, data processing) directly to the BullMQ backend.
- **⚡ Real-Time Metrics & Status:** Live status tracking for queues (*Waiting*, *Active*, *Completed*, *Failed*).
- **🎨 Modern UI/UX:** Built with Tailwind CSS for a fully responsive, clean, and intuitive user dashboard.
- **🛡️ Fault Tolerance & Error Handling:** Visual feedback for failed jobs with retry strategies and queue health monitoring.
- **🌐 Full Stack API Gateway Integration:** Seamless connectivity through a resilient API Gateway architecture.

---

##  Tech Stack

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios / Native Fetch API
- **State Management:** React Hooks / Context API
- **Containerization:** Docker & Docker Compose

---

##  Getting Started

### Prerequisites

Make sure you have Node.js and npm installed:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/JPF3312/job-scheduler-frontend.git](https://github.com/JPF3312/job-scheduler-frontend.git)
   cd job-scheduler-frontend
