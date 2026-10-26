import { describe, expect, it } from 'vitest';
import { applyRoomAction, DEFAULT_LAYOUT, type OwnedCounts } from './roomState';
import type { RoomLayout } from '../../types/furniture';

// 방 배치 규칙: 잘못된 요청은 기존 상태를 '그대로'(같은 객체) 돌려준다

const owned: OwnedCounts = { leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1, toyChest: 1, forestBookshelf: 1, leafFrame: 2, acornGarland: 1, starryFrame: 1, woodlandWallpaper: 1 };
// 침대(2×3)가 (0,0)~(1,2) 를 차지하는 방
const room: RoomLayout = {
  placed: [{ uid: 'bed', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 }],
  wallItems: [],
  wallpaperId: null,
};
const apply = (state: RoomLayout, action: Parameters<typeof applyRoomAction>[1], o: OwnedCounts = owned) => applyRoomAction(state, action, o);

describe('바닥 가구 놓기', () => {
  it('빈 자리에 놓을 수 있다', () => {
    const next = apply(room, { type: 'place', item: { uid: 'c', furnitureId: 'toyChest', gx: 3, gy: 3, rotation: 0 } });
    expect(next.placed).toHaveLength(2);
  });

  it.each([
    ['방 밖', { gx: 6, gy: 0 }],
    ['음수 칸', { gx: -1, gy: 2 }],
    ['침대와 겹침', { gx: 1, gy: 1 }],
  ])('%s 이면 바뀌지 않는다', (_, pos) => {
    expect(apply(room, { type: 'place', item: { uid: 'c', furnitureId: 'toyChest', rotation: 0, ...pos } })).toBe(room);
  });

  it('여러 칸 가구가 방 끝을 넘으면 바뀌지 않는다 (책장 2×1 을 가로 5번째 칸에)', () => {
    expect(apply(room, { type: 'place', item: { uid: 's', furnitureId: 'forestBookshelf', gx: 5, gy: 4, rotation: 0 } })).toBe(room);
  });

  it('러그는 가구 아래에 깔 수 있다', () => {
    expect(apply(room, { type: 'place', item: { uid: 'r', furnitureId: 'petalRug', gx: 0, gy: 0, rotation: 0 } }).placed).toHaveLength(2);
  });

  it('가진 개수보다 많이 놓을 수 없다 (빠른 두 번 누르기 방지)', () => {
    const once = apply(room, { type: 'place', item: { uid: 'c1', furnitureId: 'toyChest', gx: 3, gy: 3, rotation: 0 } });
    expect(apply(once, { type: 'place', item: { uid: 'c2', furnitureId: 'toyChest', gx: 5, gy: 5, rotation: 0 } })).toBe(once);
    expect(apply(room, { type: 'place', item: { uid: 'x', furnitureId: 'woodenDesk', gx: 3, gy: 3, rotation: 0 } })).toBe(room); // 하나도 없음
  });

  it('같은 번호, 없는 가구, 벽 장식·벽지는 바닥에 놓을 수 없다', () => {
    expect(apply(room, { type: 'place', item: { uid: 'bed', furnitureId: 'toyChest', gx: 3, gy: 3, rotation: 0 } })).toBe(room);
    expect(apply(room, { type: 'place', item: { uid: 'g', furnitureId: 'ghostSofa', gx: 3, gy: 3, rotation: 0 } })).toBe(room);
    expect(apply(room, { type: 'place', item: { uid: 'f', furnitureId: 'leafFrame', gx: 3, gy: 3, rotation: 0 } })).toBe(room);
    expect(apply(room, { type: 'place', item: { uid: 'w', furnitureId: 'woodlandWallpaper', gx: 3, gy: 3, rotation: 0 } })).toBe(room);
  });
});

describe('바닥 가구 옮기기·돌리기·치우기', () => {
  const withShelf = apply(room, { type: 'place', item: { uid: 's', furnitureId: 'forestBookshelf', gx: 3, gy: 0, rotation: 0 } }); // 2×1

  it('옮기기: 빈 자리는 되고, 방 밖·겹침은 안 된다', () => {
    expect(apply(withShelf, { type: 'move', uid: 's', gx: 3, gy: 4 }).placed.find((p) => p.uid === 's')).toMatchObject({ gx: 3, gy: 4 });
    expect(apply(withShelf, { type: 'move', uid: 's', gx: 5, gy: 4 })).toBe(withShelf);
    expect(apply(withShelf, { type: 'move', uid: 's', gx: 1, gy: 0 })).toBe(withShelf);
    expect(apply(withShelf, { type: 'move', uid: 'nope', gx: 3, gy: 4 })).toBe(withShelf);
  });

  it('돌리기: 자리가 있으면 되고, 돌린 모양이 방 밖·겹침이면 안 된다', () => {
    expect(apply(withShelf, { type: 'rotate', uid: 's' }).placed.find((p) => p.uid === 's')?.rotation).toBe(1);
    const atEdge = apply(room, { type: 'place', item: { uid: 'e', furnitureId: 'forestBookshelf', gx: 3, gy: 5, rotation: 0 } });
    expect(apply(atEdge, { type: 'rotate', uid: 'e' })).toBe(atEdge); // 1×2 로 돌리면 바닥 아래로 나간다
    const nextToBed = apply(room, { type: 'place', item: { uid: 'n', furnitureId: 'forestBookshelf', gx: 2, gy: 1, rotation: 1 } }); // 1×2
    expect(apply(nextToBed, { type: 'rotate', uid: 'n' }).placed.find((p) => p.uid === 'n')?.rotation).toBe(0);
    const blocked = apply(nextToBed, { type: 'place', item: { uid: 'c', furnitureId: 'toyChest', gx: 3, gy: 1, rotation: 0 } });
    expect(apply(blocked, { type: 'rotate', uid: 'n' })).toBe(blocked); // 2×1 로 돌리면 상자와 겹친다
  });

  it('치우기: 있는 것만', () => {
    expect(apply(withShelf, { type: 'remove', uid: 's' }).placed).toHaveLength(1);
    expect(apply(withShelf, { type: 'remove', uid: 'nope' })).toBe(withShelf);
  });
});

describe('벽 장식', () => {
  it('걸 수 있고, 창문(오른쪽 벽 3~4번째 칸)의 가운데 높이에는 걸 수 없다', () => {
    expect(apply(room, { type: 'placeWall', item: { uid: 'f', furnitureId: 'leafFrame', wall: 'left', slot: 2 } }).wallItems).toHaveLength(1);
    expect(apply(room, { type: 'placeWall', item: { uid: 'f', furnitureId: 'leafFrame', wall: 'right', slot: 2 } })).toBe(room);
    expect(apply(room, { type: 'placeWall', item: { uid: 'f', furnitureId: 'leafFrame', wall: 'right', slot: 3 } })).toBe(room);
  });

  it('가랜드(위쪽)는 창문 위에 걸 수 있다', () => {
    expect(apply(room, { type: 'placeWall', item: { uid: 'g', furnitureId: 'acornGarland', wall: 'right', slot: 2 } }).wallItems).toHaveLength(1);
  });

  it('같은 벽·같은 높이에서는 겹치지 않고, 높이가 다르면 겹쳐도 된다', () => {
    const one = apply(room, { type: 'placeWall', item: { uid: 'f1', furnitureId: 'leafFrame', wall: 'left', slot: 2 } });
    expect(apply(one, { type: 'placeWall', item: { uid: 'f2', furnitureId: 'leafFrame', wall: 'left', slot: 2 } })).toBe(one);
    expect(apply(one, { type: 'placeWall', item: { uid: 'f2', furnitureId: 'leafFrame', wall: 'right', slot: 2 - 2 } }).wallItems).toHaveLength(2); // 다른 벽
    expect(apply(one, { type: 'placeWall', item: { uid: 'g', furnitureId: 'acornGarland', wall: 'left', slot: 1 } }).wallItems).toHaveLength(2); // 다른 높이
  });

  it('벽 밖, 가진 개수 초과, 바닥 가구는 걸 수 없다', () => {
    expect(apply(room, { type: 'placeWall', item: { uid: 'g', furnitureId: 'acornGarland', wall: 'left', slot: 5 } })).toBe(room); // 2칸짜리
    expect(apply(room, { type: 'placeWall', item: { uid: 's', furnitureId: 'starryFrame', wall: 'left', slot: 0 } }, { starryFrame: 0 })).toBe(room);
    expect(apply(room, { type: 'placeWall', item: { uid: 'c', furnitureId: 'toyChest', wall: 'left', slot: 0 } })).toBe(room);
  });

  it('옮기기: 창문·겹침·벽 밖이면 안 된다', () => {
    let s = apply(room, { type: 'placeWall', item: { uid: 'f1', furnitureId: 'leafFrame', wall: 'left', slot: 0 } });
    s = apply(s, { type: 'placeWall', item: { uid: 'f2', furnitureId: 'leafFrame', wall: 'left', slot: 3 } });
    expect(apply(s, { type: 'moveWall', uid: 'f1', wall: 'right', slot: 3 })).toBe(s);
    expect(apply(s, { type: 'moveWall', uid: 'f1', wall: 'left', slot: 3 })).toBe(s);
    expect(apply(s, { type: 'moveWall', uid: 'f1', wall: 'left', slot: 6 })).toBe(s);
    expect(apply(s, { type: 'moveWall', uid: 'f1', wall: 'right', slot: 5 }).wallItems.find((w) => w.uid === 'f1')).toMatchObject({ wall: 'right', slot: 5 });
  });
});

describe('가구 색', () => {
  it('바닥 가구의 색을 바꾸고, 원래 색으로 돌리면 기록을 지운다', () => {
    const uid = room.placed[0].uid;
    const blue = apply(room, { type: 'tint', uid, tint: 2 });
    expect(blue.placed[0].tint).toBe(2);
    expect(blue.placed.slice(1)).toEqual(room.placed.slice(1));
    expect(apply(blue, { type: 'tint', uid, tint: 2 })).toBe(blue); // 같은 색이면 그대로
    expect(apply(blue, { type: 'tint', uid, tint: 0 }).placed[0]).not.toHaveProperty('tint');
    expect(apply(room, { type: 'tint', uid: 'nobody', tint: 1 })).toBe(room);
    expect(apply(room, { type: 'tint', uid, tint: 5 as 1 })).toBe(room);
  });
});

describe('벽지와 초기화', () => {
  it('가진 벽지만 붙일 수 있고, 떼는 것은 언제나 된다', () => {
    const on = apply(room, { type: 'setWallpaper', wallpaperId: 'woodlandWallpaper' });
    expect(on.wallpaperId).toBe('woodlandWallpaper');
    expect(apply(on, { type: 'setWallpaper', wallpaperId: null }).wallpaperId).toBeNull();
    expect(apply(room, { type: 'setWallpaper', wallpaperId: 'woodlandWallpaper' }, {})).toBe(room);
    expect(apply(room, { type: 'setWallpaper', wallpaperId: 'leafBed' })).toBe(room);
  });

  it('초기화는 처음 방으로', () => {
    expect(apply(room, { type: 'reset' })).toBe(DEFAULT_LAYOUT);
  });
});
