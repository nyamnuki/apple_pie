import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, collectProblems, goToRegion, englishWords } from './helpers';

// 바람 언덕: 시계 읽기 (정각, 30분)
const OPEN = ['counting1', 'comparing1', 'patterns1', 'shapes1', 'skipCount1', 'tens1', 'numberLine1', 'evenOdd1'];

test('놀이: 몇 시일까? (짧은바늘을 한 칸씩 돌리기)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Windy Hill/);
  await page.getByRole('button', { name: /What Time Is It\?/ }).click();
  await expect(guide(page)).toHaveText('Look at the clock. The long hand points to 12. The short hand points to 3.');
  await page.getByRole('button', { name: 'Next' }).click();
  const turn = page.getByRole('button', { name: 'Turn the short hand' });
  let taps = 0;
  while (await turn.count()) {
    await turn.click();
    taps++;
  }
  expect(taps).toBe(3);
  await expect(guide(page)).toHaveText("The short hand is on 3 and the long hand is on 12. It is 3 o'clock!");
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await expect(choices.getByRole('button')).toHaveText(['6:00', '7:00', '8:00', '12:00']);
  await choices.getByRole('button', { name: '12:00' }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '10:00' }).click();
  await expect(guide(page)).toHaveText("Yes! It is 10 o'clock!");
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Feather +2' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Cloud Cotton +1' })).toBeVisible();
  expect(problems).toEqual([]);
});

test('놀이: 30분 (한국어, 긴바늘 돌리기와 "○시 30분" 선택지)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN }), locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  await goToRegion(page, /^바람 언덕/);
  await page.getByRole('button', { name: /30분/ }).click();
  await page.getByRole('button', { name: '다음' }).click();
  const turn = page.getByRole('button', { name: '긴바늘 돌리기' });
  let taps = 0;
  while (await turn.count()) {
    await turn.click();
    taps++;
  }
  expect(taps).toBe(6);
  await expect(guide(page)).toHaveText('긴바늘이 반 바퀴 돌아 6에 왔어요. 4시 30분이에요!');
  await page.getByRole('button', { name: '다음' }).click();
  const choices = page.getByRole('group', { name: '답 고르기' });
  await expect(choices.getByRole('button')).toHaveText(['6시', '8시', '8시 30분', '9시 30분']);
  await choices.getByRole('button', { name: '8시 30분' }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await choices.getByRole('button', { name: '2시 30분' }).click();
  await expect(guide(page)).toHaveText('맞아요! 2시 30분이에요!');
  expect(await englishWords(page)).toBeNull();
});
