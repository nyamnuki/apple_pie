import { test, expect } from '@playwright/test';
import { seed, makeSave, guide } from './helpers';
import { dailyLesson } from '../src/features/daily/daily';
import { answerOf } from '../src/features/math/answers';

// 오늘의 문제: 지도 위 버튼 → 한 문제 → 도장 → 오늘은 끝
test('오늘의 문제를 풀면 도장을 받고, 지도에 오늘 푼 것으로 보인다', async ({ page, context }) => {
  const day = new Date(2026, 9, 26, 10, 0);
  await page.clock.setFixedTime(day);
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'addition1'] }) });
  const lesson = dailyLesson(day, ['counting1', 'addition1'])!;
  const right = String(answerOf(lesson.apply));
  const wrong = String(lesson.applyChoices.find((c) => String(c) !== right));

  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: /^Today's puzzle/ })).toContainText('A new one every day!');
  await page.getByRole('button', { name: /^Today's puzzle/ }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: wrong, exact: true }).click();
  await expect(guide(page)).toHaveText(/^Let's try another way!/); // 틀리면 힌트
  await choices.getByRole('button', { name: right, exact: true }).click();
  await expect(page.getByText('Puzzle stamps: 1')).toBeVisible();
  await expect(page.getByText('2 more stamps for a golden acorn!')).toBeVisible();
  await page.getByRole('button', { name: 'Back to the map' }).click();
  await expect(page.getByRole('button', { name: /^Today's puzzle/ })).toContainText('Solved today.');
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('mathTown.save')!).game.dailyDone)).toEqual(['2026-10-26']);
});

test('끝낸 놀이가 없으면 오늘의 문제 버튼이 없다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: /^Today's puzzle/ })).toHaveCount(0);
});

test('도장 3개째에 황금 도토리 선물', async ({ page, context }) => {
  const day = new Date(2026, 9, 26, 10, 0);
  await page.clock.setFixedTime(day);
  const save = makeSave({ completedLessons: ['counting1'] });
  await seed(context, { save: { ...save, game: { ...save.game, dailyDone: ['2026-10-20', '2026-10-21'] } } });
  const lesson = dailyLesson(day, ['counting1'])!;
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: /^Today's puzzle/ }).click();
  await page.getByRole('group', { name: 'Answer choices' }).getByRole('button', { name: String(answerOf(lesson.apply)), exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'A gift for 3 stamps:' })).toBeVisible();
  if (process.env.SHOT_DIR) await page.waitForTimeout(800).then(() => page.screenshot({ path: `${process.env.SHOT_DIR}/daily-golden.png` }));
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('mathTown.save')!).game.resources.goldenAcorn)).toBe(1);
});
