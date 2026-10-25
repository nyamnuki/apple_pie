import { test, expect, type Page } from '@playwright/test';
import { seed, makeSave, readSave } from './helpers';

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
  await expect(page.getByText('Math games finished: 2 of 4')).toBeVisible();

  await page.getByRole('button', { name: 'Erase all progress' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Math games finished: 2 of 4')).toBeVisible();

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
