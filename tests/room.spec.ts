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

  // 색 바꾸기: 3가지 중 하나를 고르면 방의 가구 색이 바뀌고 저장된다
  await page.getByRole('button', { name: 'Leaf Bed in your room' }).click();
  await expect(page.getByRole('radio', { name: 'Color 1' })).toBeChecked();
  await page.getByRole('radio', { name: 'Color 3' }).click();
  await expect(guide(page)).toHaveText('New color!');
  await expect(page.getByRole('radio', { name: 'Color 3' })).toBeChecked();
  await page.getByRole('button', { name: 'Done' }).click();

  await page.getByRole('button', { name: 'Flower Pot in your room' }).click();
  await page.getByRole('button', { name: 'Put away' }).click();

  await page.waitForTimeout(500);
  const placed = (await readSave(page)).room.placed;
  expect(placed.find((p: { furnitureId: string }) => p.furnitureId === 'forestBookshelf')).toMatchObject({ gx: 5, gy: 4, rotation: 1 });
  expect(placed.some((p: { furnitureId: string }) => p.furnitureId === 'flowerPot')).toBe(false);
  expect(placed.find((p: { furnitureId: string }) => p.furnitureId === 'leafBed')).toMatchObject({ tint: 2 });
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

test('루루의 질문: 방의 물건을 세고, 답하면 번호를 붙여 같이 센다', async ({ page, context }) => {
  // 기본 방: 침대·버섯 조명·러그·화분 → 바닥에 서 있는 물건(러그 빼고) 3개
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: "Lulu's question" }).click();
  await expect(guide(page)).toHaveText('How many things are standing on the floor? (Rugs don’t count.)');
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '4', exact: true }).click();
  await expect(guide(page)).toHaveText(/Let's count them together!/);
  await expect(page.locator('svg text').filter({ hasText: /^[123]$/ })).toHaveCount(3); // 번호 1, 2, 3
  await choices.getByRole('button', { name: '3', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! There are 3. You counted our room!');
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  // 다음 질문은 다른 종류 (불빛)
  await page.getByRole('button', { name: "Lulu's question" }).click();
  await expect(guide(page)).toHaveText('How many lights are in our room?');
});

test('밤에는 창밖에 달과 별, 방이 어두워지고 조명 둘레가 밝다 / 낮에는 해', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.clock.setFixedTime(new Date(2026, 9, 26, 21, 0));
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('[data-sky="night"]')).toHaveCount(1);
  await expect(page.locator('[data-time="night"]')).toHaveCount(1);
  await expect(page.locator('[data-glow="mushroomLamp-1"]')).toHaveCount(1); // 버섯 조명
  await page.clock.setFixedTime(new Date(2026, 9, 26, 10, 0));
  await page.reload();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('[data-sky="day"]')).toHaveCount(1);
  await expect(page.locator('[data-time]')).toHaveCount(0);
});

test('계절 장식: 가을에는 낙엽, 겨울에는 눈', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.clock.setFixedTime(new Date(2026, 9, 26, 10, 0)); // 10월
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('[data-season="autumn"]')).toHaveCount(1);
  await page.clock.setFixedTime(new Date(2026, 11, 24, 10, 0)); // 12월
  await page.reload();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('[data-season="winter"]')).toHaveCount(1);
});

test('방 사진 찍기: 꾸민 방을 그림 파일(PNG)로 내려받는다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Take a photo of my room' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^my-room-\d{4}-\d{2}-\d{2}\.png$/);
  const bytes = Buffer.concat(await (await download.createReadStream()).toArray());
  expect(bytes.subarray(1, 4).toString()).toBe('PNG');
  expect(bytes.readUInt32BE(16)).toBe(1768); // 너비 (760 + 여백 80 + 액자 44) × 2
  expect(bytes.readUInt32BE(20)).toBe(1656); // 높이 (640 + 여백 80 + 액자 44 + 글 띠 64) × 2
  if (process.env.SHOT_DIR) await download.saveAs(`${process.env.SHOT_DIR}/room-photo.png`);
  expect(bytes.length).toBeGreaterThan(50_000); // 빈 그림이 아니다
});

test('저녁·밤에는 조명을 눌러 끄고 켤 수 있다 (낮에는 누를 수 없다)', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.clock.setFixedTime(new Date(2026, 9, 26, 21, 0));
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  const lamp = page.getByRole('button', { name: 'Mushroom Lamp light' });
  await expect(lamp).toHaveAttribute('aria-pressed', 'true');
  await lamp.click();
  await expect(lamp).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-glow="mushroomLamp-1"]')).toHaveCount(0);
  await expect(guide(page)).toHaveText('The light is off. Good night!');
  if (process.env.SHOT_DIR) await page.screenshot({ path: `${process.env.SHOT_DIR}/light-off.png` });
  await lamp.press('Enter');
  await expect(page.locator('[data-glow="mushroomLamp-1"]')).toHaveCount(1);
  await expect(guide(page)).toHaveText('The light is on.');
});

test('낮에는 조명이 버튼이 아니다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.clock.setFixedTime(new Date(2026, 9, 26, 11, 0));
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mushroom Lamp light' })).toHaveCount(0);
});

test('꾸미기 모두 치우기: 한 번 더 묻고, 치운 뒤 다시 원래대로 되돌릴 수 있다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: 'Put everything away' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('button', { name: 'Leaf Bed in your room' })).toBeVisible();
  await page.getByRole('button', { name: 'Put everything away' }).click();
  await expect(page.getByRole('alertdialog', { name: 'Put all the furniture back in your bag?' })).toBeVisible();
  await page.getByRole('button', { name: 'Yes, put away' }).click();
  await expect(guide(page)).toHaveText('Everything is back in your bag. Your room is ready to decorate again!');
  await expect(page.getByRole('button', { name: /in your room$/ })).toHaveCount(0);
  await page.waitForTimeout(400);
  expect((await readSave(page)).room.placed).toEqual([]);
  await page.getByRole('button', { name: 'Put it all back' }).click();
  await expect(guide(page)).toHaveText('Everything is back where it was!');
  await expect(page.getByRole('button', { name: 'Leaf Bed in your room' })).toBeVisible();
  await page.waitForTimeout(400);
  expect((await readSave(page)).room.placed).toHaveLength(4);
});

test('꾸미기 되돌리기: 방금 바꾼 것 하나를 되돌린다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await expect(page.getByRole('button', { name: 'Undo' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Flower Pot in your room' }).click();
  await page.getByRole('button', { name: 'Put away' }).click();
  await expect(page.getByRole('button', { name: 'Flower Pot in your room' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(guide(page)).toHaveText('Back the way it was!');
  await expect(page.getByRole('button', { name: 'Flower Pot in your room' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Undo' })).toHaveCount(0); // 한 번만
  await page.waitForTimeout(400);
  expect((await readSave(page)).room.placed.some((p: { furnitureId: string }) => p.furnitureId === 'flowerPot')).toBe(true);
});

test('가방에서 가구를 누르면 꾸미기에서 바로 놓을 자리를 고른다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'My Bag' }).click();
  await page.getByRole('button', { name: /Toy Chest/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Decorate');
  await expect(guide(page)).toHaveText('Tap a spot with a + to put it there.');
  await page.getByRole('button', { name: 'Floor spot, row 5, column 4' }).click({ force: true });
  await expect(guide(page)).toHaveText('Nice! It fits just right.');
  // 다시 들어오면 아무것도 고르지 않은 처음 모습
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await expect(guide(page)).toHaveText('Pick something for your room!');
});

test('가방에서 이미 붙인 벽지를 눌러도 떼지 않는다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, woodlandWallpaper: 1 }, wallpaperId: 'woodlandWallpaper' }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'My Bag' }).click();
  await page.getByRole('button', { name: /Woodland Wallpaper/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Decorate');
  await page.waitForTimeout(400);
  expect((await readSave(page)).room.wallpaperId).toBe('woodlandWallpaper');
});
