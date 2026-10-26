// ===== 루루 옷장 =====
// 스티커를 모으면 루루가 쓸 모자·두를 스카프가 하나씩 늘어난다 (스티커 36장 중 4·7·11·18·24·30장).
// 고른 옷은 저장되고, 루루가 나오는 모든 화면에서 입고 있다.

export type OutfitSlot = 'hat' | 'scarf';
export type OutfitId = 'acornCap' | 'berryScarf' | 'flowerCrown' | 'starScarf' | 'moonHat' | 'rainbowScarf';

export interface OutfitDef {
  id: OutfitId;
  slot: OutfitSlot;
  stickers: number; // 이만큼 모으면 열림
}

export const OUTFITS: readonly OutfitDef[] = [
  { id: 'acornCap', slot: 'hat', stickers: 4 },
  { id: 'berryScarf', slot: 'scarf', stickers: 7 },
  { id: 'flowerCrown', slot: 'hat', stickers: 11 },
  { id: 'starScarf', slot: 'scarf', stickers: 18 },
  { id: 'moonHat', slot: 'hat', stickers: 24 },
  { id: 'rainbowScarf', slot: 'scarf', stickers: 30 },
];

export interface Outfit {
  hat: OutfitId | null;
  scarf: OutfitId | null;
}

export const NO_OUTFIT: Outfit = { hat: null, scarf: null };

export const getOutfit = (id: unknown) => OUTFITS.find((o) => o.id === id);
export const isUnlocked = (def: OutfitDef, stickerCount: number) => stickerCount >= def.stickers;

// 그 자리에 입을 수 있는 옷인가 (없는 옷·다른 자리 옷·아직 안 열린 옷은 안 된다)
export function canWear(slot: OutfitSlot, id: unknown, stickerCount: number): id is OutfitId {
  const def = getOutfit(id);
  return Boolean(def && def.slot === slot && isUnlocked(def, stickerCount));
}

// 다음에 열릴 옷 (다 열렸으면 없음)
export const nextOutfit = (stickerCount: number) => OUTFITS.find((o) => !isUnlocked(o, stickerCount));
