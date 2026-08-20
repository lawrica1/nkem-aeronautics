# AGENTS.md

Instructions for any AI coding agent (Claude Code, Cursor, Copilot, etc.) working in this repository.

## What this project is

Nkem Aeronautics Ltd — a drone company site (Zambia / Sub-Saharan Africa) that is really two products sharing one frontend: a marketing site, and a farmer registration/logbook system whose output (real per-region farmer counts) is meant to replace estimate-based government/firm resource allocation. See `docs/PROJECT-UNDERSTANDING.md` for the full picture and `docs/FEATURES.md` for feature status.

**Current state (2026-08-20):** `client/` is a working Next.js full-stack app — frontend pages plus real API routes backed by MongoDB (see below). There is no separate `/server` directory; it was removed. Always verify actual file state before assuming progress, but as of this date the auth flow (signup/OTP-verify/login) and service-request submission are implemented end-to-end in code (they still need a real `MONGODB_URI` to run against, and a real SMS/email provider to replace the OTP stub — see `client/src/lib/server/otp.js`).

## Tech stack

- **Full-stack Next.js (App Router)** — one app, one folder (`client/`), no separate backend process. **Pivoted twice from the original client spec**: first Vite → Next.js (2026-08-20, for real SSR/SEO on the marketing pages), then Express → Next.js Route Handlers (2026-08-20, same day, at the user's explicit request to keep frontend and backend in one folder). Both pivots are recorded in the `project-build-order` memory.
- Frontend: React + Tailwind CSS + shadcn/ui (Radix), React Query. React Router is gone; use `next/link` and `next/navigation`.
- Backend: Next.js Route Handlers under `client/src/app/api/**`, MongoDB via Mongoose, JWT auth (`jsonwebtoken`), `bcryptjs` for password/OTP hashing. Server-only code lives in `client/src/lib/server/` — never import it from a `"use client"` component or the browser-safe `client/src/lib/` modules.
- Hosting: single deploy target (e.g. Vercel) now that there's no separate backend process; DB on MongoDB Atlas.

## Current layout

```
nkem-aeronautics/
├── /client                          # Next.js (App Router) full-stack app — frontend + API routes
│   ├── next.config.mjs
│   ├── postcss.config.mjs            # Tailwind v4 via @tailwindcss/postcss
│   ├── /public
│   │   └── /images
│   │       ├── /drones               # Product photos (AW50G, AWV2548, AWV2847, etc.)
│   │       ├── /hero                 # Background/hero images
│   │       └── /icons                # Logo, favicon
│   └── /src
│       ├── /app
│       │   ├── layout.jsx            # Root layout — metadata, globals.css, Providers
│       │   ├── globals.css           # Tailwind entry
│       │   ├── providers.jsx         # "use client" — QueryClientProvider
│       │   ├── /(site)               # Route group: Navbar/Footer/WhatsApp shell
│       │   │   ├── layout.jsx
│       │   │   ├── page.jsx          # Home — has `metadata` export for SEO
│       │   │   ├── services/page.jsx
│       │   │   ├── contact/page.jsx
│       │   │   └── logbook/page.jsx
│       │   ├── /(auth)               # Route group: full-bleed, no Navbar/Footer
│       │   │   ├── layout.jsx
│       │   │   ├── login/{page.jsx, LoginView.jsx}
│       │   │   └── signup/{page.jsx, SignupView.jsx}
│       │   └── /api                  # Route Handlers — the backend
│       │       ├── auth/{signup,login,verify-otp,resend-otp}/route.js
│       │       └── farmers/service-requests/route.js
│       │
│       ├── /components
│       │   ├── /ui                   # shadcn-generated primitives (button, dialog, input, select, carousel...)
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── SectorTabs.jsx        # Agricultural / Wildlife / Real Estate toggle
│       │   ├── SignupForm.jsx        # Single shared form — replaces the duplicated forms
│       │   ├── LoginForm.jsx
│       │   ├── ProductCarousel.jsx   # shadcn Carousel for the drone catalog
│       │   └── ProductCard.jsx
│       │
│       ├── /hooks
│       │   ├── useSignup.js          # React Query mutation
│       │   ├── useLogin.js           # React Query mutation
│       │   ├── useVerifyOtp.js / useResendOtp.js
│       │   ├── useFirms.js           # React Query query — firm list for dropdown
│       │   └── useServiceRequest.js  # React Query mutation — request routing
│       │
│       ├── /lib
│       │   ├── api.js                # fetch wrapper (same-origin "/api" by default), SSR-safe localStorage helpers
│       │   ├── firms.js               # confirmed firm list — single source of truth, imported by both frontend and the signup API route
│       │   └── queryClient.js        # React Query client instance
│       │
│       └── /lib/server               # SERVER-ONLY — never import from a "use client" file
│           ├── db.js                 # Mongoose connection (dev-mode cached on `global`)
│           ├── auth.js               # hashPassword/verifyPassword, signToken/verifyToken, requireFarmer()
│           ├── otp.js                # OTP generate/hash/verify + sendOtp() stub (see below)
│           ├── handleRoute.js        # wraps a route handler so HttpError -> proper JSON response
│           ├── httpError.js          # HttpError(status, message)
│           └── /models
│               ├── Farmer.js
│               ├── Counter.js        # atomic sequence -> collision-safe farmer IDs
│               └── ServiceRequest.js
│
├── /docs
│   ├── dev-spec.md                   # Feature/development spec
│   ├── agenda.md                     # Development roadmap
│   └── open-questions.md             # Running list of client questions to resolve
│
└── README.md                         # Project overview, setup instructions
```

## Dev commands

```bash
cd client && npm install && npm run dev   # frontend + backend, one process
```

Env (`client/.env.local`, see `client/.env.example`): `MONGODB_URI` (required — nothing in `/api/**` works without it), `JWT_SECRET` (required — auth routes throw clearly if missing), `NEXT_PUBLIC_API_URL` (optional, only if the API is ever split to a different origin). Never commit `.env` files or real secrets.

**No SMS/email provider is wired up.** `client/src/lib/server/otp.js`'s `sendOtp()` just logs to the server console; outside production the generated code is also returned as `otpDebug` in the signup/resend-otp response so the flow is testable. Both must be replaced with a real provider before production use — this was a deliberate, flagged placeholder, not an oversight.

**No `/api/reports/*` or aggregation endpoints exist.** Per domain rule 6 below, don't add them without an actual role/permission model — this was intentionally left out of the initial backend build.

## Domain rules — do not violate these without flagging it to the user first

1. **Firm affiliation values are confirmed** (resolved 2026-08-19/20): CDC, CDC Tole, CDC Jitu SAP, SOWEDA, Del Monte/PHP, Agro-Hub Southwest, OTAFARMS Southwest, Not affiliated — South West Region agricultural firms/estates. Kept in `client/src/lib/firms.js` as the single source of truth; don't hardcode them elsewhere.
2. **One registration form only.** The spec explicitly calls out removing a duplicated registration form (homepage inline + separate Logbook Portal page). Never reintroduce a second signup form — `client/src/components/SignupForm.jsx` (rendered from `app/(auth)/signup/SignupView.jsx`) is the single source of truth.
3. **Keep the UI simple and uncluttered.** This is an explicit, repeated client mandate, not a style suggestion — when in doubt, choose the plainer layout, fewer fields, fewer steps. This system needs to be usable by farmers who may not be tech-comfortable; a complicated flow biases who completes signup, which corrupts the data the whole project exists to produce.
4. **Farmer ID / logbook generation must be collision-safe.** Don't implement it as a random or timestamp-based string without a uniqueness guarantee (atomic counter, or unique index + retry). A duplicate ID undermines the government-facing data this system produces.
5. **This system handles real PII** (farmer names, phone numbers, addresses) that feeds government resource-allocation decisions. Treat it accordingly — don't log it carelessly, don't expose it in report endpoints without an actual auth/role check, don't default to weaker-than-necessary token storage without flagging the tradeoff.
6. **No role/permission model exists yet** for "authorized user" access to `/api/reports/*` endpoints. Don't build report endpoints as open/unauthenticated — raise this as a design gap if it comes up before Sprint 1 auth is settled.
7. **Firm-side interactions are undesigned.** There is currently no firm login, dashboard, or defined mechanism for how a firm receives/acts on a routed service request. Don't invent one silently — this needs a decision from the user/client first.

## Open questions blocking parts of the build

See `docs/PROJECT-UNDERSTANDING.md` §6 for the full list with priorities. The most agent-relevant ones:
- Whether unaffiliated farmers can request services, and who fulfills them.
- Whether rent-vs-purchase needs a price display or is a label only — affects `ProductCard` shape.

If a task touches one of these unresolved areas, implement the most reversible option and say so, rather than guessing a final answer.
