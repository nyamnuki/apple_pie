import { Plus } from '../../../components/icons';
import BigButton from '../../../components/BigButton';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene, MeasureThing } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'measure' }>;

const CELL = 40; // 블록 한 칸 (그림 좌표)
const L = { stroke: '#6B5444', strokeOpacity: 0.6, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// 재는 물건: 정확히 length 칸 너비로 그린다 (왼쪽 끝 0, 오른쪽 끝 length×CELL)
function Thing({ thing, length }: { thing: MeasureThing; length: number }) {
  const w = length * CELL;
  switch (thing) {
    case 'twig':
      return (
        <g>
          <path d={`M2 22 C${w * 0.3} 18 ${w * 0.6} 26 ${w - 2} 20`} fill="none" stroke="#8C6B52" strokeWidth="9" strokeLinecap="round" />
          <path d={`M${w * 0.35} 20 l8 -12 M${w * 0.7} 22 l6 10`} stroke="#8C6B52" strokeWidth="4" strokeLinecap="round" />
          <path d={`M${w * 0.35 + 8} 8 c6 -6 14 -4 14 0 c-4 4 -10 4 -14 0 z`} fill="#A8C3A0" {...L} strokeWidth={1.4} />
        </g>
      );
    case 'ribbon':
      return (
        <g>
          <path d={`M0 12 L${w} 12 L${w - 8} 21 L${w} 30 L0 30 L8 21 Z`} fill="#F3C6D2" {...L} />
          <path d={`M10 21 L${w - 10} 21`} stroke="#E79BB0" strokeWidth="2" strokeDasharray="6 6" />
        </g>
      );
    case 'caterpillar': {
      const n = Math.max(3, Math.round(w / 22));
      const r = w / n / 2;
      return (
        <g>
          {range(n).map((i) => (
            <circle key={i} cx={r + i * r * 2} cy={22} r={r + 1} fill={i === n - 1 ? '#B9D1AD' : '#A8C3A0'} {...L} />
          ))}
          <circle cx={w - r * 0.7} cy={19} r="2.6" fill="#59483C" />
          <path d={`M${w - r} ${22 - r} l-3 -7 M${w - r * 0.4} ${22 - r} l2 -7`} stroke="#6B5444" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    }
  }
}

function Block({ x, n }: { x: number; n?: string }) {
  return (
    <g className="animate-settle">
      <rect x={x + 2} y={50} width={CELL - 4} height={CELL - 6} rx="6" fill="#F5D0AD" {...L} />
      <path d={`M${x + 8} 56 h${CELL - 22}`} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      {n && (
        <text x={x + CELL / 2} y={74} textAnchor="middle" fontSize="16" fontWeight="700" fill="#59483C">
          {n}
        </text>
      )}
    </g>
  );
}

// 길이 재기: 버튼을 누를 때마다 물건 아래에 블록이 왼쪽부터 빈틈없이 하나씩 놓인다.
// 예상하기(static)에서는 답이 보이지 않게 블록 한 개만 '이만큼이 1' 로 보여준다.
export default function MeasureField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const order = range(scene.length);
  const { picked, pick } = useSequence({ steps: scene.length, mode, demoOrder: order, onDone });
  const w = scene.length * CELL;
  const placed = picked.length;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg viewBox={`-6 0 ${w + 12} 92`} className="w-full overflow-visible" style={{ maxWidth: w * 1.25 }} role="img" aria-label={t('math.a11y.counter', { n: formatNumber(placed) })}>
        <g filter="url(#wc-small)">
          <Thing thing={scene.thing} length={scene.length} />
        </g>
        {/* 시작과 끝을 알려 주는 짧은 점선 */}
        <path d={`M0 4 V88 M${w} 4 V88`} stroke="#946539" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="4 5" />
        {mode === 'static' ? <Block x={0} n={formatNumber(1)} /> : order.slice(0, placed).map((i) => <Block key={i} x={i * CELL} n={formatNumber(i + 1)} />)}
      </svg>
      {mode === 'interactive' && placed < scene.length && (
        <BigButton variant="sage" onClick={() => pick(placed)} aria-label={t('math.a11y.addBlock')}>
          <Plus size={26} strokeWidth={3} aria-hidden />
          <svg viewBox="0 0 40 34" width="34" height="30" aria-hidden="true">
            <rect x="2" y="2" width="36" height="30" rx="6" fill="#F5D0AD" stroke="#6B5444" strokeOpacity="0.6" strokeWidth="2" />
          </svg>
        </BigButton>
      )}
      {mode !== 'static' && <CountBubble value={placed} />}
    </div>
  );
}
