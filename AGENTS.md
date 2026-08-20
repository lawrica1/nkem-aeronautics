# AGENTS.md

Instructions for any AI coding agent (Claude Code, Cursor, Copilot, etc.) working in this repository.

## What this project is

Nkem Aeronautics Ltd — a drone company site (Zambia / Sub-Saharan Africa) that is really two products sharing one frontend: a marketing site, and a farmer registration/logbook system whose output (real per-region farmer counts) is meant to replace estimate-based government/firm resource allocation. See `docs/PROJECT-UNDERSTANDING.md` for the full picture and `docs/FEATURES.md` for feature status.

**Current state:** nothing is scaffolded yet. This repo has no `/client` or `/server` code as of 2026-08-18 — only planning docs. Sprint 0 (project setup) has not started. Don't assume any file in the planned structure below exists until you've checked.

## Tech stack (planned, per client spec)

- Frontend: React + Vite + Tailwind CSS + shadcn/ui (Radix), React Query, React Router
- Backend: Node.js + Express, MongoDB (Atlas), JWT auth, bcrypt for password hashing
- Hosting: frontend on Netlify/Vercel, backend on Render/Railway, DB on MongoDB Atlas

## Planned layout

```
nkem-aeronautics/
├── /client                          # React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── /public
│   │   └── /images
│   │       ├── /drones               # Product photos (AW50G, AWV2548, AWV2847, etc.)
│   │       ├── /hero                 # Background/hero images
│   │       └── /icons                # Logo, favicon
│   └── /src
│       ├── main.jsx                  # App entry, QueryClientProvider setup
│       ├── App.jsx                   # Routes (if using React Router)
│       │
│       ├── /components
│       │   ├── /ui                   # shadcn-generated primitives (button, dialog, input, select, carousel...)
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── SectorTabs.jsx        # Agricultural / Wildlife / Real Estate toggle
│       │   ├── AuthModal.jsx         # Login/Signup modal (shadcn Dialog)
│       │   ├── SignupForm.jsx        # Single shared form — replaces the duplicated forms
│       │   ├── LoginForm.jsx
│       │   ├── ProductCarousel.jsx   # shadcn Carousel for the drone catalog
│       │   └── ProductCard.jsx
│       │
│       ├── /pages
│       │   ├── Home.jsx
│       │   ├── Services.jsx
│       │   └── Contact.jsx
│       │
│       ├── /hooks
│       │   ├── useSignup.js          # React Query mutation
│       │   ├── useLogin.js           # React Query mutation
│       │   ├── useFirms.js           # React Query query — firm list for dropdown
│       │   └── useServiceRequest.js  # React Query mutation — request routing
│       │
│       ├── /lib
│       │   ├── api.js                # fetch/axios wrapper, base URL config
│       │   └── queryClient.js        # React Query client instance
│       │
│       └── /styles
│           └── index.css             # Tailwind entry
│
├── /server                           # Node/Express backend
│   ├── server.js                     # App entry point
│   ├── /routes
│   │   ├── auth.js                   # Login/signup endpoints
│   │   ├── farmers.js                # Farmer CRUD, logbook + ID generation
│   │   └── firms.js                  # Firm data, request routing
│   ├── /models
│   │   ├── Farmer.js
│   │   ├── Firm.js
│   │   └── ServiceRequest.js
│   ├── /controllers
│   │   ├── authController.js
│   │   ├── farmerController.js
│   │   └── firmController.js
│   └── /config
│       └── db.js                     # MongoDB connection
│
├── /docs
│   ├── dev-spec.md                   # Feature/development spec
│   ├── agenda.md                     # Development roadmap
│   └── open-questions.md             # Running list of client questions to resolve
│
└── README.md                         # Project overview, setup instructions
```

## Dev commands (once scaffolded)

```bash
cd client && npm install && npm run dev   # frontend
cd server && npm install && npm run dev   # backend
```

Frontend env: `VITE_API_URL`. Backend env: `PORT`, `MONGODB_URI`, `JWT_SECRET`. Never commit `.env` files or real secrets.

## Domain rules — do not violate these without flagging it to the user first

1. **Firm affiliation values are confirmed** (resolved 2026-08-19/20): CDC, CDC Tole, CDC Jitu SAP, SOWEDA, Del Monte/PHP, Agro-Hub Southwest, OTAFARMS Southwest, Not affiliated — South West Region agricultural firms/estates. Kept in `client/src/lib/firms.js` as the single source of truth; don't hardcode them elsewhere.
2. **One registration form only.** The spec explicitly calls out removing a duplicated registration form (homepage inline + separate Logbook Portal page). Never reintroduce a second signup form — `AuthModal` / `SignupForm` is the single source of truth.
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
