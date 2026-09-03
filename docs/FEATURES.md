# Features

Status tracker for Nkem Aeronautics Ltd.

Legend: done, in progress, not started, blocked/open decision.

_Last synced against actual code: 2026-09-03. See `docs/SITE-FUNCTIONALITY-AUDIT.md` for the fuller functionality audit._

## Branding & Layout

- done: Site name/logo appears in Navbar/Footer.
- done: Motto displayed in Navbar.
- done: Real hero image is used on the homepage.
- done: Homepage includes Challenges, Partners, Services Overview, Catalog, Project Lifecycle, Manufacturing Process, How It Works, and Why Choose Us.
- in progress: Keep UI simple and uncluttered as new platform features are added.

## Navigation

- done: Navbar links to Home, Services, Logbook Portal, Contact, and auth/dashboard entry.
- done: Auth entry changes between Sign Up, Log In, and My Dashboard based on browser account/token state.

## Homepage Sectors & Catalog

- done: Agricultural Operations catalog tab with crop/service filtering.
- done: Wildlife & Surveillance catalog tab.
- in progress: Real Estate & Surveillance catalog tab exists, but still shows a coming-soon state.
- done: eVTOL catalog tab added.
- done: eVTOL entries added: ZAM13E, ZAM2001, ZAM201, ZAM112, ZAM237, ZAM223/AW1749, and AW1338.
- deferred: Military is not built and remains a future phase.

## Auth

- done: Login page and `LoginForm`.
- done: Signup page and `SignupForm`.
- done: Sector-aware signup fields for Agriculture, Wildlife & Surveillance, and Real Estate & Surveillance.
- done: Confirmed agricultural firm dropdown sourced from `client/src/lib/firms.js`.
- done: OTP verification step after signup.
- done: JWT issued after login and after successful OTP verification.
- in progress: OTP delivery is stubbed; a real SMS/email provider is still required.
- in progress: Profile photo selector exists, but upload/storage is not implemented.
- not started: Password reset flow.

## Logbook & Identification

- done: Collision-safe farmer/logbook ID generation through a Prisma-backed PostgreSQL counter.
- done: Farmer ID is assigned after OTP verification.
- done: Logbook portal page fetches and displays real farmer profile (name, logbook ID, sector, crop, firm, phone).
- done: `GET /api/farmers/me` endpoint returns authenticated farmer profile from the separate backend.
- not started: Logbook portal operations history section (requires pilots/drones/ops to be assigned).
- not started: Pilot reviews.

## Service Requests & Routing

- done: `GET /api/farmers/service-requests` — authenticated list of farmer's own requests.
- done: `POST /api/farmers/service-requests` — creates request with proper status lifecycle (submitted → under_review → … → completed).
- done: User-facing service request form in the logbook portal (sector-aware service options).
- done: Service request status badge rendering with full lifecycle colours.
- in progress: Nkem/admin request review workflow (admin can view in reports but cannot yet change status).
- not started: Pilot/drone assignment and operation lifecycle.
- open decision: Handling for unaffiliated farmers and partner/firm handoff process.

## Drone Catalogue & Commerce

- done: Static catalogue data lives in `client/src/lib/catalog.js`.
- done: Product cards show name, description, tags, availability/enquiry status, and compact specs.
- in progress: Product cards support image paths, but the pasted chat images are not present as files in the repo yet.
- in progress: Product entries are enquiry-based because prices are not confirmed.
- not started: Product detail pages.
- not started: Cart, order, payment, receipt, and fulfillment flow.
- not started: Drone parts catalogue/request workflow.

## Admin

- done: Admin creation script exists at `server/scripts/create-admin.mjs`.
- done: Admin login route and page exist.
- done: Admin auth uses a backend-issued JWT stored by the frontend admin gate.
- done: Protected admin layout redirects unauthenticated users.
- done: Admin logbook export supports CSV and Excel.
- done: Export uses an explicit allowlist and excludes password hash/OTP data.
- done: Admin reports show farmer and request counts by key fields.
- in progress: Admin dashboard is still narrow; it does not yet manage users, requests, pilots, drones, products, orders, news, media, or operations.

## Data Aggregation & Reporting

- done: Admin reports include total verified farmers, total requests, farmers by sector, agricultural farmers by firm/crop, and requests by status/service.
- done: Signup supports structured country, region, and district fields.
- done: Admin reports include country and region breakdowns.

## Public Pages

- done: Homepage.
- in progress: Services page is currently placeholder content.
- in progress: Contact page is currently placeholder content.
- not started: About page.
- not started: Drones/products route.
- not started: News pages and admin-managed public content.

## Infrastructure

- done: Frontend lives in `client/` as a Next.js App Router app.
- done: Backend lives in `server/` as a separate Node.js/Express API.
- done: Database access uses Prisma with PostgreSQL/Neon.
- done: Prisma schema lives at `server/prisma/schema.prisma`.
- done: `client/.env.example` documents `NEXT_PUBLIC_API_URL`.
- done: `server/.env.example` documents `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `OTP_PROVIDER`.
- done: `npm.cmd run build` passes.
- done: `npm.cmd run lint` passes with warnings only.
- in progress: Dependency audit needs to be re-run after the Prisma/Express lockfile refresh.
- done: Health check endpoint exists at `/health`.
- not started: Automated tests.
