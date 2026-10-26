import { test, expect } from '@playwright/test';
import { seed, makeSave, playCountingApples, goToRegion } from './helpers';

// 반려 친구: 스티커를 모으면 방에 찾아오고, 누르면 인사한다
const withStickers = (stickers: string[]) => {
  const s = makeSave();
  return { ...s, game: { ...s.game, stickers } };
};

test('스티커 3장이면 아기 오리가 방에 있고, 누르면 폴짝 뛴다', async ({ page, context }) => {
  await seed(context, { save: withStickers(['apple', 'acorn', 'flower']) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  const duck = page.getByRole('button', { name: 'Dudu the duckling: tap to say hi' });
  await expect(duck).toBeVisible();
  await expect(page.locator('[data-pet]')).toHaveCount(1);
  await duck.click();
  await expect(duck.locator('.animate-hop')).toHaveCount(1);
  // 꾸미기 화면에는 나오지 않는다 (가구 놓기를 방해하지 않게)
  await page.getByRole('button', { name: 'Decorate' }).click();
  await expect(page.locator('[data-pet]')).toHaveCount(0);
});

test('친구는 가구가 없는 칸에서 돌아다닌다', async ({ page, context }) => {
  await page.clock.install();
  await seed(context, { save: withStickers(['apple', 'acorn', 'flower', 'ladybug', 'butterfly', 'frog', 'moon', 'star', 'owl']) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('[data-pet]')).toHaveCount(2);
  const where = () => page.locator('[data-pet]').evaluateAll((els) => els.map((e) => e.getAttribute('data-spot')).join(' '));
  const before = await where();
  await page.clock.runFor(20_000);
  const after = await where();
  expect(after).not.toBe(before);
  // 침대(0,0~1,2)·화분(5,0)·버섯 조명(2,0) 칸에는 서지 않는다
  for (const spot of after.split(' ')) expect(['0,0', '0,1', '0,2', '1,0', '1,1', '1,2', '5,0', '2,0']).not.toContain(spot);
});

test('놀이로 3번째 스티커를 받으면 새 친구가 왔다고 알려 준다 + 도감에 다음 친구까지 남은 수', async ({ page, context }) => {
  await seed(context, { save: withStickers(['moon', 'gem']) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Sticker Book' }).click();
  await expect(page.getByText('Collect 1 more and a new friend will visit your room!')).toBeVisible();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Acorn Village/);
  await playCountingApples(page);
  await expect(page.getByText('A new friend came to your room: Dudu the duckling!')).toBeVisible();
});
