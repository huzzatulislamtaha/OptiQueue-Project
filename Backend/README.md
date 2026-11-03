# OptiQueue Backend

Express API + Supabase PostgreSQL.

## Requirements
- Node.js 20 or newer
- A Supabase project
- Database schema installed from `../Database/schema.sql`

## Setup
1. Open a terminal in this `Backend` directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, and `ADMIN_SETUP_KEY`.
5. Run `npm start`.
6. Open `http://localhost:5000/api/health`.

Do not share `.env`, the Supabase secret/service-role key, or JWT secret.

## Create the first admin
Keep `ADMIN_SETUP_KEY` in `.env` temporarily. Send a POST request to `/api/auth/setup-admin` with JSON:
`{ "setupKey": "...", "name": "...", "email": "...", "password": "at-least-8-characters" }`.
After the first admin is created, remove `ADMIN_SETUP_KEY` from `.env` and restart the server.

## Main API routes
- `GET /api/health`
- `GET /api/services`
- `GET /api/queue/live`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `POST /api/tokens` (patient Bearer token; body `{ "serviceId": 1 }`)
- `GET /api/tokens/my` (patient Bearer token)
- `PATCH /api/tokens/:id/cancel` (patient Bearer token)
- `GET /api/admin/dashboard` (admin Bearer token)
- `GET /api/admin/tokens` (admin Bearer token)
- `PATCH /api/admin/tokens/:id/status` (admin Bearer token; body `{ "status": "serving" }`)
- `PATCH /api/admin/services/:id` (admin Bearer token)
- `GET /api/notifications` (Bearer token)
- `PATCH /api/notifications/:id/read` (Bearer token)

The live queue endpoint is suitable for polling from the TV display. The supplied frontends are preserved as the original UI projects; they still contain demo/static screen data and require API integration before being considered a fully connected production system.
