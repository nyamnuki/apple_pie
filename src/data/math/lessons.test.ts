import { describe, expect, it } from 'vitest';
import { LESSONS } from './lessons';
import { MATH_ITEMS } from './items';
import { answerOf } from '../../features/math/answers';
import { REGIONS } from '../regions/regions';
import { getResource } from '../resources/resources';
import { FURNITURE } from '../furniture/furniture';
import { bundleEntries } from '../../utils/bundles';
import { sizeOk } from './sceneRules';

// 레슨 데이터 점검: 선택지에 정답이 있는지, 수의 범위, 보상과 레시피가 서로 맞는지

describe('레슨 목록', () => {
  it('도토리 마을 4개, 달빛 숲 3개, 수정 동굴 2개, 햇살 들판 2개, 바람 언덕 2개 (README 와 같다)', () => {
    expect(LESSONS.filter((l) => l.region === 'acornVillage')).toHaveLength(4);
    expect(LESSONS.filter((l) => l.region === 'moonlightForest').map((l) => l.id)).toEqual(['patterns1', 'shapes1', 'measure1']);
    expect(LESSONS.filter((l) => l.region === 'crystalCave').map((l) => l.id)).toEqual(['skipCount1', 'tens1']);
    expect(LESSONS.filter((l) => l.region === 'sunnyMeadow').map((l) => l.id)).toEqual(['numberLine1', 'evenOdd1']);
    expect(LESSONS.filter((l) => l.region === 'windyHill').map((l) => l.id)).toEqual(['clock1', 'clock2']);
  });

  it('id 가 겹치지 않는다', () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
  });

  for (const lesson of LESSONS) {
    describe(lesson.id, () => {
      it('세 장면의 종류가 같고 수의 범위가 맞다', () => {
        expect(lesson.predict.kind).toBe(lesson.explore.kind);
        expect(lesson.apply.kind).toBe(lesson.explore.kind);
        for (const scene of [lesson.explore, lesson.predict, lesson.apply]) expect(sizeOk(scene), JSON.stringify(scene)).toBe(true);
      });

      it('선택지에 정답이 하나 있고 선택지가 겹치지 않는다', () => {
        for (const [scene, choices] of [
          [lesson.predict, lesson.predictChoices],
          [lesson.apply, lesson.applyChoices],
        ] as const) {
          expect(choices).toContain(answerOf(scene));
          expect(new Set(choices).size).toBe(choices.length);
          // 짝수·홀수는 답이 둘뿐 (그 밖에는 3개 이상)
          if (scene.kind === 'pairs') expect(choices).toEqual(['even', 'odd']);
          else expect(choices.length).toBeGreaterThanOrEqual(3);
        }
      });

      it('비교 문제에는 그룹 이름이, 규칙 문제에는 아는 물건만 있다', () => {
        if (lesson.explore.kind === 'compare') {
          expect(lesson.predictLabels).toBeDefined();
          expect(lesson.applyLabels).toBeDefined();
        }
        if (lesson.explore.kind === 'pattern') {
          for (const c of [...lesson.predictChoices, ...lesson.applyChoices]) expect(Object.keys(MATH_ITEMS)).toContain(c);
        }
      });

      it('보상은 그 마을에서 나는 재료이다', () => {
        expect(bundleEntries(lesson.rewards).length).toBeGreaterThan(0);
        for (const [id] of [...bundleEntries(lesson.rewards), ...bundleEntries(lesson.firstTimeBonus)]) expect(getResource(id).region).toBe(lesson.region);
      });
    });
  }
});

describe('마을과 레시피', () => {
  it('마을 열림 조건은 실제로 채울 수 있다 (필요한 놀이 수 ≤ 그 마을 놀이 수)', () => {
    for (const r of REGIONS) {
      if (r.unlock.type !== 'lessons') continue;
      const { region, count } = r.unlock;
      expect(LESSONS.filter((l) => l.region === region).length).toBeGreaterThanOrEqual(count);
    }
  });

  it('레시피의 모든 재료는 어떤 놀이에서든 얻을 수 있다 (만들 수 없는 가구가 없다)', () => {
    const obtainable = new Set(LESSONS.flatMap((l) => [...bundleEntries(l.rewards), ...bundleEntries(l.firstTimeBonus)].map(([id]) => id)));
    for (const f of FURNITURE) {
      if (f.unlockCondition.type !== 'recipe') continue;
      for (const [id] of bundleEntries(f.unlockCondition.cost)) expect(obtainable.has(id), `${f.id} 의 재료 ${id}`).toBe(true);
    }
  });
});
