import type { TranslationKey } from '../i18n';
import type { ResourceBundle, RegionId } from './resources';

// 수학 놀이에 나오는 물건 종류 (그림은 src/data/math/items.ts)
export type MathItemId =
  | 'apple' | 'pear' | 'mushroom' | 'acorn' | 'leaf' | 'flower'
  | 'butterfly' | 'ladybug' | 'frog' | 'blueberry' | 'cookie'
  | 'moon' | 'star' | 'owl'
  | 'gem' | 'pebble' | 'bat' | 'candle';

// 도형 종류와 도형 하나의 모습 (크기·색·돌림이 달라도 같은 도형이다)
export type ShapeId = 'circle' | 'square' | 'triangle';
export interface ShapeSpec {
  shape: ShapeId;
  color: string; // #RRGGBB
  size: number; // 1 = 기본 크기 (0.6 ~ 1.2)
  rotate?: number; // 돌린 각도 (도)
}

// 학습 영역
export type MathArea = 'counting' | 'comparing' | 'addition' | 'subtraction' | 'patterns' | 'shapes' | 'skipCounting' | 'placeValue';

// 한 장면의 수량 정보 — 언어와 상관없이 같은 값을 쓴다.
export type MathScene =
  | { kind: 'count'; item: MathItemId; total: number } // total 개를 센다
  | { kind: 'compare'; itemA: MathItemId; itemB: MathItemId; a: number; b: number } // a 개와 b 개를 비교한다
  | { kind: 'add'; item: MathItemId; start: number; add: number } // start 개에 add 개를 더한다
  | { kind: 'subtract'; item: MathItemId; start: number; remove: number } // start 개에서 remove 개를 뺀다
  | { kind: 'pattern'; unit: MathItemId[]; shown: number } // unit 을 되풀이해 shown 개 보여주고, 다음 것을 맞힌다
  | { kind: 'shapes'; target: ShapeId; shapes: ShapeSpec[] } // 여러 도형 중 target 도형의 개수를 센다
  // size 개씩 묶인 묶음 groups 개와 낱개 ones 개를 묶음째로 센다 (2씩 뛰어 세기, 10씩 묶어 세기)
  | { kind: 'groups'; item: MathItemId; size: number; groups: number; ones: number };

// 답: 숫자, 비교 문제의 'A 쪽이 많다 / B 쪽이 많다 / 똑같다', 또는 규칙 문제의 물건
export type MathAnswer = number | 'a' | 'b' | 'same' | MathItemId;

// 비교 문제 선택지에 보일 그룹 이름 (번역 키)
export interface CompareLabels {
  a: TranslationKey;
  b: TranslationKey;
}

// 수학 놀이 하나 (6단계: 살펴보기 → 만져 보기 → 예상하기 → 확인하기 → 발견하기 → 해 보기)
export interface MathLesson {
  id: LessonId;
  area: MathArea;
  region: RegionId;
  icon: MathItemId; // 목록에 보일 그림
  explore: MathScene; // 살펴보기·만져 보기 장면
  predict: MathScene; // 예상하기·확인하기 장면
  predictChoices: MathAnswer[];
  apply: MathScene; // 해 보기 장면
  applyChoices: MathAnswer[];
  rewards: ResourceBundle; // 끝까지 하면 받는 재료 (정답 여부와 상관없음)
  firstTimeBonus: ResourceBundle; // 처음 끝냈을 때만 더 받는 재료
  predictLabels?: CompareLabels; // 비교 문제만
  applyLabels?: CompareLabels; // 비교 문제만
}

// 놀이 id 목록 (언어 파일의 lessons.<id> 와 같아야 한다)
export type LessonId = 'counting1' | 'comparing1' | 'addition1' | 'subtraction1' | 'patterns1' | 'shapes1' | 'skipCount1' | 'tens1';

// 놀이마다 언어 파일에 있어야 하는 문장들
export type LessonTextPart =
  | 'title' | 'observe' | 'manipulate' | 'manipulateDone' | 'predict' | 'verify'
  | 'discover' | 'apply' | 'hint1' | 'hint2' | 'hint3' | 'correct';
