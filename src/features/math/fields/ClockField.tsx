import BigButton from '../../../components/BigButton';
import { RotateCw } from '../../../components/icons';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'clock' }>;

// 바늘 각도 (12 시 방향이 0도, 시계 방향)
const hourAngle = (h: number, minutes: number) => ((h % 12) + minutes / 60) * 30;
const minuteAngle = (minutes: number) => minutes * 6;

// 시계 읽기: 정각(half=false)은 짧은바늘을 한 칸씩, 30분은 긴바늘을 5분씩 돌려 본다.
// 살펴보기·예상하기·해 보기(처음)는 정답 시각 그대로 보여주고, 만져 보기·시범은 12 시에서 출발한다.
export default function ClockField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const steps = scene.half ? 6 : scene.hour % 12 || 12;
  const { picked, pick } = useSequence({ steps, mode, demoOrder: range(steps), onDone });
  const moving = mode === 'interactive' || mode === 'demo';
  const k = picked.length;
  // 지금 바늘 위치
  const minutes = scene.half ? (moving ? k * 5 : 30) : 0;
  const hour = scene.half ? scene.hour : moving ? k : scene.hour;
  const hA = hourAngle(hour, minutes);
  const mA = minuteAngle(minutes);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 200" width="220" height="220" className="max-w-full" role="img" aria-label={t('math.a11y.clock')}>
        <g filter="url(#wc-small)">
          <circle cx="100" cy="100" r="92" fill="#B9855A" stroke="#6B5444" strokeOpacity="0.6" strokeWidth="3" />
          <circle cx="100" cy="100" r="80" fill="#FFF8EA" />
          <circle cx="100" cy="100" r="80" fill="url(#wc-ball)" />
        </g>
        {/* 눈금과 숫자 */}
        {range(60).map((i) => {
          const a = (i * 6 * Math.PI) / 180;
          const big = i % 5 === 0;
          return <line key={i} x1={100 + Math.sin(a) * (big ? 70 : 74)} y1={100 - Math.cos(a) * (big ? 70 : 74)} x2={100 + Math.sin(a) * 78} y2={100 - Math.cos(a) * 78} stroke="#6B5444" strokeOpacity={big ? 0.8 : 0.35} strokeWidth={big ? 3 : 1.5} strokeLinecap="round" />;
        })}
        {range(12).map((i) => {
          const n = i + 1;
          const a = (n * 30 * Math.PI) / 180;
          return (
            <text key={n} x={100 + Math.sin(a) * 56} y={100 - Math.cos(a) * 56 + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#59483C">
              {formatNumber(n)}
            </text>
          );
        })}
        {/* 긴바늘 (분): 길고 가늘게 / 짧은바늘 (시): 짧고 굵게 — 모양으로 구분 */}
        <g style={{ transform: `rotate(${mA}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s ease-out' }}>
          <path d="M100 104 L100 34" stroke="#946539" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g style={{ transform: `rotate(${hA}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s ease-out' }}>
          <path d="M100 106 L100 58" stroke="#59483C" strokeWidth="9" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="7" fill="#F5D0AD" stroke="#6B5444" strokeWidth="2" />
      </svg>
      {mode === 'interactive' && k < steps && (
        <BigButton variant="sage" onClick={() => pick(k)} aria-label={t(scene.half ? 'math.a11y.turnMinute' : 'math.a11y.turnHour')}>
          <RotateCw size={30} aria-hidden />
        </BigButton>
      )}
    </div>
  );
}
