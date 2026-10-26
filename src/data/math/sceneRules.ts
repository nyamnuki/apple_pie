import type { MathScene } from '../../types/math';

// 장면의 수가 지금 난이도 범위 안인지 (테스트에서 레슨 데이터와 '다시 할 때 바뀐 문제'를 같이 검사한다)
export const MAX = 20; // 현재 난이도: 20까지의 수 (묶어 세기만 50까지)

export function sizeOk(scene: MathScene): boolean {
  switch (scene.kind) {
    case 'count':
      return scene.total >= 1 && scene.total <= MAX;
    case 'compare':
      return scene.a >= 1 && scene.b >= 1 && scene.a <= MAX && scene.b <= MAX;
    case 'add':
      return scene.start >= 1 && scene.add >= 1 && scene.start + scene.add <= MAX;
    case 'subtract':
      return scene.remove >= 1 && scene.remove < scene.start && scene.start <= MAX;
    case 'pattern':
      return scene.unit.length >= 2 && scene.shown >= scene.unit.length * 2; // 묶음이 두 번 이상 보여야 규칙을 찾을 수 있다
    case 'shapes':
      return scene.shapes.some((s) => s.shape === scene.target) && scene.shapes.some((s) => s.shape !== scene.target);
    case 'groups':
      // 수정 동굴: 묶어 세기는 50까지. 낱개는 묶음 하나보다 적어야 묶어 세기가 된다.
      return scene.size >= 2 && scene.groups >= 2 && scene.ones >= 0 && scene.ones < scene.size && scene.groups * scene.size + scene.ones <= 50;
    case 'measure':
      return scene.length >= 2 && scene.length <= 10;
    case 'hops':
      return scene.hop !== 0 && Math.abs(scene.hop) <= 9 && scene.start >= 0 && scene.start <= MAX && scene.start + scene.hop >= 0 && scene.start + scene.hop <= MAX;
    case 'pairs':
      return scene.total >= 4 && scene.total <= 16;
    case 'clock':
      return Number.isInteger(scene.hour) && scene.hour >= 1 && scene.hour <= 12;
  }
}

