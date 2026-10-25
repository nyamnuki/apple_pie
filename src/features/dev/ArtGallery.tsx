import Character from '../../components/characters/Character';
import AssetThumb from '../../components/AssetThumb';
import AssetIcon from '../../components/AssetIcon';
import RoomView from '../room/RoomView';
import { FURNITURE } from '../../data/furniture/furniture';
import { MATH_ITEMS } from '../../data/math/items';
import { RESOURCES } from '../../data/resources/resources';
import { CHARACTERS, EXPRESSIONS, type CharacterId } from '../../data/characters/characters';
import { DEFAULT_LAYOUT } from '../room/roomState';

// 그림 모아 보기 (주소 끝에 #gallery). 모든 그림이 같은 세계처럼 보이는지 한 화면에서 비교하는 용도.
// 아이에게는 보이지 않는다 (메뉴에서 갈 수 없음).
export default function ArtGallery() {
  const section = 'rounded-[2rem] bg-cream/80 p-4 shadow-pop-sm';
  return (
    <div className="paper fixed inset-0 overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
        <h1 className="text-3xl font-bold">Math Town · Art</h1>
        <section className={section}>
          <h2 className="mb-2 text-xl font-bold">Characters</h2>
          {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
            <div key={id} className="flex flex-wrap items-end gap-2">
              {EXPRESSIONS.map((e) => (
                <Character key={e} id={id} expression={e} size={110} />
              ))}
            </div>
          ))}
        </section>
        <section className={section}>
          <h2 className="mb-2 text-xl font-bold">Room</h2>
          <div className="h-[420px]">
            <RoomView layout={{ ...DEFAULT_LAYOUT, placed: [...DEFAULT_LAYOUT.placed, { uid: 'g1', furnitureId: 'forestBookshelf', gx: 4, gy: 3, rotation: 0 }, { uid: 'g2', furnitureId: 'toyChest', gx: 0, gy: 4, rotation: 0 }], wallItems: [{ uid: 'w1', furnitureId: 'leafFrame', wall: 'left', slot: 3 }, { uid: 'w2', furnitureId: 'acornGarland', wall: 'right', slot: 4 }] }} />
          </div>
        </section>
        <section className={section}>
          <h2 className="mb-2 text-xl font-bold">Furniture</h2>
          <div className="flex flex-wrap gap-2">
            {FURNITURE.map((f) => (
              <AssetThumb key={f.id} def={f} size={96} />
            ))}
          </div>
        </section>
        <section className={section}>
          <h2 className="mb-2 text-xl font-bold">Items & materials</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(MATH_ITEMS).map(([id, m]) => (
              <AssetIcon key={id} path={m.assetPath} emoji={m.emoji} size={64} />
            ))}
            {RESOURCES.map((r) => (
              <AssetIcon key={r.id} path={r.assetPath} emoji={r.placeholder.emoji} size={64} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
