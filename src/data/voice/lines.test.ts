import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { voiceLines } from './lines';
import ko from './ko.json';

// 녹음할 문장 목록 (VOICE_LIST=<파일> 로 돌리면 목록을 파일로 써 준다: scripts/voice/ 가 녹음할 때 쓴다)
describe('녹음할 문장 (한국어)', () => {
  const lines = voiceLines('ko');

  it('모든 자리({…})가 채워져 있고, 문장이 너무 길지 않다', () => {
    expect(lines.length).toBeGreaterThan(200);
    for (const l of lines) {
      expect(l, l).not.toMatch(/\{\w+\}/);
      expect(l.length, l).toBeLessThan(160);
    }
    if (process.env.VOICE_LIST) writeFileSync(process.env.VOICE_LIST, JSON.stringify(lines, null, 1));
  });

  it('녹음이 있으면 모든 문장에 녹음이 있다 (새 문장을 더하면 녹음도 더한다)', () => {
    const have = ko as Record<string, string>;
    if (Object.keys(have).length === 0) return; // 아직 녹음 전
    const missing = lines.filter((l) => !have[l]);
    expect(missing, `녹음이 없는 문장 ${missing.length}개`).toEqual([]);
  });
});
