# VPS Deployment

The production VPS runs two private application processes behind Nginx:

- Next.js frontend on `127.0.0.1:3000`.
- Express backend on `127.0.0.1:5000`.

Only Nginx ports 80 and 443 are public. PostgreSQL and object storage remain
managed by Neon, and outbound email is delivered through Brevo.

## Configuration

Secrets stay outside Git:

- `client/.env.production` contains `NEXT_PUBLIC_API_URL`.
- `server/.env` contains backend credentials and production settings.

Both files must be owned by `deploy` with mode `600`.

## Service Installation

Copy the unit templates from `deploy/systemd/` into `/etc/systemd/system/`, then
run `systemctl daemon-reload` and enable the services. Install the frontend and
API Nginx sites independently from `deploy/nginx/`, validate with `nginx -t`,
and obtain certificates with Certbot. Keeping the sites separate prevents a
change to one service from replacing the other's certificate configuration.

## Frontend Deployment

After pulling an approved commit, run `deploy/scripts/build-frontend.sh`. The
script performs a clean dependency install, creates the standalone build, copies
static assets into its runtime directory, restarts the service, and verifies the
local HTTP endpoint.

Backend deployments use `npm ci`, `npm run prisma:generate`, the relevant
integration checks, and a controlled `systemctl restart nkem-backend`.
