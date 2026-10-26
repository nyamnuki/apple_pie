import type { CharacterId } from '../characters/characters';
import type { RegionId } from '../../types/resources';

// 안내하는 친구: 도토리 마을·햇살 들판은 루루, 달빛 숲·바람 언덕은 모모, 수정 동굴·무지개 호수는 도토
export const GUIDE_OF: Record<RegionId, CharacterId> = { acornVillage: 'lulu', moonlightForest: 'momo', crystalCave: 'doto', sunnyMeadow: 'lulu', windyHill: 'momo', rainbowLake: 'doto' };
