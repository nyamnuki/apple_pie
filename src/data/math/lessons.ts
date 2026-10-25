import type { LessonId, LessonTextPart, MathLesson } from '../../types/math';
import type { TranslationKey } from '../../i18n';

// ===== 수학 놀이 목록 =====
// 수량·정답·선택지는 여기 한곳에만 둔다. (영어·한국어가 같은 값을 쓴다)
// 문장은 언어 파일 lessons.<id> 에 있고, 문장 속 숫자는 {start} 처럼 여기 값으로 채운다.
// 정답은 장면 정보로 자동 계산한다 (src/features/math/answers.ts).
// rewards: 끝까지 하면 받는 도토리 마을 재료, firstTimeBonus: 처음 끝냈을 때만 더 받는 재료.

export const LESSONS: MathLesson[] = [
  {
    id: 'counting1',
    rewards: { acorn: 3, apple: 1 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'counting',
    region: 'acornVillage',
    icon: 'apple',
    explore: { kind: 'count', item: 'apple', total: 5 },
    predict: { kind: 'count', item: 'pear', total: 6 },
    predictChoices: [4, 5, 6, 7],
    apply: { kind: 'count', item: 'mushroom', total: 7 },
    applyChoices: [5, 6, 7, 8],
  },
  {
    id: 'comparing1',
    rewards: { acorn: 2, apple: 2 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'comparing',
    region: 'acornVillage',
    icon: 'acorn',
    explore: { kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 3, b: 5 },
    predict: { kind: 'compare', itemA: 'flower', itemB: 'butterfly', a: 4, b: 4 },
    predictChoices: ['a', 'b', 'same'],
    predictLabels: { a: 'lessons.comparing1.predictA', b: 'lessons.comparing1.predictB' },
    apply: { kind: 'compare', itemA: 'blueberry', itemB: 'cookie', a: 6, b: 4 },
    applyChoices: ['a', 'b', 'same'],
    applyLabels: { a: 'lessons.comparing1.applyA', b: 'lessons.comparing1.applyB' },
  },
  {
    id: 'addition1',
    rewards: { acorn: 1, apple: 3 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'addition',
    region: 'acornVillage',
    icon: 'flower',
    explore: { kind: 'add', item: 'flower', start: 3, add: 2 },
    predict: { kind: 'add', item: 'ladybug', start: 4, add: 2 },
    predictChoices: [5, 6, 7, 8],
    apply: { kind: 'add', item: 'frog', start: 2, add: 3 },
    applyChoices: [4, 5, 6, 7],
  },
  {
    id: 'subtraction1',
    rewards: { acorn: 2, apple: 2 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'subtraction',
    region: 'acornVillage',
    icon: 'blueberry',
    explore: { kind: 'subtract', item: 'blueberry', start: 5, remove: 2 },
    predict: { kind: 'subtract', item: 'butterfly', start: 6, remove: 2 },
    predictChoices: [2, 3, 4, 5],
    apply: { kind: 'subtract', item: 'cookie', start: 5, remove: 1 },
    applyChoices: [3, 4, 5, 6],
  },
];

export const getLesson = (id: LessonId) => LESSONS.find((l) => l.id === id)!;

// 놀이 문장의 번역 키 (예: lessons.counting1.hint2). 언어 파일에 없으면 타입 오류가 난다.
export const lessonKey = (id: LessonId, part: LessonTextPart): TranslationKey => `lessons.${id}.${part}`;
