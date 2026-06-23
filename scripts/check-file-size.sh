#!/usr/bin/env bash
#
# Pre-commit guard: inspect staged files before they reach GitHub.
#   - WARN  at 50 MB  (GitHub shows a warning above this size)
#   - BLOCK at 100 MB (GitHub hard-rejects files above this size)
#
# Install as a git hook (run once, from the repo root):
#   ln -sf ../../scripts/check-file-size.sh .git/hooks/pre-commit
#   chmod +x scripts/check-file-size.sh
#
# To commit despite a block (use sparingly):
#   git commit --no-verify
#
set -euo pipefail

WARN_MB=50
BLOCK_MB=100
warn_bytes=$(( WARN_MB * 1024 * 1024 ))
block_bytes=$(( BLOCK_MB * 1024 * 1024 ))

blocked=0

while IFS= read -r -d '' file; do
  [ -f "$file" ] || continue
  size=$(wc -c < "$file")
  mb=$(( size / 1024 / 1024 ))
  if [ "$size" -gt "$block_bytes" ]; then
    echo "BLOCK: $file is ${mb} MB (over ${BLOCK_MB} MB; GitHub will reject it)"
    blocked=1
  elif [ "$size" -gt "$warn_bytes" ]; then
    echo "WARN:  $file is ${mb} MB (over ${WARN_MB} MB GitHub warning threshold)"
  fi
done < <(git diff --cached --name-only -z --diff-filter=ACM)

if [ "$blocked" -eq 1 ]; then
  echo ""
  echo "Commit stopped: one or more files exceed ${BLOCK_MB} MB."
  echo "Compress the file, or set up Git LFS (see WORKFLOW.md)."
  echo "Override (not recommended): git commit --no-verify"
  exit 1
fi

exit 0
