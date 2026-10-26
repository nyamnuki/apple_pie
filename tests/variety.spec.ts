import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave, answersFor, waitLastButtonEnabled, goToRegion } from './helpers';

// 다시 할 때 바뀌는 문제 · 그림 지도 · 방 크게 보기

test('다시 할 때마다 해 보기 문제의 수가 바뀌고, 정답을 고르면 끝낼 수 있다', async ({ page, context }) => {
  const at = '2026-10-25T09:00:00.000Z';
  await seed(context, { save: makeSave({ completedLessons: ['counting1'], lessonStats: { counting1: { plays: 2, firstTry: 2, hints: 0, lastPlayed: at } } }) });
  const first = answersFor('counting1', 0).lesson;
  const second = answersFor('counting1', 2);
  const third = answersFor('counting1', 3);
  // 테스트가 의미 있으려면 판마다 문제가 달라야 한다
  expect(JSON.stringify(second.lesson.apply)).not.toBe(JSON.stringify(first.apply));
  expect(JSON.stringify(third.lesson.apply)).not.toBe(JSON.stringify(second.lesson.apply));

  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Acorn Village/);
  await page.getByRole('button', { name: /Counting Apples/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const apple = page.getByRole('button', { name: 'Count this one' });
  while (await apple.count()) await apple.first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await expect(choices.getByRole('button')).toHaveText(second.lesson.predictChoices.map(String));
  await choices.getByRole('button', { name: second.firstPredict, exact: true }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(choices.getByRole('button')).toHaveText(second.lesson.applyChoices.map(String));
  await choices.getByRole('button', { name: second.apply, exact: true }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.waitForTimeout(300);
  expect((await readSave(page)).game.lessonStats.counting1.plays).toBe(3);

  // 다시 하기 → 또 다른 문제
  await page.getByRole('button', { name: 'Play again' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  while (await apple.count()) await apple.first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(choices.getByRole('button')).toHaveText(third.lesson.predictChoices.map(String));
});

test('지도: 마을마다 풍경 그림, 잠긴 마을은 안개와 자물쇠', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  for (const name of [/^Acorn Village/, /^Moonlight Forest/, /^Crystal Cave/]) await expect(page.getByRole('button', { name }).locator('svg').first()).toBeVisible();
  const cave = page.getByRole('button', { name: /^Crystal Cave/ });
  await expect(cave).toBeDisabled();
  await expect(cave.locator('svg[data-icon="lock"]')).toBeVisible();
});

test('방 크게 보기: 돋보기 버튼으로 바닥 칸이 커지고, 커진 상태에서도 놓을 수 있다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  const tile = page.getByRole('button', { name: 'Floor spot, row 5, column 4' });
  const before = (await tile.boundingBox())!;
  await page.getByRole('button', { name: 'Make the room bigger' }).click();
  await expect(page.getByRole('button', { name: 'Show the whole room' })).toHaveAttribute('aria-pressed', 'true');
  const after = (await tile.boundingBox())!;
  expect(after.width).toBeGreaterThan(before.width * 1.5);
  await tile.click({ force: true });
  await expect(page.getByText('Nice! It fits just right.')).toBeVisible();
  await page.getByRole('button', { name: 'Show the whole room' }).click();
  await expect(page.getByRole('button', { name: 'Make the room bigger' })).toHaveAttribute('aria-pressed', 'false');
  await page.waitForTimeout(300);
  expect((await readSave(page)).room.placed.find((p: { furnitureId: string }) => p.furnitureId === 'toyChest')).toMatchObject({ gx: 3, gy: 4 });
});
