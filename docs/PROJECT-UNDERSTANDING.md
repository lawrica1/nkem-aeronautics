# Nkem Aeronautics Ltd — Project Understanding

**Written:** 2026-08-18
**Purpose of this file:** a synthesis of what I understand about this project from the client-provided documentation, plus the open design gaps I've identified that go beyond what's been specced. This is a companion to `dev-spec.md`, not a replacement — it's meant to capture *understanding and risk*, not restate the plan.

---

## 1. What this project actually is

On the surface, this is a marketing site for a drone company. Underneath, it's a **data collection instrument for public resource allocation**. Those are two different products sharing one frontend, and the second one is the one that actually matters to the client.

The real goal: firms and government bodies (e.g. the ministry distributing agricultural chemicals) currently allocate resources based on estimates. The client wants real, per-region farmer counts instead — the South West Region was named as the concrete motivating case. Every farmer who signs up, declares a crop and a location, and gets logged is a data point feeding that allocation decision. That reframes a few things:

- Data accuracy and uniqueness (no duplicate farmers, no lost signups) matters more than it would for a typical marketing-site signup form.
- The "logbook and ID" aren't cosmetic gamification — they're the audit trail that makes the aggregated numbers trustworthy.
- The **simple, uncluttered UI** requirement isn't just a style preference — it's what makes this usable by farmers who may not be tech-comfortable, which is a precondition for the data being representative at all. A complicated form means a smaller, biased sample of who actually completes signup.

## 2. The three roles the system implies, only one of which is designed

Reading the flows closely, there are three actors:

1. **Farmer** — signs up, gets an affiliation, requests services. Fully specced (Sprint 1–2).
2. **Firm** (CDC / CDC Tole / CDC Jitu SAP / SOWEDA) — receives routed requests and is "responsible for supplying the chemicals." **Not specced at all.** There's no firm login, no firm dashboard, no model field distinguishing a firm-user from a farmer-user. As written, a service request lands in a "queue" that nothing in the current design lets a firm see or act on.
3. **Ministry / distributing body** — consumes aggregated reports. Partially specced (Sprint 5 report endpoints exist), but "authorized user" has no corresponding role or permission model anywhere in the auth design.

This matters because Sprint 2's acceptance criterion — "request routes to the correct firm" — is only meaningfully testable once you know what "routes to" means operationally. Does the firm get an email? A dashboard? A CSV a human checks manually? That's a client question, not just an engineering one, and it's currently missing from the open-questions list even though it's arguably more foundational than some of the questions that are on it.

## 3. Sequencing risk I'd flag before Sprint 1 starts

The open-questions table marks "exact firm names" as a blocker for **Sprint 2**. But the firm-affiliation dropdown is a field on `SignupForm`, which is built in **Sprint 1**. If Sprint 1 ships with placeholder firm names ("CDC," "CDC tolerance," "Jitu SAP" as currently spelled) and those turn out to be wrong or incomplete, every farmer who signed up in between has a mis-recorded affiliation — which directly corrupts the regional data the whole project exists to produce. This should be resolved with the client *before* Sprint 1's form ships, not treated as a Sprint 2 dependency.

## 4. Technical gaps not yet visible in the spec

- **ID uniqueness strategy is unstated.** "Generate a unique `identification_number`" needs an actual mechanism (atomic counter document, or unique index + retry-on-collision). A collision here isn't cosmetic — it means two farmers sharing one government-facing ID.
- **No role/permission model exists** for the report endpoints (`/api/reports/*`) to check against, even though they're meant to be restricted to "an authorized user." This needs to be designed alongside Sprint 1 auth, since retrofitting roles after Farmer/Firm models are fixed is more churn.
- **JWT storage in localStorage** is a reasonable MVP default but is worth a conscious tradeoff conversation given the data involved (farmer names, phone numbers, addresses feeding government planning) — an httpOnly cookie is the safer default if that matters to the client.
- **Rent-vs-purchase display is marked low priority** in the open questions, but it actually determines the shape of the `ProductCard` component being built in Sprint 3 (badge-only vs. badge-plus-price). It should be resolved before Sprint 3, regardless of its priority label.
- **Catalog data source** (Sprint 3) defaults to hardcoded frontend mock data unless made dynamic. Fine for MVP, but means every future drone/price change is a code deploy, not a content edit — worth flagging as a tradeoff, not a silent default.

## 5. Current state of the actual workspace

As of 2026-08-18, `e:\Nkem` contains no code — no `/client`, no `/server`, nothing scaffolded. Everything above is understanding derived from the two documentation passes the client provided, not from an existing codebase. Sprint 0 (project setup) has not been started.

## 6. Open questions — carried over, with the one addition

From the client spec, unresolved and blocking as noted:

| # | Question | Blocks |
|---|----------|--------|
| ~~1~~ | ~~Exact spelling/meaning of "CDC tolerance" and "Jitu SAP"~~ — **Resolved 2026-08-19**: confirmed firm list is CDC, CDC Tole, CDC Jitu SAP, SOWEDA, Del Monte / Plantations Haut Penja (PHP), Agro-Hub Southwest, OTAFARMS Southwest, Not affiliated (South West Region agricultural firms/estates). | Resolved |
| 2 | Can unaffiliated farmers request services? Who fulfills them if so? | Sprint 2 |
| 3 | Does the farmer ID need real firm verification, or is auto-generated reference enough? | Sprint 2 |
| 4 | Who consumes aggregated regional data, and in what format? | Sprint 5 |
| 5 | Is the website URL shown in the footer? | Low — cosmetic only |
| 6 | Are product photos client-supplied or need sourcing? | Sprint 3 |
| 7 | Does rent-vs-purchase affect pricing display, or is it label-only? | Sprint 3 (component shape) |
| 8 *(added)* | How does a firm actually receive/act on a routed request — dashboard, email, manual process? | Sprint 2 — currently undesigned entirely |

---

*This file reflects my understanding as of the conversation on 2026-08-18. If the client answers any of the open questions above, this file (and the sprint plan) should be updated before the corresponding sprint starts.*
