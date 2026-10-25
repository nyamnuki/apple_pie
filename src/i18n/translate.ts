import { en } from './locales/en';
import { ko } from './locales/ko';
import type { Locale, Messages } from './types';

const MESSAGES: Record<Locale, Messages> = { en, ko };

// 'menu.play' → MESSAGES[locale].menu.play 를 찾는다.
function lookup(messages: Messages, key: string): string | undefined {
  let node: unknown = messages;
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) node = (node as Record<string, unknown>)[part];
    else return undefined;
  }
  return typeof node === 'string' ? node : undefined;
}

// 번역 함수. vars 로 문장 안의 {name} 자리를 채운다.
// 키를 못 찾으면 개발 중에는 콘솔 경고를 띄우고, 화면에는 키 이름을 그대로 보여준다.
// (가구 이름처럼 데이터에서 오는 키는 string 으로 받는다)
export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const text = lookup(MESSAGES[locale], key);
  if (text === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] 번역 키가 없어요: "${key}" (언어: ${locale})`);
    return key;
  }
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}
