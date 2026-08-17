#!/usr/bin/env bash
# Integration test: ApiGate <-> Open5GS (isp.router-dashboard)
set -euo pipefail

API="${APIGATE_URL:-http://localhost:4000}"
WEBUI="${OPEN5GS_WEBUI_URL:-http://localhost:9999}"
EMAIL="${TEST_EMAIL:-user@test.com}"
PASSWORD="${TEST_PASSWORD:-Test1234!}"
IMSI="${TEST_IMSI:-001010000000001}"
ICCID="${TEST_ICCID:-8900101000000000001}"

pass() { printf '  PASS  %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; exit 1; }

echo "ApiGate ↔ Open5GS integration tests"
echo "ApiGate: $API"
echo "WebUI:   $WEBUI"
echo

health="$(curl -fsS "$API/health")" || fail "GET $API/health"
echo "$health" | grep -q '"status":"ok"' || fail "ApiGate health payload"
pass "ApiGate /health"

status="$(curl -fsS "$API/open5gs/status")" || fail "GET $API/open5gs/status"
echo "$status" | grep -q '"core":"open5gs"' || fail "Open5GS status payload"
echo "$status" | grep -q '"connected":true' || fail "Open5GS MongoDB not connected"
pass "Open5GS MongoDB connected via ApiGate"

curl -fsS "$WEBUI/api/apigate/health" >/tmp/webui-apigate-health.json || fail "Open5GS WebUI → ApiGate /api/apigate/health"
grep -q '"connected":true' /tmp/webui-apigate-health.json || fail "WebUI cannot reach ApiGate"
pass "Open5GS WebUI /api/apigate/health"

curl -fsS -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  >/tmp/apigate-login.json || fail "ApiGate login"
TOKEN="$(python3 -c 'import json; print(json.load(open("/tmp/apigate-login.json"))["access_token"])')"
[ -n "$TOKEN" ] || fail "Missing access token"
pass "ApiGate login"

activate="$(curl -sS -o /tmp/apigate-activate.json -w '%{http_code}' -X POST "$API/sim/activate" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"iccid\":\"$ICCID\",\"imsi\":\"$IMSI\",\"apn\":\"internet\"}")"
if [ "$activate" != "200" ] && [ "$activate" != "409" ]; then
  cat /tmp/apigate-activate.json
  fail "SIM activate HTTP $activate"
fi
pass "SIM activate / already provisioned ($activate)"

sub="$(curl -fsS "$API/open5gs/subscribers/$IMSI" -H "Authorization: Bearer $TOKEN")" || fail "GET subscriber $IMSI"
echo "$sub" | grep -q "$IMSI" || fail "Subscriber $IMSI missing from Open5GS"
pass "Open5GS subscriber $IMSI visible through ApiGate"

echo
echo "All integration checks passed."
