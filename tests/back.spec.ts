import { test, expect } from '@playwright/test';
import { seed, makeSave, goToRegion } from './helpers';

// 휴대폰 뒤로 가기(브라우저 뒤로)는 앱을 닫지 않고, 화면의 ← 버튼처럼 한 단계 뒤로 간다
test('뒤로 가기: 앱 안에서 한 단계씩 돌아간다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Map');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('My Woodland Room');
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('My Woodland Room');
  expect(page.url()).toContain('localhost'); // 앱을 떠나지 않았다
});

test('놀이 도중 뒤로 가기: 그만할지 묻고, 한 번 더 뒤로 가기는 계속하기', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await goToRegion(page, /^Acorn Village/);
  await page.getByRole('button', { name: /Counting Apples/ }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click(); // 만져 보기
  await page.getByRole('button', { name: 'Count this one' }).first().click();

  await page.goBack();
  const ask = page.getByRole('alertdialog', { name: 'Stop this game?' });
  await expect(ask).toBeVisible();
  await expect(ask.getByRole('button', { name: 'Keep playing' })).toBeFocused();
  await page.goBack(); // 한 번 더 → 계속하기
  await expect(ask).toHaveCount(0);
  await expect(page.getByRole('status', { name: 'Count: 1' })).toBeVisible(); // 하던 그대로

  await page.getByRole('button', { name: 'Go back' }).click();
  await ask.getByRole('button', { name: 'Stop' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Math Play');
});

test('살펴보기에서는 묻지 않고 바로 나간다', async ({ page, context }) => {
  await seed(context, { save: makeSave() });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await goToRegion(page, /^Acorn Village/);
  await page.getByRole('button', { name: /Counting Apples/ }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Math Play');
});

test('스티커 크게 보기에서 뒤로 가기는 창만 닫는다', async ({ page, context }) => {
  const save = makeSave();
  await seed(context, { save: { ...save, game: { ...save.game, stickers: ['apple'] } } });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await page.getByRole('button', { name: 'Look closely: Apple' }).click();
  await expect(page.getByRole('dialog', { name: 'Apple' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sticker Book');
});
