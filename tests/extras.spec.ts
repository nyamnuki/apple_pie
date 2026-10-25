import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave, guide, goToRegion } from './helpers';

// 효과음, 벽 장식, 저장 버전 변환, 도토·모모

test.describe('효과음', () => {
  // 소리가 실제로 만들어지는지 세기 위해 오실레이터(소리 발생기) 생성 횟수를 센다
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      const w = window as unknown as { __osc: number };
      w.__osc = 0;
      const original = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function (this: AudioContext) {
        w.__osc++;
        return original.call(this);
      };
    });
  });

  const countApples = async (page: import('@playwright/test').Page) => {
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Play' }).click();
    await goToRegion(page, /^Acorn Village/);
    await page.getByRole('button', { name: /Counting Apples/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Count this one' }).first().click();
    await page.getByRole('button', { name: 'Count this one' }).first().click();
  };

  test('셀 때 소리가 나고, 설정에서 끄면 나지 않으며 꺼진 상태가 유지된다', async ({ page, context }) => {
    await seed(context, { save: makeSave() });
    await page.goto('/');
    await countApples(page);
    expect(await page.evaluate(() => (window as unknown as { __osc: number }).__osc)).toBeGreaterThanOrEqual(2);

    await page.goto('/');
    await page.getByRole('button', { name: 'Open settings' }).click();
    const sw = page.getByRole('switch', { name: 'Sound' });
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(sw).toContainText('Sound is off');
    expect(await page.evaluate(() => localStorage.getItem('mathTown.settings'))).toBe('{"sound":false}');

    await page.reload();
    await countApples(page);
    expect(await page.evaluate(() => (window as unknown as { __osc: number }).__osc)).toBe(0);
  });
});

test('벽 장식: 걸기, 창문 피하기, 옮기기, 떼기', async ({ page, context }) => {
  await seed(context, { save: makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, leafFrame: 1, acornGarland: 1 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();

  await page.getByRole('button', { name: /Leaf Picture/ }).click();
  await expect(guide(page)).toHaveText('Tap a spot with a + on the wall.');
  await expect(page.getByRole('button', { name: /Floor spot/ })).toHaveCount(0); // 바닥 칸은 고를 수 없다
  // 오른쪽 벽 3번째 자리 = 창문 → 바로 옆(2번째)에 걸린다
  await page.getByRole('button', { name: 'Right wall, spot 3' }).click({ force: true });
  await expect(guide(page)).toHaveText('Nice! It fits just right.');
  await expect(page.getByRole('button', { name: 'Turn' })).toHaveCount(0); // 벽 장식은 돌리지 않는다
  await page.getByRole('button', { name: 'Move' }).click();
  await page.getByRole('button', { name: 'Left wall, spot 4' }).click({ force: true });
  await page.getByRole('button', { name: 'Done' }).click();

  // 가랜드는 위쪽에 걸리므로 창문 위(오른쪽 벽 3번째)에도 걸 수 있다
  await page.getByRole('button', { name: /Acorn Garland/ }).click();
  await page.getByRole('button', { name: 'Right wall, spot 3' }).click({ force: true });
  await page.getByRole('button', { name: 'Done' }).click();

  await page.waitForTimeout(500);
  let walls = (await readSave(page)).room.wallItems;
  expect(walls).toEqual([
    expect.objectContaining({ furnitureId: 'leafFrame', wall: 'left', slot: 3 }),
    expect.objectContaining({ furnitureId: 'acornGarland', wall: 'right', slot: 2 }),
  ]);

  await page.getByRole('button', { name: 'Leaf Picture in your room' }).click();
  await page.getByRole('button', { name: 'Put away' }).click();
  await page.waitForTimeout(500);
  walls = (await readSave(page)).room.wallItems;
  expect(walls.map((w: { furnitureId: string }) => w.furnitureId)).toEqual(['acornGarland']);
});

test('버전 1 저장본은 버전 2로 바뀌고 진행 상황은 그대로다', async ({ page, context }) => {
  const v1 = makeSave({ resources: { acorn: 4 }, completedLessons: ['counting1'] }); // schemaVersion 1 (벽 장식 없음)
  await seed(context, { save: v1 });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveCount(0); // '새로 시작' 안내가 없어야 한다
  await page.waitForTimeout(500);
  const s = await readSave(page);
  expect(s.schemaVersion).toBe(2);
  expect(s.room.wallItems).toEqual([]);
  expect(s.game.resources).toEqual({ acorn: 4 });
  expect(s.game.completedLessons).toEqual(['counting1']);
  expect(s.room.placed).toHaveLength(4);
});

test('친구들: 타이틀의 세 친구, 공방의 도토, 달빛 숲의 모모', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }) });
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Doto (happy)' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Lulu (cheering you on)' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Momo (happy)' })).toBeVisible();

  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await expect(page.getByLabel("Doto says: Hi, I'm Doto! Let's use your materials to make furniture.")).toBeVisible();

  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Moonlight Forest/);
  await page.getByRole('button', { name: /Shape Hunt/ }).click();
  await expect(guide(page)).toHaveAttribute('aria-label', /^Momo says: /);
  await expect(page.getByRole('img', { name: 'Momo (smiling)' })).toBeVisible();
});

test('친구들 (한국어)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }), locale: 'ko' });
  await page.goto('/');
  await expect(page.getByRole('img', { name: '도토 (기쁜 얼굴)' })).toBeVisible();
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  await goToRegion(page, /^달빛 숲/);
  await page.getByRole('button', { name: /도형 찾기/ }).click();
  await expect(guide(page)).toHaveAttribute('aria-label', /^모모의 말: /);
});
