import { describe, expect, it } from 'vitest';
import { answerOf, sceneVars, withJosa } from './answers';
import { translate } from '../../i18n/translate';

// 정답 계산: 장면 정보(수량)만으로 정답을 구한다
describe('answerOf', () => {
  it('수 세기: 전체 개수', () => {
    expect(answerOf({ kind: 'count', item: 'apple', total: 17 })).toBe(17);
  });

  it('비교: 많은 쪽 또는 똑같다', () => {
    expect(answerOf({ kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 7, b: 9 })).toBe('b');
    expect(answerOf({ kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 11, b: 9 })).toBe('a');
    expect(answerOf({ kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 8, b: 8 })).toBe('same');
  });

  it('더하기·빼기', () => {
    expect(answerOf({ kind: 'add', item: 'frog', start: 8, add: 7 })).toBe(15);
    expect(answerOf({ kind: 'subtract', item: 'cookie', start: 16, remove: 9 })).toBe(7);
  });

  it('묶어 세기: 묶음 × 묶음 크기 + 낱개', () => {
    expect(answerOf({ kind: 'groups', item: 'gem', size: 2, groups: 6, ones: 0 })).toBe(12);
    expect(answerOf({ kind: 'groups', item: 'candle', size: 2, groups: 9, ones: 1 })).toBe(19);
    expect(answerOf({ kind: 'groups', item: 'mushroom', size: 10, groups: 4, ones: 2 })).toBe(42);
  });

  it('묶어 세기 문장 속 숫자: 묶음 수·낱개·묶음으로 센 수', () => {
    expect(sceneVars({ kind: 'groups', item: 'pebble', size: 10, groups: 2, ones: 3 }, String)).toMatchObject({ answer: '23', size: '10', groups: '2', ones: '3', tens: '20' });
  });

  it('규칙: 되풀이 묶음에서 다음 차례', () => {
    expect(answerOf({ kind: 'pattern', unit: ['moon', 'star', 'star'], shown: 9 })).toBe('moon');
    expect(answerOf({ kind: 'pattern', unit: ['star', 'star', 'moon', 'moon'], shown: 10 })).toBe('moon');
    expect(answerOf({ kind: 'pattern', unit: ['leaf', 'mushroom', 'acorn', 'owl'], shown: 10 })).toBe('acorn');
  });

  it('도형: 찾는 도형의 개수 (크기·색·돌림과 상관없음)', () => {
    expect(
      answerOf({
        kind: 'shapes',
        target: 'square',
        shapes: [
          { shape: 'square', color: '#fff', size: 1 },
          { shape: 'square', color: '#000', size: 0.6, rotate: 45 },
          { shape: 'circle', color: '#fff', size: 1 },
        ],
      }),
    ).toBe(2);
  });
});

describe('sceneVars (문장 속 숫자)', () => {
  const fmt = (n: number) => String(n);
  it('장면 종류마다 필요한 값을 채운다', () => {
    expect(sceneVars({ kind: 'add', item: 'frog', start: 8, add: 7 }, fmt)).toMatchObject({ answer: '15', start: '8', add: '7', total: '15' });
    expect(sceneVars({ kind: 'subtract', item: 'cookie', start: 16, remove: 9 }, fmt)).toMatchObject({ answer: '7', start: '16', remove: '9', left: '7' });
    expect(sceneVars({ kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 7, b: 9 }, fmt)).toMatchObject({ a: '7', b: '9' });
  });
  it('물건 낱말: 영어는 여럿·하나, 한국어는 이름·세는 말과 받침에 맞는 조사', () => {
    const en = (k: string) => translate('en', k);
    const ko = (k: string) => translate('ko', k);
    expect(sceneVars({ kind: 'count', item: 'pear', total: 13 }, fmt, en)).toMatchObject({ item: 'pears', itemOne: 'pear' });
    expect(sceneVars({ kind: 'count', item: 'pear', total: 13 }, fmt, ko)).toMatchObject({ item: '배', itemGa: '배가', itemEul: '배를', itemUnit: '개', itemUnitYeyo: '개예요' });
    expect(sceneVars({ kind: 'count', item: 'mushroom', total: 13 }, fmt, ko)).toMatchObject({ itemGa: '버섯이', itemEul: '버섯을', itemEun: '버섯은', itemWa: '버섯과' });
    expect(sceneVars({ kind: 'add', item: 'frog', start: 8, add: 7 }, fmt, ko)).toMatchObject({ itemUnit: '마리', itemUnitGa: '마리가' });
    expect(sceneVars({ kind: 'share', item: 'lily', total: 8 }, fmt, ko)).toMatchObject({ itemUnit: '송이', itemUnitEul: '송이를' });
    // 비교: 많은 쪽 이름
    expect(sceneVars({ kind: 'compare', itemA: 'acorn', itemB: 'leaf', a: 7, b: 9 }, fmt, en).more).toBe('leaves');
    expect(sceneVars({ kind: 'compare', itemA: 'blueberry', itemB: 'cookie', a: 11, b: 9 }, fmt, ko).moreGa).toBe('블루베리가');
    // 도형·재는 물건·규칙 묶음
    expect(sceneVars({ kind: 'measure', thing: 'ribbon', length: 7 }, fmt, ko)).toMatchObject({ thingEun: '리본은', thingYeyo: '리본이에요' });
    expect(sceneVars({ kind: 'shapes', target: 'square', shapes: [{ shape: 'square', color: '#A8C3A0', size: 1 }] }, fmt, en)).toMatchObject({ shape: 'squares' });
    expect(sceneVars({ kind: 'pattern', unit: ['star', 'star', 'moon', 'moon'], shown: 10 }, fmt, ko)).toMatchObject({ units: '별, 별, 달, 달', unitsYeyo: '별, 별, 달, 달이에요', next: '달' });
  });
  it('조사: 받침이 있으면 이·을·은·과·이에요, 없으면 가·를·는·와·예요', () => {
    expect(['Ga', 'Eul', 'Eun', 'Wa', 'Yeyo'].map((k) => withJosa('곰', k as 'Ga'))).toEqual(['곰이', '곰을', '곰은', '곰과', '곰이에요']);
    expect(['Ga', 'Eul', 'Eun', 'Wa', 'Yeyo'].map((k) => withJosa('나비', k as 'Ga'))).toEqual(['나비가', '나비를', '나비는', '나비와', '나비예요']);
  });
  it('숫자 표시 방식(언어별)을 그대로 쓴다', () => {
    expect(sceneVars({ kind: 'count', item: 'apple', total: 1000 }, (n) => new Intl.NumberFormat('en').format(n)).total).toBe('1,000');
  });
});
