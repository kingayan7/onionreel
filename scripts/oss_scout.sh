#!/usr/bin/env bash
set -euo pipefail

# OnionReel OSS Scout (GitHub-only, no Brave)
# Produces a shortlist of candidate repos + licenses.

out="${1:-/Users/adrianissac/.openclaw/workspace/onionreel/OSS_SCOUT_RESULTS.json}"

queries=(
  "bullmq dashboard"
  "job queue dashboard"
  "reactflow"
  "digital asset management"
)

json='{"generatedAt":"'"$(date -u +%FT%TZ)"'","results":[]}'

for q in "${queries[@]}"; do
  r=$(gh search repos "$q" --limit 10 --json fullName,url,description,license,stargazersCount 2>/dev/null || echo '[]')
  json=$(python3 - <<PY
import json,sys
base=json.loads('''$json''')
res=json.loads('''$r''')
base['results'].append({'query':"$q",'repos':res})
print(json.dumps(base, indent=2))
PY
)
done

echo "$json" > "$out"
echo "$out"
