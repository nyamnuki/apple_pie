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

  // 두 번째: 보너스 없음
  await page.getByRole('button', { name: 'Play again' }).click();
  await playCountingApples(page, false, 1); // 두 번째 판은 수가 바뀐다
  await expect(page.getByText('First-time bonus!')).toHaveCount(0);

  await page.getByRole('button', { name: 'Make something in the Workshop' }).click();
  await expect(bookshelf.getByRole('img', { name: 'Acorn: you have 6, need 4' })).toBeVisible();
  await bookshelf.getByRole('button', { name: 'Make it!' }).click();
  await expect(page.getByText('You made a Forest Bookshelf!')).toBeVisible();

  await page.getByRole('button', { name: 'Put it in my room' }).click();
  await expect(page.getByLabel('1 ready to place')).toBeVisible();
  await page.getByRole('button', { name: /Forest Bookshelf/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 5, column 4' }).click({ force: true });
  await page.getByRole('button', { name: 'Done' }).click();

  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'My Bag' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Forest Bookshelf' })).toContainText('1 of 1 in room');
});
