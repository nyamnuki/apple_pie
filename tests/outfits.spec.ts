import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave } from './helpers';

// 루루 옷장: 스티커 수만큼 모자·스카프가 열리고, 고른 옷은 저장되어 다른 화면의 루루도 입는다
const STICKERS = 'apple acorn flower ladybug butterfly frog moon star'.split(' '); // 8장: 도토리 모자(4), 산딸기 스카프(7)

test('스티커로 열린 옷만 고를 수 있고, 고른 옷은 저장된다', async ({ page, context }) => {
  const save = makeSave();
  await seed(context, { save: { ...save, game: { ...save.game, stickers: STICKERS } } });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();

  await expect(page.getByRole('heading', { name: "Lulu's Closet" })).toBeVisible();
  await expect(page.getByText('3 more stickers for something new to wear!')).toBeVisible();
  const hats = page.getByRole('radiogroup', { name: 'Hats' });
  await expect(hats.getByRole('radio', { name: 'Nothing' })).toBeChecked();
  // 안 열린 옷: 자물쇠와 필요한 스티커 수, 눌러도 바뀌지 않는다
  const crown = hats.getByRole('radio', { name: 'Flower Crown: opens with 11 stickers' });
  await expect(crown).toHaveAttribute('aria-disabled', 'true');
  await crown.click({ force: true });
  await expect(crown).not.toBeChecked();

  await hats.getByRole('radio', { name: 'Acorn Cap' }).click();
  await expect(hats.getByRole('radio', { name: 'Acorn Cap' })).toBeChecked();
  await page.getByRole('radiogroup', { name: 'Scarves' }).getByRole('radio', { name: 'Berry Scarf' }).click();
  await page.waitForTimeout(300);
  expect((await readSave(page)).game.outfit).toEqual({ hat: 'acornCap', scarf: 'berryScarf' });

  // 다시 열어도 그대로
  await page.reload();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await expect(page.getByRole('radiogroup', { name: 'Hats' }).getByRole('radio', { name: 'Acorn Cap' })).toBeChecked();
  await page.getByRole('radiogroup', { name: 'Hats' }).getByRole('radio', { name: 'Nothing' }).click();
  await page.waitForTimeout(300);
  expect((await readSave(page)).game.outfit).toEqual({ hat: null, scarf: 'berryScarf' });
});

test('한국어: 옷장 이름과 잠긴 옷 안내', async ({ page, context }) => {
  await seed(context, { save: makeSave(), locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '스티커 도감' }).click();
  await expect(page.getByRole('heading', { name: '루루 옷장' })).toBeVisible();
  await expect(page.getByRole('radio', { name: '도토리 모자: 스티커 4장 모으면 열려요' })).toBeVisible();
  await expect(page.getByText('스티커 4장 더 모으면 새 옷이 생겨요!')).toBeVisible();
});
