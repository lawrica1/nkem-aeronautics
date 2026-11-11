#!/usr/bin/env bash
set -u

runtime_dir="/var/www/nkem-aeronautics-runtime"

echo "== Active release =="
if [[ -L "$runtime_dir/current" ]]; then
  readlink -f "$runtime_dir/current"
else
  echo "No active release symlink found."
fi

echo
echo "== Application services =="
systemctl --no-pager --full status nkem-backend nkem-frontend || true

echo
echo "== Health supervisor =="
systemctl --no-pager --full status nkem-healthcheck.timer || true

echo
echo "== Local endpoints =="
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:5000/health || true
echo
curl --fail --silent --show-error --max-time 10 -o /dev/null \
  -w 'frontend_status=%{http_code}\n' http://127.0.0.1:3000/ || true

echo
echo "== Capacity =="
free -h
df -h /

echo
echo "== TLS certificates =="
for domain in nkemaeronautics.com api.nkemaeronautics.com; do
  printf '%s: ' "$domain"
  timeout 15 openssl s_client -connect "$domain:443" -servername "$domain" \
    </dev/null 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null \
    || echo "certificate check failed"
done

echo
echo "== Recent application errors =="
journalctl -p warning -u nkem-backend -u nkem-frontend -u nkem-healthcheck \
  --since "24 hours ago" --no-pager -n 50 || true
