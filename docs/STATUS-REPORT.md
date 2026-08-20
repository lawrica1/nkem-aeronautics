# Nkem Aeronautics — Project Status Report

**Date:** 2026-08-20
**Repo state:** No git repository exists yet in `e:\Nkem` (no `.git`). This report is based on a direct read of the current files, not commit/PR history — there isn't any yet.

---

## 1. Headline

The frontend is substantially built — much further along than `docs/FEATURES.md` indicates (that file is stale, last updated 2026-08-18 before scaffolding started). The backend is **not started at all** (`/server` is an empty directory). Nothing in the app is end-to-end functional yet: forms submit to `http://localhost:5000/api/...`, which doesn't exist.

## 2. What's actually built

### Frontend (`/client`) — React 19 + Vite + Tailwind v4 + shadcn-style components + React Query + React Router
Scaffolded and largely implemented:

- **Pages:** Home, Services, Contact, Login, Signup, LogbookPortal — all present and routed in `App.jsx`.
- **Layout/marketing:** Navbar, Footer, Hero, SectorTabs (Agricultural / Wildlife & Surveillance / Real Estate), HowItWorks, WhyChooseUs, Challenges, ServicesOverview, Partners, WhatsAppButton, BrandMark.
- **Auth forms:** `SignupForm` and `LoginForm` are built as full pages (`/signup`, `/login`), not the modal (`AuthModal`) originally planned in `AGENTS.md`. This isn't a violation of the "one registration form only" rule — there's still a single signup source of truth — but it's a **deviation from the documented plan** worth confirming is intentional.
  - `SignupForm` collects: profile photo (optional, new — not in original spec), surname, name, sex, telephone, email, address/farm location, crop cultivation, firm affiliation, password. Matches the spec fields plus the photo addition.
- **Firm affiliation:** `lib/firms.js` holds the confirmed 8-option list (CDC, CDC Tole, CDC Jitu SAP, SOWEDA, Del Monte/PHP, Agro-Hub Southwest, OTAFARMS Southwest, Not affiliated) as the single source of truth, wired into `SignupForm` via `useFirms`. Matches domain rule 1 in `AGENTS.md`.
- **Drone catalog:** `ProductCard`, `ProductCarousel` (embla carousel), `AgriDroneFilter` exist.
- **Data hooks (React Query):** `useSignup`, `useLogin`, `useFirms`, `useServiceRequest` — all wired to call a backend that doesn't exist yet.
- **API/auth plumbing:** `lib/api.js` — fetch wrapper, JWT stored in `localStorage` under `nkem_token`. This is the tradeoff flagged in `docs/PROJECT-UNDERSTANDING.md` §4 (httpOnly cookie would be safer for PII-bearing tokens) — still unresolved, now baked into working code rather than just a design note.
- **Footer now answers two previously-open questions:**
  - Website URL is shown: `nkemaeronautics.com` (resolves open question #5).
  - Address is Lusaka, Zambia; phone is a `+237` (Cameroon) WhatsApp number — the Zambia/Cameroon inconsistency flagged earlier in the project is still present in shipped copy, per the client's earlier choice to keep it.
- **LogbookPortal** is built as a shell: gates on JWT presence, shows "Profile details pending backend connection" and an empty mission-log table. Correctly reflects that there's no backend yet rather than faking data.
- **Assets:** hero, services, and partner images are in `client/public/images/`; favicon present.

### Backend (`/server`)
**Empty.** No `server.js`, no routes, no models, no MongoDB connection. Nothing from the planned layout in `AGENTS.md` (`/routes`, `/models`, `/controllers`, `/config`) has been created. This means:
- Signup, login, service requests, and logbook data are all non-functional today — the frontend will error against `localhost:5000` until a backend exists.
- None of the domain rules that depend on a backend (collision-safe ID generation, role/permission model for `/api/reports/*`, PII handling) have been tested against real code, because there's no code to test them against yet.

### Stray file
- `nkem.html` (38KB) sits at the repo root, outside `/client`. It's unclear whether this is a legacy static prototype, a reference mockup, or leftover from before the React scaffold. Worth a decision on whether to keep, move into `docs/` as reference, or delete — it's not part of the Vite app and could confuse anyone new to the repo.

## 3. Docs are out of sync with code

`docs/FEATURES.md` marks nearly everything ⬜ "not started" as of 2026-08-18, but the frontend items above are now built. Recommend regenerating that tracker once backend work starts, so it reflects reality — right now it undersells actual progress and isn't reliable for status checks.

## 4. Open questions — still unresolved (from `docs/PROJECT-UNDERSTANDING.md`)

| # | Question | Blocks |
|---|----------|--------|
| 2 | Can unaffiliated farmers request services? Who fulfills them? | Backend service-request logic |
| 3 | Does the farmer ID need real firm verification, or is an auto-generated reference enough? | ID/logbook generation design |
| 4 | Who consumes aggregated regional data, and in what format? | Report endpoints |
| 6 | Are product photos client-supplied or need sourcing? | Catalog completeness (some images already added — confirm these are final) |
| 7 | Does rent-vs-purchase affect pricing display, or is it label-only? | `ProductCard` shape |
| 8 | How does a firm actually receive/act on a routed request? | Entirely undesigned — no firm login/dashboard exists |

Resolved since the last doc pass: firm list (confirmed), website URL (now shown in footer).

## 5. No source control yet

There is no `.git` directory anywhere in `e:\Nkem`, so there's no GitHub repository, no commit history, and no way to track changes or collaborate via PRs. Recommend initializing git and creating a GitHub repo soon — the frontend has enough real work in it now that it's at risk without version history.

## 6. Suggested next steps, in order

1. Initialize git, create the GitHub repo, commit current state (frontend work is substantial and currently unprotected by version control).
2. Resolve the firm-routing question (#8) — it's the biggest undesigned gap and affects backend API shape.
3. Build `/server`: Express + MongoDB connection, auth routes (signup/login/JWT), matching what `lib/api.js` and the hooks already expect.
4. Implement collision-safe farmer ID generation once the backend exists.
5. Decide on `nkem.html`'s fate and refresh `docs/FEATURES.md` to match actual code.
