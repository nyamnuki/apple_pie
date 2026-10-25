import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave, englishWords, collectProblems, LOCALE_KEY } from './helpers';

// 다국어 완료 기준 (기획서 4.7) 확인
test.describe('언어', () => {
  test('처음에는 영어, 설정에서 한국어로 바꾸면 바로 바뀌고 다시 열어도 유지된다', async ({ page, context }) => {
    const save = makeSave({ resources: { acorn: 7 } });
    await seed(context, { save });
    const problems = collectProblems(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Math Town');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('radio', { name: /한국어/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('설정');
    await expect(page.getByRole('radio', { name: /한국어/ })).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page).toHaveTitle('셈셈마을');

    // 언어만 바뀌고 게임 데이터는 그대로
    expect((await readSave(page)).game.resources).toEqual({ acorn: 7 });
    expect(await page.evaluate((k) => localStorage.getItem(k), LOCALE_KEY)).toBe('ko');

    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('셈셈마을');
    expect(problems).toEqual([]);
  });

  test('저장된 언어 값이 잘못되면 영어로 돌아간다', async ({ page, context }) => {
    await context.addInitScript(() => localStorage.setItem('mathTown.locale', 'fr-XX'));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Math Town');
  });

  test('한국어 화면에 영어 문구가 섞이지 않는다', async ({ page, context }) => {
    await seed(context, { save: makeSave({ resources: { acorn: 3, apple: 2 } }), locale: 'ko' });
    await page.goto('/');
    expect(await englishWords(page)).toBeNull();
    await page.getByRole('button', { name: '시작하기' }).click();
    expect(await englishWords(page)).toBeNull();
    for (const menu of ['방 꾸미기', '공방', '내 가방']) {
      await page.getByRole('button', { name: menu, exact: true }).click();
      expect(await englishWords(page), menu).toBeNull();
      await page.getByRole('button', { name: '뒤로 가기' }).click();
    }
    await page.getByRole('button', { name: '놀이하기' }).click();
    expect(await englishWords(page), '지도').toBeNull();
    await page.getByRole('button', { name: /^도토리 마을/ }).click();
    expect(await englishWords(page), '놀이 고르기').toBeNull();
  });
});
