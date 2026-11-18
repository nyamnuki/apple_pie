import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import glyphs from '../assets/fonts/glyphs.json';

// 앱 안에 넣은 글꼴은 앱 글에 쓰는 글자만 남긴 것이다 (scripts/subset-fonts.py).
// 언어 파일에 새 글자가 생겼는데 글꼴을 다시 만들지 않으면 그 글자만 기기 글꼴로 나온다 → 여기서 알려 준다.
const STRING = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
const hangul = (ch: string) => /[가-힣㄰-㆏ᄀ-ᇿ]/.test(ch);

function appText(file: string): string {
  const src = readFileSync(new URL(`./locales/${file}`, import.meta.url), 'utf-8').replace(/\/\/[^\n]*/g, '');
  return [...src.matchAll(STRING)].map((m) => m[1] ?? m[2]).join('');
}

describe('앱 안 글꼴의 글자', () => {
  it('언어 파일의 모든 글자가 글꼴에 들어 있다 (없으면 python3 scripts/subset-fonts.py 를 다시 돌린다)', () => {
    const text = appText('en.ts') + appText('ko.ts');
    const missing = [...new Set(text)].filter((ch) => ch.charCodeAt(0) >= 0x20 && !(hangul(ch) ? glyphs.hangul : glyphs.latin).includes(ch));
    expect(missing.join('')).toBe('');
  });
});
