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

// 읽기 (앞에 읽던 것은 멈춘다). 아이가 따라오기 쉽게 조금 천천히, 조금 높게.
export function speak(text: string, locale: Locale) {
  const s = synth();
  if (!s || !text.trim()) return;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG[locale];
  try {
    const voice = voiceFor(locale);
    if (voice) u.voice = voice;
  } catch {
    // 목소리를 고를 수 없으면 기기 기본 목소리로 읽는다
  }
  u.rate = 0.9;
  u.pitch = 1.1;
  s.speak(u);
}

export function stopSpeaking() {
  synth()?.cancel();
}
