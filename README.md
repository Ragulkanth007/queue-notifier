# 🔴 LIVE Queue Notifier

<p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.3.4-blue?logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/WebSocket-Live-blueviolet?logo=websocket" alt="WebSocket" />
    <img src="https://img.shields.io/badge/License-ISC-yellow" alt="License" />
</p>

<p align="center">
    <b>Skip the Wait. Live Your Life.</b><br>
    <sub>Real-time queue management SaaS with live updates, role-based access, and a modern stack.</sub>
</p>

---

## 🚀 Overview

**LIVE Queue Notifier** is a full-stack, real-time queue management platform built with Next.js, MongoDB, and WebSockets. Designed for businesses and users who want to manage and join queues online, it features:

- 🔒 **Role-based authentication** (admin, owner, manager, user)
- ⚡ **Live queue updates** via WebSocket
- 🏢 **Room & queue management** for any business
- 📱 **Modern, responsive UI** (Next.js + Tailwind CSS)
- 🛡️ **Secure, scalable, SaaS-ready architecture**

---

## ✨ Features

- **Google OAuth** authentication (NextAuth.js)
- **Join/leave queues** in real time
- **Live position tracking** in queues
- **Admin dashboard** for managing rooms & users
- **REST API** for integration
- **WebSocket server** for instant updates
- **MongoDB Atlas** support

---

## 🏗️ Tech Stack

| Frontend      | Backend         | Database   | Real-time   | Auth         |
|---------------|----------------|------------|-------------|--------------|
| Next.js 15    | Node.js        | MongoDB    | WebSocket   | NextAuth.js  |
| React 19      |                | Mongoose   | Socket.io   | Google OAuth |
| Tailwind CSS  |                |            |             |              |

---

## 📦 Monorepo Structure

```
/live-queue-notifier
├── backend      # WebSocket + MongoDB
├── frontend     # Next.js + NextAuth.js + Tailwind
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/raghulkannan-s/live-queue-notifier.git
cd live-queue-notifier
```

### 2. Setup Environment

- Copy `.env.example` to `.env` in both `backend` and `frontend`
- Fill in your MongoDB URI and Google OAuth credentials

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run the app

- **Backend:**  
    ```bash
    cd backend
    npm run dev
    ```
- **Frontend:**  
    ```bash
    cd frontend
    npm run dev
    ```

---

## 🛠️ Contributing

Contributions are welcome! Please open issues or pull requests.

---

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
    <b>Made with ❤️ for modern businesses and users.</b>
</p>




