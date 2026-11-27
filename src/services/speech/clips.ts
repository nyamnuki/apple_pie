import type { Locale } from '../../i18n/types';
import koClips from '../../data/voice/ko.json';

// ===== 녹음해 둔 목소리 (ElevenLabs, 루루 목소리) =====
// 앱이 소리로 읽는 문장마다 미리 녹음한 짧은 파일이 public/voice/<언어>/ 에 있고,
// src/data/voice/<언어>.json 이 '문장 → 파일 이름' 목록이다 (scripts/voice/ 가 만든다).
// 문장에 맞는 녹음이 없으면 speech.ts 가 기기 음성으로 읽는다.
// 파일은 처음 들을 때 내려받아 저장해 둔다 (서비스 워커). 앱을 처음 설치할 때 모두 받지는 않는다.

const MANIFEST: Partial<Record<Locale, Record<string, string>>> = { ko: koClips as Record<string, string> };

// 목록의 열쇠: 빈칸을 하나로 맞춘 문장
export const lineKey = (text: string) => text.replace(/\s+/g, ' ').trim();

export function clipUrl(text: string, locale: Locale): string | null {
  const file = MANIFEST[locale]?.[lineKey(text)];
  return file ? `./voice/${locale}/${file}` : null;
}

export const hasClips = (locale: Locale) => Object.keys(MANIFEST[locale] ?? {}).length > 0;

// ===== 재생 =====
let current: HTMLAudioElement | null = null;
let queue: string[] = [];
let token = 0;
let rate = 1;
let onIdle: (() => void) | null = null;

function playNext(my: number) {
  if (my !== token) return;
  const url = queue.shift();
  if (!url) {
    current = null;
    onIdle?.();
    return;
  }
  const audio = new Audio(url);
  audio.playbackRate = rate;
  (audio as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
  current = audio;
  audio.onended = () => playNext(my);
  audio.onerror = () => playNext(my);
  audio.play().catch(() => playNext(my)); // 재생할 수 없으면 (자동 재생 막힘 등) 다음으로
}

// 녹음 여러 개를 차례로. append: 지금 읽는 것 뒤에 잇는다 (세는 수), 아니면 앞의 것을 멈추고 새로
export function playClips(urls: string[], options: { rate?: number; append?: boolean; onDone?: () => void } = {}) {
  rate = options.rate ?? 1;
  if (options.append && current) {
    queue.push(...urls);
    return;
  }
  stopClips();
  queue = [...urls];
  onIdle = options.onDone ?? null;
  playNext(token);
}

export function stopClips() {
  token++;
  queue = [];
  if (current) current.pause();
  current = null;
}

export const isPlayingClip = () => current !== null;
