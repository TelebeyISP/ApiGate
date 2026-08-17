#!/usr/bin/env bash
set -euo pipefail
chmod +x "$(dirname "$0")/test-open5gs-apigate.sh" 2>/dev/null || true

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "Starting postgres, redis, mongo, Open5GS WebUI, ApiGate, and dashboard..."
docker compose up -d --build

echo "Waiting for ApiGate health..."
for i in $(seq 1 60); do
  if curl -fsS http://localhost:4000/health >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

docker compose exec -T backend-api node -e "console.log('api container up')" >/dev/null 2>&1 || true

echo "Seeding demo users/plans if needed..."
(
  cd telebey-platform/apps/api
  DB_HOST=localhost DB_USERNAME=telebey_user DB_USER=telebey_user DB_PASSWORD=telebey_pass DB_NAME=telebey_db \
    npm run seed --silent || true
)

echo
echo "Dashboard:        http://localhost:3000"
echo "ApiGate:          http://localhost:4000"
echo "Swagger:          http://localhost:4000/api/docs"
echo "Open5GS WebUI:    http://localhost:9999  (admin / 1423 in dev)"
echo
echo "Run ./scripts/test-open5gs-apigate.sh to verify the link."
