import BigButton from '../../../components/BigButton';
import CountBubble from './CountBubble';
import { ITEM_ART } from '../../../components/art/itemArt';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'hops' }>;

const GAP = 44; // 눈금 사이 (그림 좌표)
const Frog = ITEM_ART['items/frog.png'];

// 수직선 뛰기: 시작 수에 개구리가 있고, 뛰기 버튼을 누를 때마다 한 칸 뛴다 (오른쪽 = 더하기, 왼쪽 = 빼기).
// 좁은 화면에 맞게 수직선은 시작과 끝 둘레만 보여준다. 뛴 자리 위에는 1, 2, 3… 번호.
// 예상하기(static)에서는 개구리와 방향 화살표만 (답은 보이지 않게).
export default function HopsField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const steps = Math.abs(scene.hop);
  const dir = Math.sign(scene.hop);
  const { picked, pick } = useSequence({ steps, mode, demoOrder: range(steps), onDone });
  const end = scene.start + scene.hop;
  const lo = Math.max(0, Math.min(scene.start, end) - 1);
  const hi = Math.min(20, Math.max(scene.start, end) + 1);
  const xOf = (n: number) => 20 + (n - lo) * GAP;
  const width = xOf(hi) + 20;
  const done = picked.length;
  const at = scene.start + dir * done;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg viewBox={`0 0 ${width} 110`} className="w-full overflow-visible" style={{ maxWidth: width * 1.1 }} role="img" aria-label={t('math.a11y.counter', { n: formatNumber(done) })}>
        {/* 수직선 */}
        <path d={`M8 80 H${width - 8}`} stroke="#6B5444" strokeWidth="3" strokeLinecap="round" />
        <path d={`M${width - 16} 74 l8 6 l-8 6`} fill="none" stroke="#6B5444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {range(hi - lo + 1).map((k) => {
          const n = lo + k;
          return (
            <g key={n}>
              <path d={`M${xOf(n)} 72 V88`} stroke="#6B5444" strokeWidth="2.4" />
              <text x={xOf(n)} y="106" textAnchor="middle" fontSize="17" fontWeight={n === scene.start ? 800 : 600} fill={n === scene.start ? '#946539' : '#59483C'}>
                {formatNumber(n)}
              </text>
            </g>
          );
        })}
        {/* 뛴 자국: 무지개다리 + 번호 */}
        {range(done).map((i) => {
          const a = xOf(scene.start + dir * i);
          const b = xOf(scene.start + dir * (i + 1));
          return (
            <g key={i} className="animate-settle">
              <path d={`M${a} 70 Q${(a + b) / 2} 30 ${b} 70`} fill="none" stroke="#7FA077" strokeWidth="3" strokeDasharray="5 4" />
              <text x={(a + b) / 2} y="40" textAnchor="middle" fontSize="15" fontWeight="700" fill="#946539">
                {formatNumber(i + 1)}
              </text>
            </g>
          );
        })}
        {/* 예상하기: 가는 방향 화살표 */}
        {mode === 'static' && (
          <path d={`M${xOf(scene.start)} 46 h${dir * 30}`} stroke="#946539" strokeWidth="3" strokeLinecap="round" markerEnd="url(#hop-arrow)" />
        )}
        <defs>
          <marker id="hop-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#946539" />
          </marker>
        </defs>
        {/* 개구리 (지금 자리) */}
        <g style={{ transform: `translate(${xOf(at) - 20}px, 34px)`, transition: 'transform 0.35s ease-out' }}>
          <svg width="40" height="40" viewBox="0 0 64 64" overflow="visible">
            <g filter="url(#wc-small)">
              <Frog />
            </g>
          </svg>
        </g>
      </svg>
      {mode === 'interactive' && done < steps && (
        <BigButton variant="sage" onClick={() => pick(done)} aria-label={t('math.a11y.hop')}>
          <svg viewBox="0 0 40 24" width="44" height="26" aria-hidden="true" style={{ transform: dir < 0 ? 'scaleX(-1)' : undefined }}>
            <path d="M4 20 Q20 -4 36 20" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M30 14 l6 6 l2 -8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BigButton>
      )}
      {mode !== 'static' && <CountBubble value={done} />}
    </div>
  );
}
