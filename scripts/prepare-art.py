# 그림 생성기(그록 등)로 만든 그림을 게임에 넣을 수 있는 파일로 바꾼다.
#
# 하는 일:
#   1. 흰 바탕 지우기: 그림 가장자리에서 이어진 하얀 부분만 투명하게 (그림 안의 흰 빛 자국은 남는다)
#   2. 가장자리를 부드럽게 (계단처럼 보이지 않게)
#   3. 남은 그림에 맞게 자르고, 정사각형(또는 정한 비율) 가운데에 여백을 두고 놓기
#   4. 정한 크기로 줄여 WebP 로 저장 (public/assets/<폴더>/<이름>.webp)
#
# 쓰는 법:
#   python3 scripts/prepare-art.py <받은 그림> <폴더/이름> [--size 256] [--ratio 1:1] [--margin 0.06] [--keep-bg]
# 예:
#   python3 scripts/prepare-art.py ~/Downloads/grok-apple.png items/apple
#   python3 scripts/prepare-art.py ~/Downloads/lulu.png characters/lulu-default --size 480 --ratio 4:5
#
# 그림 생성기에 '순수한 흰 바탕(pure white background)'으로 그려 달라고 해야 바탕이 깨끗이 지워진다.
# 바탕이 이미 투명한 PNG 면 1 단계는 건너뛴다. --keep-bg 를 주면 바탕을 지우지 않는다 (방 배경 등).
# 필요한 것: pip install pillow numpy
import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'assets'


def remove_white_background(img: Image.Image, soft: int = 48, clear: int = 10) -> Image.Image:
    # 바탕(그림 테두리의 색, 흰색이나 옅은 크림색)을 지운다.
    # 1) 테두리에서 이어진 '바탕에 가까운 색' 영역을 찾는다 (그림 안의 흰 빛 자국은 테두리와 이어지지 않아 남는다)
    # 2) 그 영역에서 바탕과 거의 같은 곳은 투명하게,
    #    바탕보다 조금 어두운 곳(바닥 그림자, 노란 빛 번짐)은 반투명으로 (흰 종이 위 물감처럼: 흰색 기준 color-to-alpha)
    #    (진주·구름처럼 하얀 물건은 테두리 선이 막아 주므로 이 영역에 들어오지 않는다)
    import numpy as np

    img = img.convert('RGB')
    a = np.asarray(img).astype(np.float32)
    h, w, _ = a.shape
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(border, axis=0)
    delta = np.abs(a - bg).max(axis=2)
    # 테두리에서 이어진 영역: 바탕과 차이 soft 이하인 곳을 테두리에서부터 넓혀 간다 (한 칸씩 번지기, 더 안 넓어질 때까지)
    mask = delta <= soft
    region = np.zeros((h, w), bool)
    region[0, :] = mask[0, :] & (delta[0, :] <= clear)
    region[-1, :] = mask[-1, :] & (delta[-1, :] <= clear)
    region[:, 0] |= mask[:, 0] & (delta[:, 0] <= clear)
    region[:, -1] |= mask[:, -1] & (delta[:, -1] <= clear)
    while True:
        grown = region.copy()
        grown[1:, :] |= region[:-1, :]
        grown[:-1, :] |= region[1:, :]
        grown[:, 1:] |= region[:, :-1]
        grown[:, :-1] |= region[:, 1:]
        grown &= mask
        if (grown == region).all():
            break
        region = grown
    alpha = np.ones((h, w), np.float32)
    color = a.copy()
    soft_px = region
    # 흰색 기준으로 물감 농도: 어두운 만큼 진하게
    paint = ((255.0 - a).max(axis=2) / 255.0).clip(0, 1)
    # 바탕색 자체의 농도는 0 으로 보이도록 바탕 농도만큼 빼고 다시 늘린다
    bg_paint = float((255.0 - bg).max() / 255.0)
    k = np.clip((paint - bg_paint) / max(1e-3, 1 - bg_paint), 0, 1)
    alpha[soft_px] = k[soft_px]
    alpha[region & (delta <= clear)] = 0
    nz = soft_px & (alpha > 0.01)
    color[nz] = np.clip(255.0 + (a[nz] - 255.0) / alpha[nz, None].clip(0.05, 1), 0, 255)
    out = np.dstack([color, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def fit(img: Image.Image, size: tuple[int, int], margin: float) -> Image.Image:
    box = img.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    if box:
        img = img.crop(box)
    tw, th = size
    inner_w, inner_h = tw * (1 - 2 * margin), th * (1 - 2 * margin)
    s = min(inner_w / img.width, inner_h / img.height)
    img = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)
    canvas = Image.new('RGBA', size, (0, 0, 0, 0))
    # 가운데, 아래쪽 여백은 위와 같게 (바닥 그림자 자리를 지킨다)
    canvas.paste(img, ((tw - img.width) // 2, (th - img.height) // 2), img)
    return canvas


def main() -> None:
    ap = argparse.ArgumentParser(description='그림 생성기 그림 → 게임 그림 (WebP)')
    ap.add_argument('src', type=Path)
    ap.add_argument('name', help='public/assets 아래 경로, 확장자 없이 (예: items/apple)')
    ap.add_argument('--size', type=int, default=256, help='긴 변 픽셀 (물건 256, 캐릭터 480)')
    ap.add_argument('--ratio', default='1:1', help='가로:세로 (캐릭터는 4:5 = 120×150)')
    ap.add_argument('--margin', type=float, default=0.06, help='둘레 여백 비율')
    ap.add_argument('--keep-bg', action='store_true', help='바탕을 지우지 않는다')
    args = ap.parse_args()

    rw, rh = (float(v) for v in args.ratio.split(':'))
    size = (args.size, round(args.size * rh / rw)) if rw >= rh else (round(args.size * rw / rh), args.size)
    img = Image.open(args.src)
    img.thumbnail((720, 720), Image.LANCZOS)  # 결과는 256~480px 이므로 먼저 줄여서 빠르게
    has_alpha = img.mode in ('RGBA', 'LA') and img.getchannel('A').getextrema()[0] < 250
    img = img.convert('RGBA') if (args.keep_bg or has_alpha) else remove_white_background(img)
    out = OUT / f'{args.name}.webp'
    out.parent.mkdir(parents=True, exist_ok=True)
    fit(img, size, 0 if args.keep_bg else args.margin).save(out, 'WEBP', quality=88, method=6)
    print(f'{out.relative_to(ROOT)}: {size[0]}×{size[1]}, {out.stat().st_size // 1024}KB')


if __name__ == '__main__':
    main()
