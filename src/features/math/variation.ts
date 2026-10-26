import { answerOf } from './answers';
import type { LessonId, MathAnswer, MathLesson, MathScene, ShapeId, ShapeSpec } from '../../types/math';

// ===== 다시 할 때마다 바뀌는 문제 =====
// 처음 하는 판(play 0)은 lessons.ts 에 적힌 그대로 (선생님이 고른 첫 경험).
// 다시 하면 '예상하기'와 '해 보기' 장면의 수가 바뀌어 답을 외울 수 없게 한다.
// - 같은 판 번호면 언제나 같은 문제 (판 번호 + 놀이 id 로 정해지는 난수)
// - 난이도 범위와 가르치는 점은 그대로: 비교의 '똑같다'는 계속 똑같게, 더하기는 10 을 넘게, 빼기는 10 아래로 내려가게
// - 살펴보기·만져 보기(가르치는 장면)와 규칙 찾기는 바꾸지 않는다 (문장이 그 장면을 설명하기 때문)

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

const COLORS = ['#A8C3A0', '#F5D0AD', '#F3C6D2', '#C8DFE8', '#D9D0EC'];
const SHAPES: ShapeId[] = ['circle', 'square', 'triangle'];

// 장면 하나를 같은 종류·같은 난이도로 새로 만든다
export function varyScene(scene: MathScene, rng: Rng): MathScene {
  switch (scene.kind) {
    case 'count':
      return { ...scene, total: int(rng, 11, 19) };
    case 'compare': {
      if (scene.a === scene.b) {
        const n = int(rng, 6, 14);
        return { ...scene, a: n, b: n };
      }
      // 많은 쪽은 그대로, 차이는 1~3 (가까울수록 세어 봐야 안다)
      const small = int(rng, 6, 12);
      const big = small + int(rng, 1, 3);
      return scene.a > scene.b ? { ...scene, a: big, b: small } : { ...scene, a: small, b: big };
    }
    case 'add': {
      // 10 을 넘는 덧셈 (20 까지)
      const start = int(rng, 6, 10);
      const add = int(rng, 11 - start, Math.min(9, 20 - start));
      return { ...scene, start, add };
    }
    case 'subtract': {
      // 10 보다 큰 수에서 빼서 10 아래로
      const start = int(rng, 11, 18);
      const remove = int(rng, start - 9, Math.min(9, start - 2));
      return { ...scene, start, remove };
    }
    case 'groups':
      if (scene.size === 10) {
        // 10 묶음 3~4 개 (문장이 '10, 20, 30…' 하고 세기 때문에 3 개 이상), 낱개 1~9 개 (묶음 수와 다르게: 자리 바꾸기 실수를 구별할 수 있게)
        const groups = int(rng, 3, 4);
        let ones = int(rng, 1, 9);
        if (ones === groups) ones = ones === 9 ? 8 : ones + 1;
        return { ...scene, groups, ones };
      }
      // 5묶음 3~7 개 (15~35), 따로 있는 것은 원래대로 (문장이 그것을 말한다)
      if (scene.size === 5) return { ...scene, groups: int(rng, 3, 7) };
      // 짝 5~10 쌍 (20 을 넘지 않게), 혼자 있는 것은 원래대로 (문장이 그것을 말한다)
      return { ...scene, groups: int(rng, 5, Math.floor((20 - scene.ones) / 2)) };
    case 'shapes': {
      // 찾는 도형 4~7 개 + 다른 도형 5~8 개, 색·크기·돌림·순서를 새로
      const others = SHAPES.filter((s) => s !== scene.target);
      const spec = (shape: ShapeId): ShapeSpec => ({
        shape,
        color: COLORS[int(rng, 0, COLORS.length - 1)],
        size: Math.round((0.6 + rng() * 0.5) * 100) / 100,
        rotate: shape === 'circle' ? undefined : [0, 0, 15, 30, 45, 90, 180][int(rng, 0, 6)] || undefined,
      });
      const list = [...Array.from({ length: int(rng, 4, 7) }, () => spec(scene.target)), ...Array.from({ length: int(rng, 5, 8) }, () => spec(others[int(rng, 0, 1)]))];
      return { ...scene, shapes: shuffle(rng, list) };
    }
    case 'measure':
      // 블록 4~9 개 (좁은 휴대폰에서도 한 줄에 보이게)
      return { ...scene, length: int(rng, 4, 9) };
    case 'hops': {
      // 앞으로 뛰기는 3~7 칸, 끝이 20 을 넘지 않게. 뒤로 뛰기는 3~7 칸, 0 아래로 가지 않게
      const n = int(rng, 3, 7);
      return scene.hop > 0 ? { ...scene, start: int(rng, 2, 20 - n), hop: n } : { ...scene, start: int(rng, n + 1, 18), hop: -n };
    }
    case 'pairs':
      return { ...scene, total: int(rng, 6, 15) };
    case 'clock':
      return { ...scene, hour: int(rng, 1, 12) };
    case 'share':
      return { ...scene, total: int(rng, 3, 8) * 2 };
    case 'double':
      return { ...scene, n: int(rng, 2, 9) };
    case 'makeTen':
      return { ...scene, have: int(rng, 2, 8) };
    case 'difference': {
      const b = int(rng, 3, 8);
      return { ...scene, b, a: b + int(rng, 1, 5) };
    }
    case 'pattern':
      return scene;
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

function choicesFor(scene: MathScene, original: MathAnswer[], rng: Rng): MathAnswer[] {
  if (scene.kind === 'compare' || scene.kind === 'pattern' || scene.kind === 'pairs') return original; // 'a/b/같다', '짝수/홀수', 그림 선택지는 그대로
  if (scene.kind === 'clock') return clockChoices(scene, rng);
  return numberChoices(scene, rng);
}

function makeVariant(lesson: MathLesson, rng: Rng): MathLesson {
  const predict = varyScene(lesson.predict, rng);
  const apply = varyScene(lesson.apply, rng);
  return {
    ...lesson,
    predict,
    predictChoices: choicesFor(predict, lesson.predictChoices, rng),
    apply,
    applyChoices: choicesFor(apply, lesson.applyChoices, rng),
  };
}

// '같은 문제'인지 비교하는 값: 보통은 정답, 비교 문제는 정답('많은 쪽')이 일부러 같으므로 두 수
// (짝수·홀수는 답이 둘뿐이라 개수로 비교)
export const sameKey = (scene: MathScene) => (scene.kind === 'compare' ? `${scene.a}:${scene.b}` : scene.kind === 'pairs' ? `${scene.total}` : String(answerOf(scene)));


// 판마다 만든 문제를 기억해 둔다 (놀이 id → [0판, 1판, …])
const cache = new Map<LessonId, MathLesson[]>();

// play 번째 판의 놀이 (0 = 원래 그대로). 바로 앞 판과 '해 보기' 정답이 같으면 다시 만든다 (또 같은 문제라고 느끼지 않게).
export function lessonForPlay(lesson: MathLesson, play: number): MathLesson {
  if (play <= 0) return lesson;
  let list = cache.get(lesson.id);
  if (!list || list[0] !== lesson) cache.set(lesson.id, (list = [lesson]));
  for (let p = list.length; p <= play; p++) {
    const rng = makeRng(hash(lesson.id) + p * 7919);
    const prev = sameKey(list[p - 1].apply);
    let next = makeVariant(lesson, rng);
    // 규칙 찾기는 바뀌지 않으므로 다시 만들 필요가 없다
    for (let tries = 0; tries < 8 && lesson.apply.kind !== 'pattern' && sameKey(next.apply) === prev; tries++) next = makeVariant(lesson, rng);
    list.push(next);
  }
  return list[play];
}

// 판 번호와 상관없는 한 번짜리 문제 (오늘의 문제: 날짜로 seed 를 정한다)
export function lessonForSeed(lesson: MathLesson, seed: number): MathLesson {
  return makeVariant(lesson, makeRng(hash(lesson.id) + seed * 104729));
}
