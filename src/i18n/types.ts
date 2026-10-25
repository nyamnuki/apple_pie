import type { en } from './locales/en';

// 지원 언어 목록. 언어를 추가하려면 여기와 locales/ 에 파일을 추가한다.
export const LOCALES = ['en', 'ko'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

// en.ts 의 구조를 그대로 따르되 값은 아무 문자열이나 되는 타입.
// ko.ts 가 이 타입을 따르므로 키가 빠지거나 더 많으면 타입 오류가 난다.
type DeepStrings<T> = { [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]> };
export type Messages = DeepStrings<typeof en>;

// 'menu.play' 처럼 점으로 이은 번역 키 목록 (자동 완성·오타 검사용)
type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;
type Paths<T> = { [K in keyof T]: T[K] extends string ? K : Join<K, Paths<T[K]>> }[keyof T];
export type TranslationKey = Paths<Messages>;
