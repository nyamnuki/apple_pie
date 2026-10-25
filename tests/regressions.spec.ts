import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave, waitLastButtonEnabled, goToRegion } from './helpers';

// 실제로 발견해 고친 버그가 다시 생기지 않는지 (아이의 빠른 연타)

test('끝내기를 빠르게 두 번 눌러도 보상은 한 번만', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
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
  await choices.getByRole('button', { name: '12', exact: true }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '17', exact: true }).click();

  // 같은 순간에 두 번 (화면이 바뀌기 전)
  await page.getByRole('button', { name: 'Finish' }).evaluate((b: HTMLElement) => {
    b.click();
    b.click();
  });
  await expect(page.getByRole('heading', { name: 'You discovered something new!' })).toBeVisible();
  await page.waitForTimeout(500);
  expect((await readSave(page)).game.resources).toEqual({ acorn: 3, apple: 1, goldenAcorn: 1 });
});

test('같은 칸을 빠르게 두 번 눌러도 가진 개수만큼만 놓인다 (바닥·벽)', async ({ page, context }) => {
  await seed(context, {
    save: makeSave({
      furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1, leafFrame: 1 },
      placed: [{ uid: 'b', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 }],
    }),
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  const doubleTap = (name: string) =>
    page.getByRole('button', { name }).evaluate((el: Element) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

  await page.getByRole('button', { name: /Toy Chest/ }).click();
  await doubleTap('Floor spot, row 5, column 4');
  // 두 번째 누름은 '빈 바닥 누르기'로 처리되어 선택이 풀린다 → 바로 목록이 보인다
  await page.getByRole('button', { name: /Leaf Picture/ }).click();
  await doubleTap('Left wall, spot 2');

  await page.waitForTimeout(500);
  const room = (await readSave(page)).room;
  expect(room.placed.filter((p: { furnitureId: string }) => p.furnitureId === 'toyChest')).toHaveLength(1);
  expect(room.wallItems).toHaveLength(1);
});
