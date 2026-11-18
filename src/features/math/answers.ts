import type { MathAnswer, MathItemId, MathScene } from '../../types/math';
import { itemCounterKey, itemManyKey, itemNameKey, itemOneKey } from '../../data/math/items';

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
    case 'ordinal':
      return scene.items[scene.position - 1];
  }
}

// ===== 문장 속 낱말 =====
// 한국어 조사는 앞 낱말의 받침에 따라 모양이 바뀐다 (배가 / 버섯이). 낱말이 바뀌는 자리 바로 뒤에
// 조사를 글로 적지 않고, 받침을 보고 붙인 값({itemGa} 등)을 쓴다. 영어 문장에서는 쓰지 않는다.
const JOSA = { Ga: ['이', '가'], Eul: ['을', '를'], Eun: ['은', '는'], Wa: ['과', '와'], Yeyo: ['이에요', '예요'] } as const;
export type JosaKind = keyof typeof JOSA;
export function withJosa(word: string, kind: JosaKind): string {
  const code = word.charCodeAt(word.length - 1);
  if (!(code >= 0xac00 && code <= 0xd7a3)) return word + JOSA[kind][1]; // 한글이 아니면 (영어 등) 받침 없는 쪽
  return word + JOSA[kind][(code - 0xac00) % 28 ? 0 : 1];
}

// 낱말 하나와 그 조사 붙은 모양들: name → name, nameGa, nameEul, nameEun, nameWa, nameYeyo
function word(name: string, value: string): Record<string, string> {
  const out: Record<string, string> = { [name]: value };
  for (const kind of Object.keys(JOSA) as JosaKind[]) out[name + kind] = withJosa(value, kind);
  return out;
}

// 물건 자리(item, itemA …): 여럿('pears' / '배'), 하나('pear'), 세는 말('개')
function itemWords(slot: string, id: MathItemId, tr: Tr): Record<string, string> {
  return { ...word(slot, tr(itemManyKey(id))), ...word(`${slot}One`, tr(itemOneKey(id))), ...word(`${slot}Unit`, tr(itemCounterKey(id))) };
}

// 번역 함수 (키 → 그 언어의 글). 테스트에서는 키를 그대로 돌려주는 함수를 쓴다
type Tr = (key: string) => string;
const asKey: Tr = (key) => key;

// 문장 속 {start}, {answer}, {item} 같은 자리에 넣을 값들. tr: 물건·도형 이름을 그 언어로 바꾸는 함수
export function sceneVars(scene: MathScene, formatNumber: (n: number) => string, tr: Tr = asKey): Record<string, string> {
  const answer = answerOf(scene);
  const vars: Record<string, string> = typeof answer === 'number' ? { answer: formatNumber(answer) } : {};
  switch (scene.kind) {
    case 'count':
      return { ...vars, ...itemWords('item', scene.item, tr), total: formatNumber(scene.total) };
    case 'compare':
      return {
        ...vars,
        ...itemWords('itemA', scene.itemA, tr),
        ...itemWords('itemB', scene.itemB, tr),
        ...itemWords('more', scene.a >= scene.b ? scene.itemA : scene.itemB, tr), // 많은 쪽
        a: formatNumber(scene.a),
        b: formatNumber(scene.b),
      };
    case 'add':
      return { ...vars, ...itemWords('item', scene.item, tr), start: formatNumber(scene.start), add: formatNumber(scene.add), total: formatNumber(scene.start + scene.add) };
    case 'subtract':
      return { ...vars, ...itemWords('item', scene.item, tr), start: formatNumber(scene.start), remove: formatNumber(scene.remove), left: formatNumber(scene.start - scene.remove) };
    case 'pattern':
      // units: 되풀이되는 묶음 ('star, star, moon, moon'), next: 답 (버튼과 같은 이름)
      return { ...vars, ...word('units', scene.unit.map((id) => tr(itemOneKey(id))).join(', ')), next: tr(itemNameKey(answer as MathItemId)) };
    case 'shapes':
      return { ...vars, ...word('shape', tr(`shapesMany.${scene.target}`)), shapeHint: tr(`shapeHints.${scene.target}`), total: formatNumber(scene.shapes.length) };
    case 'groups':
      return { ...vars, ...itemWords('item', scene.item, tr), size: formatNumber(scene.size), groups: formatNumber(scene.groups), ones: formatNumber(scene.ones), tens: formatNumber(scene.groups * scene.size) };
    case 'measure':
      return { ...vars, ...word('thing', tr(`measureThings.${scene.thing}`)) };
    case 'hops':
      return { ...vars, start: formatNumber(scene.start), hop: formatNumber(Math.abs(scene.hop)) };
    case 'pairs':
      return { ...vars, ...itemWords('item', scene.item, tr), total: formatNumber(scene.total), pairs: formatNumber(Math.floor(scene.total / 2)), left: formatNumber(scene.total % 2) };
    case 'clock':
      return { ...vars, hour: formatNumber(scene.hour) };
    case 'share':
      return { ...vars, ...itemWords('item', scene.item, tr), total: formatNumber(scene.total), each: formatNumber(scene.total / 2) };
    case 'double':
      return { ...vars, ...itemWords('item', scene.item, tr), n: formatNumber(scene.n), total: formatNumber(scene.n * 2) };
    case 'makeTen':
      return { ...vars, ...itemWords('item', scene.item, tr), have: formatNumber(scene.have), more: formatNumber(10 - scene.have) };
    case 'difference':
      return { ...vars, ...itemWords('itemA', scene.itemA, tr), ...itemWords('itemB', scene.itemB, tr), a: formatNumber(scene.a), b: formatNumber(scene.b), diff: formatNumber(scene.a - scene.b) };
    case 'ordinal':
      return { ...vars, nth: formatNumber(scene.position), total: formatNumber(scene.items.length) };
  }
}

// 자리 이름의 바탕 (조사·하나·세는 말 꼬리를 뗀 것): itemUnitGa → item. 두 언어가 같은 자리를 쓰는지 볼 때 쓴다
export const placeholderBase = (name: string) => name.replace(/(One|Unit|Ga|Eul|Eun|Wa|Yeyo)+$/, '');
