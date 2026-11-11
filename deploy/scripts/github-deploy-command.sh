#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${SSH_ORIGINAL_COMMAND:-}" =~ ^deploy[[:space:]]([0-9a-f]{40})$ ]]; then
  commit="${BASH_REMATCH[1]}"
else
  echo "Only 'deploy <40-character-git-commit>' is permitted." >&2
  exit 2
fi

cd /var/www/nkem-aeronautics
git fetch origin main
exec ./deploy/scripts/deploy-production.sh "$commit"
