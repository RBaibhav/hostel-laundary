# LaundryMate – Frontend

A SaaS-style dashboard frontend for the **Hostel Laundry Machine Occupancy Tracker**, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**.

**Product Name:** LaundryMate  
**Tagline:** "Your hostel laundry, without the waiting."

---

## Table of Contents

- [Visual Style & Design Language](#visual-style--design-language)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Pages](#application-pages)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Getting Started](#getting-started)

---

## Visual Style & Design Language

Inspired by Linear and modern SaaS products:
- **Background:** Clean `#F8FAFC` (slate-50).
- **Cards:** Crisp white (`bg-white`) with subtle borders (`border-slate-200/80`) and rounded corners (`rounded-2xl`).
- **Typography:** Dark navy/slate text (`text-slate-900`) with medium grey secondary labels (`text-slate-500`).
- **Primary Accent:** Indigo (`indigo-600`) for primary buttons, active indicators, and brand marks.
- **Machine Status Indicators:**
  - `AVAILABLE`: Emerald Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `IN_USE`: Warm Amber/Orange (`bg-amber-50 text-amber-700 border-amber-200`)
  - `OUT_OF_ORDER`: Rose Red (`bg-rose-50 text-rose-700 border-rose-200`)

---

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **HTTP Client:** Axios (`axios`) with request/response interceptors
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **Toast Notifications:** `sonner`
- **Form Management:** `react-hook-form`
- **Schema Validation:** `zod` + `@hookform/resolvers`
- **State Management:** React Context (`AuthProvider`)

---

## Project Structure

```text
frontend/
├── app/
│   ├── page.tsx                  # Marketing / Landing Page
│   ├── login/
│   │   └── page.tsx              # Student / Warden Sign In
│   ├── register/
│   │   └── page.tsx              # Resident Account Creation
│   ├── dashboard/
│   │   └── page.tsx              # Main Dashboard (KPIs, active cycle, free washers)
│   ├── machines/
│   │   └── page.tsx              # Washer Directory with filtering & booking
│   ├── sessions/
│   │   └── page.tsx              # Active Session tracker & Session History
│   ├── admin/
│   │   └── machines/
│   │       └── page.tsx          # Warden Machine Management (Add, Edit, Delete)
│   ├── layout.tsx                # Root layout with AuthProvider & Toaster
│   ├── loading.tsx               # Global fallback loading skeleton
│   └── globals.css               # Tailwind & custom scrollbar styles
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Desktop sidebar & mobile navigation drawer
│   │   ├── Header.tsx            # Top bar with greeting, date & user profile
│   │   └── DashboardLayout.tsx   # Auth guard & responsive page wrapper
│   ├── machines/
│   │   ├── MachineCard.tsx       # Interactive washer card
│   │   ├── MachineGrid.tsx       # Responsive card grid with skeleton loaders
│   │   ├── MachineStatusBadge.tsx# Status indicator badge (Available/In Use/Broken)
│   │   └── StartSessionModal.tsx # Booking dialog with duration slider
│   ├── sessions/
│   │   ├── ActiveSessionCard.tsx # Countdown clock & animated progress bar
│   │   ├── SessionHistory.tsx    # Detailed session history table
│   │   └── EndSessionDialog.tsx  # Confirmation dialog for ending cycle early
│   ├── dashboard/
│   │   ├── StatsCards.tsx        # Summary metrics (Total, Available, In Use, Broken)
│   │   └── RecentActivity.tsx    # Hostel laundry etiquette and peak hours guide
│   └── admin/
│       ├── MachineForm.tsx       # Add / Edit machine modal with Zod validation
│       └── MachineTable.tsx      # Admin washer table with delete dialog
├── lib/
│   ├── api.ts                    # Centralized typed API client
│   ├── auth-context.tsx          # Authentication context & localStorage sync
│   ├── auth.ts                   # Auth re-exports
│   └── utils.ts                  # Date formatting, classnames, remaining time math
└── types/
    ├── user.ts                   # User & AuthResponse interfaces
    ├── machine.ts                # WashingMachine & MachineSummary interfaces
    └── session.ts                # LaundrySession & SessionStatus interfaces
```

---

## Application Pages

### 1. Landing Page (`/`)
- Brand showcase: **LaundryMate** ("Your hostel laundry, without the waiting.").
- Live washer status preview mockup.
- Feature breakdown (Live availability, One-tap claim, Real-time countdowns, Warden controls).
- Direct call-to-action to Sign In or Create an Account.

### 2. Authentication (`/login` & `/register`)
- Clean centered authentication cards.
- Zod-validated input fields with inline error hints.
- Password visibility toggle (eye icon).
- Auto-redirects already-authenticated users to `/dashboard`.
- Persists JWT and user profile in browser storage.

### 3. Dashboard (`/dashboard`)
- Dynamic greeting based on time of day ("Good morning, Jane 👋").
- **KPI Stats Cards:** Total washers, Available right now, In use, and Out of order.
- **Prominent Active Cycle Card:** Live countdown clock, animated progress bar, start/estimated completion timestamps, and early-end button.
- **Available Washers Grid:** Live feed of machines ready for immediate use.
- **Hostel Guidelines:** Advice on peak usage hours and laundry etiquette.

### 4. Laundry Machines (`/machines`)
- Filter machines by status: *All Machines*, *Available*, *In Use*, *Out of Order*.
- Detailed machine cards showing location, status, estimated completion time, and current occupant's room number.
- One-click **Start Laundry** modal with interactive duration slider (5–180 minutes) and quick-select presets (30m, 45m, 60m, 90m).
- Automatically prevents double-booking if the resident already has an active cycle.

### 5. My Laundry Sessions (`/sessions`)
- Real-time countdown for current cycle.
- **Session History Table:** Displays machine identifier, hostel location, start timestamp, completion timestamp, cycle duration, and status badge.
- Confirmation dialog before ending sessions early to release the washer.

### 6. Admin Control Panel (`/admin/machines`)
- Protected route: strictly restricted to users with the `ADMIN` role.
- Table view of all washers across hostel floors.
- **Add Washer:** Form to register a new machine.
- **Edit Washer:** Update machine number and floor location.
- **Delete Washer:** Protected deletion with a confirmation dialog (prevents deletion while a session is actively running).

---

## Key Features

1. **Inaccurate Timer Prevention:**
   - Instead of blindly decrementing a counter (which drifts when tabs are hidden), remaining time is calculated directly against `session.estimatedEndTime`:
   ```typescript
   calculateRemainingTime(session.startTime, session.estimatedEndTime)
   ```
2. **Real-Time Polling:**
   - Active pages automatically refresh machine availability and active session data every 12 seconds.
   - Clean interval teardown prevents memory leaks when components unmount.
3. **Optimistic Error Feedback:**
   - All server errors (e.g. 409 Conflict if another student booked the washer at the same millisecond) trigger immediate, descriptive toast notifications via Sonner.
4. **Mobile Responsive Navigation:**
   - Desktop sidebar seamlessly converts into a touch-friendly slide-over drawer on mobile devices.

---

## API Integration

Connected to the Express 5 backend at `http://localhost:5000/api`.

Configure `.env.local` inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production
```bash
npm run build
npm start
```
