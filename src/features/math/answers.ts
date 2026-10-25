import type { MathAnswer, MathScene } from '../../types/math';

// 장면 정보로 정답을 계산한다 (번역 문구와 상관없음)
export function answerOf(scene: MathScene): MathAnswer {
  switch (scene.kind) {
    case 'count':
      return scene.total;
    case 'compare':
      return scene.a === scene.b ? 'same' : scene.a > scene.b ? 'a' : 'b';
    case 'add':
      return scene.start + scene.add;
    case 'subtract':
      return scene.start - scene.remove;
  }
}

// 문장 속 {start}, {answer} 같은 자리에 넣을 값들
export function sceneVars(scene: MathScene, formatNumber: (n: number) => string): Record<string, string> {
  const answer = answerOf(scene);
  const vars: Record<string, string> = typeof answer === 'number' ? { answer: formatNumber(answer) } : {};
  switch (scene.kind) {
    case 'count':
      return { ...vars, total: formatNumber(scene.total) };
    case 'compare':
      return { ...vars, a: formatNumber(scene.a), b: formatNumber(scene.b) };
    case 'add':
      return { ...vars, start: formatNumber(scene.start), add: formatNumber(scene.add), total: formatNumber(scene.start + scene.add) };
    case 'subtract':
      return { ...vars, start: formatNumber(scene.start), remove: formatNumber(scene.remove), left: formatNumber(scene.start - scene.remove) };
  }
}
