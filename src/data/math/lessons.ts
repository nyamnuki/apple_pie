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
    explore: { kind: 'count', item: 'apple', total: 10 },
    predict: { kind: 'count', item: 'pear', total: 13 },
    predictChoices: [12, 13, 14, 15],
    apply: { kind: 'count', item: 'mushroom', total: 17 },
    applyChoices: [15, 16, 17, 18],
  },
  {
    id: 'comparing1',
    rewards: { acorn: 2, apple: 2 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'comparing',
    region: 'acornVillage',
    icon: 'acorn',
    explore: { kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 7, b: 9 },
    predict: { kind: 'compare', itemA: 'flower', itemB: 'butterfly', a: 8, b: 8 },
    predictChoices: ['a', 'b', 'same'],
    predictLabels: { a: 'lessons.comparing1.predictA', b: 'lessons.comparing1.predictB' },
    apply: { kind: 'compare', itemA: 'blueberry', itemB: 'cookie', a: 11, b: 9 },
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
    // 10을 넘는 덧셈: 처음 수에서 이어 세기
    explore: { kind: 'add', item: 'flower', start: 8, add: 5 },
    predict: { kind: 'add', item: 'ladybug', start: 9, add: 4 },
    predictChoices: [11, 12, 13, 14],
    apply: { kind: 'add', item: 'frog', start: 8, add: 7 },
    applyChoices: [13, 14, 15, 16],
  },
  {
    id: 'subtraction1',
    rewards: { acorn: 2, apple: 2 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'subtraction',
    region: 'acornVillage',
    icon: 'blueberry',
    // 10보다 큰 수에서 빼기
    explore: { kind: 'subtract', item: 'blueberry', start: 12, remove: 5 },
    predict: { kind: 'subtract', item: 'butterfly', start: 14, remove: 6 },
    predictChoices: [6, 7, 8, 9],
    apply: { kind: 'subtract', item: 'cookie', start: 16, remove: 9 },
    applyChoices: [5, 6, 7, 8],
  },

  // ===== 달빛 숲 =====
  {
    id: 'patterns1',
    rewards: { glowBranch: 2 },
    firstTimeBonus: { moonDew: 1 },
    area: 'patterns',
    region: 'moonlightForest',
    icon: 'moon',
    explore: { kind: 'pattern', unit: ['moon', 'star', 'star'], shown: 9 }, // 달 별 별 ×3 → 달
    predict: { kind: 'pattern', unit: ['star', 'star', 'moon', 'moon'], shown: 10 }, // 별 별 달 달 별 별 달 달 별 별 → 달
    predictChoices: ['star', 'moon', 'owl'],
    apply: { kind: 'pattern', unit: ['leaf', 'mushroom', 'acorn', 'owl'], shown: 10 }, // 잎 버섯 도토리 부엉이 ×2 + 잎 버섯 → 도토리
    applyChoices: ['leaf', 'mushroom', 'acorn', 'owl'],
  },
  {
    id: 'shapes1',
    rewards: { glowBranch: 1, moonDew: 1 },
    firstTimeBonus: { moonDew: 1 },
    area: 'shapes',
    region: 'moonlightForest',
    icon: 'star',
    // 동그라미 5개 (크기·색이 다르다)
    explore: {
      kind: 'shapes',
      target: 'circle',
      shapes: [
        { shape: 'circle', color: '#A8C3A0', size: 1.1 },
        { shape: 'square', color: '#F5D0AD', size: 0.9 },
        { shape: 'circle', color: '#F3C6D2', size: 0.6 },
        { shape: 'triangle', color: '#C8DFE8', size: 1 },
        { shape: 'circle', color: '#D9D0EC', size: 0.85 },
        { shape: 'square', color: '#A8C3A0', size: 0.7, rotate: 20 },
        { shape: 'triangle', color: '#F3C6D2', size: 0.75, rotate: 180 },
        { shape: 'circle', color: '#F5D0AD', size: 1 },
        { shape: 'square', color: '#C8DFE8', size: 0.65 },
        { shape: 'circle', color: '#C8DFE8', size: 0.7 },
      ],
    },
    // 세모 6개 (여러 개가 돌아가 있다)
    predict: {
      kind: 'shapes',
      target: 'triangle',
      shapes: [
        { shape: 'triangle', color: '#F3C6D2', size: 1 },
        { shape: 'circle', color: '#C8DFE8', size: 0.8 },
        { shape: 'triangle', color: '#A8C3A0', size: 0.7 },
        { shape: 'square', color: '#D9D0EC', size: 0.9 },
        { shape: 'triangle', color: '#F5D0AD', size: 1.1, rotate: 180 },
        { shape: 'circle', color: '#F3C6D2', size: 1 },
        { shape: 'square', color: '#F5D0AD', size: 0.65 },
        { shape: 'triangle', color: '#D9D0EC', size: 0.85, rotate: 90 },
        { shape: 'circle', color: '#A8C3A0', size: 0.6 },
        { shape: 'triangle', color: '#C8DFE8', size: 0.6, rotate: 30 },
        { shape: 'square', color: '#A8C3A0', size: 0.8, rotate: 15 },
        { shape: 'triangle', color: '#F5D0AD', size: 0.9, rotate: 270 },
      ],
    },
    predictChoices: [5, 6, 7, 8],
    // 네모 5개 (45도 돌아간 것 2개 포함)
    apply: {
      kind: 'shapes',
      target: 'square',
      shapes: [
        { shape: 'circle', color: '#F5D0AD', size: 0.9 },
        { shape: 'square', color: '#C8DFE8', size: 1 },
        { shape: 'triangle', color: '#F3C6D2', size: 0.8 },
        { shape: 'square', color: '#F3C6D2', size: 0.75, rotate: 45 },
        { shape: 'circle', color: '#A8C3A0', size: 0.65 },
        { shape: 'triangle', color: '#D9D0EC', size: 1.1, rotate: 180 },
        { shape: 'square', color: '#A8C3A0', size: 0.6 },
        { shape: 'triangle', color: '#F5D0AD', size: 0.7 },
        { shape: 'circle', color: '#D9D0EC', size: 1.05 },
        { shape: 'square', color: '#F5D0AD', size: 0.85, rotate: 15 },
        { shape: 'triangle', color: '#C8DFE8', size: 0.65, rotate: 90 },
        { shape: 'circle', color: '#F3C6D2', size: 0.75 },
        { shape: 'square', color: '#D9D0EC', size: 0.7, rotate: 45 },
        { shape: 'triangle', color: '#A8C3A0', size: 0.95, rotate: 30 },
      ],
    },
    applyChoices: [4, 5, 6, 7],
  },

  {
    id: 'measure1',
    rewards: { glowBranch: 2 },
    firstTimeBonus: { moonDew: 1 },
    area: 'measuring',
    region: 'moonlightForest',
    icon: 'leaf',
    // 블록을 빈틈없이 이어 놓아 길이 재기
    explore: { kind: 'measure', thing: 'twig', length: 5 },
    predict: { kind: 'measure', thing: 'ribbon', length: 7 },
    predictChoices: [5, 6, 7, 8],
    apply: { kind: 'measure', thing: 'caterpillar', length: 6 },
    applyChoices: [4, 5, 6, 7],
  },

  // ===== 수정 동굴 =====
  {
    id: 'skipCount1',
    rewards: { crystal: 2 },
    firstTimeBonus: { mithril: 1 },
    area: 'skipCounting',
    region: 'crystalCave',
    icon: 'gem',
    // 2씩 뛰어 세기: 둘씩 짝지어 있으면 2, 4, 6… 으로 빨리 센다
    explore: { kind: 'groups', item: 'gem', size: 2, groups: 6, ones: 0 }, // 12
    predict: { kind: 'groups', item: 'bat', size: 2, groups: 8, ones: 0 }, // 16
    predictChoices: [8, 14, 16, 18],
    apply: { kind: 'groups', item: 'candle', size: 2, groups: 9, ones: 1 }, // 짝 9쌍 + 하나 = 19
    applyChoices: [9, 18, 19, 20],
  },
  {
    id: 'tens1',
    rewards: { crystal: 1, mithril: 1 },
    firstTimeBonus: { mithril: 1 },
    area: 'placeValue',
    region: 'crystalCave',
    icon: 'pebble',
    // 10씩 묶어 세기: 10묶음 몇 개 + 낱개 몇 개 (20보다 큰 수로 가는 다리)
    explore: { kind: 'groups', item: 'pebble', size: 10, groups: 2, ones: 3 }, // 23
    predict: { kind: 'groups', item: 'gem', size: 10, groups: 3, ones: 5 }, // 35 (53 은 자리를 바꿔 읽은 실수)
    predictChoices: [8, 35, 53, 38],
    apply: { kind: 'groups', item: 'mushroom', size: 10, groups: 4, ones: 2 }, // 42
    applyChoices: [6, 24, 40, 42],
  },
];

export const getLesson = (id: LessonId) => LESSONS.find((l) => l.id === id)!;

// 놀이 문장의 번역 키 (예: lessons.counting1.hint2). 언어 파일에 없으면 타입 오류가 난다.
export const lessonKey = (id: LessonId, part: LessonTextPart): TranslationKey => `lessons.${id}.${part}`;
