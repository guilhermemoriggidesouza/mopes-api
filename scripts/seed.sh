#!/usr/bin/env bash
set -euo pipefail

# Seed script that uses HTTP API (curl) to create categories, teams and championships.
# Requires: curl, jq

BASE_URL=${BASE_URL:-http://localhost:3000}

if ! command -v curl >/dev/null; then
  echo "curl is required"
  exit 1
fi

if ! command -v jq >/dev/null; then
  echo "jq is required to parse JSON. Install it and re-run."
  exit 1
fi

echo "Seeding API at $BASE_URL"

echo "Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/user" \
  -H "Content-Type: application/json" \
  -d '{"name":"Seed Admin","login":"seed_admin","email":"seed_admin@example.com","password":"root","role":"admin"}')
echo "$ADMIN_RESPONSE" | jq . >/dev/null || true

echo "Logging in as admin..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"login":"seed_admin","password":"root"}' | jq -r '.access_token')
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Failed to obtain token. Response:"
  curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"login":"seed_admin","password":"root"}' | jq .
  exit 1
fi

AUTH="Authorization: Bearer $TOKEN"

echo "Creating categories..."
CAT_BASKET=$(curl -s -X POST "$BASE_URL/categoryGame" -H "Content-Type: application/json" -H "$AUTH" -d '{"name":"basket"}')
CAT_FUTEBOL=$(curl -s -X POST "$BASE_URL/categoryGame" -H "Content-Type: application/json" -H "$AUTH" -d '{"name":"futebol"}')
CAT_BASKET_ID=$(echo "$CAT_BASKET" | jq -r '.id')
CAT_FUTEBOL_ID=$(echo "$CAT_FUTEBOL" | jq -r '.id')

echo "Created categories: basket=$CAT_BASKET_ID futebol=$CAT_FUTEBOL_ID"

echo "Creating teams..."
TEAM1=$(curl -s -X POST "$BASE_URL/team" -H "Content-Type: application/json" -H "$AUTH" -d '{"name":"Seed Team A","sex":"M","city":"SeedCity"}')
TEAM2=$(curl -s -X POST "$BASE_URL/team" -H "Content-Type: application/json" -H "$AUTH" -d '{"name":"Seed Team B","sex":"M","city":"SeedCity"}')
TEAM1_ID=$(echo "$TEAM1" | jq -r '.id')
TEAM2_ID=$(echo "$TEAM2" | jq -r '.id')
echo "Created teams: $TEAM1_ID, $TEAM2_ID"

echo "Creating championships..."
# minimal championship payload: name, categoryId, gamePerKeys, keys, blankGames
CHAMP1_PAYLOAD=$(jq -nc --arg name "Seed Championship Basket" --argjson catId $CAT_BASKET_ID '{name: $name, categoryId: $catId, gamePerKeys: 1, keys: 1, blankGames: 0}')
CHAMP2_PAYLOAD=$(jq -nc --arg name "Seed Championship Futebol" --argjson catId $CAT_FUTEBOL_ID '{name: $name, categoryId: $catId, gamePerKeys: 1, keys: 1, blankGames: 0}')

CHAMP1=$(curl -s -X POST "$BASE_URL/championship" -H "Content-Type: application/json" -H "$AUTH" -d "$CHAMP1_PAYLOAD")
CHAMP2=$(curl -s -X POST "$BASE_URL/championship" -H "Content-Type: application/json" -H "$AUTH" -d "$CHAMP2_PAYLOAD")
CHAMP1_ID=$(echo "$CHAMP1" | jq -r '.id')
CHAMP2_ID=$(echo "$CHAMP2" | jq -r '.id')

echo "Created championships: $CHAMP1_ID, $CHAMP2_ID"

echo "Done."
echo "Summary:"
echo "  Admin login: seed_admin / root"
echo "  Categories: basket=$CAT_BASKET_ID, futebol=$CAT_FUTEBOL_ID"
echo "  Teams: $TEAM1_ID, $TEAM2_ID"
echo "  Championships: $CHAMP1_ID, $CHAMP2_ID"

exit 0
