import type { Locale } from '../../i18n/types';

// ===== 말풍선 읽어 주기 (브라우저에 들어 있는 음성, Web Speech API) =====
// 서버로 아무것도 보내지 않는다. 기기에 해당 언어 음성이 없으면 읽기 버튼을 숨긴다.

const LANG: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR' };

const synth = () => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null);

// 이 기기에서 읽어 줄 수 있는지 (음성 목록은 늦게 채워지는 브라우저가 있어 목록이 비어도 일단 가능으로 본다)
export function canSpeak(locale: Locale): boolean {
  const s = synth();
  if (!s || typeof SpeechSynthesisUtterance === 'undefined') return false;
  const voices = s.getVoices();
  return voices.length === 0 || voices.some((v) => v.lang.replace('_', '-').toLowerCase().startsWith(LANG[locale].slice(0, 2)));
}

// 그 언어의 목소리 고르기: 기기 기본 → 이름에 'Female'·'Google' 등이 있는 것 순서는 따지지 않고 첫 번째
function voiceFor(locale: Locale): SpeechSynthesisVoice | undefined {
  const voices = synth()?.getVoices() ?? [];
  const lang = LANG[locale].toLowerCase();
  return voices.find((v) => v.lang.replace('_', '-').toLowerCase() === lang) ?? voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
}

// 천천히 읽기 (설정). 처음 읽기를 배우는 아이가 따라오기 쉽게
let slow = false;
export const setSlowSpeech = (on: boolean) => {
  slow = on;
};

// 안내 문장을 읽는 중인지 (또는 아직 차례를 기다리는지). 세는 수는 이 문장을 끊지 않는다.
let lineActive = false;

// 읽기 (앞에 읽던 것은 멈춘다). 아이가 따라오기 쉽게 조금 천천히, 조금 높게.
export function speak(text: string, locale: Locale) {
  const s = synth();
  if (!s || !text.trim()) return;
  s.cancel();
  lineActive = false;
  say(s, text, locale, 'line');
}

// 물건을 셀 때 쓰는 말: 한국어는 '하나, 둘, 셋…' (1~99), 그 밖에는 숫자 그대로
const KO_ONES = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const KO_TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
export function countWord(n: number, locale: Locale): string {
  if (locale === 'ko' && Number.isInteger(n) && n >= 1 && n <= 99) return KO_TENS[Math.floor(n / 10)] + KO_ONES[n % 10];
  return String(n);
}

// 세는 수 읽기 ('하나, 둘, 셋'): 앞의 수는 끊고 바로 다음 수를 읽지만,
// 안내 문장이 끝나지 않았으면 끊지 않고 그 뒤에 이어서 읽는다 (빠르게 여러 번 눌러도).
export function speakNumber(n: number, locale: Locale) {
  const s = synth();
  if (!s) return;
  if (!lineActive) s.cancel();
  say(s, countWord(n, locale), locale, 'number');
}

function say(s: SpeechSynthesis, text: string, locale: Locale, kind: 'line' | 'number') {
  if (kind === 'line') lineActive = true;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG[locale];
  try {
    const voice = voiceFor(locale);
    if (voice) u.voice = voice;
  } catch {
    // 목소리를 고를 수 없으면 기기 기본 목소리로 읽는다
  }
  u.rate = (kind === 'number' ? 1 : 0.9) * (slow ? 0.75 : 1);
  u.pitch = 1.1;
  if (kind === 'line') {
    // 끝나거나 끊기면 (speak·stopSpeaking 의 cancel) 수가 다시 앞의 수를 끊을 수 있다
    u.onend = () => (lineActive = false);
    u.onerror = () => (lineActive = false);
  }
  s.speak(u);
}

export function stopSpeaking() {
  lineActive = false;
  synth()?.cancel();
}
