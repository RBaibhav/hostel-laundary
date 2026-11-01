# Hostel Laundry Machine Occupancy Tracker (LaundryMate)

A modern full-stack web application designed to track, claim, and manage washing machine occupancy in student hostels.

- **Product Name:** LaundryMate
- **Tagline:** *"Your hostel laundry, without the waiting."*
- **Backend:** Node.js, Express.js, TypeScript, MongoDB 7.0, Mongoose, JWT, bcryptjs, Zod
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Axios, Lucide React, Sonner, React Hook Form
- **Database:** MongoDB 7.0 (via Docker Compose)

---

## Architecture Overview

```text
hostel-laundary-machine/
├── backend/            # Express 5 REST API with MVC structure & concurrency safety
├── frontend/           # Next.js App Router modern SaaS dashboard
├── docker-compose.yml  # MongoDB 7.0 container configuration
├── .env                # Global environment settings
└── .env.example        # Example environment variables
```

---

## Quick Start Guide

### 1. Start MongoDB with Docker

```bash
docker compose up -d
```

Verify that the database is running:
```bash
docker ps
```

### 2. Configure Environment Variables

Verify `.env` at the repository root:
```env
# MongoDB Docker Configuration
MONGO_PORT=27017
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=secretpassword123
MONGO_DB_NAME=laundry_db

# Backend Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRES_IN=7d

# MongoDB Connection
MONGODB_URI=mongodb://admin:secretpassword123@localhost:27017/laundry_db?authSource=admin

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

And verify `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start the Project (Full-Stack)

Install root dependencies and start both frontend and backend concurrently across any OS without bash scripts:

```bash
npm install
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### 4. Running Services Individually

- **Backend only:**
  ```bash
  npm run dev:backend
  ```
- **Frontend only:**
  ```bash
  npm run dev:frontend
  ```
- **Run Backend Test Suite:**
  ```bash
  npm run test:backend
  ```
- **Build Both Services:**
  ```bash
  npm run build
  ```

---

## Documentation

- [Backend Documentation](backend/README.md) – REST API routes, models, atomic concurrency safeguards, and automated test suite.
- [Frontend Documentation](frontend/README.md) – Next.js App Router design system, layout, and component architecture.
