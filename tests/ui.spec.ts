import { test, expect, type Page } from '@playwright/test';
import { seed, makeSave } from './helpers';

// 그래픽·화면 다듬기 점검: 없는 그림 요청 없음, 목록 그림, 권하는 자리 화면 배치, 상태 표시, 글자 선택, 움직임 줄이기

const SAVE = makeSave({ furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1, leafFrame: 1, woodlandWallpaper: 1 } });

test('없는 그림 파일은 아예 요청하지 않는다 (404 없음)', async ({ page, context }) => {
  await seed(context, { save: SAVE });
  const asked: string[] = [];
  page.on('request', (r) => {
    if (/\/assets\/.+\.(png|webp|svg|jpe?g)$/.test(r.url())) asked.push(r.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'My Bag' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: /^Acorn Village/ }).click();
  await page.getByRole('button', { name: /Counting Apples/ }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  expect(asked).toEqual([]);
});

test('꾸미기 목록의 그림은 방에 그려지는 것과 같은 그림이다 (그림 문자가 아님)', async ({ page, context }) => {
  await seed(context, { save: SAVE });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Decorate' }).click();
  const cards = page.getByRole('list', { name: 'Things you can put in your room' }).getByRole('button');
  await expect(cards).toHaveCount(7);
  for (let i = 0; i < 7; i++) await expect(cards.nth(i).locator('svg[aria-hidden="true"] > *').first()).toBeAttached();
  expect(await cards.first().innerText()).not.toMatch(/🛏️/);
});

// 가로 넘침·작은 버튼·글자 잘림
async function check(page: Page, where: string) {
  const issues = await page.evaluate(() => {
    const found: string[] = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) found.push('가로 넘침');
    for (const el of document.querySelectorAll<HTMLElement>('button')) {
      if (el.closest('svg')) continue;
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const name = (el.getAttribute('aria-label') || el.innerText).trim().slice(0, 20);
      if (r.width < 47.5 || r.height < 47.5) found.push(`작은 버튼 ${name}`);
      if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) found.push(`글자 잘림 ${name}`);
    }
    return found;
  });
  expect(issues, where).toEqual([]);
}

for (const vp of [{ width: 320, height: 640 }, { width: 844, height: 390 }]) {
  test(`권하는 자리 화면 배치 (한국어, ${vp.width}x${vp.height})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: vp });
    await seed(context, { save: SAVE, locale: 'ko' });
    const page = await context.newPage();
    await page.goto('/');
    await page.getByRole('button', { name: '시작하기' }).click();
    await page.getByRole('button', { name: '방 꾸미기' }).click();
    await page.getByRole('button', { name: /장난감 상자/ }).click();
    await page.getByRole('button', { name: '바닥 3번째 줄 1번째 칸' }).click({ force: true });
    await expect(page.getByRole('button', { name: '여기에 놓기' })).toBeVisible();
    await page.waitForTimeout(400); // 버튼이 톡 나타나는 효과가 끝난 뒤 크기를 잰다
    await check(page, 'suggest');
    // 버튼이 화면 안에 다 보인다 (가로 화면에서 아래로 잘리지 않음)
    const box = await page.getByRole('button', { name: '그만두기' }).boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 1);
    await context.close();
  });
}

test('누를 수 없는 버튼은 색만이 아니라 점선 테두리와 그림자 없음으로도 구분된다', async ({ page, context }) => {
  await seed(context, { save: SAVE });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: /^Acorn Village/ }).click();
  await page.getByRole('button', { name: /Counting Apples/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const next = page.getByRole('button', { name: 'Next' });
  await expect(next).toBeDisabled();
  const style = await next.evaluate((b) => {
    const s = getComputedStyle(b);
    return { outline: s.outlineStyle, shadow: s.boxShadow };
  });
  expect(style.outline).toBe('dashed');
  expect(style.shadow).not.toMatch(/\d+px [1-9]/); // 입체 그림자(아래로 5px)가 없다
});

test('어른 화면의 안내 글은 선택할 수 있고, 놀이 화면의 글은 선택되지 않는다', async ({ page, context }) => {
  await seed(context, { save: SAVE });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  const saveInfo = page.getByText('Your progress is saved on this device.');
  expect(await saveInfo.evaluate((e) => getComputedStyle(e).userSelect)).toBe('text');
  expect(await page.getByRole('button', { name: 'For grown-ups' }).evaluate((e) => getComputedStyle(e).userSelect)).toBe('none');
  await page.getByRole('button', { name: 'Go back' }).click();
  expect(await page.getByRole('heading', { level: 1 }).evaluate((e) => getComputedStyle(e).userSelect)).toBe('none');
});

test('움직임 줄이기를 켠 기기에서는 애니메이션이 사실상 멈춘다', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const duration = await page.locator('.animate-bob').first().evaluate((e) => getComputedStyle(e).animationDuration);
  expect(parseFloat(duration)).toBeLessThan(0.001);
  await context.close();
});
