#!/usr/bin/env sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  npx prisma migrate deploy --schema=./prisma/schema.prisma
fi

exec node dist/index.js
