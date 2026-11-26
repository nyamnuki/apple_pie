# 그록(Grok)으로 그림 만들기 — 지시문 모음

[ASSET_SPEC_ITEMS.md](ASSET_SPEC_ITEMS.md)(1단계 43장 명세)와 [ART_BIBLE.md](ART_BIBLE.md)(화풍 규칙)를 그록에 넣을 **영어 지시문**으로 옮긴 것입니다.
그림 생성기는 영어 지시문을 더 정확히 따릅니다. 색·모양은 명세서와 같습니다.

## 순서

1. **시범 5장만 먼저** (아래 1절): 사과 → 빛나는 나뭇가지 → 보석 → 버섯 → 미스릴.
   - 사과가 마음에 들 때까지 다시 뽑고, **고른 사과 그림을 다음 그림부터 참고 그림으로 함께 올리세요** ("같은 화풍으로").
   - 그래야 43장이 한 사람이 그린 것처럼 맞춰집니다.
2. 그록에서 **정사각형(1:1)** 으로 뽑습니다. 캐릭터는 세로(4:5).
3. 받은 그림을 게임 파일로 바꿉니다 (흰 바탕 지우기 → 자르기 → 256×256 WebP):
   ```
   pip install pillow
   python3 scripts/prepare-art.py ~/Downloads/사과.png items/apple
   ```
   - 캐릭터: `python3 scripts/prepare-art.py ~/Downloads/루루.png characters/lulu-default --size 480 --ratio 4:5`
   - 바탕에 종이 무늬가 남아 지워지지 않으면, 그록에 "pure white background" 를 다시 강조해 뽑습니다.
   - 사과와 도토리는 재료 그림으로도 **복사**합니다: `cp public/assets/items/apple.webp public/assets/items/res-apple.webp` (도토리도 같게)
4. 확인: `npm run dev` 후 주소 끝에 `#gallery` → 그림을 한눈에 봅니다. `npm run test:unit` 의 '그림 현황' 숫자가 늘어납니다.
5. 놀이 화면에서 **10개를 나란히** 놓아 보고 셀 수 있는지 봅니다 (사과 세기 놀이).

## 공통 문구 (모든 지시문 끝에 붙입니다)

> **STYLE:** cute children's storybook watercolor illustration, soft hand-painted watercolor washes with visible paper grain, warm brown colored-pencil outline (#6B5444, slightly wobbly, rounded ends, never black), light coming from the top-left with one soft white highlight on the upper left, a faint light-brown oval shadow on the ground under the object, gentle pastel palette (sage green #A8C3A0, cream #FFF5DF, petal pink #F3C6D2, apricot #F5D0AD, mist blue #C8DFE8, soft lilac #D9D0EC, oak #B9855A), simple shapes with 2-3 main color areas, single object centered, front view or slightly from above, isolated on a pure white background, no text, no frame, no border, no extra objects.
>
> **AVOID:** black outlines, pure black, neon or saturated colors, photorealism, 3D render, glossy plastic look, gradients that look digital, busy details, background scenery, paper texture in the background, cast shadows to the side, text or letters.

- 얼굴이 있는 것(개구리·부엉이·박쥐·구름·새·오리)은 문장 끝에 `smiling friendly face, rosy pink cheeks` 를 붙입니다.
- 그림자를 넣지 않는 2장(구름·연)은 공통 문구의 그림자 부분 대신 `floating, no ground shadow` 라고 씁니다.
- 드문 재료(황금 도토리·달빛 이슬·미스릴·꿀·구름 솜·진주 등)는 게임이 **오른쪽 위**에 반짝이를 따로 붙입니다. 그림 안 반짝이는 **왼쪽 위**에만.

## 1. 시범 5장

| 파일 | 지시문 (뒤에 STYLE 을 붙입니다) |
|---|---|
| `items/apple` | A round, slightly heart-shaped red apple (#E0796B), small dip at the top and plump bottom, one faint vertical crease line in the middle, a short brown stem with one sage-green leaf, a large soft white highlight on the upper left. |
| `items/res-glow-branch` | A small brown twig (#8C6B52) going diagonally from lower left to upper right with two small sage-green leaves, four tiny cream glowing dots around the tip, and a very faint, wide, soft yellow watercolor glow behind the upper right that fades out at the edges (not a hard circle). |
| `items/gem` | A single faceted gemstone, wide at the top and pointed at the bottom, mist blue (#C8DFE8) with a brighter top facet (#E4F1F6), darker lower-right facets (#A9C6D6) and a translucent soft lilac wash in the middle, facet lines drawn lightly. |
| `items/mushroom` | A cute mushroom with a wide rounded red cap (#E0796B) and a cream stem (#FBF1DF) that flares slightly at the bottom, four cream round spots on the cap (two big, two small); the smooth cap and the soft stem should look like different materials. |
| `items/res-mithril` | A hexagonal silver metal ingot, bright top face (#E6E8EF), silver middle (#C9CCD6), darker lower right (#B2B6C4), one short bold white shine line on the top face and one small white star sparkle on the upper left; soft and gentle, not shiny chrome. |

## 2. 놀이 물건 (나머지 26장)

| 파일 | 지시문 |
|---|---|
| `items/pear` | A yellow-green pear (#CFDB8E), narrow top and wide bottom like a gourd, two tiny darker dots near the bottom, a short stem with one sage-green leaf. Must look clearly different from an apple. |
| `items/acorn` | An acorn: light brown nut (#C79461) below, darker brown cap (#8F613C) on top with a crosshatch net pattern, a short stem on top. *(복사: `res-acorn`)* |
| `items/leaf` | A fresh green leaf (#A8C3A0), teardrop shape, tilted from lower left to upper right, one central vein and 4-5 thin side veins (#6F9468). Green, not autumn colors. |
| `items/flower` | A simple flower with five separate pink petals (#F3C6D2) around a round apricot center (#F5D0AD), one green stem below. The five petals must be easy to count. |
| `items/butterfly` | A symmetric butterfly: upper wings soft lilac (#D9D0EC) each with one apricot dot, lower wings pink (#F3C6D2), long brown oval body, two antennae. Seen from above. |
| `items/ladybug` | A ladybug seen from above: round red back (#E0796B) with a center line, five clearly visible dark brown spots of different sizes, dark brown half-round head with two antennae. |
| `items/frog` | A sitting light green frog (#9DBF86), two eyes bulging on top of the head (cream with brown pupils), light green belly, upturned smiling mouth. smiling friendly face, rosy pink cheeks. |
| `items/blueberry` | One round blueberry (#7D8BC0) with a small star-shaped crown on top (#59608A), made round only by light and shade. |
| `items/cookie` | A round, slightly bumpy golden-brown cookie (#DDAF77) with six evenly scattered dark chocolate chips. |
| `items/moon` | A yellow crescent moon (#F4D98C), plump on the left and curved in on the right, one faint round crater mark, one tiny star sparkle at the upper right. |
| `items/star` | A yellow five-pointed star (#F2CF5B) with soft rounded points and gently curved edges, hand-drawn, not sharp. Must look clearly different from the moon. |
| `items/owl` | A small round brown owl (#B48A64) with triangle ear tufts, two big eyes (cream with brown pupils and tiny white dots), cream belly with wavy feather marks, tiny apricot beak. smiling friendly face, rosy pink cheeks. |
| `items/pebble` | A plain rounded flat grey-brown pebble (#B7B1A8) with a lighter upper-left area and two tiny dents. The simplest picture of all. |
| `items/bat` | A round cute bat, soft lilac wings (#A59BBE) with wavy lower edges, darker purple oval body (#8C82A8), two triangle ears, two white eyes. Not scary at all. smiling friendly face, rosy pink cheeks. |
| `items/candle` | A cream candle (#FBF1DF) on a small wooden oval holder (#B9855A), orange-yellow flame (#F5C77E) with a bright cream core, a very faint soft yellow watercolor glow around the flame (no hard circle). |
| `items/bee` | A round yellow bee (#F2CF5B) with two bold soft brown stripes, two translucent pale blue wings, one small eye, a tiny short line instead of a stinger. |
| `items/sunflower` | A sunflower with twelve separate yellow petals (#F2CF5B) around a brown center (#8C6B52), green stem with one leaf. All twelve petals must be separate and countable. |
| `items/snail` | A snail: long cream body (#E8D9BF) along the ground, apricot round shell (#F5D0AD) with a bold brown spiral of about two and a half turns, two eye stalks with brown dots. |
| `items/cloud` | A white fluffy cloud made of three puffs, faint pale blue shading on the upper left, two eyes, smiling mouth, two pink cheeks. floating, no ground shadow. |
| `items/kite` | A pink diamond kite (#F3C6D2) divided by a cross, upper right section lilac, lower left section pale blue, a wavy string below with two apricot bows, slightly tilted as if flying. floating, no ground shadow. |
| `items/windmill` | A small pinwheel windmill: cream tower (#FBF1DF) with a tiny wooden door, four blades in a cross (two apricot, two pale blue), wooden round center. The four blades must be countable. |
| `items/dandelion` | A dandelion seed head: small cream ball center with about fourteen thin light-grey stalks radiating out, each ending in a white fluffy tuft, green stem and one leaf below. Stalks thick enough to see. |
| `items/bird` | A plump pale blue bird (#C8DFE8) seen from the side, slightly darker blue wing, short apricot beak, brown eye, two thin orange legs. smiling friendly face, rosy pink cheeks. |
| `items/fish` | An apricot fish (#F5D0AD) seen from the side facing right, slightly darker coral fins and forked tail, two fin lines on its side, one eye. smiling friendly face. |
| `items/duck` | A round baby duck in light yellow (#FFF0B8) with a slightly darker yellow wing, orange beak, brown eye, neck rising smoothly from the body. smiling friendly face, rosy pink cheeks. |
| `items/shell` | A light pink fan-shaped scallop shell (#F7D6DF) with exactly five evenly spaced ridge lines from the bottom to the top edge, small hinge at the bottom. |
| `items/lily` | A water lily: wide sage-green lily pad oval below, five pink petals (#F3C6D2) fanned out on top around an apricot center. The five petals must be countable. |

## 3. 재료 (11장 + 복사 2장)

| 파일 | 지시문 |
|---|---|
| `items/res-golden-acorn` | The same acorn shape as before but golden: golden nut (#EBC35A), deeper gold cap (#B98A3A) with a net pattern, one small star sparkle on the upper left. Special and precious. |
| `items/res-moon-dew` | A water drop, pointed at the top and round at the bottom, mist blue (#C8DFE8), one white shine streak on the inner left, a tiny yellow crescent moon visible inside the lower part of the drop. |
| `items/res-crystal` | Three crystal pillars side by side: the middle one tallest and brightest (#E4F1F6), a small lilac one on the left, a medium pale blue one on the right; darker right face on the middle pillar and one white shine line. Different from a single gem. |
| `items/res-sunflower-seed` | Three dark brown almond-shaped sunflower seeds (#6B5444), slightly tilted and overlapping a little, each with two or three cream vertical stripes; all three countable. |
| `items/res-honey` | A small honey pot: deep yellow body (#F2B84B) covered on top with a cream cloth lid, two bright honey drip streaks, one simple hexagon honeycomb outline on the front, one tall glassy highlight on the left. |
| `items/res-feather` | One soft pink feather (#F3C6D2) going from lower left to upper right with a thin quill line and six short barbs on each side, the tip curving gently. |
| `items/res-cloud-cotton` | A white cotton puff the same shape as the cloud but without a face, faint lilac shading on the upper left, one small star sparkle on the upper left, with a ground shadow. |
| `items/res-lily-pad` | A round sage-green lily pad seen from above with one V-shaped notch on the right, five veins from the center, one tiny white water drop on the upper left. |
| `items/res-pearl` | One pearl: very pale lilac-white ball (#F1E9F7), bright on the upper left fading softly toward the lower right, white highlight and one tiny sparkle on the upper left, very faint outline. |

## 4. 캐릭터 (루루 먼저)

캐릭터는 세로 4:5 로 뽑고 `--size 480 --ratio 4:5` 로 넣습니다. **`lulu-default` 하나만 넣어도** 다른 표정이 없을 때 그 그림을 씁니다.
루루의 모자·스카프는 게임이 위에 겹쳐 그리므로 **그리지 않습니다**. 루루 기본 그림을 고르면, 그 그림을 참고 그림으로 올려 표정만 바꿉니다.

**루루 공통:** A tiny baby bunny girl named Lulu, chibi proportions (big round head about as tall as the body), cream fur (#FFF6E6), two long ears (the right ear's tip folds over slightly), pink inner ears, a pink five-petal flower tucked behind the right ear, rosy pink round cheeks, a sage-green cape made of three overlapping leaves with an acorn button, standing and facing the viewer, full body. + STYLE

| 파일 | 덧붙이는 말 |
|---|---|
| `characters/lulu-default` | calm gentle smile, hands together in front. |
| `characters/lulu-happy` | big happy smile with eyes curved shut, both paws up. |
| `characters/lulu-thinking` | thinking pose, one paw on the chin, eyes looking up to the side, small closed smile. |
| `characters/lulu-cheer` | cheering and encouraging, one paw raised in a fist, open happy mouth. |
| `characters/lulu-surprised` | pleasantly surprised "wow" face, round open mouth, ears perked up. |

- 도토(고슴도치): `A round baby hedgehog named Doto with two layers of soft brown spines, round glasses, a small acorn bag on a green strap` + 표정 + STYLE
- 모모(다람쥐): `A baby squirrel named Momo with orange fur, a big tail curling up over the head, a sage-green scarf and a tilted acorn cap` + 표정 + STYLE
- 화난 표정은 쓰지 않습니다 (틀렸을 때도 응원 표정).

## 5. 다음 단계에서 쓸 것

- 가구 26장·배경 9장은 2:1 아이소메트릭이라 생성기로 비율과 바닥 기준점을 맞추기가 어렵습니다. 물건·캐릭터를 넣어 화풍을 정한 뒤에 따로 지시문을 만듭니다.
- 방 배경처럼 바탕이 있는 그림은 `--keep-bg` 로 넣습니다.
