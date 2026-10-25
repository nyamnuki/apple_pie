import { audio, existingAudio } from './sound';

// ===== 배경 음악 (Web Audio API) =====
// 음원 파일 없이 코드로 연주한다. 8마디가 끝없이 반복되는 잔잔한 곡 3개.
// 멜로디는 5음 음계(도 레 미 솔 라)로만 써서 어떤 화음 위에서도 부드럽게 들린다.

export type TrackId = 'day' | 'night' | 'cave';

interface Track {
  bpm: number; // 빠르기 (1분에 4분음표 몇 번)
  wave: OscillatorType; // 멜로디 음색
  chords: string[][]; // 마디마다 화음 (8마디)
  melody: string; // 8분음표 단위. 음 이름 또는 '-' (쉼/늘임). 마디마다 8칸, 공백으로 구분
}

const TRACKS: Record<TrackId, Track> = {
  // 낮의 숲 (도토리 마을, 내 방): 밝고 느린 곡  — 화음 C · Am · F · G 반복
  day: {
    bpm: 84,
    wave: 'triangle',
    chords: [
      ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['G2', 'B2', 'D3'],
      ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['G2', 'B2', 'D3'],
    ],
    melody:
      'E4 - G4 - A4 G4 E4 - | A4 - C5 - A4 G4 E4 - | C5 - A4 - G4 - E4 - | D4 - E4 G4 D4 - - - | ' +
      'E4 - G4 - C5 - D5 - | E5 - D5 C5 A4 - - - | A4 - C5 - A4 G4 E4 - | D4 - E4 - C4 - - -',
  },
  // 밤의 숲 (달빛 숲): 더 느리고 조용한 곡 — 화음 Am · F · C · G 반복
  night: {
    bpm: 70,
    wave: 'sine',
    chords: [
      ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['C3', 'E3', 'G3'], ['G2', 'B2', 'D3'],
      ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['C3', 'E3', 'G3'], ['G2', 'B2', 'D3'],
    ],
    melody:
      'A4 - - C5 E5 - D5 - | C5 - A4 - - - G4 - | E4 - G4 - A4 - - - | G4 - E4 - D4 - - - | ' +
      'A4 - C5 - D5 - E5 - | D5 - C5 - A4 - - - | G4 - A4 C5 - - E4 - | D4 - - - E4 - - -',
  },
  // 수정 동굴: 높은 음이 물방울처럼 똑똑 떨어지는 곡 — 화음 Dm · C · Am · G 반복
  cave: {
    bpm: 76,
    wave: 'sine',
    chords: [
      ['D3', 'F3', 'A3'], ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['G2', 'B2', 'D3'],
      ['D3', 'F3', 'A3'], ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['G2', 'B2', 'D3'],
    ],
    melody:
      'D5 - A4 - - - D5 E5 | C5 - - - G4 - - - | A4 - C5 - E5 - D5 - | D5 - - - - - - - | ' +
      'A4 - D5 - E5 - G5 - | E5 - D5 - C5 - - - | A4 - C5 - D5 - A4 - | D5 - - - - - - -',
  },
};

const VOLUME = 0.07; // 음악 전체 크기 (효과음보다 훨씬 작게)
const NOTE_INDEX: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// 'A4' → 주파수(Hz)
function freq(name: string): number {
  const midi = 12 * (Number(name.slice(-1)) + 1) + NOTE_INDEX[name[0]];
  return 440 * 2 ** ((midi - 69) / 12);
}

const steps = (track: Track) => track.melody.replace(/\|/g, ' ').split(/\s+/).filter(Boolean);

// 음 하나를 master 로 보낸다 (부드럽게 켜고 끄기)
function note(ac: AudioContext, out: AudioNode, f: number, start: number, length: number, wave: OscillatorType, volume: number, attack: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(f, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

// 연주 상태
let master: GainNode | null = null;
let timer: number | null = null;
let current: TrackId | null = null;
let step = 0;
let nextTime = 0;

// 앞으로 0.3초 안에 울릴 음들을 미리 예약한다 (정확한 박자를 위해)
function schedule() {
  const ac = audio();
  if (!ac || !master || !current) return;
  const track = TRACKS[current];
  const seq = steps(track);
  const eighth = 60 / track.bpm / 2;
  while (nextTime < ac.currentTime + 0.3) {
    const i = step % seq.length;
    // 마디 첫 박: 화음을 길게 깐다
    if (i % 8 === 0) {
      const bar = track.chords[(i / 8) % track.chords.length];
      for (const n of bar) note(ac, master, freq(n), nextTime, eighth * 8, 'sine', 0.18, 0.4);
    }
    const name = seq[i];
    // 멜로디: 다음 음이 나올 때까지(최대 4칸) 늘인다
    if (name !== '-') {
      let len = 1;
      while (len < 4 && seq[(i + len) % seq.length] === '-') len++;
      note(ac, master, freq(name), nextTime, eighth * len * 0.95, track.wave, 0.5, 0.03);
    }
    nextTime += eighth;
    step++;
  }
}

// 곡 시작 (이미 같은 곡이 나오고 있으면 그대로)
export function playMusic(track: TrackId) {
  const ac = audio();
  if (!ac) return;
  if (current === track && timer !== null) return;
  stopMusic(0.4); // 다른 곡이면 이전 곡을 줄인다
  current = track;
  step = 0;
  master = ac.createGain();
  master.gain.setValueAtTime(0.0001, ac.currentTime);
  master.gain.exponentialRampToValueAtTime(VOLUME, ac.currentTime + 1.5); // 천천히 커진다
  master.connect(ac.destination);
  nextTime = ac.currentTime + 0.1;
  schedule();
  timer = window.setInterval(schedule, 100);
}

// 곡 멈춤 (fade 초 동안 줄였다가 끊는다)
export function stopMusic(fade = 0.6) {
  const ac = existingAudio(); // 멈출 때는 오디오를 새로 만들지 않는다 (아이가 누르기 전에는 만들면 안 된다)
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  current = null;
  const old = master;
  master = null;
  if (ac && old) {
    old.gain.cancelScheduledValues(ac.currentTime);
    old.gain.setValueAtTime(Math.max(old.gain.value, 0.0001), ac.currentTime);
    old.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + fade);
    window.setTimeout(() => old.disconnect(), (fade + 0.2) * 1000);
  }
}
