import { useEffect, useState } from 'react';
import { canSpeak } from './speech';
import type { Locale } from '../../i18n/types';

// 이 기기가 지금 언어로 읽어 줄 수 있는지. 언어를 바꾸거나, 브라우저가 목소리 목록을 늦게 채우면 다시 확인한다.
export function useCanSpeak(locale: Locale): boolean {
  const [ok, setOk] = useState(() => canSpeak(locale));
  useEffect(() => {
    setOk(canSpeak(locale));
    const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    if (!synth?.addEventListener) return;
    const update = () => setOk(canSpeak(locale));
    synth.addEventListener('voiceschanged', update);
    return () => synth.removeEventListener('voiceschanged', update);
  }, [locale]);
  return ok;
}
