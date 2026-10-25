import { describe, expect, it } from 'vitest';
import { en } from './locales/en';
import { ko } from './locales/ko';
import { translate } from './translate';
import { LESSONS, lessonKey } from '../data/math/lessons';
import { sceneVars } from '../features/math/answers';
import { FURNITURE } from '../data/furniture/furniture';
import { RESOURCES } from '../data/resources/resources';
import { REGIONS } from '../data/regions/regions';
import { CHARACTERS } from '../data/characters/characters';
import { MATH_ITEMS, itemNameKey } from '../data/math/items';
import type { LessonTextPart, MathScene } from '../types/math';

// 번역 점검: 키 누락, 빈 문장, 문장 속 자리({answer} 등) 불일치, 코드·데이터에서 쓰는 키의 존재

type Tree = { [k: string]: string | Tree };
function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'string' ? { ...acc, [key]: v } : { ...acc, ...flatten(v, key) };
  }, {});
}
const EN = flatten(en as unknown as Tree);
const KO = flatten(ko as unknown as Tree);
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('영어·한국어 언어 파일', () => {
  it('키가 완전히 같다', () => {
    expect(Object.keys(KO).sort()).toEqual(Object.keys(EN).sort());
  });

  it('빈 문장이 없다', () => {
    for (const [k, v] of [...Object.entries(EN), ...Object.entries(KO)]) expect(v.trim(), k).not.toBe('');
  });

  it('문장 속 자리({answer} 등)가 두 언어에서 같다', () => {
    for (const key of Object.keys(EN)) expect(placeholders(KO[key]), key).toEqual(placeholders(EN[key]));
  });

  it('한국어 파일에는 영어 문장이 그대로 남아 있지 않다 (Lulu 같은 이름 제외)', () => {
    for (const [k, v] of Object.entries(KO)) expect(/[A-Za-z]{3,}/.test(v.replace(/\{\w+\}/g, '')), `${k}: ${v}`).toBe(false);
  });

  it('없는 키는 키 이름을 그대로 보여준다 (앱이 멈추지 않는다)', () => {
    expect(translate('en', 'no.such.key')).toBe('no.such.key');
  });
});

describe('코드와 데이터에서 쓰는 키가 모두 있다', () => {
  // src 안의 t('...') 처럼 글자로 적힌 키를 모두 찾는다 (테스트 파일은 빼고)
  const sources = import.meta.glob(['../**/*.{ts,tsx}', '!../**/*.test.ts'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

  it('화면 코드의 t(\'…\') 키', () => {
    const keys = new Set<string>();
    expect(Object.keys(sources).length).toBeGreaterThan(20);
    for (const text of Object.values(sources)) {
      for (const m of text.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) keys.add(m[1]);
    }
    expect(keys.size).toBeGreaterThan(50);
    for (const k of keys) expect(EN[k] !== undefined && KO[k] !== undefined, k).toBe(true);
  });

  it('데이터(가구·재료·마을·캐릭터·물건)의 키', () => {
    const keys = [
      ...FURNITURE.flatMap((f) => [f.nameKey, f.descriptionKey]),
      ...RESOURCES.map((r) => r.nameKey),
      ...REGIONS.flatMap((r) => [r.nameKey, r.topicsKey]),
      ...Object.values(CHARACTERS).flatMap((c) => [c.nameKey, c.descriptionKey]),
      ...Object.keys(MATH_ITEMS).map((id) => itemNameKey(id as keyof typeof MATH_ITEMS)),
    ];
    for (const k of keys) expect(EN[k] !== undefined && KO[k] !== undefined, k).toBe(true);
  });

  // 레슨 문장의 {자리}는 그 단계 장면에서 채울 수 있는 값이어야 한다
  const SCENE_OF: Record<LessonTextPart, 'explore' | 'predict' | 'apply' | null> = {
    title: null, discover: null,
    observe: 'explore', manipulate: 'explore', manipulateDone: 'explore',
    predict: 'predict', verify: 'predict',
    apply: 'apply', hint1: 'apply', hint2: 'apply', hint3: 'apply', correct: 'apply',
  };
  for (const lesson of LESSONS) {
    it(`레슨 ${lesson.id}: 문장 12개가 있고 {자리}를 모두 채울 수 있다`, () => {
      for (const part of Object.keys(SCENE_OF) as LessonTextPart[]) {
        const key = lessonKey(lesson.id, part);
        const scene = SCENE_OF[part];
        const available = scene ? Object.keys(sceneVars(lesson[scene] as MathScene, String)) : [];
        for (const text of [EN[key], KO[key]]) {
          expect(text, key).toBeDefined();
          for (const p of placeholders(text)) expect(available, `${key} 의 {${p}}`).toContain(p);
        }
      }
      for (const labels of [lesson.predictLabels, lesson.applyLabels]) {
        if (labels) for (const k of [labels.a, labels.b]) expect(EN[k] !== undefined && KO[k] !== undefined, k).toBe(true);
      }
    });
  }
});
