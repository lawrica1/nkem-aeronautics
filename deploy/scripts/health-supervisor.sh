#!/usr/bin/env bash
set -u

check_service() {
  local service="$1"
  local url="$2"

  if curl --fail --silent --show-error --max-time 10 "$url" >/dev/null; then
    echo "$service health check passed."
    return 0
  fi

  echo "$service health check failed; restarting service." >&2
  systemctl restart "$service"

  local attempt
  for attempt in {1..20}; do
    if curl --fail --silent --max-time 5 "$url" >/dev/null; then
      echo "$service recovered after restart."
      return 0
    fi
    sleep 1
  done

  echo "$service remains unhealthy after restart." >&2
  systemctl status "$service" --no-pager >&2 || true
  return 1
}

status=0
check_service nkem-backend http://127.0.0.1:5000/health || status=1
check_service nkem-frontend http://127.0.0.1:3000/ || status=1
exit "$status"
