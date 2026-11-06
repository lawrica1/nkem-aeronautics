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
curl --fail --silent --show-error http://127.0.0.1:3000/ >/dev/null

echo "Frontend build deployed and health check passed."
