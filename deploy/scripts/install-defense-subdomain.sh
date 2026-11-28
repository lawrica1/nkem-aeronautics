#!/usr/bin/env bash
set -Eeuo pipefail

repository="/var/www/nkem-aeronautics"
site_root="/var/www/nkem-defense/public"
site_available="/etc/nginx/sites-available/nkem-defense"
site_enabled="/etc/nginx/sites-enabled/nkem-defense"

cd "$repository"

sudo install -d -o deploy -g deploy -m 755 "$site_root"
sudo install -o deploy -g deploy -m 644 \
  deploy/defense/index.html \
  "$site_root/index.html"
sudo install -o root -g root -m 644 \
  deploy/nginx/nkem-defense.conf \
  "$site_available"
sudo ln -sfn "$site_available" "$site_enabled"

sudo nginx -t
sudo systemctl reload nginx

echo "Defense HTTP site installed."
echo "Next: point defense.nkemaeronautics.com to this VPS and issue its TLS certificate."
