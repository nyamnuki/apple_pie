import { FURNITURE, getFurniture } from '../../data/furniture/furniture';
import { RESOURCES } from '../../data/resources/resources';
import { LESSONS } from '../../data/math/lessons';
import { createInitialGameState, type GameState } from '../../app/gameState';
import { DEFAULT_LAYOUT } from '../../features/room/RoomProvider';
import { canPlace, canPlaceWall } from '../../features/room/placement';
import type { PlacedFurniture, RoomLayout, WallItem } from '../../types/furniture';
import type { ResourceBundle } from '../../types/resources';
import type { LessonId } from '../../types/math';

// ===== 저장 데이터 검사 =====
// 저장본의 일부가 이상해도(없는 가구, 음수, 방 밖 위치 등) 그 부분만 버리고 나머지는 살린다.

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
// 0 이상 정수만 개수로 인정
const toCount = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 99999 ? v : 0);

export function sanitizeGame(raw: unknown): GameState {
  const base = createInitialGameState();
  if (!isObject(raw)) return base;

  const rawResources = isObject(raw.resources) ? raw.resources : {};
  const resources: ResourceBundle = {};
  for (const r of RESOURCES) {
    const n = toCount(rawResources[r.id]);
    if (n > 0) resources[r.id] = n;
  }

  const rawFurniture = isObject(raw.furniture) ? raw.furniture : {};
  const furniture: Record<string, number> = {};
  for (const f of FURNITURE) {
    // 처음부터 가진 가구는 최소 1개
    const n = Math.max(toCount(rawFurniture[f.id]), base.furniture[f.id] ?? 0);
    if (n > 0) furniture[f.id] = n;
  }

  const knownLessons = new Set<string>(LESSONS.map((l) => l.id));
  const completedLessons = Array.isArray(raw.completedLessons)
    ? [...new Set(raw.completedLessons.filter((id): id is LessonId => typeof id === 'string' && knownLessons.has(id)))]
    : [];

  return { resources, furniture, completedLessons };
}

export function sanitizeRoom(raw: unknown, game: GameState): RoomLayout {
  const source = isObject(raw) && Array.isArray(raw.placed) ? raw : DEFAULT_LAYOUT;
  const placed: PlacedFurniture[] = [];
  const usedUids = new Set<string>();

  for (const item of source.placed as unknown[]) {
    if (!isObject(item)) continue;
    const { uid, furnitureId, gx, gy, rotation } = item;
    if (typeof uid !== 'string' || usedUids.has(uid) || typeof furnitureId !== 'string') continue;
    if (!Number.isInteger(gx) || !Number.isInteger(gy) || (rotation !== 0 && rotation !== 1)) continue;
    const def = getFurniture(furnitureId);
    if (!def || def.category === 'wallpaper') continue;
    // 가진 개수보다 많이 놓을 수 없다
    if (placed.filter((p) => p.furnitureId === furnitureId).length >= (game.furniture[furnitureId] ?? 0)) continue;
    // 방 밖이거나 다른 가구와 겹치면 뺀다
    if (!canPlace(placed, furnitureId, rotation, gx as number, gy as number)) continue;
    placed.push({ uid, furnitureId, gx: gx as number, gy: gy as number, rotation });
    usedUids.add(uid);
  }

  // 벽 장식: 벽 이름·칸이 맞고, 가진 수 안에서, 겹치지 않는 것만
  const wallItems: WallItem[] = [];
  const rawWall = isObject(raw) && Array.isArray(raw.wallItems) ? (raw.wallItems as unknown[]) : [];
  for (const item of rawWall) {
    if (!isObject(item)) continue;
    const { uid, furnitureId, wall, slot } = item;
    if (typeof uid !== 'string' || usedUids.has(uid) || typeof furnitureId !== 'string') continue;
    if ((wall !== 'left' && wall !== 'right') || !Number.isInteger(slot)) continue;
    if (wallItems.filter((w) => w.furnitureId === furnitureId).length >= (game.furniture[furnitureId] ?? 0)) continue;
    if (!canPlaceWall(wallItems, furnitureId, wall, slot as number)) continue;
    wallItems.push({ uid, furnitureId, wall, slot: slot as number });
    usedUids.add(uid);
  }

  const wp = source.wallpaperId;
  const wallpaperId = typeof wp === 'string' && getFurniture(wp)?.category === 'wallpaper' && (game.furniture[wp] ?? 0) > 0 ? wp : null;
  return { placed, wallItems, wallpaperId };
}
