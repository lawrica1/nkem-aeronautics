# Nkem Aeronautics Site Functionality Audit

**Date:** 2026-09-02  
**Scope:** Current `client/` Next.js frontend, separate `server/` Node.js backend, Prisma schema, docs, and configuration.

## 1. What This Site Is

Nkem Aeronautics is now a two-part digital platform. It combines:

- A public marketing website for Nkem Aeronautics Ltd.
- A farmer registration and logbook system.
- Farmer signup, OTP verification, and login.
- A separate Node.js/Express service-request API for verified users.
- A protected admin area for reports and logbook exports.

The most important purpose is data collection for real farmer counts, firm affiliation, crops, and service needs. This is meant to support better resource allocation instead of relying on estimates.

## 2. Public Website Functionality

### Home Page

Route: `/`

Built sections:

- Hero section with background image, signup/login CTA, and WhatsApp CTA.
- Challenge section explaining inaccurate distribution, manual spraying limits, and disconnected records.
- Partner section showing SOWEDA.
- Services overview.
- Drone catalog with sector tabs, including eVTOL.
- Agricultural drone filtering by crop and service.
- Project lifecycle section.
- Manufacturing process and quality control section.
- How-it-works section.
- Why-choose-us section.
- Footer and floating WhatsApp button.

Status: built and production build passes.

Note: some homepage copy says firm routing/fulfillment exists, but the firm-side workflow is not implemented yet.

### Navigation

Component: `Navbar`

Links:

- Home
- Services
- Logbook Portal
- Contact
- Sign Up / Log In / My Dashboard

Status: built.

The navigation decides whether to show Sign Up, Log In, or My Dashboard using browser `localStorage`.

### Footer

Component: `Footer`

Includes:

- Brand name/logo
- Company description
- Lusaka, Zambia address
- Website
- Email
- Tel / WhatsApp

Status: built.

Note: the listed address is Zambia, while the phone number is a Cameroon `+237` number. Confirm before launch.

### Services Page

Route: `/services`

Status: placeholder only.

The backend service-request API exists, but there is no user-facing service request form yet.

### Contact Page

Route: `/contact`

Status: placeholder only.

It currently says headquarters and contact details are TBC.

## 3. Drone Catalog Functionality

Components:

- `CatalogSection`
- `SectorTabs`
- `AgriDroneFilter`
- `ProductCarousel`
- `ProductCard`

Current sectors:

- Agricultural Operations
- Wildlife & Surveillance
- Mining
- eVTOL

Agricultural products:

- Nkem AW50G High-Payload Agri Sprayer
- Nkem AWV2548 Ultralight Agri Drone
- Nkem AWV2847 Efficient Crop Monitor

Wildlife/surveillance products:

- Nkem AW1749 Gasoline VTOL Fixed-Wing
- Nkem AWV2555 Tethered Security Unit
- Nkem AW1338 HD Mapping Remote UAV

eVTOL products:

- ZAM13E Fixed Wing UAV Forest Survey Drone
- ZAM2001 8K GPS Camera Cargo UAV
- ZAM201 VTOL Fixed-Wing Training Survey Drone
- ZAM112 Agricultural UAV for Crop Management
- ZAM237 Carbon Fiber Fixed-Wing Drone Kit
- ZAM223 / AW1749 Gasoline VTOL Fixed Wing Drone
- AW1338 HD 4K Long Distance Mapping Drone

Status: built as static frontend data.

Gaps:

- Product data is currently stored in `client/src/lib/catalog.js` and mirrored by the backend catalog module.
- Product cards support images when image files are added, but the pasted chat images are not present as files in the repo.
- No pricing is shown.
- Purchasing is treated as enquiry-based until prices/payment are confirmed.
- No product API or admin product management exists.

## 4. Farmer Signup Functionality

Routes/components:

- `/signup`
- `SignupView`
- `SignupForm`
- `useSignup`
- `server/src/modules/auth`

Signup supports:

- Agricultural
- Wildlife & Surveillance
- Mining

Common fields:

- Sector
- Surname
- Name
- Sex
- Telephone
- Email
- Profile photo selector
- Address
- Password

Agricultural fields:

- Crop cultivation
- Firm affiliation
- Other firm name when applicable

Wildlife fields:

- Wildlife organization/site
- Position/role

Status: frontend and backend route are built.

Backend behavior:

- Validates required fields.
- Requires crop and firm for agricultural signups.
- Requires organization and role for wildlife signups.
- Hashes password.
- Creates or updates an unverified farmer record.
- Generates and hashes a 6-digit OTP.
- Stores OTP channel/contact/expiry.
- Returns `otpDebug` outside production for testing.

Gaps:

- Profile photo is not uploaded to the backend.
- OTP delivery is not real; it only logs the code server-side.

## 5. OTP Verification Functionality

Routes/hooks:

- `server/src/modules/auth`
- `useVerifyOtp`
- `useResendOtp`

Behavior:

- User enters OTP after signup.
- API validates pending unverified farmer by channel/contact.
- Expired or invalid codes are rejected.
- On success, farmer is marked verified.
- Farmer receives a logbook ID.
- OTP data is removed.
- Farmer JWT is issued.

Status: built.

Production blocker: no real SMS/email provider is connected.

## 6. Farmer Identification / Logbook ID

Files:

- `server/src/modules/logbooks/counter.model.js`
- `server/prisma/schema.prisma`

Behavior:

- ID is generated after OTP verification.
- Format: `NKEM-{year}-{sequence}`.
- Uses a Prisma-backed PostgreSQL counter update, so concurrent signups should not receive duplicate IDs.

Status: built well.

Gap: the farmer logbook page does not yet display real profile/logbook data from the backend.

## 7. Farmer Login Functionality

Routes/components:

- `/login`
- `LoginView`
- `LoginForm`
- `useLogin`
- `server/src/modules/auth`

Behavior:

- Login uses email and password.
- Only verified farmers can log in.
- Password is checked with bcrypt.
- JWT is stored in browser `localStorage`.
- Successful login redirects to `/logbook`.

Status: built.

Gaps:

- "Forgot password?" is a dead `#` link.
- Farmer token storage in `localStorage` is acceptable for an MVP, but httpOnly cookies would be safer for PII.

## 8. Logbook Portal Functionality

Route: `/logbook`

Current behavior:

- If no token exists, user is prompted to log in.
- If a token exists, a dashboard shell appears.
- Logout clears the token.
- Shows a static notification and empty mission log table.

Status: frontend shell only.

Gaps:

- Operation/mission history is not implemented yet.
- Pilot/drone assignment data is not implemented yet.

## 9. Farmer Service Request Functionality

Routes/hooks:

- `useServiceRequest`
- `server/src/modules/requests`

Backend behavior:

- Requires verified farmer Bearer token.
- Requires a `service` value.
- Creates a `ServiceRequest`.
- Copies farmer firm onto the request.
- Marks as `routed` for known firms.
- Marks as `unassigned` for no firm, other firm, missing firm, or empty firm.

Status: backend exists; frontend UI is missing.

Gaps:

- No firm dashboard or notification exists.
- Current "routing" means database classification, not actual delivery to a firm.
- Unaffiliated farmer handling still needs a business decision.

## 10. Admin Functionality

### Admin Account Creation

Script: `server/scripts/create-admin.mjs`

Status: built.

It creates or updates an admin account from the command line. There is no public admin signup endpoint.

### Admin Login

Routes:

- `/admin/login`
- `/api/admin/login`

Status: built.

Admin login uses the separate backend and stores a backend-issued JWT in browser storage for the current MVP.

### Protected Admin Pages

Routes:

- `/admin/logbooks`
- `/admin/reports`

Status: built.

Unauthenticated users are redirected to `/admin/login`.

### Admin Logbook Export

Route: `GET /api/admin/logbooks/export` on the separate backend.

Status: built.

Features:

- Exports verified farmer records.
- Supports CSV and Excel.
- Can export all firms or a selected firm.
- Uses an explicit field allowlist.
- Does not export password hashes or OTP data.

Privacy note: exports include PII such as names, phone numbers, emails, addresses, crops, and affiliations.

### Admin Reports

Route: `/admin/reports`

Status: built.

Reports include:

- Total verified farmers.
- Total service requests.
- Farmers by sector.
- Agricultural farmers by firm.
- Agricultural farmers by crop.
- Service requests by status.
- Service requests by type.

Gap: no per-region reporting exists because address is free text, not structured region/district data.

## 11. Data Models

### User

Stores:

- Sector
- Name details
- Telephone
- Email
- Address
- Crop
- Firm
- Wildlife organization/role
- Password hash
- Verification status
- Identification number
- OTP data
- Timestamps

Verified email uniqueness is enforced with a partial unique index.

### ServiceRequest

Stores:

- Farmer reference
- Service
- Firm
- Status
- Timestamps

### Admin

Stores:

- Email
- Password hash
- Name
- Timestamps

### Counter

Used for atomic farmer ID generation.

## 12. Environment Requirements

Required:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

Optional:

- `NEXT_PUBLIC_API_URL` in `client/.env.local`

`.env.example` files are present for the separated client and server setup.

Real database credentials must stay in `server/.env` and must not be committed.

## 13. Verification Results

Commands run from `client/`:

- `npm.cmd install`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd audit --omit=dev`

Results:

- Dependencies installed successfully.
- Production build passed.
- Lint passed with warnings only.
- npm audit reports 2 moderate vulnerabilities.

Lint warnings:

- Oxlint warns that some files export non-component values, mostly `metadata` exports and helper constants. These are warnings, not build failures.

Audit result:

- `exceljs` depends on a vulnerable `uuid` range.
- npm suggests `npm audit fix --force`, but that would install a breaking `exceljs` version, so it should not be applied blindly.

## 14. Main Issues To Fix Before Launch

1. Connect real OTP delivery.
2. Build the service request form.
3. Make the logbook portal show real farmer data.
4. Decide and build the firm-side routing/receiving workflow.
5. Add structured region/district fields for reliable reporting.
6. Complete `/services` and `/contact`.
7. Update stale docs and README.
8. Review farmer token storage security.
9. Resolve catalog product images, pricing, and rent/purchase behavior.
10. Address the npm audit vulnerability carefully.

## 15. Overall Assessment

The project is in a solid MVP foundation state. The core architecture is now the requested split: Next.js frontend plus a separate Node.js/Express backend using Prisma with Neon PostgreSQL.

The main remaining work is connecting real-world workflows:

- Real OTP delivery.
- Real farmer dashboard/logbook data.
- Real service-request submission UI.
- Real firm-side receiving/fulfillment process.
- Structured regional data for meaningful government/firm reports.

So: the foundation is good, the build passes, and important backend pieces are already done. It is not production-ready yet, but it is in a workable state for the next implementation phase.
