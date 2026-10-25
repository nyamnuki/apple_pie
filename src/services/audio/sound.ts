// ===== 효과음 (Web Audio API) =====
// 음원 파일 없이 코드로 짧은 소리를 만든다. 소리 켜기/끄기는 SoundProvider 가 관리한다.

let ctx: AudioContext | null = null;

// 브라우저 규칙상 소리는 아이가 화면을 누른 뒤에만 낼 수 있다. 처음 소리를 낼 때 만든다.
function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null; // 소리를 낼 수 없는 환경에서는 조용히 넘어간다
  }
}

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

// 5음 음계 (도 레 미 솔 라 …): 어떤 순서로 이어져도 듣기 좋다
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

export const SOUNDS = {
  // 셀 때마다 한 음씩 올라간다 (n = 0, 1, 2 …)
  count: (n: number) => tone(PENTATONIC[Math.min(n, PENTATONIC.length - 1)], 0, 0.16, 'triangle', 0.14),
  // 맞힘: 밝은 세 음
  correct: () => [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.09, 0.22)),
  // 다시 해 보기: 낮고 부드러운 두 음 (벌칙처럼 들리지 않게 작게)
  tryAgain: () => [392, 349.23].forEach((f, i) => tone(f, i * 0.12, 0.22, 'sine', 0.08)),
  // 다른 도형을 눌렀을 때: 아주 짧고 작게
  nope: () => tone(220, 0, 0.12, 'sine', 0.06),
  // 가구를 놓을 때: 톡
  place: () => tone(330, 0, 0.12, 'triangle', 0.14),
  // 가구 완성: 반짝이는 오르는 음
  craft: () => [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => tone(f, i * 0.07, 0.2, 'triangle', 0.12)),
  // 보상: 차임
  reward: () => [783.99, 1046.5, 1318.51].forEach((f, i) => tone(f, i * 0.12, 0.35, 'sine', 0.12)),
  // 새 마을 열림: 짧은 팡파르
  unlock: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.4 + i * 0.1, i === 3 ? 0.5 : 0.18, 'triangle', 0.13)),
};

export type SoundName = keyof typeof SOUNDS;
