import { VIEW_H, VIEW_W } from '../room/iso';
import { downloadBlob } from '../../utils/download';

// ===== 방 사진 =====
// 화면의 방 그림(배경 SVG + 가구 SVG)을 한 장의 그림 파일(PNG)로 만들어 기기에 내려받는다.
// 수채화 효과(필터)도 함께 넣어 화면과 같은 모습으로 저장한다. 어디에도 올리지 않는다.
// 나무 액자에 넣고, 아래 종이 띠에 글(앱 이름과 날짜)을 적는다.

const SCALE = 2; // 사진 크기 배율
const PAD = 40; // 방 둘레 여백 (방 좌표)
const FRAME = 22; // 나무 액자 두께
const CAPTION = 64; // 아래 글 띠 높이

export async function saveRoomPhoto(roomEl: HTMLElement, fileName: string, caption = ''): Promise<boolean> {
  const svgs = [...roomEl.querySelectorAll<SVGSVGElement>(':scope > svg')];
  // 앱 전체의 수채화 필터·빛 그라데이션 정의
  const defs = document.querySelector('svg defs filter#wc-room')?.parentElement?.outerHTML ?? '';
  if (svgs.length === 0) return false;
  const W = VIEW_W + PAD * 2 + FRAME * 2;
  const H = VIEW_H + PAD * 2 + FRAME * 2 + CAPTION;
  const layers = svgs.map((s) => `<g transform="translate(${PAD + FRAME} ${PAD + FRAME})">${s.innerHTML}</g>`).join('');
  // 나무 액자: 바깥 나무색, 안쪽 가장자리에 옅은 그늘, 네 모서리에 작은 잎
  const leaf = (x: number, y: number, r: number) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C6 -10 18 -10 22 0 C18 8 6 8 0 0 Z" fill="#A8C3A0" stroke="#6B5444" stroke-width="1.5"/>`;
  const frame = `<rect x="${FRAME / 2}" y="${FRAME / 2}" width="${W - FRAME}" height="${H - FRAME}" rx="18" fill="none" stroke="#B9855A" stroke-width="${FRAME}"/>
    <rect x="${FRAME / 2}" y="${FRAME / 2}" width="${W - FRAME}" height="${H - FRAME}" rx="18" fill="none" stroke="#6B5444" stroke-opacity="0.35" stroke-width="2"/>
    <rect x="${FRAME}" y="${FRAME}" width="${W - FRAME * 2}" height="${H - FRAME * 2}" rx="8" fill="none" stroke="#59483C" stroke-opacity="0.12" stroke-width="6"/>
    <path d="M${FRAME + 30} ${H - FRAME - CAPTION + 8} H${W - FRAME - 30}" stroke="#B9855A" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="6 8"/>
    ${leaf(6, 14, -20)}${leaf(W - 28, 10, 20)}${leaf(8, H - 8, -60)}${leaf(W - 24, H - 22, 40)}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}">${defs}<rect width="${W}" height="${H}" fill="#FFF5DF"/>${layers}${frame}</svg>`;

  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('svg load'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0);
    // 아래 띠의 글: 그림(SVG) 안에서는 앱 글꼴을 쓸 수 없어서 캔버스에 직접 쓴다 (앱에서 불러온 글꼴 그대로)
    if (caption) {
      await document.fonts?.ready;
      ctx.fillStyle = '#59483C';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${30 * SCALE}px Fredoka, Jua, system-ui, sans-serif`;
      ctx.fillText(caption, (W / 2) * SCALE, (H - FRAME - CAPTION / 2 + 4) * SCALE, (W - FRAME * 2 - 40) * SCALE);
    }
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;
    downloadBlob(blob, fileName);
    return true;
  } catch {
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}
