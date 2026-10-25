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

test('놓을 수 없는 칸을 누르면 저절로 놓지 않고, 옆 빈 칸을 미리 보여준 뒤 고르게 한다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  // 무엇을 놓는지 그림과 함께 보여준다
  await expect(page.getByText('Where should the Toy Chest go?')).toBeVisible();
  await expect(page.locator('[data-ghost]')).toHaveCount(0);

  // 침대 가장자리 (바로 옆에 빈 칸이 있다) → 놓지 않고 권하기만
  await page.getByRole('button', { name: 'Floor spot, row 3, column 1' }).click({ force: true });
  await expect(guide(page)).toHaveText('That spot is busy. How about the glowing spot next to it?');
  await expect(page.locator('[data-ghost="suggested"]')).toHaveCount(1);
  await page.waitForTimeout(300);
  expect((await readSave(page)).room.placed.some((p: { furnitureId: string }) => p.furnitureId === 'toyChest')).toBe(false);

  // '여기에 놓기' → 권한 자리 (침대 바로 아래 칸)에 놓인다
  await page.getByRole('button', { name: 'Put it here' }).click();
  await expect(guide(page)).toHaveText('Nice! It fits just right.');
  await expect(page.locator('[data-ghost]')).toHaveCount(0);
  await page.waitForTimeout(300);
  expect((await readSave(page)).room.placed.find((p: { furnitureId: string }) => p.furnitureId === 'toyChest')).toMatchObject({ gx: 0, gy: 3 });
});

test('권한 자리 대신 다른 빈 칸을 누르면 그 칸에 놓는다, 그만두기는 아무것도 바꾸지 않는다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 3, column 1' }).click({ force: true });
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(guide(page)).toHaveText('Pick something for your room!');
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 3, column 1' }).click({ force: true });
  await page.getByRole('button', { name: 'Floor spot, row 6, column 6' }).click({ force: true });
  await expect(guide(page)).toHaveText('Nice! It fits just right.');
  await page.waitForTimeout(300);
  expect((await readSave(page)).room.placed.find((p: { furnitureId: string }) => p.furnitureId === 'toyChest')).toMatchObject({ gx: 5, gy: 5 });
});

test('마우스로 칸 위에 올리면 놓일 모습을 미리 보여준다, 돌릴 자리가 없으면 안내한다', async ({ page, context }) => {
  await seed(context, {
    save: makeSave({
      furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, forestBookshelf: 1 },
      placed: [
        { uid: 'bed', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 },
        { uid: 'shelf', furnitureId: 'forestBookshelf', gx: 2, gy: 0, rotation: 0 },
        { uid: 'lamp', furnitureId: 'mushroomLamp', gx: 2, gy: 1, rotation: 0 }, // 돌리면 책장이 차지할 칸
      ],
    }),
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: /Flower Pot/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 5, column 5' }).hover({ force: true });
  await expect(page.locator('[data-ghost="preview"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Cancel' }).click();

  // 책장(가로 2칸)을 돌리면 세로로 차지할 칸에 등불이 있어 돌릴 수 없다
  await page.getByRole('button', { name: 'Forest Bookshelf in your room' }).click();
  await expect(page.getByText('Forest Bookshelf', { exact: true })).toBeVisible(); // 고른 물건 이름
  await page.getByRole('button', { name: 'Turn' }).click();
  await expect(guide(page)).toHaveText("There isn't enough room to turn it here.");
  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(300);
  expect((await readSave(page)).room.placed.find((p: { uid: string }) => p.uid === 'shelf')).toMatchObject({ rotation: 0 });
});
