import { describe, expect, it } from 'vitest';
import { lessonForPlay, sameKey } from './variation';
import { answerOf, sceneVars } from './answers';
import { LESSONS, lessonKey } from '../../data/math/lessons';
import { sizeOk } from '../../data/math/sceneRules';
import { en } from '../../i18n/locales/en';
import type { LessonTextPart, MathScene } from '../../types/math';

// 다시 할 때마다 바뀌는 문제: 여러 판을 만들어 보고 규칙이 지켜지는지 확인한다
const PLAYS = Array.from({ length: 200 }, (_, i) => i + 1);
const read = (key: string) => key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], en) as string;
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);

describe('다시 할 때 바뀌는 문제', () => {
  it('처음 하는 판은 lessons.ts 그대로다', () => {
    for (const lesson of LESSONS) expect(lessonForPlay(lesson, 0)).toBe(lesson);
  });

  it('바로 앞 판과 해 보기 정답이 같지 않다 (비교는 두 수가 같지 않다, 규칙 찾기 제외)', () => {
    for (const lesson of LESSONS.filter((l) => l.area !== 'patterns'))
      for (const p of PLAYS) expect(sameKey(lessonForPlay(lesson, p).apply), `${lesson.id} ${p}`).not.toEqual(sameKey(lessonForPlay(lesson, p - 1).apply));
  });

  it('같은 판 번호면 같은 문제 (다시 열어도 바뀌지 않는다)', () => {
    for (const lesson of LESSONS) expect(lessonForPlay(lesson, 3)).toEqual(lessonForPlay(lesson, 3));
  });

  for (const lesson of LESSONS) {
    describe(lesson.id, () => {
      const variants = PLAYS.map((p) => lessonForPlay(lesson, p));

      it('수의 범위가 맞고, 정답이 선택지에 딱 한 번, 선택지는 3개 이상 겹치지 않는다', () => {
        for (const v of variants) {
          for (const [scene, choices] of [[v.predict, v.predictChoices], [v.apply, v.applyChoices]] as const) {
            expect(sizeOk(scene), JSON.stringify(scene)).toBe(true);
            expect(choices.filter((c) => c === answerOf(scene))).toHaveLength(1);
            expect(new Set(choices).size).toBe(choices.length);
            if (scene.kind === 'pairs') expect(choices).toEqual(['even', 'odd']);
            else expect(choices.length).toBeGreaterThanOrEqual(3);
          }
        }
      });

      it('가르치는 점은 그대로 (같은 종류, 비교의 많은 쪽·똑같음, 10 넘는 덧셈, 10 아래로 빼기)', () => {
        for (const v of variants) {
          for (const [orig, next] of [[lesson.predict, v.predict], [lesson.apply, v.apply]] as [MathScene, MathScene][]) {
            expect(next.kind).toBe(orig.kind);
            if (orig.kind === 'compare') expect(answerOf(next)).toBe(answerOf(orig));
            if (next.kind === 'add') expect(next.start + next.add).toBeGreaterThan(10);
            if (next.kind === 'subtract') expect(next.start - next.remove).toBeLessThan(10);
            if (next.kind === 'groups' && orig.kind === 'groups') {
              expect(next.size).toBe(orig.size);
              if (next.size === 2) expect(next.ones).toBe(orig.ones); // 문장이 '혼자 있는 하나'를 말한다
              else expect(next.groups).toBeGreaterThanOrEqual(3); // 문장이 '10, 20, 30…' 하고 센다
            }
          }
          // 처음 살펴보는 장면은 바뀌지 않는다
          expect(v.explore).toBe(lesson.explore);
        }
      });

      it('문장 속 {자리}를 바뀐 장면으로 모두 채울 수 있다', () => {
        for (const v of variants.slice(0, 20)) {
          const parts: [LessonTextPart, MathScene][] = [['predict', v.predict], ['verify', v.predict], ['apply', v.apply], ['hint1', v.apply], ['hint2', v.apply], ['hint3', v.apply], ['correct', v.apply]];
          for (const [part, scene] of parts) {
            const vars = sceneVars(scene, String);
            for (const name of placeholders(read(lessonKey(v.id, part)))) expect(vars, `${v.id}.${part} {${name}}`).toHaveProperty(name);
          }
        }
      });

      it('여러 판을 하면 실제로 다른 문제가 나온다 (규칙 찾기는 그대로)', () => {
        // 비교는 '어느 쪽이 많은지'는 그대로 두고 수만 바꾸므로 장면 자체를 비교한다
        const scenes = new Set(variants.map((v) => JSON.stringify([v.predict, v.apply])));
        if (lesson.area === 'patterns') expect(scenes.size).toBe(1);
        else expect(scenes.size).toBeGreaterThan(10);
      });
    });
  }
});
