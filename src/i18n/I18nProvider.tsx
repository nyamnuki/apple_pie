import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate } from './translate';
import { loadLocale, saveLocale } from './localeStorage';
import type { Locale, TranslationKey } from './types';

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // 일반 화면 문구: 정해진 키만 받아서 오타를 막는다
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  // 데이터(가구·문제 등)에서 오는 키용: 아무 문자열이나 받고, 없으면 경고
  tKey: (key: string, vars?: Record<string, string | number>) => string;
  // 숫자를 언어에 맞게 표시 (예: 1,000)
  formatNumber: (n: number) => string;
  // 날짜·시각을 언어에 맞게 표시 (예: Oct 25, 2026, 3:04 PM / 2026. 10. 25. 오후 3:04)
  formatDateTime: (date: Date) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

// 앱 전체에서 하나만 쓰는 언어 상태. 모든 화면이 여기서 언어를 받는다.
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  }, []);

  // 화면 읽기 프로그램과 브라우저가 현재 언어를 알 수 있게 <html lang> 과 탭 제목을 맞춘다
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(locale, 'app.title');
  }, [locale]);

  const value = useMemo<I18nValue>(() => {
    const numberFormat = new Intl.NumberFormat(locale);
    const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
    return {
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
      tKey: (key, vars) => translate(locale, key, vars),
      formatNumber: (n) => numberFormat.format(n),
      formatDateTime: (date) => dateFormat.format(date),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n 은 I18nProvider 안에서만 쓸 수 있어요');
  return ctx;
}
