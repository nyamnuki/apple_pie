import { answerOf } from './answers';
import type { Level } from '../../data/math/sceneRules';
import { MATH_ITEMS } from '../../data/math/items';
import type { MathAnswer, MathItemId, MathLesson, MathScene, MeasureThing, ShapeId, ShapeSpec } from '../../types/math';

// ===== 다시 할 때마다 바뀌는 문제 =====
// 보통 단계에서 처음 하는 판(play 0)은 lessons.ts 에 적힌 그대로 (선생님이 고른 첫 경험).
// 다시 하면 '예상하기'와 '해 보기' 장면이 바뀌어 답을 외울 수 없게 한다.
// - 수만이 아니라 물건(lesson.pools 에서, 문장에 어울리는 것만), 비교의 많은 쪽, 찾는 도형, 재는 물건,
//   줄 선 동물의 순서, 규칙의 물건도 바뀐다
// - 정확히 같은 문제(장면 전체가 같은 것)는 그 놀이에서 나올 수 있는 문제를 한 번씩 다 낼 때까지 다시 나오지 않는다
// - 같은 판 번호면 언제나 같은 문제 (판 번호 + 놀이 id + 단계로 정해지는 난수)
// - 가르치는 점은 그대로: 비교의 '똑같다'는 계속 똑같게, 더하기는 십의 자리를 넘게, 빼기는 십의 자리 아래로 내려가게
// - 살펴보기·만져 보기(가르치는 장면)와 규칙 찾기는 바꾸지 않는다 (문장이 그 장면을 설명하기 때문)
//
// 어려움 단계('hard')는 같은 놀이를 50 까지의 수로 낸다. 첫 판부터 바꾼다 (어려운 문제를 고른 것이므로).
// 도형 찾기·시계·몇 번째·10 만들기·규칙 찾기는 수 크기가 어려움의 핵심이 아니라서 두 단계가 같다.

type Rng = () => number;

// 작고 빠른 난수 (mulberry32)
function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (text: string) => [...text].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);
const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
function shuffle<T>(rng: Rng, list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = <T,>(rng: Rng, list: readonly T[]): T => list[int(rng, 0, list.length - 1)];

// 묶음에서 서로 다른 물건 n 개 (그림이 같은 것은 함께 고르지 않는다). avoid 는 되도록 피한다 (같은 판의 다른 장면 물건)
function pickItems(rng: Rng, pool: MathItemId[], n: number, avoid: MathItemId[] = []): MathItemId[] {
  const fresh = pool.filter((id) => !avoid.includes(id));
  const order = [...shuffle(rng, fresh), ...shuffle(rng, pool.filter((id) => avoid.includes(id)))];
  const out: MathItemId[] = [];
  for (const id of order) if (out.length < n && !out.some((o) => MATH_ITEMS[o].emoji === MATH_ITEMS[id].emoji)) out.push(id);
  return out;
}

// 장면에 나오는 물건들 (같은 판의 두 장면이 같은 물건을 쓰지 않게 할 때)
export function itemsOf(scene: MathScene): MathItemId[] {
  switch (scene.kind) {
    case 'compare':
    case 'difference':
      return [scene.itemA, scene.itemB];
    case 'pattern':
      return scene.unit;
    case 'ordinal':
      return scene.items;
    case 'shapes':
    case 'measure':
    case 'hops':
    case 'clock':
      return [];
    default:
      return [scene.item];
  }
}

// 물건 바꾸기: 묶음이 있으면 문장에 맞는 물건으로 (규칙은 같은 자리에 같은 물건이 오도록 짜임새를 지킨다)
function swapItems(scene: MathScene, rng: Rng, pool: MathItemId[], avoid: MathItemId[]): MathScene {
  switch (scene.kind) {
    case 'compare':
    case 'difference': {
      const [itemA, itemB] = pickItems(rng, pool, 2, avoid);
      return { ...scene, itemA, itemB };
    }
    case 'pattern': {
      const kinds = [...new Set(scene.unit)];
      const picked = pickItems(rng, pool, kinds.length, avoid);
      const swap = new Map(kinds.map((id, i) => [id, picked[i]] as const));
      return { ...scene, unit: scene.unit.map((id) => swap.get(id)!) };
    }
    case 'ordinal':
      return { ...scene, items: pickItems(rng, pool, scene.items.length) };
    case 'shapes':
    case 'measure':
    case 'hops':
    case 'clock':
      return scene;
    default:
      return { ...scene, item: pickItems(rng, pool, 1, avoid)[0] };
  }
}

const COLORS = ['#A8C3A0', '#F5D0AD', '#F3C6D2', '#C8DFE8', '#D9D0EC'];
const SHAPES: ShapeId[] = ['circle', 'square', 'triangle'];
const THINGS: MeasureThing[] = ['twig', 'ribbon', 'caterpillar'];

// ===== 도전 단계 (아이 실력에 맞춰 저절로) =====
// 놀이마다 '해 보기'를 한 번에 맞히면 다음 판이 한 단계 어려워지고, 두 번 넘게 틀리면 한 단계 쉬워진다 (0~3, src/app/gameState.ts).
export const MAX_BOOST = 3;

// 장면에 늘어놓는 것의 수 (클수록 큰 수, 화면도 많이 차지한다)
export function sceneSize(s: MathScene): number {
  switch (s.kind) {
    case 'count':
      return s.total;
    case 'compare':
    case 'difference':
      return s.a + s.b;
    case 'add':
      return s.start + s.add;
    case 'subtract':
      return s.start;
    case 'groups':
      return s.groups * s.size + s.ones;
    case 'pairs':
    case 'share':
      return s.total;
    case 'double':
      return s.n * 2;
    case 'shapes':
      return s.shapes.length;
    case 'hops':
      return Math.max(s.start, s.start + s.hop);
    case 'measure':
      return s.length;
    default:
      return 0;
  }
}

// 어려움 + 도전 단계 1~3: 100 가까이까지. 화면에 늘어놓을 수 있는 만큼만 키운다
// (더하기·빼기의 큰 묶음은 10 상자로 묶어 그린다: fields/TenBox.tsx). null 이면 어려움 기본 범위
function boostedHard(scene: MathScene, rng: Rng, boost: number): MathScene | null {
  const t = boost - 1;
  const pickRange = (ranges: [number, number][]) => int(rng, ranges[t][0], ranges[t][1]);
  switch (scene.kind) {
    case 'count':
      return { ...scene, total: pickRange([[30, 40], [36, 46], [40, 50]]) };
    case 'compare': {
      if (scene.a === scene.b) {
        const n = pickRange([[20, 30], [25, 35], [30, 40]]);
        return { ...scene, a: n, b: n };
      }
      const small = pickRange([[20, 28], [25, 33], [30, 38]]);
      const big = small + int(rng, 1, 2);
      return rng() < 0.5 ? { ...scene, a: big, b: small } : { ...scene, a: small, b: big };
    }
    case 'add': {
      // 다음 십의 자리를 넘는 덧셈, 모두 70 / 85 / 99 까지
      const total = [70, 85, 99][t];
      const [lo, hi] = [[20, 55], [30, 68], [40, 80]][t];
      const start = int(rng, lo, Math.min(hi, total - 11));
      const add = int(rng, Math.max(4, 11 - (start % 10)), Math.min(19, total - start));
      return { ...scene, start, add };
    }
    case 'subtract': {
      // 아래 십의 자리로 내려가는 뺄셈, 60 / 75 / 90 에서
      const start = pickRange([[30, 60], [40, 75], [50, 90]]);
      const remove = int(rng, Math.max(4, (start % 10) + 1), Math.min(19, start - 2));
      return { ...scene, start, remove };
    }
    case 'groups': {
      if (scene.size === 10) {
        const groups = pickRange([[6, 9], [7, 9], [8, 9]]);
        let ones = int(rng, 1, 9);
        if (ones === groups) ones = ones === 9 ? 8 : ones + 1;
        return { ...scene, groups, ones };
      }
      if (scene.size === 5) return { ...scene, groups: pickRange([[12, 17], [14, 18], [16, 19]]) };
      return { ...scene, groups: pickRange([[18, 30], [22, 36], [26, 44]]) };
    }
    case 'hops': {
      const top = [70, 100, 100][t];
      const n = int(rng, [6, 7, 8][t], 9);
      return scene.hop > 0 ? { ...scene, start: int(rng, 20, top - n), hop: n } : { ...scene, start: int(rng, 20 + n, top - 2), hop: -n };
    }
    case 'pairs':
      return { ...scene, total: pickRange([[24, 32], [28, 40], [32, 48]]) };
    case 'share':
      return { ...scene, total: pickRange([[14, 20], [16, 24], [20, 25]]) * 2 };
    case 'double':
      return { ...scene, n: pickRange([[13, 18], [16, 22], [20, 25]]) };
    case 'difference': {
      const b = pickRange([[12, 18], [15, 22], [18, 25]]);
      return { ...scene, b, a: b + int(rng, 3, 8) };
    }
    case 'shapes': {
      // 찾을 도형과 다른 도형이 더 많이
      const base = varyScene(scene, rng, 'hard');
      if (base.kind !== 'shapes') return null;
      const extra = varyScene(scene, rng, 'hard') as typeof base;
      return { ...base, shapes: shuffle(rng, [...base.shapes, ...extra.shapes.slice(0, 2 + t * 2)]) };
    }
    default:
      return null; // 시계·몇 번째·10 만들기·규칙·길이: 수 크기가 어려움의 핵심이 아니다
  }
}

// 장면 하나를 같은 종류·같은 가르치는 점으로 새로 만든다 (단계에 따라 수의 크기만 달라진다)
export function varyScene(scene: MathScene, rng: Rng, level: Level = 'normal', boost = 0): MathScene {
  const hard = level === 'hard';
  if (boost > 0) {
    // 도전 단계(boost): 어려움은 더 큰 수로 (100 가까이), 보통은 보통 범위의 큰 쪽으로
    if (hard) {
      const big = boostedHard(scene, rng, Math.min(boost, MAX_BOOST));
      if (big) return big;
    } else {
      // 보통: 후보를 (도전 단계 + 1)개 만들어 가장 큰 것을 고른다 (보통의 범위 안에서 위쪽으로 치우친다)
      let best = varyScene(scene, rng, level);
      for (let i = 0; i < Math.min(boost, MAX_BOOST); i++) {
        const next = varyScene(scene, rng, level);
        if (sceneSize(next) > sceneSize(best)) best = next;
      }
      return best;
    }
  }
  switch (scene.kind) {
    case 'count':
      // 보통 14~20, 어려움 24~32 (하나씩 세는 놀이라 더 많으면 세다가 지친다. 큰 수는 묶어 세기에서)
      return { ...scene, total: hard ? int(rng, 24, 32) : int(rng, 14, 20) };
    case 'compare': {
      if (scene.a === scene.b) {
        const n = hard ? int(rng, 16, 25) : int(rng, 9, 16);
        return { ...scene, a: n, b: n };
      }
      // 똑같지 않은 문제: 어느 쪽이 많은지도 판마다 바뀐다. 차이는 1~2 (가까울수록 짝을 지어 봐야 안다)
      // 어려움: 두 묶음을 한 화면에 모두 늘어놓으므로 25 까지
      const small = hard ? int(rng, 16, 23) : int(rng, 9, 17);
      const big = small + int(rng, 1, 2);
      return rng() < 0.5 ? { ...scene, a: big, b: small } : { ...scene, a: small, b: big };
    }
    case 'add': {
      // 십의 자리를 넘는 덧셈 (보통 20 까지 / 어려움 50 까지)
      if (hard) {
        const start = int(rng, 15, 38);
        const add = int(rng, Math.max(4, 11 - (start % 10)), Math.min(19, 50 - start)); // 다음 십의 자리를 넘도록
        return { ...scene, start, add };
      }
      // 모두 13 이상 (10 을 넉넉히 넘게 이어 센다), 더하는 수는 3 이상
      const start = int(rng, 6, 10);
      const add = int(rng, Math.max(3, 13 - start), Math.min(9, 20 - start));
      return { ...scene, start, add };
    }
    case 'subtract': {
      // 십의 자리 아래로 내려가는 뺄셈
      if (hard) {
        const start = int(rng, 25, 49);
        const remove = int(rng, Math.max(2, (start % 10) + 1), Math.min(19, start - 2)); // 아래 십의 자리로 내려가도록 (문장이 '{remove} fly away' 라 2 이상)
        return { ...scene, start, remove };
      }
      // 13~19 에서 빼서 10 아래로 (빼는 수는 4 이상)
      const start = int(rng, 13, 19);
      const remove = int(rng, Math.max(4, start - 9), Math.min(9, start - 2));
      return { ...scene, start, remove };
    }
    case 'groups':
      if (scene.size === 10) {
        // 10 묶음 (문장이 '10, 20, 30…' 하고 세기 때문에 3 개 이상), 낱개 1~9 개
        // 낱개를 묶음 수와 다르게 둔다: 자리를 바꿔 읽은 실수를 구별할 수 있게
        const groups = hard ? int(rng, 5, 9) : int(rng, 3, 4);
        let ones = int(rng, 1, 9);
        if (ones === groups) ones = ones === 9 ? 8 : ones + 1;
        return { ...scene, groups, ones };
      }
      // 5 묶음 (보통 20~40 / 어려움 50~80), 따로 있는 것은 원래대로 (문장이 그것을 말한다)
      if (scene.size === 5) return { ...scene, groups: hard ? int(rng, 10, 16) : int(rng, 4, 8) };
      // 짝 (보통 20 / 어려움 50 을 넘지 않게), 혼자 있는 것은 원래대로 (문장이 그것을 말한다)
      return { ...scene, groups: int(rng, hard ? 14 : 6, Math.floor(((hard ? 50 : 20) - scene.ones) / 2)) };
    case 'shapes': {
      // 찾는 도형 5~8 개 + 다른 도형 6~9 개, 색·크기·돌림·순서를 새로
      // 찾는 도형도 세모·네모 중에서 바뀐다 (동그라미는 살펴보기에서 이미 찾았다)
      const target: ShapeId = scene.target === 'circle' ? 'circle' : pick(rng, ['square', 'triangle'] as const);
      const others = SHAPES.filter((s) => s !== target);
      const spec = (shape: ShapeId): ShapeSpec => ({
        shape,
        color: COLORS[int(rng, 0, COLORS.length - 1)],
        size: Math.round((0.6 + rng() * 0.5) * 100) / 100,
        rotate: shape === 'circle' ? undefined : [0, 0, 15, 30, 45, 90, 180][int(rng, 0, 6)] || undefined,
      });
      const list = [...Array.from({ length: int(rng, 5, 8) }, () => spec(target)), ...Array.from({ length: int(rng, 6, 9) }, () => spec(others[int(rng, 0, 1)]))];
      return { ...scene, target, shapes: shuffle(rng, list) };
    }
    case 'measure':
      // 블록 (좁은 휴대폰에서도 한 줄에 보이게 10 개까지)
      // 재는 물건도 바뀐다 (나뭇가지·리본·애벌레)
      return { ...scene, thing: pick(rng, THINGS), length: hard ? int(rng, 6, 10) : int(rng, 5, 10) };
    case 'hops': {
      // 앞으로 뛰기: 끝이 범위를 넘지 않게. 뒤로 뛰기: 0 아래로 가지 않게 (한 번에 9 칸까지)
      const top = hard ? 50 : 20;
      const n = int(rng, hard ? 5 : 4, 9);
      return scene.hop > 0 ? { ...scene, start: int(rng, 2, top - n), hop: n } : { ...scene, start: int(rng, n + 1, top - 2), hop: -n };
    }
    case 'pairs':
      return { ...scene, total: hard ? int(rng, 19, 28) : int(rng, 9, 16) };
    case 'clock':
      return { ...scene, hour: int(rng, 1, 12) };
    case 'share':
      return { ...scene, total: (hard ? int(rng, 10, 16) : int(rng, 4, 8)) * 2 };
    case 'double':
      // 어려움: 물가와 물속에 모두 그리므로 15 까지 (모두 30)
      return { ...scene, n: hard ? int(rng, 11, 15) : int(rng, 4, 10) };
    case 'makeTen':
      return { ...scene, have: int(rng, 2, 8) };
    case 'ordinal':
      return { ...scene, position: int(rng, 2, scene.items.length) };
    case 'difference': {
      // 어려움: 위아래 짝을 한 칸씩 늘어놓으므로 많은 쪽이 20 을 넘지 않게
      // 차이는 2 이상 (문장이 '{diff} mushrooms have no partner' 처럼 여럿을 말한다)
      const b = hard ? int(rng, 10, 13) : int(rng, 5, 9);
      return { ...scene, b, a: b + (hard ? int(rng, 3, 7) : int(rng, 2, 5)) };
    }
    case 'pattern':
      // 되풀이 묶음은 그대로 두고 멈추는 자리만 바꾼다 (묶음이 두 번 넘게 보이게) → 다음에 올 것이 판마다 달라진다
      return { ...scene, shown: int(rng, scene.unit.length * 2, scene.unit.length * 3 - 1) };
  }
}

// 숫자 답의 선택지 4 개: 정답 + 아이가 실제로 하기 쉬운 실수
export function numberChoices(scene: MathScene, rng: Rng): number[] {
  const answer = answerOf(scene) as number;
  const near = [answer - 1, answer + 1, answer - 2, answer + 2];
  let likely: number[] = [];
  if (scene.kind === 'groups' && scene.size === 10) likely = [scene.ones * 10 + scene.groups, answer - 10, scene.groups * 10]; // 자리 바꾸기, 묶음 하나 덜 세기, 낱개 빼먹기
  else if (scene.kind === 'groups' && scene.size === 5) likely = [scene.groups + scene.ones, answer - 5, scene.groups * 5]; // 묶음을 1 로 세기, 묶음 하나 덜 세기, 따로 있는 것 빼먹기
  else if (scene.kind === 'groups') likely = [scene.groups * 2, scene.groups]; // 혼자인 것 빼먹기, 짝을 1 로 세기
  else if (scene.kind === 'add') likely = [answer - 10 > 0 ? answer - 10 : answer + 3];
  else if (scene.kind === 'shapes') likely = [scene.shapes.length];
  else if (scene.kind === 'hops') likely = [scene.start - scene.hop]; // 반대쪽으로 뛰기
  else if (scene.kind === 'share') likely = [scene.total]; // 나누기 전 전체 수
  else if (scene.kind === 'double') likely = [scene.n, scene.n + 1]; // 한쪽만 세기, 하나만 더하기
  else if (scene.kind === 'makeTen') likely = [scene.have, 10 + scene.have]; // 있는 수를 답하기, 10 에 더하기
  else if (scene.kind === 'difference') likely = [scene.b, scene.a, scene.a + scene.b]; // 적은 쪽·많은 쪽 수, 둘을 더하기
  const pool = [...new Set([...shuffle(rng, likely), ...shuffle(rng, near)])].filter((n) => n > 0 && n !== answer);
  return [answer, ...pool.slice(0, 3)].sort((x, y) => x - y);
}

// 시계 선택지: 정답 + 한 시간 차이 + (30분이면 정각, 정각이면 30분) + 짧은바늘·긴바늘을 바꿔 읽은 실수
export function clockChoices(scene: Extract<MathScene, { kind: 'clock' }>, rng: Rng): MathAnswer[] {
  const t = (h: number, half: boolean) => `${((h + 11) % 12) + 1}:${half ? '30' : '00'}` as MathAnswer;
  const right = t(scene.hour, scene.half);
  const pool = [t(scene.hour + 1, scene.half), t(scene.hour - 1, scene.half), t(scene.hour, !scene.half), scene.half ? t(6, false) : t(12, false)];
  const wrong = [...new Set(shuffle(rng, pool))].filter((x) => x !== right).slice(0, 3);
  return [right, ...wrong].sort((a, b) => parseFloat(String(a).replace(':', '.')) - parseFloat(String(b).replace(':', '.')));
}

// 몇 번째 선택지: 정답 + 바로 앞·뒤 (하나 덜·더 센 실수) + 뒤에서 센 것. 줄에 선 순서대로
export function ordinalChoices(scene: Extract<MathScene, { kind: 'ordinal' }>): MathAnswer[] {
  const p = scene.position - 1;
  const n = scene.items.length;
  const picks = new Set([p, p - 1, p + 1, n - 1 - p].filter((i) => i >= 0 && i < n));
  for (let i = 0; picks.size < Math.min(4, n); i++) picks.add(i);
  return [...picks].sort((a, b) => a - b).map((i) => scene.items[i]);
}

// 규칙 문제 선택지: 원래 선택지를 바뀐 물건으로 옮긴다 (묶음에 없던 '함정' 물건은 묶음 밖의 다른 물건으로)
function patternChoices(orig: Extract<MathScene, { kind: 'pattern' }>, scene: Extract<MathScene, { kind: 'pattern' }>, original: MathAnswer[], pool: MathItemId[], rng: Rng): MathAnswer[] {
  const swap = new Map(orig.unit.map((id, i) => [id, scene.unit[i]] as const));
  const spare = pickItems(rng, pool.filter((id) => !scene.unit.includes(id)), original.length);
  return original.map((c) => swap.get(c as MathItemId) ?? spare.shift() ?? c);
}

function choicesFor(orig: MathScene, scene: MathScene, original: MathAnswer[], rng: Rng, pool?: MathItemId[]): MathAnswer[] {
  if (scene.kind === 'pattern' && orig.kind === 'pattern') return pool ? patternChoices(orig, scene, original, pool, rng) : original;
  if (scene.kind === 'compare' || scene.kind === 'pairs') return original; // 'a/b/같다', '짝수/홀수'는 그대로
  if (scene.kind === 'clock') return clockChoices(scene, rng);
  if (scene.kind === 'ordinal') return ordinalChoices(scene);
  return numberChoices(scene, rng);
}

// 장면 하나 바꾸기: 수 → 물건 (묶음이 있을 때)
function varyWithItems(scene: MathScene, rng: Rng, level: Level, boost: number, pool: MathItemId[] | undefined, avoid: MathItemId[]): MathScene {
  const next = varyScene(scene, rng, level, boost);
  return pool ? swapItems(next, rng, pool, avoid) : next;
}

// 예상하기는 살펴보기와, 해 보기는 살펴보기·예상하기와 되도록 다른 물건으로 (relaxed 면 피하지 않는다)
const predictScene = (lesson: MathLesson, rng: Rng, level: Level, boost: number, relaxed = false) =>
  varyWithItems(lesson.predict, rng, level, boost, lesson.pools?.predict, relaxed ? [] : itemsOf(lesson.explore));
const applyScene = (lesson: MathLesson, predict: MathScene, rng: Rng, level: Level, boost: number, relaxed = false) =>
  varyWithItems(lesson.apply, rng, level, boost, lesson.pools?.apply, relaxed ? [] : [...itemsOf(lesson.explore), ...itemsOf(predict)]);

// 바뀐 두 장면으로 놀이를 만든다 (선택지도 그 장면에 맞게)
function withScenes(lesson: MathLesson, predict: MathScene, apply: MathScene, rng: Rng): MathLesson {
  return {
    ...lesson,
    predict,
    predictChoices: choicesFor(lesson.predict, predict, lesson.predictChoices, rng, lesson.pools?.predict),
    apply,
    applyChoices: choicesFor(lesson.apply, apply, lesson.applyChoices, rng, lesson.pools?.apply),
  };
}

function makeVariant(lesson: MathLesson, rng: Rng, level: Level = 'normal', boost = 0): MathLesson {
  const predict = predictScene(lesson, rng, level, boost);
  return withScenes(lesson, predict, applyScene(lesson, predict, rng, level, boost), rng);
}

// 정확히 같은 문제인지 보는 값 (장면 전체: 수·물건·도형·순서)
export const sceneKey = (scene: MathScene) => JSON.stringify(scene);

// '같은 문제'인지 비교하는 값: 보통은 정답, 비교 문제는 정답('많은 쪽')이 일부러 같으므로 두 수
// (짝수·홀수는 답이 둘뿐이라 개수로 비교)
export const sameKey = (scene: MathScene) => (scene.kind === 'compare' ? `${scene.a}:${scene.b}` : scene.kind === 'pairs' ? `${scene.total}` : scene.kind === 'ordinal' ? `${scene.position}` : String(answerOf(scene)));


// 판마다 만든 문제를 기억해 둔다 ('단계:놀이 id' → [0판, 1판, …] 과 이번 바퀴에 이미 낸 장면들)
interface History {
  base: MathLesson;
  plays: MathLesson[];
  seen: { predict: Set<string>; apply: Set<string> };
}
const cache = new Map<string, History>();
const levelSeed = (level: Level) => (level === 'hard' ? 611_953 : 0);
const TRIES = 400; // 새 장면을 찾아보는 횟수. 이만큼 해도 못 찾으면 낼 수 있는 장면을 다 낸 것

// 아직 안 낸 장면을 찾는다. 다 냈으면 그 장면은 새 바퀴를 시작한다 (다시 한 번씩)
// make(true): 같은 판의 다른 장면 물건을 피하지 않고 만든다 (피하는 물건까지 써야 새 장면이 남아 있을 때)
function findFresh(make: (relaxed: boolean) => MathScene, seen: Set<string>, ok: (scene: MathScene) => boolean = () => true): MathScene {
  const fresh = (scene: MathScene) => !seen.has(sceneKey(scene)) && ok(scene);
  let scene = make(false);
  for (let tries = 0; tries < TRIES && !fresh(scene); tries++) scene = make(false);
  for (let tries = 0; tries < TRIES && !fresh(scene); tries++) scene = make(true);
  if (!fresh(scene)) {
    seen.clear();
    for (let tries = 0; tries < TRIES && !fresh(scene); tries++) scene = make(false);
  }
  seen.add(sceneKey(scene));
  return scene;
}

// play 번째 판의 놀이.
// - 예상하기·해 보기 장면은 앞서 낸 어떤 판과도 똑같지 않게 고른다
//   (그 장면으로 낼 수 있는 문제를 다 냈으면 그때부터 새 바퀴: 다시 처음부터 한 번씩)
// - 바로 앞 판과는 '해 보기' 정답도 다르게 (또 같은 문제라고 느끼지 않게)
// 보통 단계의 0 판은 lessons.ts 에 적힌 그대로, 어려움 단계는 0 판부터 바꾼다.
export function lessonForPlay(lesson: MathLesson, play: number, level: Level = 'normal', boost = 0): MathLesson {
  const want = Math.max(play, 0);
  if (level === 'normal' && want === 0) return lesson;
  boost = Math.max(0, Math.min(MAX_BOOST, Math.floor(boost)));
  const key = `${level}:${boost}:${lesson.id}`;
  let entry = cache.get(key);
  if (!entry || entry.base !== lesson) cache.set(key, (entry = { base: lesson, plays: [], seen: { predict: new Set(), apply: new Set() } }));
  const { plays, seen } = entry;
  for (let p = plays.length; p <= want; p++) {
    // 보통 단계의 0 판은 원래 문제 그대로 (선생님이 고른 첫 경험)
    if (p === 0 && level === 'normal') {
      plays.push(lesson);
      seen.predict.add(sceneKey(lesson.predict));
      seen.apply.add(sceneKey(lesson.apply));
      continue;
    }
    const rng = makeRng(hash(lesson.id) + p * 7919 + levelSeed(level) + boost * 104_729);
    const prev = sameKey((plays[p - 1] ?? lesson).apply);
    const predict = findFresh((relaxed) => predictScene(lesson, rng, level, boost, relaxed), seen.predict);
    const apply = findFresh((relaxed) => applyScene(lesson, predict, rng, level, boost, relaxed), seen.apply, (scene) => sameKey(scene) !== prev);
    plays.push(withScenes(lesson, predict, apply, rng));
  }
  return plays[want];
}

// 판 번호와 상관없는 한 번짜리 문제 (오늘의 문제: 날짜로 seed 를 정한다)
export function lessonForSeed(lesson: MathLesson, seed: number, level: Level = 'normal', boost = 0): MathLesson {
  return makeVariant(lesson, makeRng(hash(lesson.id) + seed * 104729 + levelSeed(level)), level, Math.max(0, Math.min(MAX_BOOST, boost)));
}
