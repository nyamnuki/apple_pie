// 다국어 시스템의 입구. 다른 파일에서는 '../i18n' 에서만 가져다 쓴다.
export { I18nProvider, useI18n } from './I18nProvider';
export { LOCALES, DEFAULT_LOCALE, type Locale, type TranslationKey, type Messages } from './types';
export { LOCALE_STORAGE_KEY, isLocale } from './localeStorage';
