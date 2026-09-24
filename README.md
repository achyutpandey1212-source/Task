# LLD Practice Platform — Phase 1 (Foundation & Project Setup)

This repository contains the full-stack foundation for the Low-Level Design (LLD) Practice & Feedback Platform.

## Prerequisites

* **Node.js**: v18+ (tested with v22.x)
* **npm**: v9+ (tested with v11.x)
* **MongoDB**: A running MongoDB instance (locally on `mongodb://localhost:27017` or a MongoDB Atlas URI)

## Architecture Overview

```text
React Frontend (Vite + TypeScript)
      ↓
Express Backend (TypeScript + Zod)
      ↓
MongoDB (Mongoose)
```

## Installation

Run from the root directory:

```bash
# Install root dependencies
npm install

# Install server and client dependencies
npm run install:all
```

## Environment Variables

Copy the example configuration files and fill in your values:

### Server (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lld-practice
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_minimum_16_characters
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

## Running Locally

### Run Both Concurrently (Frontend + Backend)
```bash
npm run dev
```

### Run Server Only
```bash
npm run dev:server
```

### Run Client Only
```bash
npm run dev:client
```

## Production Build

```bash
npm run build
```

This compiles TypeScript for both the server (`server/dist`) and bundles the client with Vite (`client/dist`).

## Health & Verification Endpoints

* **Backend Health**: `GET http://localhost:5000/api/health`
  Returns:
  ```json
  {
    "status": "ok",
    "database": "connected",
    "timestamp": "...",
    "uptime": 12.3
  }
  ```
* **Auth Register**: `POST http://localhost:5000/api/auth/register`
* **Auth Login**: `POST http://localhost:5000/api/auth/login`
* **Auth Identity**: `GET http://localhost:5000/api/auth/me` (requires `Authorization: Bearer <token>`)
* **Frontend Shell**: `http://localhost:5173`
