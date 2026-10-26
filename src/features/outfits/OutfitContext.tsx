import { createContext, useContext } from 'react';
import { NO_OUTFIT, type Outfit } from './outfits';

// 루루가 지금 입은 옷. GameProvider 가 저장된 옷을 넣어 주고,
// 그 밖(오류 화면 등)에서는 아무것도 입지 않은 루루가 나온다.
export const OutfitContext = createContext<Outfit>(NO_OUTFIT);
export const useOutfit = () => useContext(OutfitContext);
