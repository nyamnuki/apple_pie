// Web Audio API 로 만드는 간단한 효과음. 음원 파일 없이 동작한다.
let ctx = null;
let enabled = true;

export const setSoundEnabled = (on) => {
  enabled = on;
};

// 브라우저 정책상 첫 터치 이후에야 오디오를 만들 수 있다
function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// 음 하나 재생: freq(Hz), 시작 지연(초), 길이(초)
function tone(freq, delay = 0, duration = 0.15, type = 'sine', volume = 0.18) {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  // 딸깍 소리가 나지 않게 부드럽게 켜고 끈다
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// 상황별 효과음 모음
export const sfx = {
  tap: () => enabled && tone(660, 0, 0.08, 'triangle', 0.12),
  correct: () => enabled && [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.18)),
  // 오답도 부드럽고 다정한 소리로 (페널티 느낌이 나지 않게)
  tryAgain: () => enabled && [440, 392].forEach((f, i) => tone(f, i * 0.12, 0.2, 'sine', 0.1)),
  mined: () => enabled && [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.22, 'triangle')),
  build: () => enabled && [262, 330, 392, 523].forEach((f, i) => tone(f, i * 0.1, 0.25, 'square', 0.06)),
};
