import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, collectProblems, goToRegion } from './helpers';

// 수학 놀이 4종: 6단계 진행, 예상 비교, 힌트 3단계, 정답, 보상 화면
interface Case {
  title: string;
  tap: string; // 만져 보기에서 누를 물건 이름
  taps: number;
  observe: string;
  manipulateDone: string;
  guess: string;
  verifyStart: string;
  wrong: string[];
  right: string;
  hints: string[];
  correct: string;
}

const CASES: Case[] = [
  {
    title: 'Counting Apples', tap: 'Count this one', taps: 10,
    observe: "Look at the apples. Let's count them together!",
    manipulateDone: 'The last number we said was 10. So there are 10 apples!',
    guess: '12', verifyStart: "Let's count them one by one… There are 13 pears!",
    wrong: ['15', '16', '18'], right: '17',
    hints: ['Look carefully. Did you count every mushroom just once?', 'Tap each mushroom to count it. Watch the numbers!', "Let's count together, one by one."],
    correct: 'Yes! There are 17 mushrooms.',
  },
  {
    title: 'Which Has More?', tap: 'Make a pair', taps: 7,
    observe: 'Here are some acorns and some leaves. Which group has more?',
    manipulateDone: 'Some leaves have no partner. They are left over, so there are more leaves!',
    guess: "They're the same", verifyStart: "Let's make pairs… Every flower has a butterfly partner.",
    wrong: ['The cookies', "They're the same"], right: 'The blueberries',
    hints: ['Look carefully. Can every blueberry find a cookie partner?', 'Tap to make pairs and see which group has some left over.'],
    correct: 'Yes! Some blueberries are left over, so there are more blueberries.',
  },
  {
    title: 'Adding More', tap: 'Add this one', taps: 5,
    observe: 'There are 8 flowers in the pot. 5 more flowers are waiting!',
    manipulateDone: '8 flowers and 5 more make 13 flowers!',
    guess: '11', verifyStart: 'Here they come! Start at 9 and count on… 13 ladybugs!',
    wrong: ['13', '14', '16'], right: '15',
    hints: ['Look carefully. How many frogs are on the log at the start?', 'Tap each frog that is hopping over. Count on as they join!', "Let's add them together, one by one."],
    correct: 'Yes! 8 and 7 make 15 frogs.',
  },
  {
    title: 'Taking Away', tap: 'Take this one away', taps: 5,
    observe: 'There are 12 blueberries. Lulu is hungry and wants to eat 5!',
    manipulateDone: 'We took away 5. Now there are 7 blueberries left!',
    guess: '7', verifyStart: "Off they go! Let's count the ones still here… 8 butterflies are left!",
    wrong: ['5', '6', '8'], right: '7',
    hints: ['Look carefully. How many cookies will Lulu eat?', 'Tap the cookies Lulu eats, then count the cookies that are left.', "Let's take them away together and count what is left."],
    correct: 'Yes! 16 take away 9 leaves 7 cookies.',
  },
];

for (const c of CASES) {
  test(`놀이: ${c.title}`, async ({ page, context }) => {
    await seed(context, { save: makeSave() });
    const problems = collectProblems(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Play' }).click();
    await goToRegion(page, /^Acorn Village/);
    await page.getByRole('button', { name: new RegExp(c.title.replace('?', '\\?')) }).click();
    const choices = page.getByRole('group', { name: 'Answer choices' });

    await expect(guide(page)).toHaveText(c.observe);
    await page.getByRole('button', { name: 'Next' }).click();

    // 만져 보기
    let taps = 0;
    const item = page.getByRole('button', { name: c.tap });
    while (await item.count()) {
      await item.first().click();
      taps++;
    }
    expect(taps).toBe(c.taps);
    await expect(guide(page)).toHaveText(c.manipulateDone);
    await page.getByRole('button', { name: 'Next' }).click();

    // 예상하기 → 확인하기
    await choices.getByRole('button', { name: c.guess, exact: true }).click();
    await waitLastButtonEnabled(page);
    await expect(guide(page)).toContainText(c.verifyStart);
    await page.getByRole('button', { name: 'Next' }).click(); // 발견하기
    await page.getByRole('button', { name: 'Next' }).click(); // 해 보기

    // 오답 → 힌트 1, 2, 3 (벌칙 없이 안내만)
    for (let i = 0; i < c.wrong.length; i++) {
      await choices.getByRole('button', { name: c.wrong[i], exact: true }).click();
      await expect(guide(page)).toHaveText(`Let's try another way! ${c.hints[i]}`);
      if (i === 1) await expect(page.getByRole('button', { name: c.tap }).first()).toBeVisible(); // 힌트 2: 직접 해 보기
    }
    await expect(choices.getByRole('button', { disabled: true })).toHaveCount(c.wrong.length);
    await choices.getByRole('button', { name: c.right, exact: true }).click();
    await expect(guide(page)).toHaveText(c.correct);

    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByRole('heading', { name: 'You discovered something new!' })).toBeVisible();
    expect(problems).toEqual([]);
  });
}

test('한국어로도 놀이가 자연스럽게 진행된다 (빼기)', async ({ page, context }) => {
  await seed(context, { save: makeSave(), locale: 'ko' });
  await page.goto('/');
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('button', { name: '놀이하기' }).click();
  await goToRegion(page, /^도토리 마을/);
  await page.getByRole('button', { name: /빼기/ }).click();
  await expect(guide(page)).toHaveText('블루베리가 12개 있어요. 배고픈 루루가 5개를 먹고 싶대요!');
  await page.getByRole('button', { name: '다음' }).click();
  const item = page.getByRole('button', { name: '이것 덜어 내기' });
  while (await item.count()) await item.first().click();
  await expect(guide(page)).toHaveText('5개를 덜어 냈어요. 이제 블루베리가 7개 남았어요!');
});
