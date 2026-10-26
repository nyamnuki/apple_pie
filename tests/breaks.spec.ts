import { test, expect } from '@playwright/test';
import { seed, makeSave } from './helpers';

// 쉬어 가기: 화면을 보는 시간만 세고, 정한 시간이 되면 루루가 쉬자고 한다
test('20분(기본) 놀면 쉬자는 창, 20초 뒤 다시 놀기', async ({ page, context }) => {
  test.setTimeout(120_000); // 시계를 20분 앞당기는 데 시간이 걸린다
  await page.clock.install();
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.clock.runFor(19 * 60 * 1000);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.clock.runFor(61 * 1000);
  const dialog = page.getByRole('dialog', { name: 'Time for a little rest!' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: "I'm back!" })).toBeDisabled();
  await page.clock.runFor(21 * 1000);
  await expect(dialog.getByRole('button', { name: "I'm back!" })).toBeEnabled();
  await dialog.getByRole('button', { name: "I'm back!" }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('어른 설정에서 끄면 쉬자는 창이 나오지 않는다 (설정은 유지)', async ({ page, context }) => {
  test.setTimeout(120_000);
  await page.clock.install();
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'For grown-ups' }).click();
  for (let i = 0; i < 2; i++) {
    const q = await page.locator('[aria-live="polite"]').textContent();
    const [a, b] = (q ?? '').match(/\d+/g)!.map(Number);
    for (const d of String(a * b)) await page.locator('.grid-cols-3').getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check answer' }).click();
  }
  await page.getByRole('radio', { name: 'Off' }).click();
  await expect(page.getByRole('radio', { name: 'Off' })).toHaveAttribute('aria-checked', 'true');
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('mathTown.settings')))!)).toMatchObject({ breakMinutes: 0 });
  await page.clock.runFor(21 * 60 * 1000); // 기본 20분을 넘겨도
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
