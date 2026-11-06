#!/usr/bin/env bash
set -euo pipefail

client_dir="/var/www/nkem-aeronautics/client"

cd "$client_dir"
test -f .env.production

npm ci
npm run build

rm -rf .next/standalone/public .next/standalone/.next/static
cp -a public .next/standalone/public
mkdir -p .next/standalone/.next
cp -a .next/static .next/standalone/.next/static

sudo systemctl restart nkem-frontend

for attempt in {1..30}; do
  if curl --fail --silent http://127.0.0.1:3000/ >/dev/null; then
    echo "Frontend build deployed and health check passed."
    exit 0
  fi

  sleep 1
done

echo "Frontend did not become ready within 30 seconds." >&2
sudo systemctl status nkem-frontend --no-pager || true
exit 1
