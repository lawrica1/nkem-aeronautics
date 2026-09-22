# AGENTS.md

Instructions for AI coding agents working in this repository.

## What This Project Is

Nkem Aeronautics Ltd is a drone company platform for Zambia and Africa. It combines:

- A public marketing website.
- A farmer/customer registration and logbook system.
- Service request workflows.
- Admin reporting and exports.
- A catalog for agricultural, surveillance, mining, and eVTOL drones.

The system is intended to collect real user, location, crop, affiliation, and service-demand data so resource allocation can rely on registered platform data instead of estimates.

## Current Architecture

The project now follows the supplied system-design prompt:

- `client/`: Next.js frontend only.
- `server/`: separate Node.js/Express backend.
- Database: Neon PostgreSQL.
- ORM: Prisma.

Do not reintroduce Next.js API routes or MongoDB/Mongoose backend code unless the user explicitly requests a new architecture change.

## Tech Stack

Frontend:

- Next.js App Router
- React
- Tailwind CSS
- shadcn/ui-style components
- React Query

Backend:

- Node.js
- Express
- Prisma
- PostgreSQL/Neon
- JWT authentication
- bcrypt password and OTP hashing

## Environment

Client:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Server:

```bash
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
JWT_SECRET=replace-with-a-long-random-string
CLIENT_ORIGIN=http://localhost:3000
OTP_PROVIDER=console
TERMII_API_KEY=replace-with-termii-api-key
TERMII_SENDER_ID=N-Alert
TERMII_CHANNEL=generic
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=nkemaeronautics@gmail.com
SMTP_PASS=replace-with-a-gmail-app-password
FLUTTERWAVE_SECRET_KEY=replace-with-flutterwave-secret-key
FLUTTERWAVE_WEBHOOK_HASH=replace-with-a-random-webhook-secret
```

Never commit real `.env` files, database URLs, JWT secrets, API keys, OTP credentials, or other secrets.

## Dev Commands

Frontend:

```bash
cd client
npm install
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
npm run create-admin -- --email admin@example.com --password "change-me" --name "Admin"
```

## Domain Rules

1. Firm affiliation values are confirmed: CDC, CDC Tole, CDC Jitu SAP, SOWEDA, Del Monte/PHP, Agro-Hub Southwest, OTAFARMS Southwest, Not affiliated.
2. Keep one registration form source of truth: `client/src/components/SignupForm.jsx`.
3. Keep the UI simple and uncluttered for users who may not be technically comfortable.
4. Farmer/logbook ID generation must be collision-safe.
5. Treat names, phone numbers, addresses, affiliations, and reports as PII.
6. Do not expose reporting data without authenticated role checks.
7. Firm-side dashboards and fulfillment workflows are still an open business decision.

## Current Backend Modules

- `server/src/modules/auth`: signup, OTP verification, resend OTP, login.
- `server/src/modules/farmers`: authenticated profile and own requests.
- `server/src/modules/requests`: service request create/list/update.
- `server/src/modules/admin`: admin login, stats, logbook export, user search/role/verify management.
- `server/src/modules/catalog`: public catalog data (marketing display only — see `products` for the sellable catalogue).
- `server/src/modules/logbooks`: collision-safe logbook counter and receipt-number counter.
- `server/src/modules/pilots`, `server/src/modules/drones`: fleet rosters, admin-managed.
- `server/src/modules/operations`: pilot/drone assignment against a service request, results, farmer reviews.
- `server/src/modules/products`, `server/src/modules/orders`: sellable catalogue, orders, manually-recorded payments, auto-issued receipts.
- `server/src/modules/payments`: Flutterwave online checkout (card/MTN MoMo/Orange Money), server-side transaction verification, webhook handling — feeds into the same `recordPayment` as manual admin-confirmed payments.
- `server/src/modules/partRequests`: customer part-identification requests with photo/video attachments.
- `server/src/modules/notifications`: outbound email (Gmail SMTP), currently used for receipt emails.

## Known Production Gaps

- OTP delivery uses Termii SMS when `TERMII_API_KEY` is set; falls back to console logging otherwise (dev/testing) or if a send fails.
- Receipt emails use Gmail SMTP (`SMTP_PASS`) with the same console-log fallback; no other email/notification types are wired yet (request-status changes, operation completed, etc.) and there's no in-portal notification list.
- Online checkout is live via Flutterwave (card/MTN MoMo/Orange Money) alongside the existing admin-confirmed methods (cash, bank transfer). `FLUTTERWAVE_SECRET_KEY`/`FLUTTERWAVE_WEBHOOK_HASH` need real (sandbox or live) values before checkout will actually work — until then, starting a checkout fails loudly rather than pretending to succeed.
- Pilot accounts are profile records only, not login accounts — no pilot self-service portal yet.
- Firm dashboard is not implemented.
- Product media files for the pasted eVTOL images still need to be added to the repo.
