#!/usr/bin/env bash
# Push one homepage variant into the running new-api instance as HomePageContent.
#
#   ./branding/push-home.sh openrouter   # branding/home-openrouter.html (default: OpenRouter layout, Omni style)
#   ./branding/push-home.sh lean         # branding/home-lean.html       (editorial hero, trimmed sections)
#   ./branding/push-home.sh editorial    # branding/home-editorial.html  (NONCE-style hero, long form)
#   ./branding/push-home.sh reference    # branding/home-reference.html  (aizhan-style hero)
#   ./branding/push-home.sh path/to.html # any file
#
# Reads the local admin account from .env (LOCAL_ADMIN_USERNAME / LOCAL_ADMIN_PASSWORD).
set -euo pipefail
cd "$(dirname "$0")/.."

case "${1:-openrouter}" in
  openrouter) FILE=branding/home-openrouter.html ;;
  lean) FILE=branding/home-lean.html ;;
  editorial) FILE=branding/home-editorial.html ;;
  reference) FILE=branding/home-reference.html ;;
  *) FILE="$1" ;;
esac
[ -f "$FILE" ] || { echo "no such file: $FILE" >&2; exit 1; }

BASE_URL="${NEW_API_URL:-http://localhost:3000}"
USERNAME="$(grep '^LOCAL_ADMIN_USERNAME=' .env | cut -d= -f2-)"
PASSWORD="$(grep '^LOCAL_ADMIN_PASSWORD=' .env | cut -d= -f2-)"

TOKEN="$(python3 - "$USERNAME" "$PASSWORD" <<'PY' | curl -s -X POST "$BASE_URL/api/user/login" -H 'Content-Type: application/json' -d @- | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["data"]["access_token"]) if d.get("success") else sys.exit("login failed: "+str(d))'
import json, sys
print(json.dumps({"username": sys.argv[1], "password": sys.argv[2]}))
PY
)"

python3 -c 'import json,sys; print(json.dumps({"key": "HomePageContent", "value": open(sys.argv[1]).read()}))' "$FILE" \
  | curl -s -X PUT "$BASE_URL/api/option/" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d @-
echo " <- pushed $FILE"
