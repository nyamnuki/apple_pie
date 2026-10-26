import { VIEW_H, VIEW_W } from '../room/iso';

// ===== 방 사진 =====
// 화면의 방 그림(배경 SVG + 가구 SVG)을 한 장의 그림 파일(PNG)로 만들어 기기에 내려받는다.
// 수채화 효과(필터)도 함께 넣어 화면과 같은 모습으로 저장한다. 어디에도 올리지 않는다.

const SCALE = 2; // 사진 크기 배율 (760×640 → 1520×1280)
const PAD = 40; // 사진 둘레 여백 (방 좌표)

export async function saveRoomPhoto(roomEl: HTMLElement, fileName: string): Promise<boolean> {
  const svgs = [...roomEl.querySelectorAll<SVGSVGElement>(':scope > svg')];
  // 앱 전체의 수채화 필터·빛 그라데이션 정의
  const defs = document.querySelector('svg defs filter#wc-room')?.parentElement?.outerHTML ?? '';
  if (svgs.length === 0) return false;
  const W = VIEW_W + PAD * 2;
  const H = VIEW_H + PAD * 2;
  const layers = svgs.map((s) => `<g transform="translate(${PAD} ${PAD})">${s.innerHTML}</g>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}">${defs}<rect width="${W}" height="${H}" fill="#FFF5DF"/>${layers}</svg>`;

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
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    return true;
  } catch {
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}
