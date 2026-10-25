import { test, expect } from '@playwright/test';

// 홈 화면 설치 정보와 인터넷 없이 실행 (서비스 워커는 이 파일에서만 켠다)
test.use({ serviceWorkers: 'allow' });

test('홈 화면에 설치할 수 있는 정보(이름·아이콘)가 있다', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifest = await (await request.get(href!)).json();
  expect(manifest).toMatchObject({ name: 'Math Town', display: 'standalone', start_url: './' });
  for (const icon of manifest.icons) {
    const res = await request.get(icon.src);
    expect(res.ok(), icon.src).toBe(true);
    expect(res.headers()['content-type']).toContain('image/png');
  }
  expect((await request.get(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href') as string)).ok()).toBe(true);
});

test('한 번 열고 나면 인터넷이 끊겨도 앱이 열리고 놀 수 있다', async ({ page, context }) => {
  await page.goto('/');
  // 서비스 워커가 파일을 모두 내려받고 이 화면을 맡을 때까지 기다린다
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: /^Acorn Village/ }).click();
  await page.getByRole('button', { name: /Counting Apples/ }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await context.setOffline(false);
});
