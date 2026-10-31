# 그림(에셋) 넣는 곳

그림 파일을 아래 폴더에 **정해진 이름**으로 넣기만 하면 게임이 자동으로 그 그림을 씁니다.
파일이 없으면 임시 그래픽(코드로 그린 수채화 SVG, 또는 그림 문자)이 보이고, 앱은 깨지지 않습니다.
파일 이름은 `src/data/assets/assetRegistry.ts`, `src/data/furniture/furniture.ts` 에 적혀 있습니다.

## 형식: PNG 또는 WebP

- 코드에 적힌 경로는 모두 `.png` 이지만, **같은 이름의 `.webp` 를 넣으면 그 파일을 먼저 씁니다.**
  (예: `furniture/leaf-bed.png` 자리에 `furniture/leaf-bed.webp` 를 넣어도 됩니다)
- 둘 다 있으면 `.webp` 가 이깁니다. 용량이 작아서 처음 설치가 빠릅니다.
- 배경은 투명하게. 2배 크기로 그려도 됩니다.
- 그림 전체 용량 예산은 **6MB** 입니다 (`build/offline.ts` 의 `ASSET_BUDGET_BYTES`).
  넘으면 `npm run build` 가 경고를 냅니다. 앱을 처음 열 때 이만큼을 모두 내려받기 때문입니다.

## 폴더와 파일 이름

| 폴더 | 내용 | 파일 이름 |
|---|---|---|
| `backgrounds/` | 방의 바닥과 벽 (760×640) | `room-base.png` |
| `backgrounds/` | 창밖 하늘 (시간대마다 한 장, 해·달·별 포함) | `window-sky-day.png`, `window-sky-evening.png`, `window-sky-night.png` |
| `backgrounds/` | 창밖 숲 (계절마다 한 장, 날리는 꽃잎·나비·낙엽·눈 포함) | `window-woods-spring.png`, `window-woods-summer.png`, `window-woods-autumn.png`, `window-woods-winter.png` |
| `backgrounds/` | 타이틀 화면 풍경 *(아직 화면에 연결되지 않음 — 6단계)* | `title-scene.png` |
| `furniture/` | 가구·벽지 | `leaf-bed.png`, `petal-rug.png`, `mushroom-lamp.png`, `forest-bookshelf.png`, `wooden-desk.png`, `flower-pot.png`, `toy-chest.png`, `woodland-wallpaper.png`, `mushroom-stool.png`, `apple-basket.png`, `moon-lantern.png`, `crystal-lamp.png`, `sunflower-pot.png`, `honey-lamp.png`, `cloud-beanbag.png`, `lily-rug.png`, `shell-lamp.png`, `mushroom-bed.png`, `clover-cushion.png`, `crafting-bench.png` / 벽 장식: `leaf-frame.png`, `acorn-garland.png`, `starry-frame.png`, `kite-garland.png`, `mithril-mirror.png`, `gem-garland.png` |
| `characters/` | 캐릭터 표정별 그림 | `lulu-default.png`, `lulu-happy.png`, `lulu-thinking.png`, `lulu-cheer.png`, `lulu-surprised.png` (도토: `doto-…`, 모모: `momo-…`) |
| `items/` | 수학 놀이 물건 | `apple.png`, `pear.png`, `mushroom.png`, `acorn.png`, `leaf.png`, `flower.png`, `butterfly.png`, `ladybug.png`, `frog.png`, `blueberry.png`, `cookie.png`, `moon.png`, `star.png`, `owl.png`, `gem.png`, `pebble.png`, `bat.png`, `candle.png`, `bee.png`, `sunflower.png`, `snail.png`, `cloud.png`, `kite.png`, `windmill.png`, `dandelion.png`, `bird.png`, `fish.png`, `duck.png`, `shell.png`, `lily.png` |
| `items/` | 재료 (`res-` 로 시작) | `res-acorn.png`, `res-apple.png`, `res-golden-acorn.png`, `res-glow-branch.png`, `res-moon-dew.png`, `res-crystal.png`, `res-mithril.png`, `res-sunflower-seed.png`, `res-honey.png`, `res-feather.png`, `res-cloud-cotton.png`, `res-lily-pad.png`, `res-pearl.png` |
| `outfits/` | 루루의 모자·스카프 (루루와 같은 120×150 좌표) | `acorn-cap.png`, `berry-scarf.png`, `flower-crown.png`, `star-scarf.png`, `moon-hat.png`, `rainbow-scarf.png` |
| `landmarks/` | 지도의 마을 풍경 (160×110) *(아직 연결되지 않음 — 6단계)* | `acorn-village.png`, `moonlight-forest.png`, `crystal-cave.png`, `sunny-meadow.png`, `windy-hill.png`, `rainbow-lake.png` |
| `pets/` | 방에 찾아오는 반려 친구 *(아직 연결되지 않음 — 7단계)* | `duckling.png`, `fox-kit.png`, `owlet.png`, `turtle.png` |
| `ui/`, `effects/` | 나중에 쓸 자리 | — |

- 이름 규칙: 코드의 id 를 **소문자-붙임표**로 바꿉니다 (`foxKit` → `fox-kit`, `acornVillage` → `acorn-village`).
- 스티커는 따로 그리지 않습니다. `items/` 의 그림을 그대로 씁니다 (36장).
- 화면 아이콘(`src/components/icons/`)과 수학 놀이의 도형·시계·수직선·블록은 **코드 SVG 를 그대로 둡니다.**
- **지금(2026-11) 들어 있는 그림 파일은 없습니다.** 모든 그림이 임시 그래픽으로 보입니다.
  현황은 `npm run test:unit` 의 '그림 현황' 줄에 나옵니다 (총 109개 자리).
- 앱은 빌드할 때 이 폴더에 **실제로 있는 파일 목록**을 만들어(`build/assetIndex.ts`) 목록에 없는 그림은 요청하지 않습니다.
  그림을 넣은 뒤에는 개발 서버를 다시 켜거나 다시 빌드하세요.
- 이름을 잘못 지어 넣으면 `npm run test:unit` 이 '쓰이지 않는 그림'으로 알려 줍니다.
- 캐릭터는 표정 그림이 없으면 `-default.png` 를, 그것도 없으면 코드로 그린 그림을 씁니다.
  그래서 `lulu-default.png` 하나만 먼저 넣어도 됩니다.
- 루루의 옷은 루루 그림 **위에 따로** 얹습니다. 그래서 `lulu-default.png` 를 넣어도 모자·스카프가 그대로 보입니다.

## 모든 그림이 같은 방처럼 보이게 하는 규칙

- **시점:** 2:1 아이소메트릭 (바닥 한 칸 = 가로 120 × 세로 60)
- **조명:** 빛은 왼쪽 위에서. 왼쪽 면이 밝고 오른쪽 면이 어둡게
- **위치 기준:** 그림의 '아래 가운데'가 가구가 차지한 바닥 영역의 '맨 아래 꼭짓점'에 맞춰집니다
- **크기:** `furniture.ts` 의 `width` × `height` 비율로 그립니다
- **벽지:** 이음새 없이 반복되는 정사각형 무늬
- **벽 장식:** 정면에서 본 모습 (가로 100×칸수 : 세로 띠 높이, 예: 액자 100×80, 가랜드 200×32). 게임이 벽 각도에 맞게 비스듬히 바꿔 줍니다
- **방 배경(`room-base.png`):** 바닥과 벽만 그립니다. **창문·창밖·햇빛은 그리지 마세요.**
  앱이 그 위에 창문틀·하늘·숲·햇빛을 시간대와 계절에 맞게 그립니다
- **창밖 그림:** 정면에서 본 160×90 네모로 그립니다. 게임이 벽 각도로 눕혀 창문 안에 넣습니다
