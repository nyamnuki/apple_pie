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
# 필요한 것: pip install pillow
import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'assets'


def remove_white_background(img: Image.Image, threshold: int = 236) -> Image.Image:
    # 가장자리에서 출발해 '거의 흰색'인 칸을 따라가며 투명하게 만든다 (가운데 흰 부분은 건드리지 않는다)
    img = img.convert('RGBA')
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    queue = deque()

    def whiteish(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return a < 16 or (r >= threshold and g >= threshold and b >= threshold)

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
    while queue:
        x, y = queue.popleft()
        i = y * w + x
        if seen[i] or not whiteish(x, y):
            continue
        seen[i] = 1
        if x > 0:
            queue.append((x - 1, y))
        if x < w - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < h - 1:
            queue.append((x, y + 1))

    mask = Image.new('L', (w, h), 255)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            if seen[y * w + x]:
                mp[x, y] = 0
    # 가장자리를 한 번 부드럽게 (흰 테두리 띠가 남지 않게 살짝 안으로 깎고 흐리게)
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    alpha = img.getchannel('A')
    img.putalpha(Image.composite(alpha, Image.new('L', (w, h), 0), mask))
    return img


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
    has_alpha = img.mode in ('RGBA', 'LA') and img.getchannel('A').getextrema()[0] < 250
    img = img.convert('RGBA') if (args.keep_bg or has_alpha) else remove_white_background(img)
    out = OUT / f'{args.name}.webp'
    out.parent.mkdir(parents=True, exist_ok=True)
    fit(img, size, 0 if args.keep_bg else args.margin).save(out, 'WEBP', quality=88, method=6)
    print(f'{out.relative_to(ROOT)}: {size[0]}×{size[1]}, {out.stat().st_size // 1024}KB')


if __name__ == '__main__':
    main()
