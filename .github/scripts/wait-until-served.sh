#!/usr/bin/env bash
# Waits until the given origin serves the entry bundle of the build in dist/, since a Static Web App
# deploy returns before its edge serves the new files. Usage: wait-until-served.sh <origin>
set -euo pipefail

ORIGIN="${1%/}"
MAX_RETRIES=12
SLEEP_SECONDS=10

ENTRY=$(grep -o 'index-[A-Za-z0-9_-]*\.js' dist/index.html | head -1)
if [ -z "$ENTRY" ]; then
  echo "No entry bundle found in dist/index.html"
  exit 1
fi
PATHS="/ /index.html"
if [ -f dist/sw.js ]; then
  PATHS="$PATHS /sw.js"
fi
echo "Expecting $ENTRY on $ORIGIN for $PATHS"

for i in $(seq 1 $MAX_RETRIES); do
  sleep $SLEEP_SECONDS
  STALE=""
  for P in $PATHS; do
    if ! curl -sf "$ORIGIN$P" | grep -q "$ENTRY"; then
      STALE="$STALE $P"
    fi
  done
  if [ -z "$STALE" ]; then
    echo "$ORIGIN serves $ENTRY"
    exit 0
  fi
  echo "Attempt $i: not serving $ENTRY yet on$STALE"
done

echo "$ORIGIN did not serve $ENTRY after $MAX_RETRIES attempts"
exit 1
