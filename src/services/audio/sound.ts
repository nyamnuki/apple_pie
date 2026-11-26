// ===== 효과음 (Web Audio API) =====
// 맞힘·보상 같은 효과음은 녹음한 짧은 소리 파일(src/assets/sounds, ElevenLabs 로 만든 것)을 쓴다.
// 파일을 아직 못 불렀거나 재생할 수 없는 기기에서는 코드로 만든 소리로 대신한다 (앱은 그대로 동작).
// 셀 때 나는 소리는 셀 때마다 한 음씩 올라가야 해서 코드로 만든다. 소리 켜기/끄기는 SoundProvider 가 관리한다.
import correctUrl from '../../assets/sounds/correct.mp3';
import tryAgainUrl from '../../assets/sounds/tryAgain.mp3';
import nopeUrl from '../../assets/sounds/nope.mp3';
import placeUrl from '../../assets/sounds/place.mp3';
import craftUrl from '../../assets/sounds/craft.mp3';
import rewardUrl from '../../assets/sounds/reward.mp3';
import unlockUrl from '../../assets/sounds/unlock.mp3';

let ctx: AudioContext | null = null;

// 브라우저 규칙상 소리는 아이가 화면을 누른 뒤에만 낼 수 있다. 처음 소리를 낼 때 만든다.
// (배경 음악 music.ts 도 같은 오디오를 쓴다)
export function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      loadSamples(ctx);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null; // 소리를 낼 수 없는 환경에서는 조용히 넘어간다
  }
}

// 이미 만들어진 오디오만 돌려준다 (없으면 null — 새로 만들지 않는다. 멈출 때 쓴다)
export const existingAudio = (): AudioContext | null => ctx;

// 음 하나: 주파수(Hz), 시작 지연(초), 길이(초), 파형, 크기
function tone(freq: number, delay = 0, duration = 0.18, type: OscillatorType = 'sine', volume = 0.16) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  // '딸깍' 소리가 나지 않게 부드럽게 켜고 끈다
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// ===== 녹음한 효과음 =====
const SAMPLE_URLS = { correct: correctUrl, tryAgain: tryAgainUrl, nope: nopeUrl, place: placeUrl, craft: craftUrl, reward: rewardUrl, unlock: unlockUrl };
type SampleId = keyof typeof SAMPLE_URLS;
const buffers = new Map<SampleId, AudioBuffer>();
let loading = false;

// 오디오를 처음 만들 때 소리 파일을 모두 불러 둔다 (모두 합쳐 50KB 안팎, 인터넷 없이도 앱 안에 있다)
function loadSamples(ac: AudioContext) {
  if (loading || typeof fetch === 'undefined') return;
  loading = true;
  for (const [id, url] of Object.entries(SAMPLE_URLS) as [SampleId, string][]) {
    fetch(url)
      .then((r) => r.arrayBuffer())
      // 옛 사파리는 약속(Promise) 대신 콜백만 받는다
      .then((data) => new Promise<AudioBuffer>((ok, fail) => ac.decodeAudioData(data, ok, fail)))
      .then((buf) => buffers.set(id, buf))
      .catch(() => {}); // 못 부르면 코드로 만든 소리를 쓴다
  }
}

// 녹음한 소리 재생. 아직 없으면 fallback (코드로 만든 소리)
function sample(id: SampleId, fallback: () => void, volume = 0.45) {
  const ac = audio();
  const buf = buffers.get(id);
  if (!ac || !buf) return fallback();
  try {
    const src = ac.createBufferSource();
    const gain = ac.createGain();
    src.buffer = buf;
    gain.gain.value = volume;
    src.connect(gain).connect(ac.destination);
    src.start();
  } catch {
    fallback();
  }
}

// 5음 음계 (도 레 미 솔 라 …): 어떤 순서로 이어져도 듣기 좋다
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

export const SOUNDS = {
  // 셀 때마다 한 음씩 올라간다 (n = 0, 1, 2 …)
  count: (n: number) => tone(PENTATONIC[Math.min(n, PENTATONIC.length - 1)], 0, 0.16, 'triangle', 0.14),
  // 맞힘: 밝은 세 음 (마림바)
  correct: () => sample('correct', () => [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.09, 0.22))),
  // 다시 해 보기: 부드러운 두 음 (벌칙처럼 들리지 않게 작게)
  tryAgain: () => sample('tryAgain', () => [392, 349.23].forEach((f, i) => tone(f, i * 0.12, 0.22, 'sine', 0.08))),
  // 다른 도형을 눌렀을 때: 아주 짧고 작게 '톡'
  nope: () => sample('nope', () => tone(220, 0, 0.12, 'sine', 0.06)),
  // 가구를 놓을 때: 나무 바닥에 '톡'
  place: () => sample('place', () => tone(330, 0, 0.12, 'triangle', 0.14)),
  // 가구 완성: 망치질 두 번 → 반짝
  craft: () =>
    sample('craft', () => {
      [0, 0.16, 0.32].forEach((at) => tone(196, at, 0.07, 'square', 0.04));
      [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => tone(f, 0.5 + i * 0.07, 0.2, 'triangle', 0.12));
    }),
  // 보상: 반짝이는 종소리
  reward: () => sample('reward', () => [783.99, 1046.5, 1318.51].forEach((f, i) => tone(f, i * 0.12, 0.35, 'sine', 0.12))),
  // 새 마을 열림: 하프와 종의 짧은 팡파르
  unlock: () => sample('unlock', () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.4 + i * 0.1, i === 3 ? 0.5 : 0.18, 'triangle', 0.13))),
};
