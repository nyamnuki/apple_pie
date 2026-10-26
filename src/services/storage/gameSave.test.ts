import { beforeEach, describe, expect, it } from 'vitest';
import { BACKUP_KEY, SAVE_KEY, SCHEMA_VERSION, backupText, loadGame, parseSave, readSavedAt, saveGame } from './gameSave';
import { createInitialGameState } from '../../app/gameState';
import { DEFAULT_LAYOUT } from '../../features/room/roomState';

// 저장·불러오기·복구·버전 변환. 브라우저 저장소(localStorage)를 메모리로 흉내 낸다.
class MemoryStorage {
  data = new Map<string, string>();
  blocked = false;
  getItem(k: string) {
    if (this.blocked) throw new Error('blocked');
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    if (this.blocked) throw new DOMException('blocked', 'SecurityError');
    this.data.set(k, v);
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
}
let store: MemoryStorage;
beforeEach(() => {
  store = new MemoryStorage();
  (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = store;
});
const put = (value: unknown) => store.data.set(SAVE_KEY, typeof value === 'string' ? value : JSON.stringify(value));
const v1Save = {
  schemaVersion: 1,
  savedAt: '2026-01-01T00:00:00Z',
  game: { resources: { acorn: 4 }, furniture: { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1 }, completedLessons: ['counting1'] },
  room: { placed: [{ uid: 'b', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 }, { uid: 't', furnitureId: 'toyChest', gx: 3, gy: 3, rotation: 0 }], wallpaperId: null },
};

describe('정상', () => {
  it('저장본이 없으면 처음 상태 (new)', () => {
    expect(loadGame()).toEqual({ game: createInitialGameState(), room: DEFAULT_LAYOUT, status: 'new' });
  });

  it('저장한 것을 그대로 불러온다', () => {
    const game = { ...createInitialGameState(), resources: { acorn: 2, goldenAcorn: 1 }, completedLessons: ['counting1' as const] };
    const room = { ...DEFAULT_LAYOUT, wallItems: [{ uid: 'f', furnitureId: 'leafFrame', wall: 'left' as const, slot: 1 }] };
    game.furniture = { ...game.furniture, leafFrame: 1 };
    expect(saveGame(game, room)).toBe(true);
    const saved = JSON.parse(store.data.get(SAVE_KEY)!);
    expect(saved.schemaVersion).toBe(SCHEMA_VERSION);
    expect(readSavedAt()).toBeInstanceOf(Date);
    expect(loadGame()).toEqual({ game, room, status: 'loaded' });
  });
});

describe('버전 변환', () => {
  it('버전 1 저장본은 벽 장식을 빈 목록으로 채워 그대로 살린다', () => {
    put(v1Save);
    const r = loadGame();
    expect(r.status).toBe('loaded');
    expect(r.room.wallItems).toEqual([]);
    expect(r.room.placed.map((p) => p.uid)).toEqual(['b', 't']);
    expect(r.game.resources).toEqual({ acorn: 4 });
    expect(r.game.completedLessons).toEqual(['counting1']);
  });

  it('모르는(더 새로운) 버전은 새로 시작하고 원래 내용을 보관한다', () => {
    put({ ...v1Save, schemaVersion: 99 });
    expect(loadGame().status).toBe('recovered');
    expect(store.data.get(BACKUP_KEY)).toContain('"schemaVersion":99');
  });
});

describe('손상 데이터 복구', () => {
  it.each([['깨진 글자', '{oops'], ['객체가 아님', '42'], ['null', 'null'], ['버전 없음', '{"game":{}}']])('%s → 새로 시작 + 보관', (_, raw) => {
    put(raw);
    const r = loadGame();
    expect(r.status).toBe('recovered');
    expect(r.game).toEqual(createInitialGameState());
    expect(store.data.get(BACKUP_KEY)).toBe(raw);
  });

  it('일부만 이상하면 그 부분만 버린다', () => {
    put({
      schemaVersion: 2,
      savedAt: 'x',
      game: { resources: { acorn: -5, apple: 3.5, goldenAcorn: 2, fake: 9 }, furniture: { toyChest: 2, unknownThing: 3, leafBed: 0, leafFrame: 1 }, completedLessons: ['counting1', 'nope', 'counting1'] },
      room: {
        placed: [
          { uid: 'b', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 },
          { uid: 't1', furnitureId: 'toyChest', gx: 9, gy: 9, rotation: 0 },
          { uid: 't2', furnitureId: 'toyChest', gx: 3, gy: 3, rotation: 0 },
          { uid: 't3', furnitureId: 'toyChest', gx: 4, gy: 4, rotation: 0 },
          { uid: 't4', furnitureId: 'toyChest', gx: 5, gy: 5, rotation: 0 },
          { uid: 'f', furnitureId: 'flowerPot', gx: 1, gy: 1, rotation: 0 },
          { uid: 'r', furnitureId: 'mushroomLamp', gx: 2, gy: 0, rotation: 7 },
        ],
        wallItems: [
          { uid: 'w1', furnitureId: 'leafFrame', wall: 'right', slot: 2 }, // 창문 자리
          { uid: 'w2', furnitureId: 'leafFrame', wall: 'left', slot: 1 },
          { uid: 'w3', furnitureId: 'leafFrame', wall: 'left', slot: 3 }, // 가진 수(1) 초과
          { uid: 'b', furnitureId: 'acornGarland', wall: 'up', slot: 0 }, // 잘못된 벽
        ],
        wallpaperId: 'woodlandWallpaper', // 갖지 않음
      },
    });
    const r = loadGame();
    expect(r.status).toBe('loaded');
    expect(r.game.resources).toEqual({ goldenAcorn: 2 });
    expect(r.game.furniture).toEqual({ leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 2, leafFrame: 1 });
    expect(r.game.completedLessons).toEqual(['counting1']);
    expect(r.room.placed.map((p) => p.uid)).toEqual(['b', 't2', 't3']);
    expect(r.room.wallItems.map((w) => w.uid)).toEqual(['w2']);
    expect(r.room.wallpaperId).toBeNull();
  });
});

describe('놀이 기록', () => {
  const at = '2026-10-25T09:00:00.000Z';
  it('예전 저장본(기록 없음)은 빈 기록으로 불러온다', () => {
    put(v1Save);
    expect(loadGame().game.lessonStats).toEqual({});
  });

  it('맞는 기록은 살리고, 이상한 기록은 그 놀이만 버린다', () => {
    put({
      schemaVersion: SCHEMA_VERSION,
      savedAt: at,
      game: {
        ...createInitialGameState(),
        lessonStats: {
          counting1: { plays: 3, firstTry: 2, hints: 1, lastPlayed: at },
          addition1: { plays: 2, firstTry: 9, hints: 99, lastPlayed: at }, // 횟수보다 많으면 줄인다
          comparing1: { plays: -1, firstTry: 0, hints: 0, lastPlayed: at }, // 음수
          subtraction1: { plays: 1, firstTry: 0, hints: 0, lastPlayed: 'yesterday' }, // 날짜가 아님
          noSuchLesson: { plays: 1, firstTry: 0, hints: 0, lastPlayed: at },
        },
      },
      room: DEFAULT_LAYOUT,
    });
    expect(loadGame().game.lessonStats).toEqual({
      counting1: { plays: 3, firstTry: 2, hints: 1, lastPlayed: at },
      addition1: { plays: 2, firstTry: 2, hints: 6, lastPlayed: at },
    });
  });
});

describe('스티커', () => {
  it('예전 저장본은 빈 도감, 모르는 스티커·겹친 스티커는 버린다', () => {
    put(v1Save);
    expect(loadGame().game.stickers).toEqual([]);
    put({ schemaVersion: SCHEMA_VERSION, savedAt: 'x', game: { ...createInitialGameState(), stickers: ['apple', 'apple', 'dragon', 7, 'moon'] }, room: DEFAULT_LAYOUT });
    expect(loadGame().game.stickers).toEqual(['apple', 'moon']);
  });
});

describe('루루 옷', () => {
  it('예전 저장본은 아무것도 안 입음, 안 열린 옷·모르는 옷은 벗긴다', () => {
    put(v1Save);
    expect(loadGame().game.outfit).toEqual({ hat: null, scarf: null });
    const stickers = ['apple', 'acorn', 'flower', 'ladybug'];
    put({ schemaVersion: SCHEMA_VERSION, savedAt: 'x', game: { ...createInitialGameState(), stickers, outfit: { hat: 'acornCap', scarf: 'berryScarf' } }, room: DEFAULT_LAYOUT });
    expect(loadGame().game.outfit).toEqual({ hat: 'acornCap', scarf: null });
    put({ schemaVersion: SCHEMA_VERSION, savedAt: 'x', game: { ...createInitialGameState(), stickers, outfit: { hat: 'cape', scarf: 3 } }, room: DEFAULT_LAYOUT });
    expect(loadGame().game.outfit).toEqual({ hat: null, scarf: null });
  });
});

describe('가구 색', () => {
  it('색 1·2 는 남기고, 이상한 값은 원래 색으로 (예전 저장본은 그대로)', () => {
    put(v1Save);
    expect(loadGame().room.placed.every((p) => p.tint === undefined)).toBe(true);
    const placed = [
      { uid: 'b', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0, tint: 2 },
      { uid: 'r', furnitureId: 'petalRug', gx: 2, gy: 2, rotation: 0, tint: 7 },
      { uid: 'l', furnitureId: 'mushroomLamp', gx: 2, gy: 0, rotation: 0, tint: '1' },
    ];
    put({ schemaVersion: SCHEMA_VERSION, savedAt: 'x', game: createInitialGameState(), room: { ...DEFAULT_LAYOUT, placed } });
    const loaded = loadGame().room.placed;
    expect(loaded.find((p) => p.uid === 'b')?.tint).toBe(2);
    expect(loaded.find((p) => p.uid === 'r')).not.toHaveProperty('tint');
    expect(loaded.find((p) => p.uid === 'l')).not.toHaveProperty('tint');
  });
});

describe('백업 파일', () => {
  it('백업 글을 다시 읽으면 같은 진행 상황', () => {
    const game = { ...createInitialGameState(), resources: { acorn: 3 }, completedLessons: ['counting1' as const], stickers: ['apple'] };
    const text = backupText(game, DEFAULT_LAYOUT);
    expect(JSON.parse(text)).toMatchObject({ app: 'math-town', schemaVersion: SCHEMA_VERSION });
    expect(parseSave(text)).toEqual({ game, room: DEFAULT_LAYOUT });
  });

  it('옛 버전 백업도 변환해서 읽고, 저장본이 아닌 파일은 거절한다', () => {
    expect(parseSave(JSON.stringify(v1Save))?.game.completedLessons).toEqual(['counting1']);
    for (const bad of ['', 'hello', '[]', '{}', '{"game": 3}', JSON.stringify({ ...v1Save, schemaVersion: 99 })]) expect(parseSave(bad), bad).toBeNull();
  });
});

describe('저장이 막힌 브라우저', () => {
  it('처음 상태로 시작하고(unavailable), 저장은 실패를 알려준다', () => {
    store.blocked = true;
    expect(loadGame().status).toBe('unavailable');
    expect(saveGame(createInitialGameState(), DEFAULT_LAYOUT)).toBe(false);
    expect(readSavedAt()).toBeNull();
  });
});
