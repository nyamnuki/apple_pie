import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave, playCountingApples, goToRegion } from './helpers';

// 스티커 도감: 놀이를 끝내면 마을 스티커를 받고, 도감에 붙는다
test('놀이를 끝내면 새 스티커를 받고 도감에 붙는다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await expect(page.getByText('You have 0 of 36.')).toBeVisible();
  await expect(page.locator('[data-owned="true"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Go back' }).click();

  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Acorn Village/);
  await playCountingApples(page);
  await expect(page.getByText('New sticker: Apple!')).toBeVisible();
  await page.waitForTimeout(300);
  expect((await readSave(page)).game.stickers).toEqual(['apple']);

  // 방 → 도감
  await page.getByRole('button', { name: 'More games' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await expect(page.getByText('You have 1 of 36.')).toBeVisible();
  await expect(page.locator('[data-sticker="apple"]')).toHaveAttribute('data-owned', 'true');
  await expect(page.locator('[data-sticker="apple"]')).toHaveAccessibleName('Apple');
  await expect(page.locator('[data-sticker="acorn"]')).toHaveAccessibleName('Sticker not found yet');
});

test('한국어 도감: 마을별 개수와 이름', async ({ page, context }) => {
  await seed(context, { save: { ...makeSave(), game: { ...makeSave().game, stickers: ['apple', 'moon', 'gem'] } }, locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '스티커 도감' }).click();
  await expect(page.getByText('지금 36장 중 3장 모았어요.')).toBeVisible();
  await expect(page.getByRole('heading', { name: /수정 동굴/ })).toContainText('1/6');
  await expect(page.locator('[data-sticker="moon"]')).toHaveAccessibleName('달');
});
