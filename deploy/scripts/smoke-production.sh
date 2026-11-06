#!/usr/bin/env bash
set -euo pipefail

frontend_url="${FRONTEND_URL:-https://nkemaeronautics.com}"
www_url="${WWW_URL:-https://www.nkemaeronautics.com}"
api_url="${API_URL:-https://api.nkemaeronautics.com}"

expect_status() {
  local expected="$1"
  local url="$2"
  shift 2

  local actual
  actual="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$@" "$url")"
  if [[ "$actual" != "$expected" ]]; then
    echo "Expected HTTP $expected from $url, received $actual." >&2
    return 1
  fi
}

expect_status 200 "$frontend_url/"
expect_status 301 "$www_url/"
expect_status 200 "$api_url/health"
expect_status 404 "$api_url/api/admin/signup" --request POST --header "Content-Type: application/json" --data '{}'
expect_status 401 "$api_url/api/admin/stats"

www_location="$(curl --silent --show-error --head "$www_url/" | tr -d '\r' | awk -F': ' 'tolower($1) == "location" { print $2 }')"
if [[ "$www_location" != "$frontend_url/" ]]; then
  echo "Expected www redirect to $frontend_url/, received ${www_location:-no Location header}." >&2
  exit 1
fi

cors_headers="$(curl --silent --show-error --dump-header - --output /dev/null --header "Origin: $frontend_url" "$api_url/health" | tr -d '\r')"
if ! grep -Fqi "access-control-allow-origin: $frontend_url" <<<"$cors_headers"; then
  echo "Production CORS origin was not returned by the API." >&2
  exit 1
fi

blocked_headers="$(curl --silent --show-error --dump-header - --output /dev/null --header "Origin: https://example.invalid" "$api_url/health" | tr -d '\r')"
if grep -qi '^access-control-allow-origin:' <<<"$blocked_headers"; then
  echo "The API returned a CORS allow-origin header for an untrusted origin." >&2
  exit 1
fi

echo "Production smoke checks passed."
