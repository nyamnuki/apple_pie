import ItemToken from './ItemToken';
import Character from '../../../components/characters/Character';
import { range, useSequence, type FieldMode } from './useSequence';
import { CHARACTERS, type CharacterId } from '../../../data/characters/characters';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'share' }>;

// 나눠 받는 두 친구
const FRIENDS: CharacterId[] = ['lulu', 'momo'];

// 똑같이 나누기: 위의 물건을 하나씩 누르면 두 친구 접시에 번갈아 하나씩 놓인다.
// 접시마다 받은 수를 크게 보여 줘서, 다 나누면 두 수가 같은 것을 볼 수 있다.
export default function ShareField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, tKey, formatNumber } = useI18n();
  const order = range(scene.total);
  const { picked, pick } = useSequence({ steps: scene.total, mode, demoOrder: order, onDone });
  const plates = FRIENDS.map((_, f) => picked.filter((_, k) => k % 2 === f));

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      {/* 나눌 물건 (나눠 준 자리는 점선으로 비워 둔다: 자리가 움직이지 않아 잘못 누르지 않게) */}
      <div className="flex flex-wrap justify-center gap-2">
        {order.map((i) =>
          picked.includes(i) ? (
            <span key={i} data-given className="h-12 w-12 rounded-2xl border-2 border-dashed border-bark/20" aria-hidden="true" />
          ) : (
            <ItemToken key={i} item={scene.item} compact onClick={mode === 'interactive' ? () => pick(i) : undefined} label={t('math.a11y.shareItem')} />
          ),
        )}
      </div>
      {/* 두 친구의 접시 */}
      <div className="grid w-full grid-cols-2 gap-3">
        {plates.map((list, f) => (
          <div
            key={FRIENDS[f]}
            role="group"
            data-plate={f}
            aria-label={t('math.a11y.plate', { name: tKey(CHARACTERS[FRIENDS[f]].nameKey), n: formatNumber(list.length) })}
            className="flex flex-col items-center gap-1 rounded-[2rem] bg-white/70 p-2 ring-4 ring-mist"
          >
            <Character id={FRIENDS[f]} expression={list.length > 0 ? 'happy' : 'default'} size={56} />
            <div className="flex min-h-[40px] flex-wrap justify-center gap-0.5">
              {list.map((i) => (
                <span key={i} className="animate-pop">
                  <ItemToken item={scene.item} size={26} compact />
                </span>
              ))}
            </div>
            <span aria-hidden="true" className="text-3xl font-bold tabular-nums">
              {formatNumber(list.length)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
