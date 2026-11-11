#!/usr/bin/env bash
set -Eeuo pipefail

repository="/var/www/nkem-aeronautics"
runtime_dir="/var/www/nkem-aeronautics-runtime"
shared_dir="$runtime_dir/shared"

cd "$repository"
test -f server/.env
test -f client/.env.production

sudo install -d -o deploy -g deploy -m 750 \
  "$runtime_dir" \
  "$runtime_dir/releases" \
  "$shared_dir"
install -m 600 server/.env "$shared_dir/server.env"
install -m 600 client/.env.production "$shared_dir/client.env.production"

sudo install -o root -g root -m 644 \
  deploy/systemd/nkem-backend.service \
  /etc/systemd/system/nkem-backend.service
sudo install -o root -g root -m 644 \
  deploy/systemd/nkem-frontend.service \
  /etc/systemd/system/nkem-frontend.service

sudo tee /etc/sudoers.d/nkem-deployment >/dev/null <<'EOF'
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart nkem-backend nkem-frontend
EOF
sudo chmod 440 /etc/sudoers.d/nkem-deployment
sudo visudo -cf /etc/sudoers.d/nkem-deployment
sudo install -o root -g root -m 755 \
  deploy/scripts/github-deploy-command.sh \
  /usr/local/sbin/nkem-github-deploy
sudo systemctl daemon-reload

deploy/scripts/install-observability.sh

commit="$(git rev-parse HEAD)"
exec deploy/scripts/deploy-production.sh "$commit"
