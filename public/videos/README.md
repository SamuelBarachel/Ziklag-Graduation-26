# Video download assets

Add both files below to maximize compatibility:

- `ziklag-class-of-2026-mobile.mp4` (default download for phones)
- `ziklag-class-of-2026-4k.mp4` (optional original quality download)

## Phone-compatible export settings

Use H.264 video + AAC audio in an `.mp4` container with `+faststart` so iPhone and Android can play it immediately.

Example command:

```bash
ffmpeg -i ziklag-class-of-2026-4k.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -crf 20 -preset medium -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 \
  ziklag-class-of-2026-mobile.mp4
```
