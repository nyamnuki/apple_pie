import { describe, expect, it } from 'vitest';
import { countWord } from './speech';

describe('세는 말', () => {
  it('한국어는 하나·둘·셋 (1~99), 영어와 그 밖의 수는 숫자 그대로', () => {
    expect([1, 2, 3, 10, 11, 20, 24, 50, 99].map((n) => countWord(n, 'ko'))).toEqual(['하나', '둘', '셋', '열', '열하나', '스물', '스물넷', '쉰', '아흔아홉']);
    expect(countWord(100, 'ko')).toBe('100');
    expect(countWord(7, 'en')).toBe('7');
  });
});
