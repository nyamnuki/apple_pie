import { test, expect, type Page } from '@playwright/test';
import { seed, makeSave, readSave, playCountingApples, goToRegion } from './helpers';

// 어른 확인(곱셈 2문제) → 어른 설정 → 진행 상황 지우기
async function answer(page: Page, correct: boolean, submit: string) {
  const q = await page.locator('[aria-live="polite"]').textContent();
  const [a, b] = (q ?? '').match(/\d+/g)!.map(Number);
  for (const d of String(correct ? a * b : a * b + 1)) await page.locator('.grid-cols-3').getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: submit }).click();
}

test('어른 확인과 진행 상황 지우기 (언어는 유지)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ resources: { acorn: 9 }, furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 }, completedLessons: ['counting1', 'addition1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused(); // 화면이 바뀌면 제목으로 초점
  await page.getByRole('button', { name: 'For grown-ups' }).click();

  await answer(page, true, 'Check answer');
  await expect(page.getByText('Question 2 of 2')).toBeVisible();
  await answer(page, false, 'Check answer');
  await expect(page.getByText('Question 1 of 2')).toBeVisible();
  await expect(page.getByText("That's not right. Here is a new question.")).toBeVisible();
  await answer(page, true, 'Check answer');
  await answer(page, true, 'Check answer');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Grown-up settings');
  await expect(page.getByText('Math games finished: 2 of 16')).toBeVisible();

  await page.getByRole('button', { name: 'Erase all progress' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Math games finished: 2 of 16')).toBeVisible();

  // 한국어로 바꾼 뒤 지우기
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('radio', { name: /한국어/ }).click();
  await page.getByRole('button', { name: '어른 전용' }).click();
  await answer(page, true, '답 확인');
  await answer(page, true, '답 확인');
  await page.getByRole('button', { name: '진행 상황 모두 지우기' }).click();
  await page.getByRole('button', { name: '네, 지울게요' }).click();
  await expect(page.getByText('진행 상황을 모두 지웠어요.')).toBeVisible();
  await page.waitForTimeout(500);
  await page.reload();
  const s = await readSave(page);
  expect(s.game.resources).toEqual({});
  expect(s.game.furniture).not.toHaveProperty('toyChest');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('셈셈마을');
});

test('예상 못 한 오류가 나면 안내 화면이 나오고 다시 시작할 수 있다', async ({ page, context }) => {
  // 어른 확인 화면을 열 때 일부러 오류를 낸다 (Math.random 사용)
  await context.addInitScript(() => {
    const original = Math.random;
    (window as unknown as { __crash: boolean }).__crash = false;
    Math.random = () => {
      if ((window as unknown as { __crash: boolean }).__crash) throw new Error('test-crash');
      return original();
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.evaluate(() => ((window as unknown as { __crash: boolean }).__crash = true));
  await page.getByRole('button', { name: 'For grown-ups' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oops! Something went wrong.');
  await page.evaluate(() => ((window as unknown as { __crash: boolean }).__crash = false));
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Math Town');
});

test('어른 설정: 놀이별 기록 (횟수·한 번에 맞힘·힌트·마지막 시각)', async ({ page, context }) => {
  await seed(context, {
    save: makeSave({
      completedLessons: ['counting1'],
      lessonStats: { counting1: { plays: 3, firstTry: 2, hints: 1, lastPlayed: '2026-10-25T09:00:00.000Z' } },
    }),
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'For grown-ups' }).click();
  await answer(page, true, 'Check answer');
  await answer(page, true, 'Check answer');

  await expect(page.getByRole('heading', { name: 'Game by game' })).toBeVisible();
  const counting = page.locator('[data-lesson="counting1"]');
  await expect(counting).toContainText('Counting Apples');
  await expect(counting).toContainText('Played 3 times · right on the first try 2 times · hints seen: 1');
  await expect(counting).toContainText('Last played:');
  await expect(page.locator('[data-lesson="tens1"]')).toContainText('Not played yet');
  // 마을 3개가 모두 나온다
  for (const name of ['Acorn Village', 'Moonlight Forest', 'Crystal Cave']) await expect(page.getByRole('heading', { name, level: 3 })).toBeVisible();

  // 한국어
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('radio', { name: /한국어/ }).click();
  await page.getByRole('button', { name: '어른 전용' }).click();
  await answer(page, true, '답 확인');
  await answer(page, true, '답 확인');
  await expect(page.locator('[data-lesson="counting1"]')).toContainText('3번 함 · 한 번에 맞힘 2번 · 본 힌트 1개');
  await expect(page.locator('[data-lesson="tens1"]')).toContainText('아직 안 했어요');
});

test('어른 설정: 파일로 저장하고, 파일에서 되살린다 (이상한 파일은 거절)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ resources: { acorn: 7 }, completedLessons: ['counting1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'For grown-ups' }).click();
  await answer(page, true, 'Check answer');
  await answer(page, true, 'Check answer');

  // 파일로 저장: 내려받은 파일 내용 확인
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Save to a file' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^math-town-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const saved = JSON.parse(await (await download.createReadStream()).toArray().then((c) => Buffer.concat(c).toString('utf8')));
  expect(saved).toMatchObject({ app: 'math-town', game: { resources: { acorn: 7 }, completedLessons: ['counting1'] } });
  await expect(page.getByText('Saved. Look for the file in your downloads.')).toBeVisible();

  // 이상한 파일
  await page.getByTestId('restore-file').setInputFiles({ name: 'notes.json', mimeType: 'application/json', buffer: Buffer.from('{"hello": 1}') });
  await expect(page.getByText("This file can't be used. Please choose a Math Town backup file.")).toBeVisible();

  // 다른 진행 상황이 든 백업 → 확인 → 되살리기
  const other = { ...saved, game: { ...saved.game, resources: { apple: 5 }, completedLessons: ['counting1', 'comparing1', 'addition1'], stickers: ['apple', 'acorn'] } };
  await page.getByTestId('restore-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(other)) });
  await expect(page.getByText('This file has 3 of 16 math games finished and 2 stickers. Replace the current progress with it?')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, restore' }).click();
  await expect(page.getByText('Progress was restored from the file.')).toBeVisible();
  await expect(page.getByText('Math games finished: 3 of 16')).toBeVisible();
  await page.waitForTimeout(500);
  expect((await readSave(page)).game).toMatchObject({ resources: { apple: 5 }, stickers: ['apple', 'acorn'] });
});

test('홈 화면에 추가하기: 기기에 맞는 안내가 먼저, 다른 기기도 골라 볼 수 있다', async ({ browser }) => {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await context.newPage();
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'For grown-ups' }).click();
  await answer(page, true, 'Check answer');
  await answer(page, true, 'Check answer');

  const section = page.getByRole('region', { name: 'Add to the home screen' });
  await expect(section.getByRole('radio', { name: 'iPhone · iPad' })).toBeChecked();
  await expect(section.getByRole('listitem').nth(1)).toHaveText('Tap the Share button (a square with an arrow pointing up).');
  await section.getByRole('radio', { name: 'Android' }).click();
  await expect(section.getByRole('listitem')).toHaveCount(3);
  await expect(section.getByRole('listitem').nth(0)).toHaveText('Open this page in Chrome.');
  await context.close();
});

test('이번 주 놀이: 놀이를 끝내면 오늘 막대가 1 늘어난다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Acorn Village/);
  await playCountingApples(page);
  await page.getByRole('button', { name: 'More games' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'For grown-ups' }).click();
  await answer(page, true, 'Check answer');
  await answer(page, true, 'Check answer');
  const week = page.getByRole('region', { name: 'This week' });
  await expect(week).toContainText('Games finished in the last 7 days: 1');
  await expect(week.getByRole('listitem')).toHaveCount(7);
  await expect(week.getByRole('listitem').last()).toHaveAccessibleName('Today: 1');
});
