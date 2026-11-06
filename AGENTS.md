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

## Environment

Variables are listed in `client/.env.example` and `server/.env.example`.

Never commit real `.env` files, database URLs, JWT secrets, API keys, OTP credentials, or other secrets.

## Admin Account

```bash
cd server
read -rsp "Admin password: " ADMIN_PASSWORD; echo
ADMIN_PASSWORD="$ADMIN_PASSWORD" npm run create-admin -- admin@example.com "Admin"
unset ADMIN_PASSWORD
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
- `server/src/modules/admin`: admin login, admin-only creation of other admins, stats, logbook export, user search/role/verify management. There is no public admin signup route.
- `server/src/modules/catalog`: public catalog data (marketing display only — see `products` for the sellable catalogue).
- `server/src/modules/logbooks`: collision-safe logbook counter and receipt-number counter.
- `server/src/modules/pilots`, `server/src/modules/drones`: fleet rosters, admin-managed.
- `server/src/modules/operations`: pilot/drone assignment against a service request, results, farmer reviews.
- `server/src/modules/products`, `server/src/modules/orders`: sellable catalogue, orders, manually-recorded payments, auto-issued receipts.
- `server/src/modules/partRequests`: customer part-identification requests with photo/video attachments.
- `server/src/modules/notifications`: outbound email (Gmail SMTP), currently used for receipt emails.

## Known Production Gaps

- Signup and password-reset verification are email-only through Brevo. Telephone is stored strictly as contact information.
- Receipt emails use Gmail SMTP (`SMTP_PASS`) with the same console-log fallback; no other email/notification types are wired yet (request-status changes, operation completed, etc.) and there's no in-portal notification list.
- Online checkout is intentionally disabled until a payment provider is selected. Admin-confirmed cash and bank-transfer records remain available.
- Pilot accounts are profile records only, not login accounts — no pilot self-service portal yet.
- Firm dashboard is not implemented.
- Product media files for the pasted eVTOL images still need to be added to the repo.
