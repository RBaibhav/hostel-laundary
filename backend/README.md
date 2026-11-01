# Laundry Machine API

The backend is an Express and TypeScript API backed by MongoDB. Residents can
register, log in, view machines, and manage their own laundry sessions.
Administrators can create, update, and delete machines.

## Stack

- Node.js and Express 5
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- bcryptjs password hashing
- Zod request validation

## Structure

```text
backend/
├── src/
│   ├── config/db.ts
│   ├── controllers/
│   │   ├── admin.controller.ts    # Admin machine actions
│   │   ├── auth.controller.ts     # Register and login
│   │   ├── machine.controller.ts  # Public machine queries
│   │   └── session.controller.ts  # Laundry sessions
│   ├── middleware/
│   │   ├── admin.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/
│   │   ├── LaundrySession.ts
│   │   ├── User.ts
│   │   └── WashingMachine.ts
│   ├── routes/
│   ├── validation/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── test-runner.ts
└── package.json
```

Validation schemas are kept in `src/validation/` and are applied by the
routes before controller logic runs.

## Configuration

Create `backend/.env` using the root `.env.example`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://admin:secretpassword123@localhost:27017/laundry_db?authSource=admin
```

MongoDB can be started from the project root with:

```bash
docker compose up -d
```

## Commands

Run these from `backend/`:

```bash
npm install
npm run dev
npm run build
npm start
npm test
```

The test command runs the API against MongoDB and checks authentication,
authorization, validation, machine operations, session ownership, and
concurrent machine booking.

## API

The server runs on `http://localhost:5000` by default.

### Health

| Method | Path | Access |
|---|---|---|
| GET | `/health` | Public |
| GET | `/api/health` | Public |

### Authentication

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

Register body:

```json
{
  "name": "Jane Resident",
  "email": "jane@example.com",
  "password": "password123",
  "roomNumber": "B-204"
}
```

### Machines

| Method | Path | Access |
|---|---|---|
| GET | `/api/machines` | Public |
| GET | `/api/machines/summary` | Public |
| GET | `/api/machines/:id` | Public |
| POST | `/api/machines` | Admin |
| PATCH | `/api/machines/:id` | Admin |
| DELETE | `/api/machines/:id` | Admin |

The list endpoint supports `?status=AVAILABLE`, `?status=IN_USE`, and
`?status=OUT_OF_ORDER`.

### Sessions

All session endpoints require a Bearer token in the `Authorization` header.

| Method | Path | Access |
|---|---|---|
| POST | `/api/sessions/start` | Authenticated |
| PATCH | `/api/sessions/end` | Authenticated |
| GET | `/api/sessions/my-active` | Authenticated |
| GET | `/api/sessions/my-history` | Authenticated |

Start session body:

```json
{
  "machineId": "507f1f77bcf86cd799439011",
  "duration": 45
}
```

Session duration must be between 5 and 180 minutes.

## Database rules

- User email and machine number must be unique.
- A user can have only one active laundry session.
- A machine can only be claimed when its status is `AVAILABLE`.
- An active machine cannot be deleted or have its status changed.
- When a session ends, its machine becomes available again.
