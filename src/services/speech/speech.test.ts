import { describe, expect, it } from 'vitest';
import { countWord } from './speech';

describe('세는 말', () => {
  it('한국어는 하나·둘·셋 (1~99), 영어와 그 밖의 수는 숫자 그대로', () => {
    expect([1, 2, 3, 10, 11, 20, 24, 50, 99].map((n) => countWord(n, 'ko'))).toEqual(['하나', '둘', '셋', '열', '열하나', '스물', '스물넷', '쉰', '아흔아홉']);
    expect(countWord(100, 'ko')).toBe('100');
    expect(countWord(7, 'en')).toBe('7');
  });
});

describe('세는 수와 안내 문장', () => {
  it('안내 문장이 끝나기 전에는 수를 여러 번 읽어도 문장을 끊지 않는다, 끝난 뒤에는 앞의 수를 끊는다', async () => {
    const log: string[] = [];
    const queue: { text: string; onend?: () => void }[] = [];
    const synth = {
      speaking: false,
      cancel: () => {
        log.push('cancel');
        queue.length = 0;
      },
      speak: (u: { text: string; onend?: () => void }) => {
        log.push(u.text);
        queue.push(u);
      },
      getVoices: () => [],
    };
    const g = globalThis as unknown as Record<string, unknown>;
    g.window = { speechSynthesis: synth };
    g.SpeechSynthesisUtterance = class {
      text: string;
      onend?: () => void;
      constructor(text: string) {
        this.text = text;
      }
    };
    const { speak, speakNumber } = await import('./speech');
    speak('Tap each apple', 'en');
    speakNumber(1, 'en');
    speakNumber(2, 'en');
    expect(log).toEqual(['cancel', 'Tap each apple', '1', '2']); // 문장 뒤에 이어서
    queue[0].onend?.(); // 문장이 끝남
    speakNumber(3, 'en');
    expect(log.slice(-2)).toEqual(['cancel', '3']); // 이제는 앞의 수를 끊고 바로
    delete g.window;
    delete g.SpeechSynthesisUtterance;
  });
});
