import { describe, expect, it } from 'vitest';
import { guessDevice } from './InstallSection';

describe('홈 화면 안내: 기기 짐작', () => {
  it('아이폰·안드로이드·컴퓨터, 맥처럼 보이는 아이패드', () => {
    expect(guessDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe('ios');
    expect(guessDevice('Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/120')).toBe('android');
    expect(guessDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120')).toBe('computer');
    expect(guessDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605', 5)).toBe('ios');
    expect(guessDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605', 0)).toBe('computer');
  });
});
