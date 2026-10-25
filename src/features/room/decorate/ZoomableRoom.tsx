import { useLayoutEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import BigButton from '../../../components/BigButton';
import { useI18n } from '../../../i18n';
import { GRID, VIEW_H, VIEW_W, toScreen } from '../iso';

const SCALE = 1.7; // 크게 볼 때 배율
const FLOOR_CENTER = toScreen(GRID / 2, GRID / 2);

// 꾸미기 화면의 방: 돋보기 버튼(또는 두 손가락 벌리기)으로 크게 보고, 한 손가락으로 밀어 둘러본다.
// 작은 휴대폰에서 바닥 칸이 작아 누르기 어려운 문제를 덜어 준다. 배치 규칙·누르기 동작은 그대로다.
export default function ZoomableRoom({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { t } = useI18n();
  const [zoomed, setZoomed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const pinch = useRef<number | null>(null);

  // 크게 보면 바닥 가운데가 화면 가운데에 오게 스크롤을 맞춘다.
  // 방 그림(760×640)은 칸 안에 비율을 지켜 가운데 놓이므로, 그 크기와 위치로 바닥 가운데(380, 420)를 계산한다.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (!zoomed) {
      el.scrollTo({ left: 0, top: 0 });
      return;
    }
    const W = el.scrollWidth;
    const H = el.scrollHeight;
    const s = Math.min(W / VIEW_W, H / VIEW_H);
    const x = (W - VIEW_W * s) / 2 + FLOOR_CENTER.x * s;
    const y = (H - VIEW_H * s) / 2 + FLOOR_CENTER.y * s;
    el.scrollTo({ left: x - el.clientWidth / 2, top: y - el.clientHeight / 2 });
  }, [zoomed]);

  // 두 손가락: 벌리면 크게, 오므리면 원래대로
  const distance = (e: TouchEvent) => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  const onTouchStart = (e: TouchEvent) => {
    pinch.current = e.touches.length === 2 ? distance(e) : null;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (pinch.current === null || e.touches.length !== 2) return;
    const ratio = distance(e) / pinch.current;
    if (ratio > 1.25 && !zoomed) setZoomed(true);
    if (ratio < 0.8 && zoomed) setZoomed(false);
  };

  return (
    <div className={`relative ${className}`} data-zoomed={zoomed}>
      <div
        ref={scroller}
        className={`absolute inset-0 overscroll-contain rounded-3xl ${zoomed ? 'overflow-auto bg-cream/40' : 'overflow-hidden'}`}
        // 방 안에서는 두 손가락 확대를 우리가 처리한다 (밀어서 둘러보기는 그대로)
        style={{ touchAction: 'pan-x pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => (pinch.current = null)}
      >
        <div style={{ width: zoomed ? `${SCALE * 100}%` : '100%', height: zoomed ? `${SCALE * 100}%` : '100%' }}>
          {children}
        </div>
      </div>
      <BigButton
        variant="soft"
        size="icon"
        className="absolute bottom-2 right-2"
        aria-pressed={zoomed}
        aria-label={t(zoomed ? 'decorate.zoomOut' : 'decorate.zoomIn')}
        onClick={() => setZoomed((z) => !z)}
      >
        {zoomed ? <ZoomOut size={28} aria-hidden /> : <ZoomIn size={28} aria-hidden />}
      </BigButton>
    </div>
  );
}
