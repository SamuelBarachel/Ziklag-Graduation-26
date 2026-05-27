#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, rmSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const photosDir = path.join(root, 'public', 'photos');
const musicFile = path.join(root, 'public', 'music', 'Graduation_music_new.mp3');
const videosDir = path.join(root, 'public', 'videos');
const outputFile = path.join(videosDir, 'graduation-2026.mp4');
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

function graduateScene(outFile, photoFile, nameLine1, nameLine2, degree, degree2, duration) {
  // Build text stack from bottom up: tagline → [degree2] → degree → [name2] → name1
  const specs = [];
  specs.push({ text: 'Ziklag Class of 2026', font: FONT_SANS,  size: 28, color: `${CREAM}@0.65`, gap: 0  });
  if (degree2)  specs.push({ text: degree2,   font: FONT_SANS,  size: 30, color: `${CREAM}@0.82`, gap: 50 });
  specs.push({ text: degree,   font: FONT_SANS,  size: 34, color: CREAM,           gap: degree2 ? 48 : 55 });
  if (nameLine2) specs.push({ text: nameLine2, font: FONT_SERIF, size: 56, color: GOLD,            gap: 62 });
  specs.push({ text: nameLine1, font: FONT_SERIF, size: 56, color: GOLD,           gap: 62 });

  let y = H - 65;
  const textFilters = specs.map((spec, i) => {
    if (i > 0) y -= spec.gap;
    return `drawtext=fontfile=${spec.font}:text='${spec.text}':fontcolor=${spec.color}:fontsize=${spec.size}:x=(w-text_w)/2:y=${y}`;
  });
  const boxH = (H - y) + 60;

  const vf = [
    `scale=${W}:${H}:force_original_aspect_ratio=decrease`,
    `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${BG}`,
    `drawbox=y=${H - boxH}:w=iw:h=${boxH}:color=${BG}@0.88:t=fill`,
    ...textFilters,
    `fade=t=in:st=0:d=1.2`,
    `fade=t=out:st=${duration - 1.2}:d=1.2`,
  ].join(',');

  run(`Graduate: ${nameLine1}`,
    `ffmpeg -y -loop 1 -i "${photoFile}" \
      -vf "${vf}" \
      -t ${duration} -r ${FPS} -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
      "${outFile}"`);
}

function familyScene(outFile, photoFiles) {
  // 3 photos × 4 s each, 1 s dissolve crossfade → total 10 s
  const perPhoto = 4;
  const xfadeDur = 1;
  const n = photoFiles.length;
  const totalDur = n * perPhoto - (n - 1) * xfadeDur; // 19 s

  const scaleFilter = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`;
  const inputs = photoFiles.map(f => `-loop 1 -t ${perPhoto} -i "${f}"`).join(' ');

  const scaled = photoFiles.map((_, i) => `[${i}:v]${scaleFilter}[s${i}]`).join(';');

  let xfadeChain = '';
  let lastLabel = 's0';
  for (let i = 1; i < n; i++) {
    const outLabel = i === n - 1 ? 'xout' : `x${i}`;
    const offset = i * perPhoto - i * xfadeDur;
    xfadeChain += `;[${lastLabel}][s${i}]xfade=transition=dissolve:duration=${xfadeDur}:offset=${offset}[${outLabel}]`;
    lastLabel = outLabel;
  }

  const titleY = H - 160;
  const lineY  = H - 100;
  const textFilters = [
    `drawbox=y=${H - 200}:w=iw:h=200:color=${BG}@0.82:t=fill`,
    `drawtext=fontfile=${FONT_SERIF}:text='United as One Family':fontcolor=${GOLD}:fontsize=62:x=(w-text_w)/2:y=${titleY}`,
    `drawtext=fontfile=${FONT_SANS}:text='Ziklag Class of 2026':fontcolor=${CREAM}@0.75:fontsize=34:x=(w-text_w)/2:y=${lineY}`,
    `fade=t=in:st=0:d=1.2`,
    `fade=t=out:st=${totalDur - 1.5}:d=1.5`,
  ].join(',');

  const filterComplex = `${scaled}${xfadeChain};[xout]${textFilters}[vout]`;

  run('Family scene',
    `ffmpeg -y ${inputs} \
      -filter_complex "${filterComplex}" \
      -map "[vout]" \
      -t ${totalDur} -r ${FPS} -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
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
  { file: 'kaylin_solo.jpeg',       line1: 'Kaylin Mangwinyana',  line2: '',         degree: 'Master of Project Management',               degree2: '',                                          dur: 27 },
  { file: 'kudakwashe_solo.jpeg',   line1: 'Kudakwashe Ngoma',    line2: '',         degree: 'PhD in Biomedical Sciences',                  degree2: '',                                          dur: 27 },
  { file: 'rumbidzai_solo.jpeg',    line1: 'Rumbidzai Charlene',  line2: 'Mushonga', degree: 'BSN, RN, PHN - Bachelor of Science in Nursing', degree2: 'Public Health Nursing Credential - With Honors', dur: 24 },
  { file: 'tendai_solo.jpeg',       line1: 'Tendai Bokisaara',    line2: '',         degree: 'Global Management - Global Business',          degree2: '',                                          dur: 24 },
  { file: 'zvikomborero_solo.jpeg', line1: 'Zvikomborero Mziti',  line2: '',         degree: 'Master of Project Management',                degree2: '',                                          dur: 27 },
];

graduates.forEach(({ file, line1, line2, degree, degree2, dur }, i) => {
  const out = path.join(tmpDir, `${String(i + 1).padStart(2, '0')}_grad.mp4`);
  graduateScene(out, path.join(photosDir, file), line1, line2, degree, degree2, dur);
  segments.push(out);
});

// Family photo slideshow — 3 photos × 4 s, 1 s crossfades = 10 s
const familyOut = path.join(tmpDir, '06_family.mp4');
familyScene(familyOut, [
  path.join(photosDir, 'family_1.jpeg'),
  path.join(photosDir, 'family_2.jpeg'),
  path.join(photosDir, 'family_3.jpeg'),
]);
segments.push(familyOut);

const finale = path.join(tmpDir, '07_finale.mp4');
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
