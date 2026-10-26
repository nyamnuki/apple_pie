import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, collectProblems, goToRegion, englishWords } from './helpers';

// 햇살 들판: 잠금/열림, 수직선 뛰기, 짝수·홀수
const OPEN = ['counting1', 'comparing1', 'patterns1', 'shapes1', 'skipCount1', 'tens1'];

test('수정 동굴 놀이 2개를 끝내면 햇살 들판이 열린다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN.slice(0, 5) }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  const meadow = page.getByRole('button', { name: /^Sunny Meadow/ });
  await expect(meadow).toBeDisabled();
  await expect(meadow).toContainText('Finish 2 games in Crystal Cave to open it. (1/2)');
});

test('놀이: 수직선 뛰기 (뛰기 버튼으로 한 칸씩, 왼쪽은 빼기)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Sunny Meadow/);
  await page.getByRole('button', { name: /Hop on the Number Line/ }).click();
  await expect(guide(page)).toHaveText('Look at the number line. The frog is on 7. It will hop 5 times to the right.');
  await page.getByRole('button', { name: 'Next' }).click();
  const hop = page.getByRole('button', { name: 'Hop' });
  let hops = 0;
  while (await hop.count()) {
    await hop.click();
    hops++;
  }
  expect(hops).toBe(5);
  await expect(guide(page)).toHaveText('From 7, 5 hops… The frog landed on 12! 7 + 5 = 12.');
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '17', exact: true }).click(); // 반대로 뛴 실수
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/The frog landed on 9!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '15', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! 9 + 6 = 15!');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Sunflower Seed +2' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Honey +1' })).toBeVisible();
  expect(problems).toEqual([]);
});

test('놀이: 짝이 될까, 하나 남을까? (한국어)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: OPEN }), locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  await goToRegion(page, /^햇살 들판/);
  await page.getByRole('button', { name: /짝이 될까, 하나 남을까\?/ }).click();
  await expect(guide(page)).toHaveText('벌이 8마리 있어요. 모두 짝을 찾을 수 있을까요?');
  await page.getByRole('button', { name: '다음' }).click();
  const bee = page.getByRole('button', { name: '짝 짓기' });
  while (await bee.count()) await bee.first().click();
  await expect(guide(page)).toHaveText('4쌍이 되고 남은 것은 0마리예요! 남는 것이 없으면 짝수예요.');
  await page.getByRole('button', { name: '다음' }).click();
  const choices = page.getByRole('group', { name: '답 고르기' });
  await expect(choices.getByRole('button')).toHaveText(['짝수', '홀수']);
  await choices.getByRole('button', { name: '홀수' }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/4쌍, 남은 것 1마리/);
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await choices.getByRole('button', { name: '짝수' }).click();
  await expect(guide(page)).toHaveText('맞아요! 7쌍, 남은 것 0개예요.');
  expect(await englishWords(page)).toBeNull();
});

test('놀이: 10 만들기 (빈칸을 채우며 몇 개 더인지 세기)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1', 'patterns1', 'shapes1', 'skipCount1', 'tens1'] }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Sunny Meadow/);
  await page.getByRole('button', { name: /Make Ten/ }).click();
  await expect(guide(page)).toHaveText('This box has 10 spots. There are 7 bees in it. How many more bees would fill it up?');
  await page.getByRole('button', { name: 'Next' }).click();
  const fill = page.getByRole('button', { name: 'Fill this spot' });
  await expect(fill).toHaveCount(3);
  while (await fill.count()) await fill.first().click();
  await expect(page.getByRole('status', { name: 'Count: 3' })).toBeVisible();
  await expect(guide(page)).toHaveText('7 and 3 make 10! The box is full.');
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '14', exact: true }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/6 more make 10!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '2', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! 8 and 2 make 10.');
  expect(problems).toEqual([]);
});
