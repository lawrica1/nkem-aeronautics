# Features

Status tracker for Nkem Aeronautics Ltd.

Legend: done, in progress, not started, blocked/open decision.

_Last synced against actual code: 2026-09-02. See `docs/SITE-FUNCTIONALITY-AUDIT.md` for the fuller functionality audit._

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

- done: Collision-safe farmer/logbook ID generation through an atomic MongoDB counter.
- done: Farmer ID is assigned after OTP verification.
- in progress: Logbook portal page exists and is auth-gated by browser token presence.
- not started: Logbook portal does not yet fetch/display real farmer profile, request history, operations, results, or pilot reviews.

## Service Requests & Routing

- done: Authenticated backend route exists for farmer service-request creation.
- in progress: Requests are stored with status `routed` or `unassigned`.
- in progress: "Routed" currently means classified in the database, not delivered through a firm dashboard or notification.
- not started: User-facing service request form.
- not started: Nkem/admin request review workflow.
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

- done: Admin creation script exists at `client/scripts/create-admin.mjs`.
- done: Admin login route and page exist.
- done: Admin auth uses an httpOnly cookie with admin JWT audience.
- done: Protected admin layout redirects unauthenticated users.
- done: Admin logbook export supports CSV and Excel.
- done: Export uses an explicit allowlist and excludes password hash/OTP data.
- done: Admin reports show farmer and request counts by key fields.
- in progress: Admin dashboard is still narrow; it does not yet manage users, requests, pilots, drones, products, orders, news, media, or operations.

## Data Aggregation & Reporting

- done: Admin reports include total verified farmers, total requests, farmers by sector, agricultural farmers by firm/crop, and requests by status/service.
- not started: Reliable per-region reporting.
- blocked/open decision: Signup currently stores free-text address, so structured country/region/district fields are needed before accurate regional reports can exist.

## Public Pages

- done: Homepage.
- in progress: Services page is currently placeholder content.
- in progress: Contact page is currently placeholder content.
- not started: About page.
- not started: Drones/products route.
- not started: News pages and admin-managed public content.

## Infrastructure

- done: Full-stack Next.js App Router app in `client/`.
- done: API routes live under `client/src/app/api/**`.
- done: MongoDB connection through Mongoose.
- done: Server-only code lives under `client/src/lib/server/`.
- done: `.env.example` documents `MONGODB_URI`, `JWT_SECRET`, and optional `NEXT_PUBLIC_API_URL`.
- done: `npm.cmd run build` passes.
- done: `npm.cmd run lint` passes with warnings only.
- in progress: `npm audit` reports 2 moderate vulnerabilities through `exceljs -> uuid`.
- not started: Health check endpoint.
- not started: Automated tests.
