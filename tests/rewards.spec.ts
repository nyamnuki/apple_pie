import { test, expect } from '@playwright/test';
import { seed, makeSave, playCountingApples, goToRegion } from './helpers';

// 보상 → 공방 → 방에 놓기 → 가방
test('놀이 보상으로 재료를 모아 공방에서 가구를 만든다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();

  await page.getByRole('button', { name: 'Workshop' }).click();
  const bookshelf = page.getByRole('listitem').filter({ hasText: 'Forest Bookshelf' });
  await expect(bookshelf.getByRole('button')).toBeDisabled();
  await expect(page.getByText('You can make this when you can visit Moonlight Forest.').first()).toBeVisible();
  await page.getByRole('button', { name: 'Go back' }).click();

  // 첫 번째: 처음 보너스(황금 도토리) 포함
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Acorn Village/);
  await playCountingApples(page);
  await expect(page.getByRole('img', { name: 'Acorn +3' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Sweet Apple +1' })).toBeVisible();
  await expect(page.getByText('First-time bonus!')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Golden Acorn +1' })).toBeVisible();
  await expect(page.getByText('You thought it through all by yourself!')).toBeVisible(); // 첫 판 칭찬

  // 두 번째: 보너스 없음
  await page.getByRole('button', { name: 'Play again' }).click();
  await playCountingApples(page, false, 1); // 두 번째 판은 수가 바뀐다
  await expect(page.getByText('First-time bonus!')).toHaveCount(0);
  await expect(page.getByText('Great counting, step by step!')).toBeVisible(); // 두 번째 판은 다른 칭찬

  await page.getByRole('button', { name: 'Make something in the Workshop' }).click();
  await expect(bookshelf.getByRole('img', { name: 'Acorn: you have 6, need 4' })).toBeVisible();
  await bookshelf.getByRole('button', { name: 'Make it!' }).click();
  await expect(page.getByText('Ta-da! The Forest Bookshelf is ready!')).toBeVisible();

  await page.getByRole('button', { name: 'Put it in my room' }).click();
  await expect(page.getByLabel('1 ready to place')).toBeVisible();
  await page.getByRole('button', { name: /Forest Bookshelf/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 5, column 4' }).click({ force: true });
  await page.getByRole('button', { name: 'Done' }).click();

  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'My Bag' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Forest Bookshelf' })).toContainText('1 of 1 in room');
});

test('공방: 아래쪽 가구를 만들어도 완성 안내가 화면에 보인다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ resources: { acorn: 9, apple: 9 }, completedLessons: ['counting1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Apple Basket' }).getByRole('button', { name: 'Make it!' }).click();
  await expect(page.getByText('Ta-da! The Apple Basket is ready!')).toBeInViewport();
});

test('공방 다음 목표: 곧 만들 가구, 모자란 재료, 그 재료를 주는 놀이', async ({ page, context }) => {
  await seed(context, { save: makeSave({ resources: { acorn: 3, apple: 1 }, completedLessons: ['counting1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  const goal = page.getByRole('region', { name: /Next goal/ });
  await expect(goal).toContainText('Make the Clover Cushion!');
  await expect(goal.getByRole('img', { name: 'Apple 1' })).toBeVisible();
  await expect(goal).toContainText('Play to get them: Counting Apples');
});

test('마을 완성: 마지막 놀이를 처음 끝내면 축하, 지도에 리본 (다시 해도 축하는 한 번)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['comparing1', 'addition1', 'subtraction1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.locator('[data-complete]')).toHaveCount(0);
  await goToRegion(page, /^Acorn Village/);
  await playCountingApples(page);
  await expect(page.getByRole('status').filter({ hasText: 'You finished every game in Acorn Village!' })).toBeVisible();
  if (process.env.SHOT_DIR) await page.waitForTimeout(1500).then(() => page.screenshot({ path: `${process.env.SHOT_DIR}/complete-reward.png` }));

  await page.getByRole('button', { name: 'More games' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await expect(page.locator('[data-complete="acornVillage"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Acorn Village/ })).toContainText('All games done!');
  if (process.env.SHOT_DIR) await page.locator('[data-complete="acornVillage"]').scrollIntoViewIfNeeded().then(() => page.screenshot({ path: `${process.env.SHOT_DIR}/complete-map.png` }));

  await goToRegion(page, /^Acorn Village/);
  await playCountingApples(page, true, 1); // 두 번째 판 (수가 바뀐다)
  await expect(page.getByRole('heading', { name: 'You discovered something new!' })).toBeVisible();
  await expect(page.getByText('You finished every game in Acorn Village!')).toHaveCount(0);
});
