import { readString, writeString } from '../services/storage/localStore';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './types';

// 언어 설정은 게임 저장 데이터와 다른 키에 따로 저장한다.
// (언어를 바꿔도 게임 진행 데이터는 건드리지 않는다)
export const LOCALE_STORAGE_KEY = 'mathTown.locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

// 저장된 언어를 읽는다. 없거나 잘못된 값이면 영어로.
export function loadLocale(): Locale {
  const saved = readString(LOCALE_STORAGE_KEY);
  return isLocale(saved) ? saved : DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale): void {
  writeString(LOCALE_STORAGE_KEY, locale);
}
