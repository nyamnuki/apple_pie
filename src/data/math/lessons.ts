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

  {
    id: 'difference1',
    rewards: { acorn: 2, apple: 1 },
    firstTimeBonus: { goldenAcorn: 1 },
    area: 'comparing',
    region: 'acornVillage',
    icon: 'pear',
    // 몇 개 더 많을까: 하나씩 짝지으면 짝 없이 남는 수
    explore: { kind: 'difference', itemA: 'apple', itemB: 'pear', a: 7, b: 4 }, // 3
    predict: { kind: 'difference', itemA: 'mushroom', itemB: 'flower', a: 9, b: 5 }, // 4 (5 는 적은 쪽, 14 는 더한 실수)
    predictChoices: [4, 5, 9, 14],
    apply: { kind: 'difference', itemA: 'ladybug', itemB: 'butterfly', a: 8, b: 6 }, // 2
    applyChoices: [2, 6, 8, 14],
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
    id: 'skipCount5',
    rewards: { crystal: 1, mithril: 1 },
    firstTimeBonus: { crystal: 1 },
    area: 'skipCounting',
    region: 'crystalCave',
    icon: 'pebble',
    // 5씩 뛰어 세기: 주사위 눈처럼 다섯 개씩 모여 있으면 5, 10, 15… 로 센다
    explore: { kind: 'groups', item: 'pebble', size: 5, groups: 4, ones: 0 }, // 20
    predict: { kind: 'groups', item: 'gem', size: 5, groups: 6, ones: 0 }, // 30 (6 은 묶음 수만 센 실수)
    predictChoices: [6, 25, 30, 35],
    apply: { kind: 'groups', item: 'candle', size: 5, groups: 5, ones: 2 }, // 27
    applyChoices: [7, 25, 27, 30],
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

  // ===== 햇살 들판 =====
  {
    id: 'numberLine1',
    rewards: { sunflowerSeed: 2 },
    firstTimeBonus: { honey: 1 },
    area: 'numberLine',
    region: 'sunnyMeadow',
    icon: 'frog',
    // 수직선 위에서 개구리가 한 칸씩 뛰기: 오른쪽은 더하기, 왼쪽은 빼기
    explore: { kind: 'hops', start: 7, hop: 5 }, // 12
    predict: { kind: 'hops', start: 13, hop: -4 }, // 9 (17 은 반대로 뛴 실수)
    predictChoices: [8, 9, 10, 17],
    apply: { kind: 'hops', start: 9, hop: 6 }, // 15
    applyChoices: [3, 14, 15, 16],
  },
  {
    id: 'evenOdd1',
    rewards: { sunflowerSeed: 1, honey: 1 },
    firstTimeBonus: { honey: 1 },
    area: 'evenOdd',
    region: 'sunnyMeadow',
    icon: 'bee',
    // 둘씩 짝지어 하나가 남으면 홀수, 딱 맞으면 짝수
    explore: { kind: 'pairs', item: 'bee', total: 8 },
    predict: { kind: 'pairs', item: 'snail', total: 9 },
    predictChoices: ['even', 'odd'],
    apply: { kind: 'pairs', item: 'sunflower', total: 14 },
    applyChoices: ['even', 'odd'],
  },

  {
    id: 'makeTen1',
    rewards: { honey: 1, sunflowerSeed: 1 },
    firstTimeBonus: { sunflowerSeed: 1 },
    area: 'makingTen',
    region: 'sunnyMeadow',
    icon: 'sunflower',
    // 10 만들기: 10칸 틀의 빈칸 수가 '몇 개 더'
    explore: { kind: 'makeTen', item: 'bee', have: 7 }, // 3
    predict: { kind: 'makeTen', item: 'snail', have: 4 }, // 6 (4 는 있는 수, 14 는 10 에 더한 실수)
    predictChoices: [4, 5, 6, 14],
    apply: { kind: 'makeTen', item: 'sunflower', have: 8 }, // 2
    applyChoices: [2, 3, 8, 18],
  },

  // ===== 바람 언덕 =====
  {
    id: 'clock1',
    rewards: { feather: 2 },
    firstTimeBonus: { cloudCotton: 1 },
    area: 'clock',
    region: 'windyHill',
    icon: 'windmill',
    // 정각: 긴바늘은 12, 짧은바늘이 가리키는 수가 '몇 시'
    explore: { kind: 'clock', hour: 3, half: false },
    predict: { kind: 'clock', hour: 7, half: false },
    predictChoices: ['6:00', '7:00', '8:00', '12:00'],
    apply: { kind: 'clock', hour: 10, half: false },
    applyChoices: ['9:00', '10:00', '10:30', '11:00'],
  },
  {
    id: 'clock2',
    rewards: { feather: 1, cloudCotton: 1 },
    firstTimeBonus: { cloudCotton: 1 },
    area: 'clock',
    region: 'windyHill',
    icon: 'kite',
    // 30분: 긴바늘이 6, 짧은바늘은 두 수 사이 (앞의 수가 '몇 시')
    explore: { kind: 'clock', hour: 4, half: true },
    predict: { kind: 'clock', hour: 8, half: true },
    predictChoices: ['6:00', '8:00', '8:30', '9:30'],
    apply: { kind: 'clock', hour: 2, half: true },
    applyChoices: ['1:30', '2:00', '2:30', '3:30'],
  },

  // ===== 무지개 호수 =====
  {
    id: 'share1',
    rewards: { lilyPad: 2 },
    firstTimeBonus: { pearl: 1 },
    area: 'sharing',
    region: 'rainbowLake',
    icon: 'shell',
    // 똑같이 나누기: 하나씩 번갈아 나눠 주면 두 친구가 똑같이 갖는다
    explore: { kind: 'share', item: 'shell', total: 6 }, // 3
    predict: { kind: 'share', item: 'fish', total: 10 }, // 5 (10 은 나누기 전 전체)
    predictChoices: [4, 5, 6, 10],
    apply: { kind: 'share', item: 'lily', total: 14 }, // 7
    applyChoices: [6, 7, 8, 14],
  },
  {
    id: 'double1',
    rewards: { lilyPad: 1, pearl: 1 },
    firstTimeBonus: { pearl: 1 },
    area: 'doubling',
    region: 'rainbowLake',
    icon: 'duck',
    // 두 배: 물가의 오리가 호수에 비치면 같은 수가 한 번 더 (n + n)
    explore: { kind: 'double', item: 'duck', n: 4 }, // 8
    predict: { kind: 'double', item: 'fish', n: 6 }, // 12 (6 은 한쪽만 센 실수)
    predictChoices: [6, 11, 12, 13],
    apply: { kind: 'double', item: 'shell', n: 8 }, // 16
    applyChoices: [8, 15, 16, 17],
  },
];

export const getLesson = (id: LessonId) => LESSONS.find((l) => l.id === id)!;

// 놀이 문장의 번역 키 (예: lessons.counting1.hint2). 언어 파일에 없으면 타입 오류가 난다.
export const lessonKey = (id: LessonId, part: LessonTextPart): TranslationKey => `lessons.${id}.${part}`;
