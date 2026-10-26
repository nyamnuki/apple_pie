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
    case 'pattern':
      return scene.unit[scene.shown % scene.unit.length];
    case 'shapes':
      return scene.shapes.filter((s) => s.shape === scene.target).length;
    case 'groups':
      return scene.groups * scene.size + scene.ones;
    case 'measure':
      return scene.length;
    case 'hops':
      return scene.start + scene.hop;
    case 'pairs':
      return scene.total % 2 === 0 ? 'even' : 'odd';
    case 'clock':
      return `${scene.hour}:${scene.half ? '30' : '00'}`;
    case 'share':
      return scene.total / 2;
    case 'double':
      return scene.n * 2;
    case 'makeTen':
      return 10 - scene.have;
    case 'difference':
      return scene.a - scene.b;
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
    case 'pattern':
      return vars;
    case 'shapes':
      return { ...vars, total: formatNumber(scene.shapes.length) };
    case 'groups':
      return { ...vars, size: formatNumber(scene.size), groups: formatNumber(scene.groups), ones: formatNumber(scene.ones), tens: formatNumber(scene.groups * scene.size) };
    case 'measure':
      return vars;
    case 'hops':
      return { ...vars, start: formatNumber(scene.start), hop: formatNumber(Math.abs(scene.hop)) };
    case 'pairs':
      return { ...vars, total: formatNumber(scene.total), pairs: formatNumber(Math.floor(scene.total / 2)), left: formatNumber(scene.total % 2) };
    case 'clock':
      return { ...vars, hour: formatNumber(scene.hour) };
    case 'share':
      return { ...vars, total: formatNumber(scene.total), each: formatNumber(scene.total / 2) };
    case 'double':
      return { ...vars, n: formatNumber(scene.n), total: formatNumber(scene.n * 2) };
    case 'makeTen':
      return { ...vars, have: formatNumber(scene.have), more: formatNumber(10 - scene.have) };
    case 'difference':
      return { ...vars, a: formatNumber(scene.a), b: formatNumber(scene.b), diff: formatNumber(scene.a - scene.b) };
  }
}
