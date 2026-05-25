#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, rmSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const photosDir = path.join(root, 'public', 'photos');
const musicFile = path.join(root, 'public', 'music', 'graduation_music.mp3');
const videosDir = path.join(root, 'public', 'videos');
const outputFile = path.join(videosDir, 'ziklag-class-of-2026-mobile.mp4');
const tmpDir = path.join(root, '.tmp-video');

const FONT_SERIF  = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf';
const FONT_SANS   = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const BG          = '0x0a0f2e';
const GOLD        = '0xd4af37';
const CREAM       = '0xfff8e7';
const W = 1920, H = 1080, FPS = 25;

if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });

function run(label, cmd) {
  console.log(`\n▶ ${label}`);
  execSync(cmd, { stdio: 'inherit', shell: true });
}

// ── helpers ──────────────────────────────────────────────────────────────────

function titleScene(outFile, duration, titleText, subtitleText) {
  const vf = [
    `drawtext=fontfile=${FONT_SERIF}:text='${titleText}':fontcolor=${GOLD}:fontsize=80:x=(w-text_w)/2:y=(h/2)-80`,
    `drawtext=fontfile=${FONT_SERIF}:text='${subtitleText}':fontcolor=${CREAM}:fontsize=52:x=(w-text_w)/2:y=(h/2)+20`,
    `fade=t=in:st=0:d=1.5`,
    `fade=t=out:st=${duration - 1.5}:d=1.5`,
  ].join(',');

  run(`Title: ${titleText}`,
    `ffmpeg -y -f lavfi -i "color=c=${BG}:size=${W}x${H}:r=${FPS}" \
      -vf "${vf}" \
      -t ${duration} -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
      "${outFile}"`);
}

function graduateScene(outFile, photoFile, nameLine1, nameLine2, duration) {
  const textY1  = nameLine2 ? H - 235 : H - 195;
  const textY2  = H - 155;
  const taglineY = H - 80;

  const line2filter = nameLine2
    ? `,drawtext=fontfile=${FONT_SERIF}:text='${nameLine2}':fontcolor=${GOLD}:fontsize=64:x=(w-text_w)/2:y=${textY2}`
    : '';

  const vf = [
    `scale=${W}:${H}:force_original_aspect_ratio=increase`,
    `crop=${W}:${H}`,
    `drawbox=y=${H - 290}:w=iw:h=290:color=${BG}@0.78:t=fill`,
    `drawtext=fontfile=${FONT_SERIF}:text='${nameLine1}':fontcolor=${GOLD}:fontsize=64:x=(w-text_w)/2:y=${textY1}${line2filter}`,
    `drawtext=fontfile=${FONT_SANS}:text='Ziklag Class of 2026':fontcolor=${CREAM}@0.75:fontsize=34:x=(w-text_w)/2:y=${taglineY}`,
    `fade=t=in:st=0:d=1.2`,
    `fade=t=out:st=${duration - 1.2}:d=1.2`,
  ].join(',');

  run(`Graduate: ${nameLine1}`,
    `ffmpeg -y -loop 1 -i "${photoFile}" \
      -vf "${vf}" \
      -t ${duration} -r ${FPS} -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
      "${outFile}"`);
}

function finaleScene(outFile, duration, names) {
  const startY  = 320;
  const spacing = 70;
  const nameFilters = names
    .map((n, i) =>
      `drawtext=fontfile=${FONT_SERIF}:text='${n}':fontcolor=${CREAM}:fontsize=46:x=(w-text_w)/2:y=${startY + i * spacing}`)
    .join(',');

  const vf = [
    `drawtext=fontfile=${FONT_SERIF}:text='Congratulations':fontcolor=${GOLD}:fontsize=96:x=(w-text_w)/2:y=110`,
    `drawtext=fontfile=${FONT_SANS}:text='Ziklag Class of 2026':fontcolor=${CREAM}:fontsize=48:x=(w-text_w)/2:y=225`,
    nameFilters,
    `drawtext=fontfile=${FONT_SERIF}:text='United in Excellence':fontcolor=${GOLD}@0.65:fontsize=38:x=(w-text_w)/2:y=${startY + names.length * spacing + 40}`,
    `fade=t=in:st=0:d=1.5`,
    `fade=t=out:st=${duration - 2}:d=2`,
  ].join(',');

  run('Finale',
    `ffmpeg -y -f lavfi -i "color=c=${BG}:size=${W}x${H}:r=${FPS}" \
      -vf "${vf}" \
      -t ${duration} -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
      "${outFile}"`);
}

// ── scenes ───────────────────────────────────────────────────────────────────

const segments = [];

const opening = path.join(tmpDir, '00_opening.mp4');
titleScene(opening, 11, 'ZIKLAG CLASS OF 2026', 'A Ceremony of Excellence');
segments.push(opening);

const graduates = [
  { file: 'kaylin_solo.jpeg',       line1: 'Kaylin Mangwinyana',          line2: '',                  dur: 29 },
  { file: 'kudakwashe_solo.jpeg',   line1: 'Kudakwashe Ngoma',            line2: '',                  dur: 29 },
  { file: 'rumbidzai_solo.jpeg',    line1: 'Rumbidzai Charlene',          line2: 'Mushonga',           dur: 26 },
  { file: 'tendai_solo.jpeg',       line1: 'Tendai Bokisaara',            line2: '',                  dur: 26 },
  { file: 'zvikomborero_solo.jpeg', line1: 'Zvikomborero Mziti',          line2: '',                  dur: 29 },
];

graduates.forEach(({ file, line1, line2, dur }, i) => {
  const out = path.join(tmpDir, `${String(i + 1).padStart(2, '0')}_grad.mp4`);
  graduateScene(out, path.join(photosDir, file), line1, line2, dur);
  segments.push(out);
});

const finale = path.join(tmpDir, '06_finale.mp4');
finaleScene(finale, 30, [
  'Kaylin Mangwinyana',
  'Kudakwashe Ngoma',
  'Rumbidzai Charlene Mushonga',
  'Tendai Bokisaara',
  'Zvikomborero Mziti',
]);
segments.push(finale);

// ── concat + audio ────────────────────────────────────────────────────────────

const concatFile = path.join(tmpDir, 'concat.txt');
writeFileSync(concatFile, segments.map(s => `file '${s}'`).join('\n'));

run('Final encode with music',
  `ffmpeg -y \
    -f concat -safe 0 -i "${concatFile}" \
    -i "${musicFile}" \
    -map 0:v:0 -map 1:a:0 \
    -c:v libx264 -preset medium -crf 20 -profile:v high -level 4.1 -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 \
    -shortest \
    "${outputFile}"`);

// cleanup
rmSync(tmpDir, { recursive: true, force: true });

const size = existsSync(outputFile)
  ? Math.round(statSync(outputFile).size / 1024 / 1024)
  : '?';

console.log(`\n✅  Done!  →  public/videos/ziklag-class-of-2026-mobile.mp4  (${size} MB)`);
console.log('   Download it from the file tree in Replit.\n');
