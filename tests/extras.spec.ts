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

  // 효과음만 보려고 배경 음악은 끈 채로 시작 (이미 설정이 있으면 건드리지 않는다)
  const musicOff = (context: import('@playwright/test').BrowserContext) =>
    context.addInitScript(() => {
      if (!localStorage.getItem('mathTown.settings')) localStorage.setItem('mathTown.settings', '{"sound":true,"music":false}');
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
    await musicOff(context);
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
    expect(await page.evaluate(() => localStorage.getItem('mathTown.settings'))).toBe('{"sound":false,"music":false}');

    await page.reload();
    await countApples(page);
    expect(await page.evaluate(() => (window as unknown as { __osc: number }).__osc)).toBe(0);
  });
});

test.describe('배경 음악', () => {
  // 만들어진 음(오실레이터)의 개수와 음색을 기록한다
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      const w = window as unknown as { __types: string[] };
      w.__types = [];
      const original = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function (this: AudioContext) {
        const osc = original.call(this);
        setTimeout(() => w.__types.push(osc.type), 0); // 음색은 만든 직후에 정해진다
        return osc;
      };
    });
  });
  const types = (page: import('@playwright/test').Page) => page.evaluate(() => (window as unknown as { __types: string[] }).__types.slice());

  test('처음 누르면 시작해서 계속 이어지고, 설정에서 끄면 멈추며 꺼진 상태가 유지된다', async ({ page, context }) => {
    await seed(context, { save: makeSave() });
    await page.goto('/');
    await page.waitForTimeout(800);
    expect(await types(page)).toEqual([]); // 누르기 전에는 소리 없음

    await page.getByRole('button', { name: 'Open settings' }).click(); // 첫 누르기
    await page.waitForTimeout(1500);
    const first = (await types(page)).length;
    expect(first).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    expect((await types(page)).length).toBeGreaterThan(first); // 가만히 있어도 음악이 이어진다

    const sw = page.getByRole('switch', { name: 'Music' });
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await sw.click();
    await expect(sw).toContainText('Music is off');
    await page.waitForTimeout(600);
    const afterOff = (await types(page)).length;
    await page.waitForTimeout(1500);
    expect((await types(page)).length).toBe(afterOff); // 끈 뒤에는 새 음이 없다
    expect(JSON.parse((await page.evaluate(() => localStorage.getItem('mathTown.settings')))!)).toEqual({ sound: true, music: false });

    await page.reload();
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.waitForTimeout(1500);
    expect(await types(page)).toEqual([]);
    await expect(page.getByRole('switch', { name: 'Music' })).toHaveAttribute('aria-checked', 'false');
  });

  test('달빛 숲에서는 밤의 곡(부드러운 음색)으로 바뀐다', async ({ page, context }) => {
    await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }) });
    await page.goto('/');
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(3000);
    expect(await types(page)).toContain('triangle'); // 낮의 곡: 멜로디가 triangle 음색

    await page.getByRole('button', { name: 'Play' }).click();
    await goToRegion(page, /^Moonlight Forest/);
    await page.getByRole('button', { name: /Shape Hunt/ }).click();
    await page.waitForTimeout(1000); // 곡이 바뀔 시간
    const before = (await types(page)).length;
    await page.waitForTimeout(3500);
    const recent = (await types(page)).slice(before);
    expect(recent.length).toBeGreaterThan(0);
    expect(new Set(recent)).toEqual(new Set(['sine'])); // 밤의 곡: 모두 sine
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
