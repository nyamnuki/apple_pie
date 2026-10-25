# 그림(에셋) 넣는 곳

그림 파일을 아래 폴더에 **정해진 이름**으로 넣기만 하면 게임이 자동으로 그 그림을 씁니다.
파일이 없으면 임시 그래픽(색 상자 + 그림 문자)이 보이고, 앱은 깨지지 않습니다.
파일 이름과 크기는 `src/data/furniture/furniture.ts` 와 `src/data/assets/assetRegistry.ts` 에 적혀 있습니다.

| 폴더 | 내용 | 지금 쓰는 파일 이름 |
|---|---|---|
| `backgrounds/` | 방 배경 (760×640, 바닥+벽) | `room-base.png` |
| `furniture/` | 가구·벽지 | `leaf-bed.png`, `petal-rug.png`, `mushroom-lamp.png`, `forest-bookshelf.png`, `wooden-desk.png`, `flower-pot.png`, `toy-chest.png`, `woodland-wallpaper.png`, `mushroom-stool.png`, `apple-basket.png`, `moon-lantern.png` / 벽 장식: `leaf-frame.png`, `acorn-garland.png`, `starry-frame.png` |
| `characters/` | 캐릭터 표정별 그림 | `lulu-default.png`, `lulu-happy.png`, `lulu-thinking.png`, `lulu-cheer.png`, `lulu-surprised.png` (도토: `doto-…`, 모모: `momo-…`) |
| `items/` | 수학 놀이 물건, 재료 | 물건: `apple.png`, `pear.png`, `mushroom.png`, `moon.png`, `star.png`, `owl.png` … / 재료: `res-acorn.png`, `res-apple.png`, `res-golden-acorn.png`, `res-glow-branch.png`, `res-moon-dew.png` |
| `pets/`, `ui/`, `effects/` | 나중에 쓸 자리 | — |

- 그림이 없으면: 가구는 코드로 그린 모양, 루루는 코드로 그린 토끼, 나머지는 그림 문자로 보입니다.
- 캐릭터는 표정 그림이 없으면 `-default.png` 를, 그것도 없으면 코드로 그린 그림을 씁니다.
  그래서 `lulu-default.png` 하나만 먼저 넣어도 됩니다.

## 모든 그림이 같은 방처럼 보이게 하는 규칙

- **시점:** 2:1 아이소메트릭 (바닥 한 칸 = 가로 120 × 세로 60)
- **조명:** 빛은 왼쪽 위에서. 왼쪽 면이 밝고 오른쪽 면이 어둡게
- **형식:** 배경이 투명한 PNG
- **위치 기준:** 그림의 '아래 가운데'가 가구가 차지한 바닥 영역의 '맨 아래 꼭짓점'에 맞춰집니다
- **크기:** `furniture.ts` 의 `width` × `height` 비율로 그립니다 (2배 크기로 그려도 됩니다)
- **벽지:** 이음새 없이 반복되는 정사각형 무늬
- **벽 장식:** 정면에서 본 모습으로 그립니다 (가로 100×칸수 : 세로 띠 높이 비율, 예: 액자 100×80, 가랜드 200×32). 게임이 벽 각도에 맞게 비스듬히 바꿔 줍니다.
