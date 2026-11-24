# Defense Subdomain Handoff

**Host:** `defense.nkemaeronautics.com`
**Purpose:** Isolated deployment target for the future Nkem Aeronautics defense
application.
**Scope:** This setup does not implement the defense application or the affiliate
program.

## Current Hosting

- VPS public IPv4: `159.198.39.233`
- SSH port: `22022`
- Web entry point: Nginx on ports 80 and 443
- Defense web root: `/var/www/nkem-defense/public`
- Nginx site: `/etc/nginx/sites-available/nkem-defense`
- Initial serving mode: static holding page
- Main website and API remain isolated on ports `3000` and `5000`

The holding page includes `noindex, nofollow` so it is not intended to appear in
search results while development is pending.

## DNS Record

In Cloudflare DNS for `nkemaeronautics.com`, create one record:

| Field | Value |
|---|---|
| Type | `A` |
| Name | `defense` |
| IPv4 address | `159.198.39.233` |
| Proxy status | `DNS only` initially |
| TTL | `Auto` |

Do not create a CNAME with the same `defense` hostname. After saving, verify from
Windows PowerShell:

```powershell
Resolve-DnsName defense.nkemaeronautics.com
```

The returned A record must be `159.198.39.233`.

## One-Time VPS Installation

After this repository commit is deployed, connect as the existing `deploy` user
and run:

```bash
cd /var/www/nkem-aeronautics
git pull --ff-only origin main
./deploy/scripts/install-defense-subdomain.sh
```

Once DNS resolves to the VPS, issue the certificate:

```bash
sudo certbot --nginx \
  -d defense.nkemaeronautics.com \
  --email nkemaeronautics@gmail.com \
  --agree-tos \
  --no-eff-email \
  --redirect
```

Validate the completed setup:

```bash
sudo nginx -t
curl -I https://defense.nkemaeronautics.com
sudo certbot renew --dry-run
```

Expected result: HTTPS returns `200`, HTTP redirects to HTTPS, and the renewal
simulation succeeds.

## Information for the Next Developer

The defense application must remain operationally separate from the existing
website. Do not place its source code inside the current frontend runtime or
reuse the main application's systemd service.

Recommended deployment choices:

1. For a static application, publish its build output to
   `/var/www/nkem-defense/public` and retain the existing Nginx configuration.
2. For Next.js or another server-rendered application, create a dedicated
   systemd service bound to `127.0.0.1:3100`, then replace the static `location
   /` block with an Nginx reverse proxy to `http://127.0.0.1:3100`.
3. Keep the application in its own repository, release directory, environment
   file, CI/CD environment, deployment key, and health check.

Do not share the existing laptop or GitHub Actions private keys. Provision a
separate restricted deployment key or a named non-root VPS user for the new
developer.

## Existing Platform Integration

- Existing API base URL: `https://api.nkemaeronautics.com/api`
- Existing production frontend: `https://nkemaeronautics.com`
- Existing database: Neon PostgreSQL accessed only by the Express backend
- Existing object storage: private Neon Object Storage bucket

The defense frontend must never receive a database URL, Prisma credentials,
storage secret key, JWT secret, or email API key. Browser code should call an
authenticated backend API instead.

The current API CORS allowlist does not automatically authorize the defense
origin. If the defense application needs the existing API, add
`https://defense.nkemaeronautics.com` through a reviewed backend configuration
change and verify authentication and role authorization first. Do not broaden
CORS to `*`.

If defense data has different sensitivity or access requirements, create a
separate backend module and least-privilege Neon database role or schema rather
than giving another application unrestricted access to the existing production
database.

## Handoff Checklist

- DNS resolves to `159.198.39.233`.
- HTTPS certificate is active and renews successfully.
- Nginx serves only the defense web root for this hostname.
- New developer has named/restricted access, not shared credentials.
- New repository and deployment pipeline are documented.
- Environment secrets remain outside Git.
- API CORS and role permissions are reviewed before integration.
- External uptime monitoring is added after the real application launches.
