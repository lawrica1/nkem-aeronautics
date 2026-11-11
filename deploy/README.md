# VPS Deployment

The production VPS runs two private application processes behind Nginx:

- Next.js frontend on `127.0.0.1:3000`.
- Express backend on `127.0.0.1:5000`.

Only Nginx ports 80 and 443 are public. PostgreSQL and object storage remain
managed by Neon, and outbound email is delivered through Brevo.

Production releases are immutable directories under
`/var/www/nkem-aeronautics-runtime/releases/<commit>`. Both services run through
the atomic `/var/www/nkem-aeronautics-runtime/current` symlink. Secrets remain
outside each release in `/var/www/nkem-aeronautics-runtime/shared`.

## Configuration

Secrets stay outside Git in shared files:

- `/var/www/nkem-aeronautics-runtime/shared/client.env.production` contains the
  public frontend build configuration.
- `/var/www/nkem-aeronautics-runtime/shared/server.env` contains backend
  credentials and production settings.

Both files must be owned by `deploy` with mode `600`.

## One-time Release Migration

After pulling the commit that introduces the release scripts, run this once in
an interactive `deploy` SSH session:

```bash
cd /var/www/nkem-aeronautics
chmod +x deploy/scripts/*.sh
./deploy/scripts/bootstrap-release-layout.sh
```

The bootstrap copies the current environment files into the protected shared
directory, installs release-aware systemd units, installs a sudo rule that can
restart only the two application services, and deploys the checked-out commit.
Keep the original terminal open until the final health checks pass.

## Service Installation

Copy the unit templates from `deploy/systemd/` into `/etc/systemd/system/`, then
run `systemctl daemon-reload` and enable the services. Install the frontend and
API Nginx sites independently from `deploy/nginx/`, validate with `nginx -t`,
and obtain certificates with Certbot. Keeping the sites separate prevents a
change to one service from replacing the other's certificate configuration.

## GitHub Production Environment

Create a GitHub Actions environment named `production`. Add these environment
variables:

```text
VPS_HOST=159.198.39.233
VPS_PORT=22022
VPS_USER=deploy
```

Add these environment secrets:

- `VPS_SSH_PRIVATE_KEY`: a dedicated CI deployment private key. Do not reuse a
  developer laptop key.
- `VPS_SSH_KNOWN_HOSTS`: the verified SSH host-key line for port `22022`.

Append the matching CI public key to `/home/deploy/.ssh/authorized_keys` on the
VPS with a forced command and SSH restrictions. Replace the final key text with
the CI public key:

```text
restrict,command="/usr/local/sbin/nkem-github-deploy" ssh-ed25519 AAAA... nkem-github-actions
```

This key cannot open a shell or run arbitrary commands. Protect the
`production` environment with required reviewers when the GitHub plan supports
it.

On every push to `main`, CI tests both applications first. The deployment job
then fetches and deploys the exact tested commit. The VPS serializes releases
with `flock`, checks local and public health endpoints, and rolls back the
`current` symlink if validation fails.

Prisma schema changes are intentionally rejected by unattended deployment. The
repository does not yet contain reviewed Prisma migrations, so a schema change
must first be converted to a migration and deployed through a separately
reviewed database procedure.

## Manual Deployment

To deploy an exact commit already available in the VPS repository:

```bash
cd /var/www/nkem-aeronautics
git fetch origin main
./deploy/scripts/deploy-production.sh "$(git rev-parse origin/main)"
```

For troubleshooting only, `deploy/scripts/build-frontend.sh` retains the old
in-place frontend build procedure. Normal releases must use
`deploy-production.sh` so validation and rollback remain active.

`deploy/scripts/smoke-production.sh` can be run independently. It checks the public
frontend, canonical redirect, API health, CORS boundary, protected admin route,
and the absence of public admin signup without creating production data.
