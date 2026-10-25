import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave } from './helpers';

// 저장·복원·복구
test('바뀐 내용은 바로 새로고침해도 남는다 (떠날 때 즉시 저장)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  await page.getByRole('button', { name: 'Floor spot, row 5, column 4' }).click({ force: true });
  await page.reload(); // 0.3초 기다리지 않고 바로
  const save = await readSave(page);
  expect(save.schemaVersion).toBe(1);
  expect(save.room.placed.some((p: { furnitureId: string }) => p.furnitureId === 'toyChest')).toBe(true);
});

test('설정에 저장 상태와 언어별 시각이 보인다', async ({ page, context }) => {
  await seed(context, { save: makeSave(), locale: 'ko' });
  await page.goto('/');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '설정 열기' }).click();
  await expect(page.getByText('진행 상황은 이 기기에 저장돼요.')).toBeVisible();
  await expect(page.getByText(/^마지막 저장: \d{4}\. \d{1,2}\. \d{1,2}\. (오전|오후) \d{1,2}:\d{2}$/)).toBeVisible();
});

test('깨진 저장본: 새로 시작하고 원래 내용은 보관한다', async ({ page, context }) => {
  await seed(context, { rawSave: '{oops not json' });
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText("We couldn't read your saved game, so we started a new one.");
  expect(await page.evaluate(() => localStorage.getItem('mathTown.save.backup'))).toBe('{oops not json');
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('모르는(더 새로운) 버전: 새로 시작하고 보관한다', async ({ page, context }) => {
  await seed(context, { save: { schemaVersion: 99, game: {}, room: {} } });
  await page.goto('/');
  await expect(page.getByRole('status')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('mathTown.save.backup'))).toContain('"schemaVersion":99');
});

test('일부만 이상한 저장본: 이상한 부분만 버린다', async ({ page, context }) => {
  await seed(context, {
    save: {
      schemaVersion: 1,
      savedAt: '2026-01-01T00:00:00Z',
      game: { resources: { acorn: -5, apple: 3.5, goldenAcorn: 2, fake: 9 }, furniture: { toyChest: 2, unknownThing: 3, leafBed: 0 }, completedLessons: ['counting1', 'nope', 'counting1'] },
      room: {
        placed: [
          { uid: 'b', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 },
          { uid: 't1', furnitureId: 'toyChest', gx: 9, gy: 9, rotation: 0 }, // 방 밖
          { uid: 't2', furnitureId: 'toyChest', gx: 3, gy: 3, rotation: 0 },
          { uid: 't3', furnitureId: 'toyChest', gx: 4, gy: 4, rotation: 0 },
          { uid: 't4', furnitureId: 'toyChest', gx: 5, gy: 5, rotation: 0 }, // 가진 수(2) 초과
          { uid: 't2', furnitureId: 'flowerPot', gx: 5, gy: 0, rotation: 0 }, // 번호 중복
          { uid: 'f', furnitureId: 'flowerPot', gx: 1, gy: 1, rotation: 0 }, // 침대와 겹침
          { uid: 'x', furnitureId: 'ghostSofa', gx: 2, gy: 2, rotation: 0 }, // 없는 가구
          { uid: 'r', furnitureId: 'mushroomLamp', gx: 2, gy: 0, rotation: 7 }, // 잘못된 방향
        ],
        wallpaperId: 'woodlandWallpaper', // 갖지 않은 벽지
      },
    },
  });
  await page.goto('/');
  await page.waitForTimeout(600);
  await expect(page.getByRole('status')).toHaveCount(0);
  const s = await readSave(page);
  expect(s.game.resources).toEqual({ goldenAcorn: 2 });
  expect(s.game.furniture).toMatchObject({ leafBed: 1, toyChest: 2 });
  expect(s.game.furniture).not.toHaveProperty('unknownThing');
  expect(s.game.completedLessons).toEqual(['counting1']);
  expect(s.room.placed.map((p: { uid: string }) => p.uid)).toEqual(['b', 't2', 't3']);
  expect(s.room.wallpaperId).toBeNull();
});

test('저장이 막힌 브라우저에서도 앱은 동작하고 안내한다', async ({ page, context }) => {
  await context.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
  });
  await page.goto('/');
  await expect(page.getByText("This browser can't save your progress. It will be gone when you close the game.")).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: 'Leaf Bed in your room' }).click();
  await expect(page.getByRole('button', { name: 'Move' })).toBeVisible();
});
