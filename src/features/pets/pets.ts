import { GRID } from '../room/iso';
import { canPlace } from '../room/placement';
import type { TranslationKey } from '../../i18n';
import type { RoomLayout } from '../../types/furniture';

// ===== 반려 친구 =====
// 스티커를 모으면 방에 친구가 하나씩 찾아온다 (저장할 것 없음: 모은 스티커 수로 정해진다).
export type PetId = 'duckling' | 'foxKit' | 'owlet';

export interface PetDef {
  id: PetId;
  nameKey: TranslationKey;
  stickers: number; // 이만큼 모으면 찾아온다
}

export const PETS: PetDef[] = [
  { id: 'duckling', nameKey: 'pets.duckling', stickers: 3 },
  { id: 'foxKit', nameKey: 'pets.foxKit', stickers: 9 },
  { id: 'owlet', nameKey: 'pets.owlet', stickers: 15 },
];

export const petsFor = (stickerCount: number) => PETS.filter((p) => stickerCount >= p.stickers);

// 스티커 수가 before → after 로 늘 때 새로 온 친구
export const newPet = (before: number, after: number) => PETS.find((p) => before < p.stickers && after >= p.stickers) ?? null;

// 다음 친구를 만나려면 스티커가 몇 장 더 필요한지 (다 만났으면 null)
export const nextPetGoal = (stickerCount: number) => PETS.find((p) => stickerCount < p.stickers) ?? null;

export type Spot = { gx: number; gy: number };

// 친구가 설 수 있는 칸: 방 안, 가구가 없는 곳 (러그 위는 괜찮다), 다른 친구가 없는 곳
export function isFree(layout: RoomLayout, spot: Spot, others: Spot[]): boolean {
  if (spot.gx < 0 || spot.gy < 0 || spot.gx >= GRID || spot.gy >= GRID) return false;
  if (others.some((o) => o.gx === spot.gx && o.gy === spot.gy)) return false;
  // 1칸짜리 바닥 가구(화분)를 놓을 수 있는 칸 = 비어 있거나 러그만 있는 칸
  return canPlace(layout.placed, 'flowerPot', 0, spot.gx, spot.gy);
}

// 처음 자리: 앞쪽(아래)부터 빈 칸을 찾는다
export function startSpots(layout: RoomLayout, count: number): Spot[] {
  const spots: Spot[] = [];
  for (let gy = GRID - 1; gy >= 0 && spots.length < count; gy--)
    for (let gx = GRID - 1; gx >= 0 && spots.length < count; gx--) if (isFree(layout, { gx, gy }, spots)) spots.push({ gx, gy });
  return spots;
}

// 한 걸음: 위·아래·옆 중 비어 있는 칸으로 (갈 데가 없으면 그대로). rand: 0~1
export function step(layout: RoomLayout, from: Spot, others: Spot[], rand: number): Spot {
  const moves = [
    { gx: from.gx + 1, gy: from.gy },
    { gx: from.gx - 1, gy: from.gy },
    { gx: from.gx, gy: from.gy + 1 },
    { gx: from.gx, gy: from.gy - 1 },
  ].filter((s) => isFree(layout, s, others));
  if (moves.length === 0) return from;
  return moves[Math.floor(rand * moves.length) % moves.length];
}
