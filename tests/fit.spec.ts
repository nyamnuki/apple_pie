import { test, expect } from '@playwright/test';
import { seed, makeSave } from './helpers';
import { LESSONS, lessonKey } from '../src/data/math/lessons';
import { getRegion } from '../src/data/regions/regions';
import { translate } from '../src/i18n/translate';

// 모든 놀이 × 보통·어려움: 예상하기 화면에서 장면이 놀이판 밖으로 삐져나오지 않고, 답 버튼이 화면 안에 보인다.
// 어려움 단계는 수가 커지므로 (수직선이 20 에서 잘리던 문제처럼) 장면이 망가지기 쉽다.
// 흔한 작은 안드로이드 크기(360×740)에서 본다.
test.use({ viewport: { width: 360, height: 740 } });

for (const level of ['normal', 'hard'] as const)
  for (const lesson of LESSONS)
    test(`화면 맞춤: ${lesson.id} (${level})`, async ({ page, context }) => {
      await seed(context, { save: makeSave({ completedLessons: LESSONS.map((l) => l.id) }) });
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
    });
