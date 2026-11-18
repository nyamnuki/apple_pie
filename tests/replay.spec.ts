import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, answersFor, collectProblems } from './helpers';
import { sceneKey } from '../src/features/math/variation';

// 다시 할 때 (물건까지 바뀌는 문제): 수만이 아니라 물건·많은 쪽도 바뀌고, 문장과 답 버튼 이름이 그 장면을 따른다
test('다시 하면 물건도 바뀌고 문장·답 버튼이 그 물건 이름을 쓴다 (비교, 4번째 판)', async ({ page, context }) => {
  const { lesson } = answersFor('comparing1', 3);
  const scene = lesson.apply as { itemA: string; itemB: string; a: number; b: number };
  expect([scene.itemA, scene.itemB]).toEqual(['apple', 'shell']); // 이 판의 물건 (판 번호로 정해진다)
  await seed(context, { save: makeSave({ lessonStats: { comparing1: { plays: 3, firstTry: 3, hints: 0, lastPlayed: '2026-10-26T09:00:00Z' } } }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: /^Acorn Village/ }).click();
  await page.getByRole('button', { name: /Which Has More\?/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const pair = page.getByRole('button', { name: 'Make a pair' });
  while (await pair.count()) await pair.first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(guide(page)).toHaveText('Look at the mushrooms and the cookies. Which group has more?');
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await expect(choices.getByRole('button', { name: 'The mushrooms' })).toBeVisible();
  await choices.getByRole('button', { name: "They're the same" }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(guide(page)).toHaveText('Look at the apples and the shells. Which group has more?');
  const more = scene.a > scene.b ? 'apples' : 'shells';
  await choices.getByRole('button', { name: `The ${more}` }).click();
  await expect(guide(page)).toHaveText(`Yes! Some ${more} are left over, so there are more ${more}.`);
  expect(problems).toEqual([]);
});

test('같은 놀이를 여러 번 해도 똑같은 문제가 다시 나오지 않는다 (앱과 같은 규칙으로 30판)', () => {
  const keys = Array.from({ length: 30 }, (_, p) => sceneKey(answersFor('subtraction1', p).lesson.apply));
  expect(new Set(keys).size).toBe(30);
});
