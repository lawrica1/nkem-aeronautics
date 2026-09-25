# Nkem Aeronautics Project Status Report

**Date:** 2026-09-03

## 1. Headline

The project is now split according to the supplied system-design prompt:

- `client/`: Next.js frontend only.
- `server/`: separate Node.js/Express backend.
- Database: Neon PostgreSQL through Prisma.

The old MongoDB/Mongoose backend code has been removed from the client.

## 2. Backend Status

The backend is implemented under `server/` with modular routes, controllers, services, middleware, constants, serializers, and Prisma database access.

Implemented modules:

- Auth: signup, OTP verification, OTP resend, login.
- Farmers: authenticated profile and own request history.
- Requests: authenticated request creation plus admin listing/update endpoints.
- Admin: login, stats, CSV/XLSX logbook export.
- Catalog: public catalog API.
- Health check: `/health`.

Prisma schema:

- `User`
- `ServiceRequest`
- `Counter`
- enums for role, sector, account type, and request status.

## 3. Frontend Status

The frontend remains a Next.js app and now talks to the backend through `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:5000/api`.

Frontend areas connected to the separate backend:

- Signup.
- OTP verification and resend.
- Login.
- Farmer logbook dashboard.
- Farmer service request form.
- Admin login.
- Admin reports.
- Admin logbook export.

## 4. Database Status

The backend expects a `DATABASE_URL` in `server/.env`.

Use the Neon PostgreSQL connection string only in `server/.env`. Do not commit it.

After setting the environment value:

```bash
cd server
npm run prisma:generate
npm run prisma:push
```

## 5. Production Blockers

- OTP delivery is still console/debug based; a real SMS/email provider is needed.
- Payment, ordering, fulfillment, pilot assignment, drone assignment, and firm dashboards are not yet complete.
- Admin request-management screens are still limited.
- Real product image files for the pasted eVTOL catalog images still need to be added to `client/public/images`.
