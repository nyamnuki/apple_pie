// 웹에서 녹음해 온 번호 파일(001.mp3 …)을 앱에 넣는다 (docs/VOICE_BROWSER_TASK.md 로 녹음한 것).
//
// 쓰는 법:  node scripts/voice/import.mjs <녹음 폴더> [ko]
//   녹음 폴더 안의 001.mp3, 002.mp3 … 를 docs/voice/<언어>-lines.json 의 번호와 짝지어
//   앞뒤 빈 소리를 자르고 크기를 맞춘 뒤 public/voice/<언어>/ 에 넣고, src/data/voice/<언어>.json 에 '문장 → 파일' 을 적는다.
//   이미 넣은 문장도 새 파일이 있으면 바꾼다. 빠진 번호는 알려 준다 (그 문장은 기기 음성으로 읽는다).
// 필요한 것: ffmpeg
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [srcDir, locale = 'ko'] = process.argv.slice(2);
if (!srcDir) {
  console.error('쓰는 법: node scripts/voice/import.mjs <녹음 폴더> ko');
  process.exit(1);
}
const root = resolve(import.meta.dirname, '../..');
const list = JSON.parse(readFileSync(join(root, 'docs', 'voice', `${locale}-lines.json`), 'utf8'));
const outDir = join(root, 'public', 'voice', locale);
const manifestPath = join(root, 'src', 'data', 'voice', `${locale}.json`);
mkdirSync(outDir, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

// 폴더 안 파일: 번호(앞의 숫자)로 찾는다 (001.mp3, 1.mp3, 001 (1).mp3 도 된다)
const files = new Map();
for (const f of readdirSync(srcDir)) {
  const m = /^0*(\d+)\b.*\.(mp3|wav|m4a|ogg)$/i.exec(f);
  if (m) files.set(Number(m[1]), join(srcDir, f));
}

let added = 0;
const missing = [];
for (const { no, text } of list) {
  const src = files.get(no);
  if (!src) {
    missing.push(no);
    continue;
  }
  const file = `${createHash('sha1').update(`web|${text}|${readFileSync(src).length}`).digest('hex').slice(0, 12)}.mp3`;
  // 앞뒤 빈 소리 자르기, 크기 맞추기, 모노 24kHz 48kbps (record.mjs 와 같게)
  execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', '-i', src,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-2:LRA=11',
    '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '48k', join(outDir, file)]);
  manifest[text] = file;
  added++;
}
// 목록에 없는 문장·파일은 지운다
const texts = new Set(list.map((l) => l.text));
for (const t of Object.keys(manifest)) if (!texts.has(t)) delete manifest[t];
writeFileSync(manifestPath, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 1) + '\n');
const keep = new Set(Object.values(manifest));
for (const f of readdirSync(outDir)) if (!keep.has(f)) rmSync(join(outDir, f));
console.log(`넣음 ${added}개, 앱 전체 녹음 ${Object.keys(manifest).length}/${list.length}개`);
if (missing.length) console.log(`빠진 번호 ${missing.length}개: ${missing.slice(0, 40).join(', ')}${missing.length > 40 ? ' …' : ''}`);
