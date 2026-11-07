import type { MathScene } from '../../types/math';

// ===== 어려움 단계 =====
// '보통'은 20 까지의 수 (5~7세 기준), '어려움'은 50 까지의 수를 쓴다.
// 가르치는 내용과 화면 모양은 같고, 수만 커진다. 타이틀 화면에서 고른다.
export type Level = 'normal' | 'hard';
export const LEVELS = ['normal', 'hard'] as const;

// 단계마다 쓰는 가장 큰 수
export const MAX: Record<Level, number> = { normal: 20, hard: 50 };
// 묶어 세기는 더 큰 수까지 (10 묶음을 여러 개 세기 때문에)
export const GROUP_MAX: Record<Level, number> = { normal: 50, hard: 100 };
// 짝 짓기·똑같이 나누기는 물건을 화면에 다 늘어놓아야 해서 따로 둔다 (좁은 휴대폰에서도 보이게)
export const SPREAD_MAX: Record<Level, number> = { normal: 16, hard: 32 };

// 장면의 수가 그 단계의 범위 안인지 (테스트에서 레슨 데이터와 '다시 할 때 바뀐 문제'를 같이 검사한다)
export function sizeOk(scene: MathScene, level: Level = 'normal'): boolean {
  const max = MAX[level];
  switch (scene.kind) {
    case 'count':
      return scene.total >= 1 && scene.total <= max;
    case 'compare':
      return scene.a >= 1 && scene.b >= 1 && scene.a <= max && scene.b <= max;
    case 'add':
      return scene.start >= 1 && scene.add >= 1 && scene.start + scene.add <= max;
    case 'subtract':
      return scene.remove >= 1 && scene.remove < scene.start && scene.start <= max;
    case 'pattern':
      return scene.unit.length >= 2 && scene.shown >= scene.unit.length * 2; // 묶음이 두 번 이상 보여야 규칙을 찾을 수 있다
    case 'shapes':
      return scene.shapes.some((s) => s.shape === scene.target) && scene.shapes.some((s) => s.shape !== scene.target);
    case 'groups':
      // 수정 동굴: 묶어 세기. 낱개는 묶음 하나보다 적어야 묶어 세기가 된다.
      return scene.size >= 2 && scene.groups >= 2 && scene.ones >= 0 && scene.ones < scene.size && scene.groups * scene.size + scene.ones <= GROUP_MAX[level];
    case 'measure':
      return scene.length >= 2 && scene.length <= 10;
    case 'hops':
      return scene.hop !== 0 && Math.abs(scene.hop) <= 9 && scene.start >= 0 && scene.start <= max && scene.start + scene.hop >= 0 && scene.start + scene.hop <= max;
    case 'pairs':
      return scene.total >= 4 && scene.total <= SPREAD_MAX[level];
    case 'clock':
      return Number.isInteger(scene.hour) && scene.hour >= 1 && scene.hour <= 12;
    case 'share':
      return scene.total >= 4 && scene.total <= SPREAD_MAX[level] && scene.total % 2 === 0; // 똑같이 나눠지는 수만
    case 'double':
      return scene.n >= 1 && scene.n * 2 <= max;
    case 'makeTen':
      return Number.isInteger(scene.have) && scene.have >= 1 && scene.have <= 9;
    case 'difference':
      return scene.b >= 1 && scene.a > scene.b && scene.a <= (level === 'hard' ? max : 15);
    case 'ordinal':
      // 좁은 화면에서도 한 줄에 서도록 5개까지, 서로 다른 것만
      return scene.items.length >= 3 && scene.items.length <= 5 && new Set(scene.items).size === scene.items.length && scene.position >= 1 && scene.position <= scene.items.length;
  }
}
