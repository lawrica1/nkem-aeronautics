#!/usr/bin/env bash
set -Eeuo pipefail

repository="/var/www/nkem-aeronautics"
cd "$repository"

sudo install -o root -g root -m 755 \
  deploy/scripts/health-supervisor.sh \
  /usr/local/sbin/nkem-health-supervisor
sudo install -o root -g root -m 644 \
  deploy/systemd/nkem-healthcheck.service \
  /etc/systemd/system/nkem-healthcheck.service
sudo install -o root -g root -m 644 \
  deploy/systemd/nkem-healthcheck.timer \
  /etc/systemd/system/nkem-healthcheck.timer
sudo install -o root -g root -m 644 \
  deploy/systemd/nkem-backend.service \
  /etc/systemd/system/nkem-backend.service
sudo install -o root -g root -m 644 \
  deploy/systemd/nkem-frontend.service \
  /etc/systemd/system/nkem-frontend.service

sudo install -d -o root -g systemd-journal -m 2755 /var/log/journal
sudo install -d -o root -g root -m 755 /etc/systemd/journald.conf.d
sudo install -o root -g root -m 644 \
  deploy/systemd/60-nkem-journal.conf \
  /etc/systemd/journald.conf.d/60-nkem-journal.conf

sudo systemctl daemon-reload
sudo systemctl restart systemd-journald
sudo systemctl enable --now nkem-healthcheck.timer
sudo systemctl start nkem-healthcheck.service

echo "Observability installation completed."
systemctl list-timers nkem-healthcheck.timer --no-pager
