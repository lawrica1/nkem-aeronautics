# Features

Status tracker for Nkem Aeronautics Ltd. Legend: ✅ done · 🚧 in progress / built but not fully functional · ⬜ not started · ❓ blocked on a client answer (see `PROJECT-UNDERSTANDING.md` §6).

_Last synced against actual code: 2026-08-20. Re-verified item-by-item against `/client/src` and `/server` (see `docs/STATUS-REPORT.md` for the narrative version of this snapshot)._

## Branding & Layout
- ✅ Site name/logo — "NKEM AERONAUTICS LTD" wordmark in Navbar/Footer, plus a placeholder quadcopter `BrandMark` icon (explicitly a placeholder in code, pending a real logo asset from the client)
- ✅ Motto displayed — "Where fate and human glory lead, we are always there." (Navbar)
- ✅ Background/theme redesign — real hero photo (`hero-crop-spray.jpg`) in place of a placeholder
- 🚧 Clean, minimal UI throughout (ongoing constraint, not a one-time task — re-check on every new page)

## Navigation
- ✅ Navbar: Home, Services, Logbook Portal, Contact, Log In / My Dashboard (swaps based on auth state)

## Homepage Sectors
- ✅ Agricultural Operations — 3 drones, crop/service filter, carousel
- ✅ Wildlife & Surveillance — 3 drones in catalog (ahead of its "lower priority" label)
- 🚧 Real Estate & Surveillance Drone — tab and "Coming Soon" placeholder built; no actual catalog entries yet
- ⬜ Military — **deferred, future phase only, correctly not built**

## Auth
- ⬜ `AuthModal` (shadcn Dialog) — **not built.** Login/Signup shipped as full pages (`/login`, `/signup`) instead of a modal. Doesn't violate "one registration form only," but is a documented deviation from the planned component layout — confirm this is the intended direction or update the plan.
- ✅ `LoginForm`
- ✅ `SignupForm` — Surname, Name, Sex, Telephone, Email, Address/Farm Location, Crop Cultivation, Password, plus an optional profile photo field not in the original spec
- ✅ Firm-affiliation dropdown on `SignupForm` — confirmed list, single source of truth in `lib/firms.js`
- 🚧 JWT issued on login/signup — frontend code path exists (`setToken` on mutation success) but has never run end-to-end; there's no backend to actually issue a token yet
- ✅ Single source of truth: no duplicate registration form anywhere in the app

## Logbook & Identification
- ⬜ Unique `identification_number` generated on signup (collision-safe strategy required) — backend doesn't exist
- ⬜ Logbook entry created per farmer on signup — backend doesn't exist
- 🚧 Confirmation shown to farmer after signup — UI built (`Signup.jsx` shows a confirmation screen with the returned logbook ID), but the ID itself will be blank/"Pending" until the backend actually returns one
- 🚧 Logbook Portal page (authenticated) — page and auth-gate exist, but shows static placeholder copy ("Profile details pending backend connection") and an empty mission-log table; not functional until backend exists
- ❓ Whether the ID needs real firm verification vs. auto-generated reference only

## Service Requests & Firm Routing
- ⬜ Farmer can submit a service request — `Services.jsx` is currently a stub page ("content in progress"); the `useServiceRequest` hook exists but isn't wired to any form/UI yet
- ⬜ Affiliated requests route to the farmer's declared firm
- ❓ Unaffiliated farmer behavior — can they request, and who fulfills it?
- ❓ Firm-side interface to receive/act on routed requests — **currently undesigned entirely**, needs a decision before this can be considered done

## Drone & Machinery Catalog
- 🚧 `ProductCard`: name, description, spec tag all render — no product image yet (component takes no image prop; catalog entries don't carry an image field either)
- ✅ `ProductCarousel` (shadcn/embla Carousel), slides left/right, filters by sector/crop/service
- ❓ Rent-vs-purchase badge vs. full price display — still explicitly deferred in code (see comment in `ProductCarousel.jsx`), resolve before adding pricing
- ❓ Product photos — drone catalog entries currently have none; client-supplied vs. sourced still unresolved
- ⬜ `/api/products` endpoint — catalog is hardcoded mock data (`PRODUCTS` array in `ProductCarousel.jsx`), fine for now but a future drone/price change means a code deploy

## Data Aggregation & Reporting
- ⬜ `/api/reports/farmers-by-region`
- ⬜ `/api/reports/farmers-by-crop`
- ⬜ `/api/reports/farmers-by-firm`
- ❓ Role/permission model for "authorized user" access — does not exist yet, needs designing alongside backend auth
- ❓ Consumer format — dashboard UI, CSV export, PDF? Depends on who consumes it (unanswered)

## Footer
- ✅ Company blurb, headquarters & address, contact info, copyright — all present (motto itself is only shown in the Navbar, not repeated in the footer — minor, not worth blocking on)
- ✅ Website URL — resolved: `nkemaeronautics.com` now shown in the footer
- ⚠️ Address is Lusaka, Zambia while the listed phone/WhatsApp number is a `+237` (Cameroon) number — known inconsistency, kept intentionally per prior client decision

## Infrastructure
- ✅ React + Vite + Tailwind + shadcn-style component scaffold (uses `@base-ui/react` under shadcn's CLI rather than Radix directly — functionally equivalent, worth noting as a stack deviation from the original spec wording)
- ✅ React Query provider + React Router setup
- ⬜ Express + MongoDB Atlas connection — `/server` is an empty directory, nothing built
- 🚧 `.env` config — frontend `.env.example` (`VITE_API_URL`) exists; backend env (`PORT`, `MONGODB_URI`, `JWT_SECRET`) doesn't exist because there's no backend yet
- ⬜ CORS configured — backend doesn't exist
- ⬜ Health check endpoint — backend doesn't exist
