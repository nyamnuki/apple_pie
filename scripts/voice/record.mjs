// 녹음할 문장 목록을 ElevenLabs 로 녹음해 앱에 넣는다 (루루 목소리).
//
// 쓰는 법:
//   1) 목록 만들기:  VOICE_LIST=/tmp/voice-ko.json npx vitest run src/data/voice
//   2) 녹음하기:     ELEVENLABS_API_KEY=… node scripts/voice/record.mjs /tmp/voice-ko.json ko
//      (이미 녹음한 문장은 건너뛴다. 중간에 멈춰도 다시 돌리면 이어서 한다)
//   3) 확인:         npx vitest run src/data/voice  (녹음이 없는 문장을 알려 준다)
//
// 하는 일: 문장마다 ElevenLabs 에 읽어 달라고 하고, ffmpeg 로 앞뒤 빈 소리를 자르고 크기를 맞춰
// public/voice/<언어>/<짧은 이름>.mp3 로 저장한 뒤, src/data/voice/<언어>.json 에 '문장 → 파일' 을 적는다.
// 목록에서 빠진 문장의 파일은 지운다 (문장을 고치면 새로 녹음).
// 필요한 것: ffmpeg, 인터넷, ElevenLabs API 키 (크레딧이 든다: 1글자에 약 1크레딧)
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const VOICES = { ko: 'XfOUWwmaVeeoarsTYigF' }; // 루루: Ajin (밝고 부드러운 목소리)
const MODEL = process.env.VOICE_MODEL || 'eleven_v3';
const CONCURRENCY = 3;

const [listPath, locale = 'ko'] = process.argv.slice(2);
if (!listPath || !VOICES[locale]) {
  console.error('쓰는 법: node scripts/voice/record.mjs <목록.json> ko');
  process.exit(1);
}
const root = resolve(import.meta.dirname, '../..');
const outDir = join(root, 'public', 'voice', locale);
const manifestPath = join(root, 'src', 'data', 'voice', `${locale}.json`);
mkdirSync(outDir, { recursive: true });

const lines = JSON.parse(readFileSync(listPath, 'utf8'));
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const fileFor = (text) => `${createHash('sha1').update(`${MODEL}|${VOICES[locale]}|${text}`).digest('hex').slice(0, 12)}.mp3`;
const save = () => writeFileSync(manifestPath, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 1) + '\n');

// 목록에서 빠진 문장은 지운다
for (const text of Object.keys(manifest)) if (!lines.includes(text)) delete manifest[text];
const todo = lines.filter((text) => !manifest[text] || !existsSync(join(outDir, manifest[text])));
console.log(`문장 ${lines.length}개 중 녹음할 것 ${todo.length}개 (${todo.reduce((a, t) => a + t.length, 0)}자)`);

async function record(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES[locale]}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY || 'proxy-injected', 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, language_code: locale }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  const raw = join(tmpdir(), `voice-${process.pid}-${Math.random().toString(36).slice(2)}.mp3`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  const file = fileFor(text);
  // 앞뒤 빈 소리 자르기, 크기 맞추기 (말소리 기준 -16 LUFS 근처), 모노 24kHz 48kbps (작고 또렷하게)
  execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', '-i', raw,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-2:LRA=11',
    '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '48k', join(outDir, file)]);
  rmSync(raw, { force: true });
  manifest[text] = file;
}

let done = 0;
let failed = 0;
const queue = [...todo];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const text = queue.shift();
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await record(text);
          break;
        } catch (e) {
          if (attempt === 3) {
            failed++;
            console.error(`실패: ${text}\n  ${e.message}`);
          } else await new Promise((r) => setTimeout(r, 2000 * attempt));
        }
      }
      if (++done % 20 === 0) {
        save();
        console.log(`${done}/${todo.length}`);
      }
    }
  }),
);
save();
// 목록에 없는 파일 지우기
const keep = new Set(Object.values(manifest));
for (const f of readdirSync(outDir)) if (!keep.has(f)) rmSync(join(outDir, f));
console.log(`끝: 녹음 ${todo.length - failed}개, 실패 ${failed}개`);
if (failed) process.exit(1);
