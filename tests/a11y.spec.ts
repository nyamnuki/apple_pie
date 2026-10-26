import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seed, makeSave } from './helpers';

// 접근성 자동 검사 (axe): 모든 주요 화면에서 심각·중대 문제가 없어야 한다
const OPEN = ['counting1', 'comparing1', 'patterns1', 'shapes1', 'skipCount1', 'tens1', 'numberLine1', 'evenOdd1'];

async function check(page: Page, where: string) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = result.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  expect(serious, where).toEqual([]);
}

for (const locale of ['en', 'ko'] as const) {
  test(`접근성 검사 (${locale})`, async ({ page, context }) => {
    test.setTimeout(120_000);
    const save = makeSave({
      resources: { acorn: 9, apple: 9 },
      furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 },
      completedLessons: OPEN,
      lessonStats: { counting1: { plays: 2, firstTry: 1, hints: 1, lastPlayed: '2026-10-26T09:00:00Z' } },
    });
    // 스티커 4장: 옷장에 열린 옷과 잠긴 옷이 같이 있다
    await seed(context, { save: { ...save, game: { ...save.game, stickers: ['apple', 'acorn', 'flower', 'ladybug'] } }, locale });
    const nav = (i: number) => page.locator('nav button').nth(i);
    const back = () => page.locator('header button').first().click();
    await page.goto('/');
    await check(page, 'title');
    await page.locator('main button:has(svg[data-icon="play"])').click();
    await check(page, 'room');
    await page.locator('button:has(svg[data-icon="question"])').click();
    await check(page, 'room-quiz');
    await page.locator('main button:has(svg[data-icon="check"])').last().click(); // 다 했어요
    await nav(1).click();
    await check(page, 'decorate');
    await page.locator('ul li button').nth(4).click(); // 장난감 상자 (놓기)
    await check(page, 'decorate-placing');
    await back();
    await nav(2).click();
    await check(page, 'workshop');
    await back();
    await nav(3).click();
    await check(page, 'bag');
    await back();
    await nav(4).click();
    await check(page, 'stickers');
    await page.locator('[data-sticker="apple"] button').click();
    await check(page, 'sticker-closeup');
    await page.keyboard.press('Escape');
    await back();
    await page.locator('header button').nth(1).click();
    await check(page, 'settings');
    await back();
    await nav(0).click();
    await check(page, 'map');
    await page.locator('ol li button').last().click();
    await check(page, 'menu');
    await page.locator('li button').first().click();
    await check(page, 'lesson-observe');
    await page.locator('main button:has(svg[data-icon="arrow-right"])').click();
    await check(page, 'lesson-touch');
  });
}

// Tab 으로 원하는 버튼까지 가서 Enter (마우스·터치 없이)
async function tabTo(page: Page, name: RegExp) {
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return (el?.getAttribute('aria-label') || el?.innerText || '').trim();
    });
    if (name.test(label)) return;
  }
  throw new Error(`키보드로 찾지 못함: ${name}`);
}

test('키보드만으로 놀이 하나를 끝까지 (초점이 늘 보인다)', async ({ page, context }) => {
  test.setTimeout(120_000);
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await tabTo(page, /^Start$/);
  // 초점 테두리가 보인다
  expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  await tabTo(page, /^Play$/);
  await page.keyboard.press('Enter');
  await tabTo(page, /^Acorn Village/);
  await page.keyboard.press('Enter');
  await tabTo(page, /Counting Apples/);
  await page.keyboard.press('Enter');
  await tabTo(page, /^Next/);
  await page.keyboard.press('Enter');
  // 사과 10개를 키보드로 센다
  for (let i = 0; i < 10; i++) {
    await tabTo(page, /^Count this one$/);
    await page.keyboard.press('Enter');
  }
  await tabTo(page, /^Next/);
  await page.keyboard.press('Enter');
  await tabTo(page, /^13$/);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 20_000 });
  await tabTo(page, /^Next/);
  await page.keyboard.press('Enter');
  await tabTo(page, /^Next/);
  await page.keyboard.press('Enter');
  await tabTo(page, /^17$/);
  await page.keyboard.press('Enter');
  await tabTo(page, /^Finish/);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'You discovered something new!' })).toBeVisible();
});
