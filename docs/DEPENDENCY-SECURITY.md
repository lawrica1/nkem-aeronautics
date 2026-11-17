# Dependency Security Review

**Reviewed:** 2026-11-12

## Applied Updates

The production dependency review removed all known critical findings and the
remotely exposed high-severity findings identified at review time.

Backend updates include:

- Patched `body-parser`, `proxy-addr`, and `qs` in the Express dependency tree.
- Patched Multer upload teardown handling.
- Patched Morgan log-field escaping.
- Patched Nodemailer address parsing and transport handling.
- Forced the patched `uuid` and `qs` transitive versions after compatibility
  checks against Excel export and Express.

Frontend updates include:

- Updated Next.js from 16.3.1 to 16.4.6.
- Updated Sharp and the Shadcn/Undici build toolchain.
- Removed unused AWS SDK packages from the browser application.
- Moved Shadcn and Tailwind to development dependencies because they are build
  inputs rather than production server runtime packages.

At verification time, `npm audit --omit=dev` reported zero findings for the
frontend production tree. The backend had no critical findings and no remaining
remotely exposed application-library findings.

## Accepted Residual Finding

Prisma 6.19.3 includes a high-severity `deepmerge-ts` advisory in its
configuration CLI. npm only offers Prisma 7 as the automatic correction, which
is a breaking ORM migration. The application does not accept Prisma
configuration from HTTP requests; deployment invokes the CLI against the
repository-owned schema and environment configuration.

This is accepted temporarily as a local/deployment-tool risk. Prisma must be
upgraded through a dedicated migration that reviews its major-version changes,
regenerates the client, validates the Neon connection behavior, and runs the
full backend test suite. `npm audit fix --force` must not be used as a shortcut.

The full frontend development audit also reports `deepmerge` and `minimatch`
through the Shadcn CLI and its `ts-morph` registry tooling. They are excluded
from the production dependency tree and are not loaded by the running Next.js
server. npm's proposed forced correction is an incompatible downgrade to
Shadcn 1.0, so these build-time findings remain pending upstream fixes. Shadcn
must only process repository-controlled component definitions.

## Continuous Enforcement

CI runs a production-only npm audit for both applications and blocks deployment
when a critical advisory is present. High and moderate findings still require
human review because build tools and unreachable transitive code can otherwise
create noisy or unsafe forced upgrades.
