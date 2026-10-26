import { describe, expect, it } from 'vitest';
import { quizChoices, roomQuiz } from './roomQuiz';
import { DEFAULT_LAYOUT } from './roomState';
import type { RoomLayout } from '../../types/furniture';

// 방 속 수학: 방에 실제로 있는 물건을 센다
const room: RoomLayout = {
  ...DEFAULT_LAYOUT,
  placed: [
    ...DEFAULT_LAYOUT.placed, // 침대, 버섯 조명, 러그, 화분
    { uid: 'lan', furnitureId: 'moonLantern', gx: 5, gy: 5, rotation: 0 },
    { uid: 'st', furnitureId: 'mushroomStool', gx: 4, gy: 5, rotation: 0 },
  ],
  wallItems: [{ uid: 'fr', furnitureId: 'leafFrame', wall: 'left', slot: 2 }],
};

describe('roomQuiz', () => {
  it('종류마다 방의 물건을 정확히 센다', () => {
    const byKind = Object.fromEntries([0, 1, 2, 3, 4].map((n) => roomQuiz(room, n)!).map((q) => [q.kind, q.answer]));
    // 바닥: 러그 빼고 침대·조명·화분·등불·의자 = 5, 불빛 2, 벽 1, 앉고 눕는 곳(침대·의자) 2, 모두 7
    expect(byKind).toEqual({ floor: 5, lights: 2, wall: 1, seats: 2, all: 7 });
  });

  it('정답은 선택지에 한 번, 선택지는 1 이상 연속 4 개', () => {
    for (let a = 1; a <= 20; a++) {
      const c = quizChoices(a);
      expect(c.filter((x) => x === a)).toHaveLength(1);
      expect(Math.min(...c)).toBeGreaterThanOrEqual(1);
      expect(c).toEqual([c[0], c[0] + 1, c[0] + 2, c[0] + 3]);
    }
  });

  it('셀 것이 없는 종류는 건너뛰고, 빈 방이면 질문이 없다', () => {
    const noWall = { ...room, wallItems: [] };
    expect(roomQuiz(noWall, 2)!.kind).not.toBe('wall');
    expect(roomQuiz({ placed: [], wallItems: [], wallpaperId: null }, 0)).toBeNull();
  });
});
