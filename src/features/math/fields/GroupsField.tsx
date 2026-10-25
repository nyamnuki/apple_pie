import ItemToken from './ItemToken';
import CountBubble from './CountBubble';
import AssetIcon from '../../../components/AssetIcon';
import { MATH_ITEMS } from '../../../data/math/items';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'groups' }>;

// 묶어 세기: 묶음을 누르면 묶음 크기만큼, 낱개를 누르면 1 씩 늘어난다.
// 배지에는 '누른 순간까지 센 수'가 붙는다 (2, 4, 6… 또는 10, 20, 21…).
// 순서: 0 ~ groups-1 은 묶음, 그 뒤는 낱개
export default function GroupsField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const order = range(scene.groups + scene.ones);
  const { picked, pick } = useSequence({ steps: order.length, mode, demoOrder: order, onDone });
  const valueOf = (i: number) => (i < scene.groups ? scene.size : 1);
  // 누른 순서대로 더한 수
  const runningTotal = (upTo: number) => picked.slice(0, upTo + 1).reduce((sum, i) => sum + valueOf(i), 0);
  const counted = picked.reduce((sum, i) => sum + valueOf(i), 0);
  const { emoji, assetPath } = MATH_ITEMS[scene.item];
  const ten = scene.size >= 10;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex max-w-md flex-wrap items-center justify-center gap-3">
        {range(scene.groups).map((g) => {
          const n = picked.indexOf(g);
          const body = (
            <>
              {/* 10묶음은 5개씩 두 줄 (10칸 틀), 2묶음은 나란히 */}
              <span className={`grid gap-0.5 ${ten ? 'grid-cols-5' : 'grid-cols-2'}`}>
                {range(scene.size).map((k) => (
                  <AssetIcon key={k} path={assetPath} emoji={emoji} size={ten ? 22 : 34} />
                ))}
              </span>
              {n >= 0 && (
                <span className="absolute -right-2 -top-2 flex h-7 min-w-7 animate-pop items-center justify-center rounded-full bg-wood px-1 text-base font-bold text-cream">
                  {formatNumber(runningTotal(n))}
                </span>
              )}
            </>
          );
          const frame = `relative flex min-h-14 min-w-14 items-center justify-center rounded-2xl border-4 p-1.5 ${n >= 0 ? 'border-wood/60 bg-apricot/50' : 'border-dashed border-oak/60 bg-cream/70'}`;
          return mode === 'interactive' && n < 0 ? (
            <button
              key={g}
              type="button"
              onClick={() => pick(g)}
              aria-label={t('math.a11y.countGroup', { n: formatNumber(scene.size) })}
              className={`${frame} shadow-pop-sm transition-transform active:scale-95`}
            >
              {body}
            </button>
          ) : (
            <span key={g} className={frame} aria-hidden="true">
              {body}
            </span>
          );
        })}
        {range(scene.ones).map((k) => {
          const i = scene.groups + k;
          const n = picked.indexOf(i);
          return (
            <ItemToken
              key={i}
              item={scene.item}
              badge={n >= 0 ? formatNumber(runningTotal(n)) : undefined}
              onClick={mode === 'interactive' && n < 0 ? () => pick(i) : undefined}
              label={t('math.a11y.countItem')}
            />
          );
        })}
      </div>
      {mode !== 'static' && <CountBubble value={counted} />}
    </div>
  );
}
