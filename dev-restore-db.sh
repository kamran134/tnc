#!/bin/bash
# Runs once, on the very first boot of the postgres-dev container (empty data dir).
# Restores the production snapshot at dev-local/db/tnc_prod.dump into the fresh DB.
# To re-run: `docker compose -f docker-compose.dev.yml down -v` then `up` again.
set -euo pipefail

DUMP=/backup/tnc_prod.dump

if [ ! -f "$DUMP" ]; then
  echo "[restore] $DUMP not found - skipping (empty DB)."
  exit 0
fi

echo "[restore] restoring production snapshot into ${POSTGRES_DB} as ${POSTGRES_USER} ..."
# During init scripts the server listens on the unix socket only (no TCP yet),
# so connect over the socket as the bootstrap superuser.
pg_restore \
  --no-owner --no-privileges --no-acl \
  --exit-on-error \
  --username="${POSTGRES_USER}" \
  --dbname="${POSTGRES_DB}" \
  "$DUMP"
echo "[restore] done."
