import { test, expect } from '@playwright/test';
import { seed, makeSave, guide, waitLastButtonEnabled, collectProblems } from './helpers';

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
    title: 'Counting Apples', tap: 'Count this one', taps: 5,
    observe: "Look at the apples. Let's count them together!",
    manipulateDone: 'The last number we said was 5. So there are 5 apples!',
    guess: '4', verifyStart: "Let's count them one by one… There are 6 pears!",
    wrong: ['5', '6', '8'], right: '7',
    hints: ['Look carefully. Did you count every mushroom just once?', 'Tap each mushroom to count it. Watch the numbers!', "Let's count together, one by one."],
    correct: 'Yes! There are 7 mushrooms.',
  },
  {
    title: 'Which Has More?', tap: 'Make a pair', taps: 3,
    observe: 'Here are some acorns and some leaves. Which group has more?',
    manipulateDone: 'Some leaves have no partner. They are left over, so there are more leaves!',
    guess: "They're the same", verifyStart: "Let's make pairs… Every flower has a butterfly partner.",
    wrong: ['The cookies', "They're the same"], right: 'The blueberries',
    hints: ['Look carefully. Can every blueberry find a cookie partner?', 'Tap to make pairs and see which group has some left over.'],
    correct: 'Yes! Some blueberries are left over, so there are more blueberries.',
  },
  {
    title: 'Adding More', tap: 'Add this one', taps: 2,
    observe: 'There are 3 flowers in the pot. 2 more flowers are waiting!',
    manipulateDone: '3 flowers and 2 more make 5 flowers!',
    guess: '7', verifyStart: 'Here they come! Start at 4 and count on… 6 ladybugs!',
    wrong: ['4', '6', '7'], right: '5',
    hints: ['Look carefully. How many frogs are on the log at the start?', 'Tap each frog that is hopping over. Count on as they join!', "Let's add them together, one by one."],
    correct: 'Yes! 2 and 3 make 5 frogs.',
  },
  {
    title: 'Taking Away', tap: 'Take this one away', taps: 2,
    observe: 'There are 5 blueberries. Lulu is hungry and wants to eat 2!',
    manipulateDone: 'We took away 2. Now there are 3 blueberries left!',
    guess: '4', verifyStart: "Off they go! Let's count the ones still here… 4 butterflies are left!",
    wrong: ['3', '5', '6'], right: '4',
    hints: ['Look carefully. How many cookies will Lulu eat?', 'Tap the cookie Lulu eats, then count the cookies that are left.', "Let's take it away together and count what is left."],
    correct: 'Yes! 5 take away 1 leaves 4 cookies.',
  },
];

for (const c of CASES) {
  test(`놀이: ${c.title}`, async ({ page, context }) => {
    await seed(context, { save: makeSave() });
    const problems = collectProblems(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Play' }).click();
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
  await page.getByRole('button', { name: /빼기/ }).click();
  await expect(guide(page)).toHaveText('블루베리가 5개 있어요. 배고픈 루루가 2개를 먹고 싶대요!');
  await page.getByRole('button', { name: '다음' }).click();
  const item = page.getByRole('button', { name: '이것 덜어 내기' });
  while (await item.count()) await item.first().click();
  await expect(guide(page)).toHaveText('2개를 덜어 냈어요. 이제 블루베리가 3개 남았어요!');
});
