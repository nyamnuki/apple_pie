import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, readSave } from './helpers';

// 방 꾸미기: 놓기, 겹침 막기, 옆 칸 보정, 옮기기, 돌리기, 치우기
test('방 꾸미기 기본 동작', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, forestBookshelf: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await expect(guide(page)).toHaveText('Pick something for your room!');

  // 가진 가구만 목록에 나온다 (처음 4개 + 책장)
  await expect(page.getByRole('list', { name: 'Things you can put in your room' }).getByRole('listitem')).toHaveCount(5);

  await page.getByRole('button', { name: /Forest Bookshelf/ }).click();
  await expect(guide(page)).toHaveText('Tap a spot with a + to put it there.');
  // 침대 한가운데(근처에 빈 칸 없음) → 자리가 없다는 안내
  await page.getByRole('button', { name: 'Floor spot, row 1, column 1' }).click({ force: true });
  await expect(guide(page)).toHaveText('That spot is busy. Try a spot with a +.');
  await page.getByRole('button', { name: 'Floor spot, row 5, column 4' }).click({ force: true });
  await expect(guide(page)).toHaveText('Nice! It fits just right.');

  await page.getByRole('button', { name: 'Turn' }).click();
  await page.getByRole('button', { name: 'Move' }).click();
  await page.getByRole('button', { name: 'Floor spot, row 5, column 6' }).click({ force: true });
  await expect(guide(page)).toHaveText('Nice! It fits just right.');
  await page.getByRole('button', { name: 'Done' }).click();

  await page.getByRole('button', { name: 'Flower Pot in your room' }).click();
  await page.getByRole('button', { name: 'Put away' }).click();

  await page.waitForTimeout(500);
  const placed = (await readSave(page)).room.placed;
  expect(placed.find((p: { furnitureId: string }) => p.furnitureId === 'forestBookshelf')).toMatchObject({ gx: 5, gy: 4, rotation: 1 });
  expect(placed.some((p: { furnitureId: string }) => p.furnitureId === 'flowerPot')).toBe(false);
});

test('놓을 수 없는 칸을 누르면 바로 옆 빈 칸에 놓아 준다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 2, column 2' }).click({ force: true });
  await expect(guide(page)).toHaveText('Nice! It fits just right.');
});
