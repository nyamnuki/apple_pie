# 글꼴을 앱 안에 넣기 위해, 앱 글에 실제로 쓰는 글자만 남겨 작게 만든다.
#
# 왜: Google Fonts 에서 받으면 (1) 아이 기기의 주소가 Google 로 가고 (2) 인터넷 없이 쓸 때 처음 보는 한글이
# 기본 글꼴로 나오고 (3) 첫 화면에서 글꼴이 늦게 바뀐다. 한글 글꼴 원본은 하나에 7~8MB 라서
# 쓰는 글자만 남긴다 (모두 합쳐 수백 KB).
#
# 언제 다시 돌리나: 언어 파일(src/i18n/locales/*.ts)에 새 한글 글자가 들어가면.
#   테스트(src/i18n/fontGlyphs.test.ts)가 빠진 글자를 알려 준다.
#
# 쓰는 법:
#   pip install fonttools brotli
#   python3 scripts/subset-fonts.py <원본 글꼴 폴더>
# 원본 폴더에는 google/fonts 저장소(ofl/)에서 받은 아래 파일이 있어야 한다:
#   Fraunces[SOFT,WONK,opsz,wght].ttf, Nunito[wght].ttf,
#   GowunBatang-Bold.ttf, GowunDodum-Regular.ttf, 그리고 각 OFL.txt
import json
import re
import shutil
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
# 빌드가 이름에 지문을 붙여 dist/assets 로 내보내고, 인터넷 없이 쓰기 목록(sw.js)에도 자동으로 들어간다
OUT = ROOT / 'src' / 'assets' / 'fonts'
LOCALES = [ROOT / 'src' / 'i18n' / 'locales' / 'en.ts', ROOT / 'src' / 'i18n' / 'locales' / 'ko.ts']


def is_hangul(ch: str) -> bool:
    o = ord(ch)
    return 0xAC00 <= o <= 0xD7A3 or 0x3130 <= o <= 0x318F or 0x1100 <= o <= 0x11FF


STRING = re.compile(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"")


def app_text() -> str:
    # 언어 파일의 따옴표 안 글자만 (주석의 글자는 넣지 않는다)
    text = ''
    for path in LOCALES:
        src = re.sub(r'//[^\n]*', '', path.read_text(encoding='utf-8'))
        text += ''.join(a or b for a, b in STRING.findall(src))
    return text


def main(src_dir: Path) -> None:
    text = app_text()
    ascii_chars = ''.join(chr(c) for c in range(0x20, 0x7F))
    # 영문 글꼴: 기본 라틴 + 앱 글의 문장부호(…·—’ 등). 한글은 한글 글꼴이 그린다
    latin = sorted(set(ascii_chars + ''.join(ch for ch in text if not is_hangul(ch) and ord(ch) >= 0x20)))
    hangul = sorted({ch for ch in text if is_hangul(ch)})
    OUT.mkdir(parents=True, exist_ok=True)

    def save(font: TTFont, chars: list[str], name: str, axes: dict | None = None) -> None:
        # 글자를 먼저 줄이고 나서 축(굵기 등)을 고정한다 (거꾸로 하면 fontTools 가 지운 글자를 찾다가 멈춘다)
        opts = subset.Options()
        opts.flavor = 'woff2'
        opts.name_IDs = ['*']
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(text=''.join(chars))
        sub.subset(font)
        if axes:
            font = instancer.instantiateVariableFont(font, axes)
        font.flavor = 'woff2'
        font.save(OUT / name)
        print(f'{name}: {(OUT / name).stat().st_size // 1024}KB')

    # 제목: Fraunces (부드러운 모양 SOFT=100 으로 고정, 장난스러운 WONK 끔, 굵기 400~700)
    save(TTFont(src_dir / 'fraunces__Fraunces[SOFT,WONK,opsz,wght].ttf'), latin, 'fraunces.woff2', {'SOFT': 100, 'WONK': 0, 'wght': (400, 700)})
    # 본문: Nunito (굵기 400~800)
    save(TTFont(src_dir / 'nunito__Nunito[wght].ttf'), latin, 'nunito.woff2', {'wght': (400, 800)})
    # 한글: 고운바탕(제목·버튼은 모두 굵게 쓰므로 굵은 것만), 고운돋움(본문)
    save(TTFont(src_dir / 'gowunbatang__GowunBatang-Bold.ttf'), hangul, 'gowun-batang-700.woff2')
    save(TTFont(src_dir / 'gowundodum__GowunDodum-Regular.ttf'), hangul, 'gowun-dodum.woff2')

    for family in ['fraunces', 'nunito', 'gowunbatang', 'gowundodum']:
        shutil.copy(src_dir / f'{family}__OFL.txt', OUT / f'OFL-{family}.txt')
    # 테스트가 읽는 '넣은 글자' 목록
    (OUT / 'glyphs.json').write_text(json.dumps({'latin': ''.join(latin), 'hangul': ''.join(hangul)}, ensure_ascii=False), encoding='utf-8')
    print(f'latin {len(latin)}자, hangul {len(hangul)}자')


if __name__ == '__main__':
    main(Path(sys.argv[1]))
