import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { seed, makeSave } from './helpers';

// 말풍선 읽어 주기: 브라우저 음성을 흉내 내어 무엇을 어떤 언어로 읽었는지 기록한다
async function mockSpeech(context: BrowserContext) {
  await context.addInitScript(() => {
    const w = window as unknown as { __spoken: { text: string; lang: string }[] };
    w.__spoken = [];
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak: (u: SpeechSynthesisUtterance) => w.__spoken.push({ text: u.text, lang: u.lang }),
        cancel: () => {},
        getVoices: () => [{ lang: 'en-US' }, { lang: 'ko-KR' }],
      },
    });
  });
}
const spoken = (page: Page) => page.evaluate(() => (window as unknown as { __spoken: { text: string; lang: string }[] }).__spoken);

async function openLesson(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Start|시작하기/ }).click();
  await page.getByRole('button', { name: /^Play$|^놀이하기$/ }).click();
  await page.getByRole('button', { name: /^Acorn Village|^도토리 마을/ }).click();
  await page.getByRole('button', { name: /Counting Apples|사과 세기/ }).click();
}

test('말이 바뀌면 자동으로 읽어 주고, 스피커 버튼으로 다시 읽는다', async ({ page, context }) => {
  await mockSpeech(context);
  await seed(context, { save: makeSave() });
  await openLesson(page);
  await expect.poll(() => spoken(page)).toContainEqual({ text: expect.stringContaining('Look at the apples'), lang: 'en-US' });
  await page.getByRole('button', { name: 'Next' }).click();
  await expect.poll(async () => (await spoken(page)).at(-1)?.text).toContain('Tap each apple');
  const before = (await spoken(page)).length;
  await page.getByRole('button', { name: 'Read it aloud' }).click();
  await expect.poll(async () => (await spoken(page)).length).toBe(before + 1);
});

test('설정에서 읽어 주기를 끄면 자동으로 읽지 않고, 스피커 버튼만 읽는다 (한국어 음성)', async ({ page, context }) => {
  await mockSpeech(context);
  await seed(context, { save: makeSave(), locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '설정 열기' }).click();
  await page.getByRole('switch', { name: /읽어 주기/ }).click();
  await expect(page.getByText('스피커를 누를 때만 읽어 줘요')).toBeVisible();
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('mathTown.settings')))!)).toMatchObject({ voice: false });
  await page.getByRole('button', { name: '뒤로 가기' }).click();
  await openLesson(page);
  await page.waitForTimeout(400);
  expect(await spoken(page)).toEqual([]);
  await page.getByRole('button', { name: '소리 내어 읽기' }).click();
  await expect.poll(() => spoken(page)).toEqual([{ text: expect.stringContaining('사과'), lang: 'ko-KR' }]);
});

test('음성이 없는 기기에서는 스피커 버튼이 보이지 않는다', async ({ page, context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined });
  });
  await seed(context, { save: makeSave() });
  await openLesson(page);
  await expect(page.getByText('Look at the apples', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Read it aloud' })).toHaveCount(0);
});

test('스티커 크게 보기: 이름을 읽어 주고, 화살표로 넘기고, Esc 로 닫으면 그 스티커로 돌아간다', async ({ page, context }) => {
  await mockSpeech(context);
  const save = makeSave();
  await seed(context, { save: { ...save, game: { ...save.game, stickers: ['apple', 'acorn', 'moon'] } } });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await page.getByRole('button', { name: 'Look closely: Acorn' }).click();

  const dialog = page.getByRole('dialog', { name: 'Acorn' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('From Acorn Village')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await expect.poll(async () => (await spoken(page)).at(-1)).toEqual({ text: 'Acorn', lang: 'en-US' });

  await dialog.getByRole('button', { name: 'Next sticker' }).click();
  await expect(page.getByRole('dialog', { name: 'Moon' })).toBeVisible();
  await expect.poll(async () => (await spoken(page)).at(-1)?.text).toBe('Moon');
  await page.keyboard.press('ArrowRight'); // 끝에서 처음으로
  await expect(page.getByRole('dialog', { name: 'Apple' })).toBeVisible();
  const before = (await spoken(page)).length;
  await page.getByRole('button', { name: 'Hear the name' }).click();
  await expect.poll(async () => (await spoken(page)).length).toBe(before + 1);

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Look closely: Apple' })).toBeFocused();
});

test('세기 놀이: 물건을 누를 때마다 센 수를 읽어 준다 (한국어는 하나·둘·셋)', async ({ page, context }) => {
  await mockSpeech(context);
  await seed(context, { save: makeSave(), locale: 'ko' });
  await openLesson(page);
  await page.getByRole('button', { name: '다음' }).click();
  const items = page.getByRole('button', { name: '이것 세기' });
  await items.first().click();
  await expect.poll(async () => (await spoken(page)).at(-1)).toEqual({ text: '하나', lang: 'ko-KR' });
  await items.nth(1).click();
  await expect.poll(async () => (await spoken(page)).at(-1)?.text).toBe('둘');
});

test('이름 듣기: 놀이 고르기 카드와 공방 가구 이름을 소리로', async ({ page, context }) => {
  await mockSpeech(context);
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: /^Acorn Village/ }).click();
  await page.getByRole('listitem').filter({ hasText: 'Which Has More?' }).getByRole('button', { name: 'Hear the name' }).click();
  await expect.poll(async () => (await spoken(page)).at(-1)).toEqual({ text: 'Which Has More?', lang: 'en-US' });
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Forest Bookshelf' }).getByRole('button', { name: 'Hear the name' }).click();
  await expect.poll(async () => (await spoken(page)).at(-1)?.text).toBe('Forest Bookshelf');
});

test('방 친구를 누르면 이름을 불러 준다', async ({ page, context }) => {
  await mockSpeech(context);
  const save = makeSave();
  await seed(context, { save: { ...save, game: { ...save.game, stickers: ['apple', 'acorn', 'flower'] } }, locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: /아기 오리 두두/ }).click();
  await expect.poll(async () => (await spoken(page)).at(-1)).toEqual({ text: '아기 오리 두두, 안녕!', lang: 'ko-KR' });
});
