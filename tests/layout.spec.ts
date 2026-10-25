import { test, expect, type Page } from '@playwright/test';
import { seed, makeSave, collectProblems } from './helpers';

// 화면 배치 검수: 2개 언어 × 4개 화면 크기 × 주요 화면
// - 가로로 넘치지 않음  - 버튼 글자가 잘리지 않음  - 누르기 영역 48px 이상
const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 844, height: 390 }, // 휴대폰 가로
  { width: 1024, height: 768 }, // 태블릿
];

async function check(page: Page, where: string) {
  const issues = await page.evaluate(() => {
    const found: string[] = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) found.push('가로 넘침');
    for (const el of document.querySelectorAll<HTMLElement>('button, [role=radio]')) {
      if (el.closest('svg')) continue; // 방 바닥 칸은 따로 (옆 칸 보정)
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const name = (el.getAttribute('aria-label') || el.innerText).trim().slice(0, 20);
      if (r.width < 47.5 || r.height < 47.5) found.push(`작은 버튼 ${name} ${Math.round(r.width)}x${Math.round(r.height)}`);
      if (el.scrollWidth > el.clientWidth + 1) found.push(`글자 잘림 ${name}`);
    }
    return found;
  });
  expect(issues, where).toEqual([]);
}

for (const locale of ['en', 'ko'] as const) {
  for (const vp of VIEWPORTS) {
    test(`화면 배치 ${locale} ${vp.width}x${vp.height}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: vp });
      await seed(context, { save: makeSave({ resources: { acorn: 9, apple: 6 }, furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 } }), locale });
      const page = await context.newPage();
      const problems = collectProblems(page);
      const nav = (i: number) => page.locator('nav button').nth(i);
      const back = () => page.locator('header button').first().click();

      await page.goto('/');
      await check(page, 'title');
      await page.locator('main button:has(svg.lucide-play)').click();
      await check(page, 'room');
      await nav(1).click();
      await check(page, 'decorate');
      await page.locator('ul li button').first().click();
      await check(page, 'decorate-selected');
      await back();
      await nav(2).click();
      await check(page, 'workshop');
      await back();
      await nav(3).click();
      await check(page, 'bag');
      await back();
      await page.locator('header button').nth(1).click();
      await check(page, 'settings');
      await page.locator('button:has(svg.lucide-lock)').click();
      await check(page, 'parent-gate');
      await back();
      await back();
      await nav(0).click();
      await check(page, 'map');
      await page.locator('ol li button').last().click(); // 지도 아래쪽 = 도토리 마을
      await check(page, 'math-menu');
      await page.locator('li button').first().click();
      await check(page, 'lesson');
      expect(problems).toEqual([]);
      await context.close();
    });
  }
}
