#!/usr/bin/env bash
set -Eeuo pipefail

repository="/var/www/nkem-aeronautics"
runtime_dir="/var/www/nkem-aeronautics-runtime"
releases_dir="$runtime_dir/releases"
shared_dir="$runtime_dir/shared"
current_link="$runtime_dir/current"
lock_file="$runtime_dir/deploy.lock"
commit="${1:-}"

if [[ ! "$commit" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Usage: $0 <40-character-git-commit>" >&2
  exit 2
fi

exec 9>"$lock_file"
if ! flock -n 9; then
  echo "Another production deployment is already running." >&2
  exit 1
fi

cd "$repository"
git cat-file -e "${commit}^{commit}"

if ! git merge-base --is-ancestor "$commit" origin/main; then
  echo "Refusing to deploy a commit that is not on origin/main." >&2
  exit 1
fi

test -f "$shared_dir/server.env"
test -f "$shared_dir/client.env.production"

release_dir="$releases_dir/$commit"
previous_release=""
if [[ -L "$current_link" ]]; then
  previous_release="$(readlink -f "$current_link")"
fi

if [[ -n "$previous_release" && -f "$previous_release/server/prisma/schema.prisma" ]]; then
  if ! git diff --quiet "$(basename "$previous_release")" "$commit" -- server/prisma/schema.prisma; then
    echo "Prisma schema changed. Create and review a migration before deploying." >&2
    exit 1
  fi
fi

if [[ ! -d "$release_dir" ]]; then
  staging_dir="${release_dir}.staging"
  rm -rf -- "$staging_dir"
  mkdir -p "$staging_dir"
  git archive "$commit" | tar -x -C "$staging_dir"

  ln -s "$shared_dir/server.env" "$staging_dir/server/.env"
  ln -s "$shared_dir/client.env.production" "$staging_dir/client/.env.production"

  (
    cd "$staging_dir/server"
    npm ci
    npm run prisma:generate
    npm run lint
    npm test
  )

  (
    cd "$staging_dir/client"
    npm ci
    NEXT_TELEMETRY_DISABLED=1 npm run build
    rm -rf .next/standalone/public .next/standalone/.next/static
    cp -a public .next/standalone/public
    mkdir -p .next/standalone/.next
    cp -a .next/static .next/standalone/.next/static
  )

  mv "$staging_dir" "$release_dir"
fi

activate_release() {
  local target="$1"
  ln -sfn "$target" "${current_link}.next"
  mv -Tf "${current_link}.next" "$current_link"
  sudo systemctl restart nkem-backend nkem-frontend
}

wait_for_local_services() {
  local attempt
  for attempt in {1..45}; do
    if curl --fail --silent http://127.0.0.1:5000/health >/dev/null \
      && curl --fail --silent http://127.0.0.1:3000/ >/dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}

deployment_ok=true
if ! activate_release "$release_dir"; then
  deployment_ok=false
elif ! wait_for_local_services; then
  deployment_ok=false
elif ! "$release_dir/deploy/scripts/smoke-production.sh"; then
  deployment_ok=false
fi

if [[ "$deployment_ok" != true ]]; then
  echo "Deployment validation failed." >&2
  sudo systemctl status nkem-backend nkem-frontend --no-pager || true

  if [[ -n "$previous_release" && -d "$previous_release" ]]; then
    echo "Rolling back to $(basename "$previous_release")." >&2
    activate_release "$previous_release"
    if ! wait_for_local_services; then
      echo "Rollback services did not become healthy." >&2
    fi
  else
    echo "No previous release is available for automatic rollback." >&2
  fi
  exit 1
fi

echo "Production deployment succeeded: $commit"

# Keep the active release and one immediate fallback. Release directory names
# are full Git SHAs, so unrelated paths can never enter this cleanup set.
mapfile -t expired_releases < <(
  find "$releases_dir" -mindepth 1 -maxdepth 1 -type d \
    -regextype posix-extended -regex '.*/[0-9a-f]{40}' \
    -printf '%T@ %p\n' \
    | sort -rn \
    | tail -n +3 \
    | cut -d' ' -f2-
)

for expired_release in "${expired_releases[@]}"; do
  if [[ "$expired_release" == "$releases_dir"/[0-9a-f]* \
    && "$expired_release" != "$(readlink -f "$current_link")" ]]; then
    echo "Removing expired release: $(basename "$expired_release")"
    rm -rf -- "$expired_release"
  fi
done
