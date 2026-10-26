import { test, expect } from '@playwright/test';
import { seed, makeSave, readSave, guide, waitLastButtonEnabled, collectProblems, goToRegion, englishWords } from './helpers';

// 수정 동굴: 잠금/열림, 2씩 뛰어 세기·10씩 묶어 세기 놀이, 동굴 재료 가구, 놀이 기록

const ACORN_TWO = ['counting1', 'comparing1'];

test('달빛 숲 놀이 2개를 끝내면 수정 동굴이 열린다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: [...ACORN_TWO, 'patterns1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  const cave = page.getByRole('button', { name: /^Crystal Cave/ });
  await expect(cave).toBeDisabled();
  await expect(cave).toContainText('Finish 2 games in Moonlight Forest to open it. (1/2)');

  await goToRegion(page, /^Moonlight Forest/);
  await page.getByRole('button', { name: /Shape Hunt/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const circle = page.getByRole('button', { name: 'Circle' });
  while (await circle.count()) await circle.first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button').first().click();
  await waitLastButtonEnabled(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '5', exact: true }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'A new place opened' })).toHaveText(/A new place opened: Crystal Cave!/);

  await page.getByRole('button', { name: 'More games' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await expect(cave).toBeEnabled();
  await expect(cave).toContainText('0 of 3 games finished');
});

test('놀이: 2씩 뛰어 세기 (묶음을 누르면 2, 4, 6…)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: [...ACORN_TWO, 'patterns1', 'shapes1'] }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Crystal Cave/);
  await page.getByRole('button', { name: /Counting by Twos/ }).click();
  await expect(guide(page)).toHaveText('Look! The gems in the cave come in pairs. There are two in every box.');
  await page.getByRole('button', { name: 'Next' }).click();

  // 만져 보기: 짝 6개를 누르면 2, 4, … 12
  const pair = page.getByRole('button', { name: 'Count this group of 2' });
  await expect(pair).toHaveCount(6);
  await pair.first().click();
  await expect(page.getByRole('status', { name: 'Count: 2' })).toBeVisible();
  await pair.first().click();
  await expect(page.getByRole('status', { name: 'Count: 4' })).toBeVisible();
  while (await pair.count()) await pair.first().click();
  await expect(guide(page)).toHaveText('2, 4, 6, 8, 10, 12! Counting by twos is faster than counting one by one.');
  await page.getByRole('button', { name: 'Next' }).click();

  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '16', exact: true }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/There are 16 bats!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // 해 보기: 짝 9쌍 + 혼자 1개 = 19. 짝만 센 18 을 고르면 힌트
  await choices.getByRole('button', { name: '18', exact: true }).click();
  await expect(guide(page)).toHaveText(/Count the pairs by twos first\. Then add the one that is alone\./);
  await choices.getByRole('button', { name: '19', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! 18 in pairs and one more make 19!');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Crystal +2' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Mithril +1' })).toBeVisible(); // 처음 보너스

  await page.waitForTimeout(300);
  const s = await readSave(page);
  expect(s.game.resources).toEqual({ crystal: 2, mithril: 1 });
  expect(s.game.lessonStats.skipCount1).toMatchObject({ plays: 1, firstTry: 0, hints: 1 });
  expect(problems).toEqual([]);
});

test('놀이: 10씩 묶어 세기 (10, 20, 21, 22, 23)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: [...ACORN_TWO, 'patterns1', 'shapes1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Crystal Cave/);
  await page.getByRole('button', { name: /Bundles of Ten/ }).click();
  await expect(guide(page)).toHaveText('Each box holds 10 pebbles. There are 2 full boxes and 3 loose pebbles.');
  await page.getByRole('button', { name: 'Next' }).click();

  const ten = page.getByRole('button', { name: 'Count this group of 10' });
  const one = page.getByRole('button', { name: 'Count this one' });
  await expect(ten).toHaveCount(2);
  await expect(one).toHaveCount(3);
  await ten.first().click();
  await ten.first().click();
  await expect(page.getByRole('status', { name: 'Count: 20' })).toBeVisible();
  await one.first().click();
  await expect(page.getByRole('status', { name: 'Count: 21' })).toBeVisible();
  while (await one.count()) await one.first().click();
  await expect(guide(page)).toHaveText('10, 20, then 21, 22, 23! 2 tens and 3 ones make 23.');
  await page.getByRole('button', { name: 'Next' }).click();

  // 예상: 53 (자리를 바꿔 읽은 실수)을 골라도 확인하기에서 35 를 보여준다
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '53', exact: true }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/That's 35!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '42', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! 4 tens and 2 ones make 42!');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Crystal +1' })).toBeVisible();

  await page.waitForTimeout(300);
  expect((await readSave(page)).game.lessonStats.tens1).toMatchObject({ plays: 1, firstTry: 1, hints: 0 });
});

test('수정 동굴 재료로 가구를 만들고, 동굴 마을은 한국어로도 나온다', async ({ page, context }) => {
  await seed(context, {
    save: makeSave({ completedLessons: [...ACORN_TWO, 'patterns1', 'shapes1'], resources: { crystal: 3, glowBranch: 1, mithril: 2 } }),
    locale: 'ko',
  });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '공방' }).click();
  await page.getByRole('listitem').filter({ hasText: '수정 등불' }).getByRole('button', { name: '만들기!' }).click();
  await expect(page.getByText('수정 등불 완성!')).toBeVisible();
  await page.waitForTimeout(300);
  const s = await readSave(page);
  expect(s.game.furniture.crystalLamp).toBe(1);
  expect(s.game.resources).toMatchObject({ crystal: 0, glowBranch: 0, mithril: 2 }); // 다 쓴 재료는 0 으로 남는다

  // 지도와 놀이 고르기
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  await expect(page.getByRole('button', { name: /^수정 동굴/ })).toContainText('2씩·5씩 뛰어 세기 · 10씩 묶어 세기');
  await goToRegion(page, /^수정 동굴/);
  await expect(page.getByRole('button', { name: /2씩 뛰어 세기/ })).toBeVisible();
  await page.getByRole('button', { name: /10씩 묶어 세기/ }).click();
  await expect(guide(page)).toHaveText('상자 하나에 조약돌이 10개씩 들어 있어요. 꽉 찬 상자 2개와 낱개 3개가 있어요.');
  await page.getByRole('button', { name: '다음' }).click();
  await expect(page.getByRole('button', { name: '10개 묶음 세기' })).toHaveCount(2);
  expect(await englishWords(page)).toBeNull();
});

test('놀이: 5씩 뛰어 세기 (주사위 눈 모양 묶음, 5, 10, 15, 20)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: [...ACORN_TWO, 'patterns1', 'shapes1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Crystal Cave/);
  await page.getByRole('button', { name: /Counting by Fives/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const five = page.getByRole('button', { name: 'Count this group of 5' });
  await expect(five).toHaveCount(4);
  await five.first().click();
  await five.first().click();
  await expect(page.getByRole('status', { name: 'Count: 10' })).toBeVisible();
  while (await five.count()) await five.first().click();
  await expect(guide(page)).toHaveText('5, 10, 15, 20! Counting by fives is super fast.');
  await page.getByRole('button', { name: 'Next' }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '6', exact: true }).click(); // 묶음 수만 센 실수
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/There are 30 gems!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await choices.getByRole('button', { name: '27', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! 25 in groups of five and 2 more make 27!');
});
