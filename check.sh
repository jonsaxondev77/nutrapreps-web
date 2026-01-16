#!/bin/bash

echo "--- 🛡️ Starting Project Security Scan (Jan 2026) ---"

# 1. Check for React2Shell (CVE-2025-55182) vulnerable versions
echo "[1/3] Checking React & Next.js versions..."

NEXT_VER=$(node -p "require('./package.json').dependencies.next || 'not found'")
REACT_VER=$(node -p "require('./package.json').dependencies.react || 'not found'")

echo "Found Next.js: $NEXT_VER"
echo "Found React: $REACT_VER"

# Simple regex check for known vulnerable Next.js 16/15 ranges
if [[ "$NEXT_VER" =~ 16.0.[0-6] ]] || [[ "$NEXT_VER" =~ 15.[0-5].[0-6] ]]; then
  echo "⚠️  CRITICAL: Vulnerable Next.js version detected (React2Shell). Update to 16.0.7+ or 15.5.7+ immediately."
else
  echo "✅ Next.js version appears patched for React2Shell."
fi

# 2. Scan for Shai-Hulud 2.0 Malware Indicators
echo "[2/3] Scanning for malicious supply-chain files..."

# These files were used by the Shai-Hulud worm to exfiltrate secrets
MALICIOUS_FILES=("setup_bun.js" "bun_environment.js" "cloud.json" "truffleSecrets.json" "environment.json")
FOUND_MALICE=0

for file in "${MALICIOUS_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🚨 ALERT: Malicious file found: $file"
    FOUND_MALICE=1
  fi
done

# Check for the hidden backdoor workflow
if [ -f ".github/workflows/discussion.yaml" ]; then
  echo "🚨 ALERT: Suspicious GitHub workflow found: .github/workflows/discussion.yaml (Possible Shai-Hulud backdoor)"
  FOUND_MALICE=1
fi

if [ $FOUND_MALICE -eq 0 ]; then
  echo "✅ No obvious Shai-Hulud malware files detected."
fi

# 3. Check for Suspicious 'preinstall' scripts
echo "[3/3] Auditing package.json scripts..."
PREINSTALL=$(node -p "require('./package.json').scripts.preinstall || 'none'")

if [[ "$PREINSTALL" != "none" ]]; then
  echo "⚠️  Note: Found preinstall script: '$PREINSTALL'. Manually verify this is not executing unknown binaries."
else
  echo "✅ No preinstall scripts found."
fi

echo "--- Scan Complete ---"