import { test, expect } from '@playwright/test';
import { seed, makeSave } from './helpers';
import { LESSONS, lessonKey } from '../src/data/math/lessons';
import { getRegion } from '../src/data/regions/regions';
import { translate } from '../src/i18n/translate';
import { lessonForPlay } from '../src/features/math/variation';
import type { MathLesson, MathScene } from '../src/types/math';

// 장면에 늘어놓는 것의 수 (클수록 화면을 많이 차지한다)
const spread = (s: MathScene): number =>
  s.kind === 'count' ? s.total
  : s.kind === 'compare' || s.kind === 'difference' ? s.a + s.b
  : s.kind === 'add' ? s.start + s.add
  : s.kind === 'subtract' ? s.start
  : s.kind === 'groups' ? s.groups * s.size + s.ones
  : s.kind === 'pairs' || s.kind === 'share' ? s.total
  : s.kind === 'double' ? s.n * 2
  : s.kind === 'shapes' ? s.shapes.length
  : s.kind === 'hops' ? Math.max(s.start, s.start + s.hop)
  : s.kind === 'measure' ? s.length
  : 0;
// 다시 할 때 나오는 문제 가운데 가장 큰 판 (1~40판)
function biggestPlay(lesson: MathLesson, level: 'normal' | 'hard', boost = 0) {
  let best = 1;
  let top = -1;
  for (let p = 1; p <= 40; p++) {
    const v = lessonForPlay(lesson, p, level, boost);
    const size = Math.max(spread(v.predict), spread(v.apply));
    if (size > top) [best, top] = [p, size];
  }
  return best;
}

// 모든 놀이 × 보통·어려움: 예상하기 화면에서 장면이 놀이판 밖으로 삐져나오지 않고, 답 버튼이 화면 안에 보인다.
// 어려움 단계는 수가 커지므로 (수직선이 20 에서 잘리던 문제처럼) 장면이 망가지기 쉽다.
// 흔한 작은 안드로이드 크기(360×740)에서 본다.
test.use({ viewport: { width: 360, height: 740 } });

// 처음 판과, 다시 할 때 나오는 가장 큰 판을 본다
for (const level of ['normal', 'hard'] as const)
  for (const lesson of LESSONS)
    // 어려움은 도전 3단계(가장 큰 수)의 가장 큰 판도 본다
    for (const which of (level === 'hard' ? ['first', 'biggest', 'boost3'] : ['first', 'biggest']) as ('first' | 'biggest' | 'boost3')[])
    test(`화면 맞춤: ${lesson.id} (${level}, ${which === 'first' ? '처음 판' : which === 'biggest' ? '가장 큰 판' : '도전 3단계 가장 큰 판'})`, async ({ page, context }) => {
      const boost = which === 'boost3' ? 3 : 0;
      const plays = which === 'first' ? 0 : biggestPlay(lesson, level, boost);
      await seed(context, { save: makeSave({ completedLessons: LESSONS.map((l) => l.id), lessonStats: plays ? { [lesson.id]: { plays, firstTry: 0, hints: 0, lastPlayed: '2026-11-01T00:00:00Z', boost } } : undefined }) });
      await context.addInitScript((lv) => localStorage.setItem('mathTown.settings', JSON.stringify({ voice: false, music: false, sound: false, breakMinutes: 0, mathLevel: lv })), level);
      await page.goto('/');
      await page.getByRole('button', { name: 'Start', exact: true }).click();
      await page.getByRole('button', { name: 'Play', exact: true }).click();
      await page.getByRole('button', { name: new RegExp(`^${translate('en', getRegion(lesson.region).nameKey)}`) }).click();
      await page.getByRole('button', { name: translate('en', lessonKey(lesson.id, 'title')) }).first().click();
      const next = page.getByRole('button', { name: 'Next', exact: true });
      await next.click();
      // 만져 보기: 장면 안 버튼을 돌아가며 누른다 (도형 찾기처럼 눌러도 그대로인 버튼이 있다)
      for (let k = 0; k < 150 && !(await next.isEnabled()); k++) {
        const buttons = page.locator('main section button:not([disabled])');
        const n = await buttons.count();
        if (!n) break;
        await buttons.nth(k % n).click();
      }
      await expect(next).toBeEnabled();
      await next.click();
      await expect(page.getByRole('group', { name: 'Answer choices' })).toBeVisible();
      await page.waitForTimeout(300);
      const fit = await page.evaluate(() => {
        const sec = document.querySelector('main section')!.getBoundingClientRect();
        const outside = [...document.querySelectorAll('main section *')].filter((e) => {
          const b = e.getBoundingClientRect();
          return b.width > 0 && (b.right > sec.right + 2 || b.left < sec.left - 2);
        }).length;
        const choices = document.querySelector('[role=group][aria-label="Answer choices"]')!.getBoundingClientRect();
        return { outside, choicesBottom: Math.round(choices.bottom), screen: innerHeight };
      });
      expect(fit.outside, '놀이판 밖으로 나온 것').toBe(0);
      expect(fit.choicesBottom, '답 버튼 아래 끝').toBeLessThanOrEqual(fit.screen);
      if (which === 'first') return;
      // 해 보기 장면도 본다
      await page.getByRole('group', { name: 'Answer choices' }).getByRole('button').first().click();
      await expect(next).toBeEnabled({ timeout: 20000 }); // 확인하기 시범 (많이 세도 10초 안팎)
      await next.click();
      await next.click();
      await expect(page.getByRole('group', { name: 'Answer choices' })).toBeVisible();
      await page.waitForTimeout(300);
      const fit2 = await page.evaluate(() => {
        const sec = document.querySelector('main section')!.getBoundingClientRect();
        const outside = [...document.querySelectorAll('main section *')].filter((e) => {
          const b = e.getBoundingClientRect();
          return b.width > 0 && (b.right > sec.right + 2 || b.left < sec.left - 2);
        }).length;
        const choices = document.querySelector('[role=group][aria-label="Answer choices"]')!.getBoundingClientRect();
        return { outside, choicesBottom: Math.round(choices.bottom), screen: innerHeight };
      });
      expect(fit2.outside, '해 보기: 놀이판 밖으로 나온 것').toBe(0);
      expect(fit2.choicesBottom, '해 보기: 답 버튼 아래 끝').toBeLessThanOrEqual(fit.screen);
    });
