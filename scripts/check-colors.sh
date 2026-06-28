#!/bin/bash
# Brand Color Audit Script
# Run: bash scripts/check-colors.sh
# Fails with exit code 1 if off-brand Tailwind color classes are found.

set -e

SRC_DIRS="app components lib"

# Tailwind semantic color classes that are banned
BANNED_PATTERNS=(
  "bg-blue-"
  "text-blue-"
  "border-blue-"
  "bg-gray-"
  "text-gray-"
  "border-gray-"
  "bg-purple-"
  "text-purple-"
  "border-purple-"
  "bg-indigo-"
  "text-indigo-"
  "border-indigo-"
  "bg-red-"
  "text-red-"
  "border-red-"
  "bg-yellow-"
  "text-yellow-"
  "border-yellow-"
  "bg-green-"
  "text-green-"
  "border-green-"
  "bg-emerald-"
  "text-emerald-"
  "border-emerald-"
  "bg-orange-"
  "text-orange-"
  "border-orange-"
  "bg-pink-"
  "text-pink-"
  "border-pink-"
  "bg-violet-"
  "text-violet-"
  "border-violet-"
  "from-blue-"
  "from-gray-"
  "from-purple-"
  "from-indigo-"
  "from-red-"
  "from-yellow-"
  "from-green-"
  "from-emerald-"
  "to-blue-"
  "to-gray-"
  "to-purple-"
  "to-indigo-"
  "to-red-"
  "to-yellow-"
  "to-green-"
  "to-emerald-"
  "shadow-xl"
  "shadow-2xl"
  "shadow-3xl"
)

FOUND=0

echo "🎨 Brand Color Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for pattern in "${BANNED_PATTERNS[@]}"; do
  # Search TSX and TS files; exclude node_modules
  matches=$(rg --glob "*.tsx" --glob "*.ts" --glob "*.css" \
    --ignore-file .gitignore \
    -l "$pattern" $SRC_DIRS 2>/dev/null || true)

  if [ -n "$matches" ]; then
    echo ""
    echo "❌  Found '$pattern' in:"
    echo "$matches" | while read -r file; do
      rg -n "$pattern" "$file" | head -5 | sed "s|^|   $file:|"
    done
    FOUND=1
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FOUND" -eq 0 ]; then
  echo "✅  All clear — no off-brand colors detected."
  exit 0
else
  echo "🚨  Fix the above before committing."
  echo "   Replace with brand hex values from .cursor/rules/brand-colors.mdc"
  exit 1
fi
