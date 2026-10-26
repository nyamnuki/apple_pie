import { describe, expect, it } from 'vitest';
import { PETS, isFree, newPet, nextPetGoal, petsFor, startSpots, step } from './pets';
import { DEFAULT_LAYOUT } from '../room/roomState';
import { GRID } from '../room/iso';

// 반려 친구: 스티커 수로 찾아오고, 가구가 없는 칸만 걸어 다닌다
describe('반려 친구', () => {
  it('스티커 3·9·15장에 한 명씩', () => {
    expect(petsFor(2)).toEqual([]);
    expect(petsFor(3).map((p) => p.id)).toEqual(['duckling']);
    expect(petsFor(18).map((p) => p.id)).toEqual(['duckling', 'foxKit', 'owlet']);
    expect(newPet(2, 3)?.id).toBe('duckling');
    expect(newPet(3, 4)).toBeNull();
    expect(nextPetGoal(4)?.id).toBe('foxKit');
    expect(nextPetGoal(15)).toBeNull();
  });

  it('처음 자리와 걸음은 언제나 방 안의 빈 칸 (침대·화분 위 아님, 러그 위는 괜찮음)', () => {
    let spots = startSpots(DEFAULT_LAYOUT, PETS.length);
    expect(spots).toHaveLength(3);
    for (let n = 0; n < 2000; n++) {
      const i = n % spots.length;
      const others = spots.filter((_, k) => k !== i);
      const next = step(DEFAULT_LAYOUT, spots[i], others, (n * 0.618) % 1);
      expect(isFree(DEFAULT_LAYOUT, next, others), JSON.stringify(next)).toBe(true);
      expect(Math.abs(next.gx - spots[i].gx) + Math.abs(next.gy - spots[i].gy)).toBeLessThanOrEqual(1);
      spots = spots.map((s, k) => (k === i ? next : s));
    }
    // 침대(0,0)~(1,2), 화분 (5,0) 은 비어 있지 않다. 러그(2,2) 위는 설 수 있다
    expect(isFree(DEFAULT_LAYOUT, { gx: 0, gy: 0 }, [])).toBe(false);
    expect(isFree(DEFAULT_LAYOUT, { gx: 5, gy: 0 }, [])).toBe(false);
    expect(isFree(DEFAULT_LAYOUT, { gx: 2, gy: 2 }, [])).toBe(true);
    expect(isFree(DEFAULT_LAYOUT, { gx: GRID, gy: 0 }, [])).toBe(false);
  });

  it('갈 데가 없으면 그 자리에 있는다', () => {
    const full = { ...DEFAULT_LAYOUT, placed: [] };
    const spot = { gx: 0, gy: 0 };
    expect(step(full, spot, [{ gx: 1, gy: 0 }, { gx: 0, gy: 1 }], 0.5)).toEqual(spot);
  });
});
