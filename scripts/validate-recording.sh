#!/bin/bash

echo "Validating recording lifecycle..."

ERRORS=0

# Check useVideoPlayer is imported in VideoTemplate
if grep -q "useVideoPlayer" src/components/video/VideoTemplate.tsx; then
  echo "✓ useVideoPlayer used in VideoTemplate"
else
  echo "✗ useVideoPlayer NOT found in VideoTemplate"
  ERRORS=$((ERRORS + 1))
fi

# Check hooks.ts exists and has startRecording
if grep -q "startRecording" src/lib/video/hooks.ts; then
  echo "✓ startRecording call found in hooks.ts"
else
  echo "✗ startRecording NOT found in hooks.ts"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "stopRecording" src/lib/video/hooks.ts; then
  echo "✓ stopRecording call found in hooks.ts"
else
  echo "✗ stopRecording NOT found in hooks.ts"
  ERRORS=$((ERRORS + 1))
fi

# Check photos exist
PHOTO_COUNT=$(ls public/photos/*.jpeg 2>/dev/null | wc -l)
if [ "$PHOTO_COUNT" -gt "0" ]; then
  echo "✓ Found $PHOTO_COUNT photos in public/photos/"
else
  echo "✗ No photos found in public/photos/"
  ERRORS=$((ERRORS + 1))
fi

# Check AnimatePresence is used
if grep -q "AnimatePresence" src/components/video/VideoTemplate.tsx; then
  echo "✓ AnimatePresence found in VideoTemplate"
else
  echo "✗ AnimatePresence NOT found in VideoTemplate"
  ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
  echo ""
  echo "All checks passed!"
  exit 0
else
  echo ""
  echo "$ERRORS check(s) failed."
  exit 1
fi
