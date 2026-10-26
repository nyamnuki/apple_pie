import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, collectProblems, goToRegion } from './helpers';

// 무지개 호수: 똑같이 나누기, 두 배
const OPEN = ['counting1', 'comparing1', 'patterns1', 'shapes1', 'skipCount1', 'tens1', 'numberLine1', 'evenOdd1', 'clock1', 'clock2'];

test('지도: 바람 언덕 놀이 2개를 끝내면 무지개 호수가 열린다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN.slice(0, -1) }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: /^Rainbow Lake/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: /^Rainbow Lake/ })).toContainText('Finish 2 games in Windy Hill to open it. (1/2)');
});

test('놀이: 똑같이 나누기 (하나씩 번갈아 두 접시에)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Rainbow Lake/);
  await page.getByRole('button', { name: /Share Fairly/ }).click();
  await expect(guide(page)).toHaveText("Lulu and Momo found 6 shells. Let's share them so both get the same!");
  await page.getByRole('button', { name: 'Next' }).click();
  const give = page.getByRole('button', { name: 'Give this one' });
  for (let i = 0; i < 3; i++) await give.first().click();
  await expect(page.getByRole('group', { name: 'Lulu has 2' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Momo has 1' })).toBeVisible();
  while (await give.count()) await give.first().click();
  await expect(page.getByRole('group', { name: 'Momo has 3' })).toBeVisible();
  await expect(guide(page)).toHaveText('Each friend has 3! Giving one at a time makes it fair.');
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '10', exact: true }).click(); // 흔한 실수: 전체 수
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '7', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! Each friend gets 7.');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Lily Pad +2' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Pearl +1' })).toBeVisible();
  expect(problems).toEqual([]);
});

test('놀이: 두 배 (한국어, 물에 비친 모습으로 이어 세기)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN }), locale: 'ko' });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  await goToRegion(page, /^무지개 호수/);
  await page.getByRole('button', { name: /호수에 비친 두 배/ }).click();
  await expect(guide(page)).toHaveText('호숫가에 오리가 4마리 있어요. 보세요! 물에 오리가 하나씩 더 비쳐요.');
  await page.getByRole('button', { name: '다음' }).click();
  const tap = page.getByRole('button', { name: '물에 비추기' });
  await expect(tap).toHaveCount(4);
  while (await tap.count()) await tap.first().click();
  await expect(page.locator('[data-reflection]')).toHaveCount(4);
  await expect(page.getByRole('status', { name: '센 수: 8' })).toBeVisible();
  await expect(guide(page)).toHaveText('오리 4마리와 물에 비친 4마리, 모두 8마리예요! 4의 두 배예요.');
  await page.getByRole('button', { name: '다음' }).click();
  const choices = page.getByRole('group', { name: '답 고르기' });
  await choices.getByRole('button', { name: '12', exact: true }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await choices.getByRole('button', { name: '16', exact: true }).click();
  await expect(guide(page)).toHaveText('맞아요! 8개와 8개, 모두 16개예요.');
  expect(problems).toEqual([]);
});
