import { describe, expect, it } from 'vitest';
import { itemsOf, lessonForPlay, sameKey, sceneKey } from './variation';
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

  it('바로 앞 판과 해 보기 정답이 같지 않다 (비교는 두 수가 같지 않다)', () => {
    for (const lesson of LESSONS)
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
            // 비교: '똑같다'는 계속 똑같게. 똑같지 않은 문제는 어느 쪽이 많은지가 판마다 바뀐다 (똑같아지지는 않는다)
            if (orig.kind === 'compare') expect(answerOf(next) === 'same').toBe(answerOf(orig) === 'same');
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

      it('여러 판을 하면 실제로 다른 문제가 나온다', () => {
        // 비교는 '어느 쪽이 많은지'는 그대로 두고 수만 바꾸므로 장면 자체를 비교한다
        // 규칙 찾기는 멈추는 자리만 바뀐다 (묶음 하나 길이만큼, 예상하기 × 해 보기)
        const scenes = new Set(variants.map((v) => JSON.stringify([v.predict, v.apply])));
        expect(scenes.size).toBeGreaterThan(lesson.area === 'patterns' ? 8 : 10);
      });
    });
  }
});

// 어려움 단계: 같은 놀이를 더 큰 수로 낸다 (타이틀 화면에서 고른다)
const HARD_PLAYS = Array.from({ length: 60 }, (_, i) => i);
// 그 장면에서 아이가 다루는 가장 큰 수 (단계에 따라 실제로 커지는지 보기 위해)
// 묶어 세기는 전체 개수, 비교는 많은 쪽, 나머지는 정답 (정답이 수가 아니면 장면에 적힌 수 가운데 가장 큰 것)
const biggest = (scene: MathScene): number => {
  if (scene.kind === 'groups') return scene.groups * scene.size + scene.ones;
  if (scene.kind === 'compare') return Math.max(scene.a, scene.b);
  const answer = answerOf(scene);
  return typeof answer === 'number' ? answer : Math.max(...(JSON.stringify(scene).match(/\d+/g) ?? ['0']).map(Number));
};

describe('어려움 단계 (50까지)', () => {
  it('첫 판부터 문제를 바꾼다', () => {
    for (const lesson of LESSONS) expect(lessonForPlay(lesson, 0, 'hard'), lesson.id).not.toBe(lesson);
  });

  it('같은 판 번호면 같은 문제 (다시 열어도 바뀌지 않는다)', () => {
    for (const lesson of LESSONS) expect(lessonForPlay(lesson, 3, 'hard')).toEqual(lessonForPlay(lesson, 3, 'hard'));
  });

  it('수가 커지는 놀이에서는 보통 단계보다 큰 수가 나온다', () => {
    const SCALED = ['count', 'compare', 'add', 'subtract', 'groups', 'hops', 'pairs', 'share', 'double', 'difference'];
    for (const lesson of LESSONS) {
      if (!SCALED.includes(lesson.apply.kind)) continue;
      const top = (level: 'normal' | 'hard') => Math.max(...HARD_PLAYS.map((p) => biggest(lessonForPlay(lesson, p, level).apply)));
      expect(top('hard'), lesson.id).toBeGreaterThan(top('normal'));
    }
  });

  for (const lesson of LESSONS) {
    describe(lesson.id, () => {
      const variants = HARD_PLAYS.map((p) => lessonForPlay(lesson, p, 'hard'));

      it('어려움 범위 안이고, 정답이 선택지에 딱 한 번, 선택지는 겹치지 않는다', () => {
        for (const v of variants) {
          for (const [scene, choices] of [[v.predict, v.predictChoices], [v.apply, v.applyChoices]] as const) {
            expect(sizeOk(scene, 'hard'), JSON.stringify(scene)).toBe(true);
            expect(choices.filter((c) => c === answerOf(scene))).toHaveLength(1);
            expect(new Set(choices).size).toBe(choices.length);
            if (scene.kind === 'pairs') expect(choices).toEqual(['even', 'odd']);
            else expect(choices.length).toBeGreaterThanOrEqual(3);
          }
        }
      });

      it('가르치는 점은 그대로 (같은 종류, 비교의 많은 쪽, 십의 자리를 넘는 덧셈·뺄셈)', () => {
        const tens = (n: number) => Math.floor(n / 10);
        for (const v of variants) {
          for (const [orig, next] of [[lesson.predict, v.predict], [lesson.apply, v.apply]] as [MathScene, MathScene][]) {
            expect(next.kind).toBe(orig.kind);
            // 비교: '똑같다'는 계속 똑같게. 똑같지 않은 문제는 어느 쪽이 많은지가 판마다 바뀐다 (똑같아지지는 않는다)
            if (orig.kind === 'compare') expect(answerOf(next) === 'same').toBe(answerOf(orig) === 'same');
            if (next.kind === 'add') expect(tens(next.start + next.add), JSON.stringify(next)).toBeGreaterThan(tens(next.start));
            if (next.kind === 'subtract') expect(tens(next.start - next.remove), JSON.stringify(next)).toBeLessThan(tens(next.start));
            if (next.kind === 'groups' && orig.kind === 'groups') {
              expect(next.size).toBe(orig.size);
              if (next.size === 2) expect(next.ones).toBe(orig.ones); // 문장이 '혼자 있는 하나'를 말한다
              else expect(next.groups).toBeGreaterThanOrEqual(3); // 문장이 '10, 20, 30…' 하고 센다
            }
          }
          expect(v.explore).toBe(lesson.explore); // 처음 살펴보는 장면은 두 단계가 같다
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
    });
  }
});

// 정확히 같은 문제가 되풀이되지 않는다 (수·물건·도형·순서까지 모두 같은 장면)
describe('정확히 같은 문제는 다시 나오지 않는다', () => {
  // 낼 수 있는 문제가 적은 놀이는 그만큼만 본다
  // (시계 12 가지, 길이 재기 3 물건 × 6·5 길이, 보통 단계 2씩 세기는 20 을 넘지 않는 짝 수 4 가지 × 물건)
  const runFor = (lesson: (typeof LESSONS)[number], level: 'normal' | 'hard') =>
    lesson.apply.kind === 'clock' ? 12 : lesson.apply.kind === 'measure' ? (level === 'hard' ? 12 : 15) : lesson.id === 'skipCount1' && level === 'normal' ? 24 : 30;
  for (const level of ['normal', 'hard'] as const) {
    for (const lesson of LESSONS) {
      it(`${level} ${lesson.id}: 처음 ${runFor(lesson, level)}판 동안 예상하기·해 보기 장면이 모두 다르다`, () => {
        const plays = Array.from({ length: runFor(lesson, level) }, (_, p) => lessonForPlay(lesson, p, level));
        expect(new Set(plays.map((v) => sceneKey(v.predict))).size).toBe(plays.length);
        expect(new Set(plays.map((v) => sceneKey(v.apply))).size).toBe(plays.length);
      });
    }
  }

  it('나올 수 있는 문제를 다 내면 새 바퀴로 이어진다 (시계: 12 판 뒤에도 문제가 나온다)', () => {
    const clock = LESSONS.find((l) => l.id === 'clock1')!;
    const hours = Array.from({ length: 24 }, (_, p) => (lessonForPlay(clock, p).apply as { hour: number }).hour);
    expect(new Set(hours.slice(0, 12)).size).toBe(12);
    expect(new Set(hours.slice(12)).size).toBeGreaterThanOrEqual(10);
  });
});

describe('물건과 모양도 바뀐다', () => {
  const plays = (id: string, n = 30) => Array.from({ length: n }, (_, p) => lessonForPlay(LESSONS.find((l) => l.id === id)!, p));

  for (const lesson of LESSONS.filter((l) => l.pools)) {
    it(`${lesson.id}: 바꿔 넣는 물건은 그 장면의 묶음에서만, 여러 가지가 나온다`, () => {
      for (const part of ['predict', 'apply'] as const) {
        const pool = lesson.pools![part]!;
        const seen = new Set<string>();
        for (const v of plays(lesson.id)) for (const id of itemsOf(v[part])) {
          expect(pool, `${lesson.id}.${part}`).toContain(id);
          seen.add(id);
        }
        expect(seen.size, `${lesson.id}.${part}`).toBeGreaterThanOrEqual(Math.min(4, pool.length - 1)); // 살펴보기 물건은 되도록 피한다
      }
    });
  }

  it('같은 판의 예상하기와 해 보기는 되도록 다른 물건을 쓴다 (새 문제가 모자랄 때만 같은 물건, 30판 중 5판까지)', () => {
    for (const lesson of LESSONS.filter((l) => l.pools && l.apply.kind !== 'ordinal' && l.apply.kind !== 'pattern')) {
      const same = plays(lesson.id).slice(1).filter((v) => itemsOf(v.apply).some((id) => itemsOf(v.predict).includes(id)));
      expect(same.length, lesson.id).toBeLessThanOrEqual(5);
    }
  });

  it('비교: 어느 쪽이 많은지가 판마다 바뀐다 (버튼 이름도 그 물건)', () => {
    const answers = new Set(plays('comparing1').map((v) => answerOf(v.apply)));
    expect([...answers].sort()).toEqual(['a', 'b']);
  });

  it('규칙 찾기: 물건이 바뀌어도 짜임새(별 별 달 달 / 넷이 다른 것)와 선택지가 맞다', () => {
    for (const v of plays('patterns1').slice(1)) {
      const [p, a] = [v.predict, v.apply] as Extract<MathScene, { kind: 'pattern' }>[];
      expect(p.unit[0]).toBe(p.unit[1]);
      expect(p.unit[2]).toBe(p.unit[3]);
      expect(p.unit[0]).not.toBe(p.unit[2]);
      expect(new Set(a.unit).size).toBe(4);
      expect(new Set(v.predictChoices).size).toBe(3);
      for (const id of new Set(p.unit)) expect(v.predictChoices).toContain(id);
      expect([...v.applyChoices].sort()).toEqual([...a.unit].sort());
    }
  });

  it('도형 찾기는 찾는 도형이, 길이 재기는 재는 물건이 바뀐다', () => {
    expect(new Set(plays('shapes1').map((v) => (v.apply as { target: string }).target)).size).toBe(2);
    expect(new Set(plays('measure1').map((v) => (v.apply as { thing: string }).thing)).size).toBe(3);
  });

  it('몇 번째: 줄 선 동물과 순서가 바뀐다', () => {
    expect(new Set(plays('ordinal1').map((v) => (v.apply as { items: string[] }).items.join())).size).toBeGreaterThan(25);
  });
});

describe('확인하기 시범 속도', () => {
  it('12개까지는 0.8초씩, 많으면 모두 10초 안팎 (가장 빨라도 0.3초)', async () => {
    const { demoDelay } = await import('./fields/useSequence');
    expect(demoDelay(10)).toBe(800);
    expect(demoDelay(12)).toBe(800);
    for (const n of [16, 20, 32, 50]) expect(demoDelay(n) * n).toBeLessThanOrEqual(15000);
    expect(demoDelay(100)).toBe(300);
  });
});
