#!/usr/bin/env node
/**
 * Records the live animated ceremony by taking screenshots every 100ms,
 * then compiles them into an MP4 with graduation music via ffmpeg.
 * Output: public/videos/ziklag-class-of-2026-mobile.mp4
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root       = path.join(__dirname, '..');
const framesDir  = path.join(root, '.tmp-frames');
const musicFile  = path.join(root, 'public', 'music', 'graduation_music.mp3');
const outputFile = path.join(root, 'public', 'videos', 'ziklag-class-of-2026-mobile.mp4');

const TOTAL_DURATION_MS = 186_000; // slightly longer than ceremony
const FRAME_INTERVAL_MS = 100;     // 10 fps
const FPS = 10;
const JPEG_QUALITY = 50;

const CHROMIUM = '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium';

const log = (msg) => {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${msg}`);
};

// Clean and recreate frames dir
if (existsSync(framesDir)) rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

log('Launching Chromium (1280×720)…');
const browser = await chromium.launch({
  executablePath: CHROMIUM,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--force-device-scale-factor=1',
    '--memory-pressure-off',
    '--max_old_space_size=512',
  ],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});

await context.addInitScript(() => {
  window.startRecording = () => {};
  window.stopRecording  = () => {};
});

const page = await context.newPage();
page.on('pageerror', (err) => log(`Page error: ${err.message}`));

log('Opening http://localhost:5000 …');
await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 15000 });

log('Clicking "Watch Ceremony"…');
await page.click('button:has-text("Watch Ceremony")');
await page.waitForTimeout(1500);

log('Clicking play button…');
await page.click('button:has(polygon)');

log(`Capturing frames every ${FRAME_INTERVAL_MS}ms for ${TOTAL_DURATION_MS / 1000}s…`);

let frame = 0;
const startTime = Date.now();

while (Date.now() - startTime < TOTAL_DURATION_MS) {
  const t0 = Date.now();

  try {
    const buf = await page.screenshot({ type: 'jpeg', quality: JPEG_QUALITY });
    const filename = path.join(framesDir, `frame_${String(frame).padStart(6, '0')}.jpg`);
    writeFileSync(filename, buf);
    frame++;
  } catch (err) {
    log(`Screenshot error at frame ${frame}: ${err.message}`);
    break;
  }

  // Log progress every 10 seconds
  const elapsed = Date.now() - startTime;
  if (frame % 100 === 0) {
    const pct = Math.round((elapsed / TOTAL_DURATION_MS) * 100);
    log(`  ▸ ${pct}% — ${Math.round(elapsed / 1000)}s | frame ${frame}`);
  }

  // Wait remaining time to hit target interval
  const took = Date.now() - t0;
  const wait = Math.max(0, FRAME_INTERVAL_MS - took);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
}

log(`Captured ${frame} frames. Closing browser…`);
await context.close();
await browser.close();

if (frame < 10) {
  log('ERROR: Too few frames captured. Aborting.');
  process.exit(1);
}

log(`Encoding ${frame} frames → MP4 at ${FPS}fps…`);
const ffmpegResult = spawnSync('ffmpeg', [
  '-y',
  '-framerate', String(FPS),
  '-i', path.join(framesDir, 'frame_%06d.jpg'),
  '-i', musicFile,
  '-map', '0:v:0',
  '-map', '1:a:0',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '20',
  '-profile:v', 'high',
  '-level', '4.1',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-ar', '48000',
  '-shortest',
  outputFile,
], { stdio: 'inherit' });

if (ffmpegResult.status !== 0) {
  log('ERROR: ffmpeg failed!');
  process.exit(1);
}

log('Cleaning up frames…');
rmSync(framesDir, { recursive: true, force: true });

log(`✅  DONE → public/videos/ziklag-class-of-2026-mobile.mp4`);
