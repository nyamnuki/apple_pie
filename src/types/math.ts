import type { TranslationKey } from '../i18n';

// 수학 놀이에 나오는 물건 종류 (그림은 src/data/math/items.ts)
export type MathItemId =
  | 'apple' | 'pear' | 'mushroom' | 'acorn' | 'leaf' | 'flower'
  | 'butterfly' | 'ladybug' | 'frog' | 'blueberry' | 'cookie';

// 학습 영역
export type MathArea = 'counting' | 'comparing' | 'addition' | 'subtraction';

// 한 장면의 수량 정보 — 언어와 상관없이 같은 값을 쓴다.
export type MathScene =
  | { kind: 'count'; item: MathItemId; total: number } // total 개를 센다
  | { kind: 'compare'; itemA: MathItemId; itemB: MathItemId; a: number; b: number } // a 개와 b 개를 비교한다
  | { kind: 'add'; item: MathItemId; start: number; add: number } // start 개에 add 개를 더한다
  | { kind: 'subtract'; item: MathItemId; start: number; remove: number }; // start 개에서 remove 개를 뺀다

// 답: 숫자, 또는 비교 문제의 'A 쪽이 많다 / B 쪽이 많다 / 똑같다'
export type MathAnswer = number | 'a' | 'b' | 'same';

// 비교 문제 선택지에 보일 그룹 이름 (번역 키)
export interface CompareLabels {
  a: TranslationKey;
  b: TranslationKey;
}

// 수학 놀이 하나 (6단계: 살펴보기 → 만져 보기 → 예상하기 → 확인하기 → 발견하기 → 해 보기)
export interface MathLesson {
  id: LessonId;
  area: MathArea;
  region: 'acornVillage';
  icon: MathItemId; // 목록에 보일 그림
  explore: MathScene; // 살펴보기·만져 보기 장면
  predict: MathScene; // 예상하기·확인하기 장면
  predictChoices: MathAnswer[];
  apply: MathScene; // 해 보기 장면
  applyChoices: MathAnswer[];
  predictLabels?: CompareLabels; // 비교 문제만
  applyLabels?: CompareLabels; // 비교 문제만
}

// 놀이 id 목록 (언어 파일의 lessons.<id> 와 같아야 한다)
export type LessonId = 'counting1' | 'comparing1' | 'addition1' | 'subtraction1';

// 놀이마다 언어 파일에 있어야 하는 문장들
export type LessonTextPart =
  | 'title' | 'observe' | 'manipulate' | 'manipulateDone' | 'predict' | 'verify'
  | 'discover' | 'apply' | 'hint1' | 'hint2' | 'hint3' | 'correct';
