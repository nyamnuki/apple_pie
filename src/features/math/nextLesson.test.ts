import { describe, expect, it } from 'vitest';
import { nextLesson } from './nextLesson';
import { LESSONS, getLesson } from '../../data/math/lessons';

describe('다음 놀이', () => {
  it('같은 마을의 안 한 놀이가 먼저, 없으면 열린 다른 마을, 다 했으면 없음', () => {
    expect(nextLesson(['counting1'], getLesson('counting1'))?.id).toBe('comparing1');
    expect(nextLesson(['counting1', 'comparing1', 'addition1', 'subtraction1', 'difference1'], getLesson('difference1'))?.id).toBe('patterns1');
    // 달빛 숲이 열리기 전에는 도토리 마을만
    expect(nextLesson(['counting1'], getLesson('counting1'))?.region).toBe('acornVillage');
    expect(nextLesson(LESSONS.map((l) => l.id), getLesson('double1'))).toBeNull();
  });
});
