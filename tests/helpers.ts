import type { Page, BrowserContext } from '@playwright/test';

// ===== 테스트 도우미 =====

export const SAVE_KEY = 'mathTown.save';
export const LOCALE_KEY = 'mathTown.locale';

// 앱이 뜨기 전에 저장 데이터·언어를 심어 둔다 (한 번만, 새로고침 때는 다시 심지 않음)
export async function seed(context: BrowserContext, opts: { save?: unknown; rawSave?: string; locale?: 'en' | 'ko' } = {}) {
  await context.addInitScript((o) => {
    if (sessionStorage.getItem('__seeded')) return;
    sessionStorage.setItem('__seeded', '1');
    localStorage.clear();
    if (o.rawSave !== undefined) localStorage.setItem('mathTown.save', o.rawSave);
    else if (o.save !== undefined) localStorage.setItem('mathTown.save', JSON.stringify(o.save));
    if (o.locale) localStorage.setItem('mathTown.locale', o.locale);
  }, opts);
}

// 저장 데이터 하나 만들기 (기본: 처음 가구 4개, 재료 없음)
export function makeSave(over: { resources?: object; furniture?: object; completedLessons?: string[]; placed?: object[]; wallpaperId?: string | null } = {}) {
  return {
    schemaVersion: 1,
    savedAt: '2026-10-25T00:00:00Z',
    game: {
      resources: over.resources ?? {},
      furniture: over.furniture ?? { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1 },
      completedLessons: over.completedLessons ?? [],
    },
    room: {
      placed: over.placed ?? [
        { uid: 'leafBed-1', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 },
        { uid: 'mushroomLamp-1', furnitureId: 'mushroomLamp', gx: 2, gy: 0, rotation: 0 },
        { uid: 'petalRug-1', furnitureId: 'petalRug', gx: 2, gy: 2, rotation: 0 },
        { uid: 'flowerPot-1', furnitureId: 'flowerPot', gx: 5, gy: 0, rotation: 0 },
      ],
      wallpaperId: over.wallpaperId ?? null,
    },
  };
}

export const readSave = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), SAVE_KEY);

// 화면의 안내 말풍선/안내 문구
export const guide = (page: Page) => page.locator('[aria-live="polite"]').first();

// 화면 맨 아래 버튼 (다음, 끝내기 등)이 켜질 때까지 기다리기
export async function waitLastButtonEnabled(page: Page) {
  await page.waitForFunction(() => {
    const bs = [...document.querySelectorAll('main button')];
    return bs.length > 0 && !(bs[bs.length - 1] as HTMLButtonElement).disabled;
  });
}

// 화면에 보이는 글자 + 접근성 이름에서 영어 단어 찾기 (한국어 화면 검사용)
export const englishWords = (page: Page) =>
  page.evaluate(() =>
    (document.body.innerText + ' ' + [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).join(' ')).match(/[A-Za-z]{2,}/g),
  );

// 경고·오류 모으기 (그림 파일이 없을 때의 404 는 정상이므로 뺀다)
export function collectProblems(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'warning' || (m.type() === 'error' && !m.text().includes('404'))) problems.push(m.text());
  });
  return problems;
}

// 지도에서 마을 고르기 (놀이하기 버튼 다음)
export async function goToRegion(page: Page, regionName: RegExp | string) {
  await page.getByRole('button', { name: regionName }).click();
}

// 놀이 하나를 빠르게 끝까지: 만져 보기에서 tapLabel 을 모두 누르고, 예상은 첫 번째, 해 보기는 right 를 고른다
export async function playLesson(page: Page, title: RegExp, tapLabel: string, right: string) {
  await page.getByRole('button', { name: title }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const item = page.getByRole('button', { name: tapLabel });
  while (await item.count()) await item.first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('group', { name: 'Answer choices' }).getByRole('button').first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('group', { name: 'Answer choices' }).getByRole('button', { name: right, exact: true }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
}

// '사과 세기' 놀이를 처음부터 끝까지 (예상은 일부러 틀리게, 해 보기는 정답)
export async function playCountingApples(page: Page, fromMenu = true) {
  if (fromMenu) await page.getByRole('button', { name: /Counting Apples/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const apple = page.getByRole('button', { name: 'Count this one' });
  while (await apple.count()) await apple.first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('group', { name: 'Answer choices' }).getByRole('button', { name: '12', exact: true }).click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('group', { name: 'Answer choices' }).getByRole('button', { name: '17', exact: true }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
}
