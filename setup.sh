#!/usr/bin/env bash
set -euo pipefail

# Scaffold outside this existing directory to avoid shadcn's
# "dest already exists" error when the project name is ".".
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
staging_dir="$(mktemp -d "${TMPDIR:-/tmp}/dice-shadcn.XXXXXXXX")"
trap 'rm -rf -- "$staging_dir"' EXIT

npx --yes shadcn@4.21.4 init \
  --template next \
  --base base \
  --preset nova \
  --no-monorepo \
  --name dice \
  --cwd "$staging_dir" \
  --yes

test -f "$staging_dir/dice/package.json"
test -f "$staging_dir/dice/components.json"

shopt -s dotglob nullglob
for source_path in "$staging_dir/dice/"*; do
  name="${source_path##*/}"
  case "$name" in .git|.agents|.codex|.aws) continue ;; esac
  if [[ -e "$project_dir/$name" || -L "$project_dir/$name" ]]; then
    printf 'Cannot copy starter: %s already exists.\n' "$project_dir/$name" >&2
    exit 1
  fi
done

for source_path in "$staging_dir/dice/"*; do
  name="${source_path##*/}"
  case "$name" in .git|.agents|.codex|.aws) continue ;; esac
  cp -a -- "$source_path" "$project_dir/"
done

printf '\nNext.js with Base UI/Nova is ready in %s\nRun: npm run dev\n' "$project_dir"
