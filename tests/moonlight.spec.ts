import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, collectProblems, goToRegion, playLesson, englishWords } from './helpers';

// 달빛 숲: 지도 잠금/열림, 규칙 찾기·도형 찾기 놀이, 달빛 숲 재료로 만드는 가구

test('도토리 마을 놀이 2개를 끝내면 달빛 숲이 열린다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  const forest = page.getByRole('button', { name: /^Moonlight Forest/ });
  await expect(forest).toBeDisabled();
  await expect(forest).toContainText('Finish 2 games in Acorn Village to open it. (1/2)');

  await goToRegion(page, /^Acorn Village/);
  await playLesson(page, /Taking Away/, 'Take this one away', '7');
  await expect(page.getByRole('status').filter({ hasText: 'A new place opened' })).toHaveText(/A new place opened: Moonlight Forest!/);

  await page.getByRole('button', { name: 'More games' }).click();
  await page.getByRole('button', { name: 'Go back' }).click(); // 놀이 고르기 → 지도
  await expect(forest).toBeEnabled();
  await expect(forest).toContainText('0 of 3 games finished');
});

test('놀이: 다음에 올 것은? (규칙 찾기)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Moonlight Forest/);
  await page.getByRole('button', { name: /What Comes Next\?/ }).click();
  const choices = page.getByRole('group', { name: 'Answer choices' });

  await expect(guide(page)).toHaveText('Look at the night sky: moon, star, star, moon, star, star… What comes next?');
  await expect(page.getByRole('img', { name: 'What comes next?' })).toBeVisible(); // '?' 자리
  await page.getByRole('button', { name: 'Next' }).click();

  // 만져 보기: 하나씩 말하기 (9번)
  let taps = 0;
  const say = page.getByRole('button', { name: /Say the next one/ });
  await expect(say.first()).toHaveAccessibleName('Say the next one: Moon');
  while (await say.count()) {
    await say.first().click();
    taps++;
  }
  expect(taps).toBe(9);
  await expect(guide(page)).toHaveText('Moon, star, star — moon, star, star! The same part keeps repeating, so a moon comes next.');
  await page.getByRole('button', { name: 'Next' }).click();

  // 예상: 그림 답 버튼 (별·달·부엉이) — 일부러 별
  for (const [i, name] of ['Star', 'Moon', 'Owl'].entries()) await expect(choices.getByRole('button').nth(i)).toHaveAccessibleName(name);
  await choices.getByRole('button', { name: 'Star' }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/After star, star comes a moon! Good guess!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // 해 보기: 힌트 1, 2 → 정답
  await expect(guide(page)).toHaveText('Leaf, mushroom, acorn, owl… Which one comes next?');
  await expect(choices.getByRole('button')).toHaveCount(4);
  await choices.getByRole('button', { name: 'Mushroom' }).click();
  await expect(guide(page)).toHaveText("Let's try another way! Look carefully. Which four things keep repeating?");
  await choices.getByRole('button', { name: 'Leaf' }).click();
  await expect(page.getByRole('button', { name: /Say the next one/ }).first()).toBeVisible(); // 힌트 2: 직접 해 보기
  await choices.getByRole('button', { name: 'Acorn' }).click();
  await expect(guide(page)).toHaveText('Yes! Leaf, mushroom — and then an acorn!');

  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Glow Branch +2' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Moon Dew +1' })).toBeVisible(); // 처음 보너스
  expect(problems).toEqual([]);
});

test('놀이: 도형 찾기 (다른 도형을 누르면 흔들리기만 한다)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Moonlight Forest/);
  await page.getByRole('button', { name: /Shape Hunt/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('button', { name: 'Square' }).first().click();
  await expect(page.getByRole('status', { name: 'Count: 0' })).toBeVisible(); // 세지 않음
  const circle = page.getByRole('button', { name: 'Circle' });
  while (await circle.count()) await circle.first().click();
  await expect(guide(page)).toHaveText('You found 5 circles! Their sizes and colors are different, but they are all round.');
  await page.getByRole('button', { name: 'Next' }).click();

  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '5', exact: true }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/There are 6! Even the turned ones are triangles\./);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await choices.getByRole('button', { name: '4', exact: true }).click();
  await expect(guide(page)).toContainText('A square has 4 straight sides');
  await choices.getByRole('button', { name: '6', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Square' }).first()).toBeVisible(); // 힌트 2: 직접 찾아보기
  await choices.getByRole('button', { name: '7', exact: true }).click();
  await expect(guide(page)).toHaveText("Let's try another way! Let's find the squares together.");
  await choices.getByRole('button', { name: '5', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! There are 5 squares — even the turned ones!');
});

test('달빛 숲이 열리면 달빛 숲 재료 가구를 만들 수 있다', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'], resources: { glowBranch: 4, moonDew: 2, acorn: 2 } }) });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await expect(page.getByText('You can make this when you can visit Moonlight Forest.')).toHaveCount(0);
  const lantern = page.getByRole('listitem').filter({ hasText: 'Moon Lantern' });
  await lantern.getByRole('button', { name: 'Make it!' }).click();
  await expect(page.getByText('You made a Moon Lantern!')).toBeVisible();
  await page.getByRole('button', { name: 'Keep making' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Woodland Wallpaper' }).getByRole('button', { name: 'Make it!' }).click();
  await expect(page.getByText('You made a Woodland Wallpaper!')).toBeVisible();
});

test('한국어: 지도와 규칙 찾기 놀이', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }), locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  expect(await englishWords(page)).toBeNull();
  await goToRegion(page, /^달빛 숲/);
  expect(await englishWords(page)).toBeNull();
  await page.getByRole('button', { name: /다음에 올 것은\?/ }).click();
  await expect(guide(page)).toHaveText('밤하늘을 봐요. 달, 별, 별, 달, 별, 별… 다음엔 무엇이 올까요?');
  expect(await englishWords(page)).toBeNull();
});

test('놀이: 얼마나 길까? (블록을 빈틈없이 놓아 길이 재기)', async ({ page, context }) => {
  await seed(context, { save: makeSave({ completedLessons: ['counting1', 'comparing1'] }) });
  const problems = collectProblems(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Play' }).click();
  await goToRegion(page, /^Moonlight Forest/);
  await page.getByRole('button', { name: /How Long Is It\?/ }).click();
  await expect(guide(page)).toHaveText('Look at the twig. How many blocks long do you think it is?');
  await page.getByRole('button', { name: 'Next' }).click();

  // 만져 보기: 블록 놓기 버튼 5번 → 나뭇가지 끝까지 (버튼은 끝에 닿으면 사라진다)
  const add = page.getByRole('button', { name: 'Put a block' });
  let taps = 0;
  while (await add.count()) {
    await add.click();
    taps++;
  }
  expect(taps).toBe(5);
  await expect(guide(page)).toHaveText('The twig is 5 blocks long! The blocks touch end to end, with no gaps.');
  await page.getByRole('button', { name: 'Next' }).click();

  const choices = page.getByRole('group', { name: 'Answer choices' });
  await choices.getByRole('button', { name: '6', exact: true }).click();
  await waitLastButtonEnabled(page);
  await expect(guide(page)).toHaveText(/The ribbon is 7 blocks long!/);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // 해 보기: 틀리면 힌트, 두 번 틀리면 직접 블록 놓기
  await choices.getByRole('button', { name: '4', exact: true }).click();
  await expect(guide(page)).toHaveText(/Look where the caterpillar starts and ends/);
  await choices.getByRole('button', { name: '5', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Put a block' })).toBeVisible();
  await choices.getByRole('button', { name: '6', exact: true }).click();
  await expect(guide(page)).toHaveText('Yes! The caterpillar is 6 blocks long!');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('img', { name: 'Glow Branch +2' })).toBeVisible();
  expect(problems).toEqual([]);
});
