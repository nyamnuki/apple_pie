# Math Town 그래픽 전면 개선 — 사전 분석 보고서

- 작성일: 2026-11-01
- 대상 저장소: `apple_pie-main` (`math-town` v0.1.0)
- 작성 시점 상태: 코드 변경 없음. 기준선 `npm run typecheck` 통과, 단위 테스트 281개 통과, 실제 그림 파일 **0/85장**

---

## 0. 한눈에 보기

| 항목 | 결론 |
|---|---|
| PNG 교체 파이프라인 | **이미 완성되어 있음.** 새로 만들 필요 없음 |
| 현재 실제 이미지 에셋 | **0장** (게임 화면 기준). 모두 코드로 그린 SVG |
| 파일만 넣으면 교체되는 경로 | **85개** |
| 교체 경로가 아예 없는 코드 전용 SVG | 마을 풍경·타이틀·반려·옷·창밖·아이콘 등 |
| 그림을 넣으면 조용히 깨지는 기능 | **4곳** (방 사진 저장 / 루루 옷장 / 창밖 계절·시간 / e2e 테스트 1개) |
| 최종 필요 에셋 | 약 **106장** (UI 아이콘 38개는 SVG 유지 권장) |
| 선행 작업 | 0단계 기반 정비를 **그림 투입 전에** 완료해야 함 |

---

## 1. 현재 그래픽 구현 구조

그림 하나를 그릴 때 3단계 우선순위로 떨어진다.

```
public/assets/ 의 실제 파일  →  코드로 그린 SVG(수채화 필터)  →  이모지
```

### 1.1 파이프라인 구성 요소

| 구성 요소 | 파일 | 역할 |
|---|---|---|
| 파일 목록 수집 | `build/assetIndex.ts` | vite 플러그인. 빌드·dev 시작 시점에 `public/assets/` 를 훑어 `virtual:asset-index` 로 넘긴다. `.png/.webp/.svg/.jpg` 모두 인식 |
| 경로 레지스트리 | `src/data/assets/assetRegistry.ts` | `hasAsset()`, `assetUrl()`, `BACKGROUNDS` |
| 로드 상태 | `src/services/assets/useAssetStatus.ts` | 경로별 `loading`/`ok`/`missing` 캐시. 목록에 없는 그림은 아예 요청하지 않음 (404 0건) |
| 오프라인 캐시 | `build/offline.ts` | `sw.js` 에 그림 전부 precache. 목록이 바뀌면 새 버전으로 인식 |
| 그림 규칙 | `docs/ART_BIBLE.md` | 2:1 아이소메트릭, 빛은 왼쪽 위, 색 10종, 선 `#6B5444` |
| 넣는 방법 안내 | `public/assets/README.md` | 폴더·파일 이름 규칙 |

### 1.2 실제로 그림 파일을 쓰는 소비 지점 (8곳)

| 파일 | 담당 |
|---|---|
| `src/components/AssetIcon.tsx` | 물건·재료 (파일 → `ITEM_ART` SVG → 이모지) |
| `src/components/AssetThumb.tsx` | 가구 목록 썸네일 |
| `src/components/RegionIcon.tsx` | 마을 아이콘 (→ AssetIcon) |
| `src/components/ResourceChip.tsx` | 재료 표시 |
| `src/components/characters/Character.tsx` | 표정 파일 → `-default.png` → SVG → 이모지 |
| `src/features/room/FurnitureSprite.tsx` | 방 안 가구 `<image>` |
| `src/features/room/WallItemSprite.tsx` | 벽 장식 |
| `src/features/room/RoomBackground.tsx` | `room-base.png` + 벽지 타일 |

이 밖에 `MathMenuScreen`, `ChoiceButtons`, `GroupsField`, `MakeTenField`, `OrdinalField`, `ItemToken` 이 `AssetIcon` 을 거쳐 간접적으로 사용한다.

### 1.3 기능 안전성

이 구조는 **개발 원칙 1·6(기능·데이터 구조 유지)을 자동으로 보장한다.** 배치·회전·충돌 판정·인벤토리·제작·저장/불러오기는 모두 `assetPath` 문자열만 참조하며, 그림이 PNG인지 SVG인지 전혀 모르게 짜여 있다.

---

## 2. 실제 이미지 에셋과 임시 그래픽의 구분

### 2.1 실제 에셋 현황

**게임 화면에 쓰이는 실제 그래픽 에셋은 0장이다.**

- `public/assets/` 아래 7개 폴더는 모두 `.gitkeep` 뿐
- 유일한 실제 이미지는 `public/icons/` 의 PWA 아이콘 (PNG 3장 + icon.svg) — 게임 화면에는 쓰이지 않음
- 단위 테스트 `그림 현황` 출력: `background 0/1, character 0/15, furniture 0/26, mathItem 0/30, resource 0/13`

### 2.2 (A) 교체 경로가 이미 있는 것 — 85개, 파일만 넣으면 끝

| 그룹 | 개수 | 폴더 |
|---|---|---|
| 방 배경 | 1 | `backgrounds/` |
| 캐릭터 | 15 (3명 × 표정 5) | `characters/` |
| 가구 | 26 (바닥 19 + 벽지 1 + 벽 장식 6) | `furniture/` |
| 수학 물건 | 30 | `items/` |
| 재료 | 13 | `items/res-` |

### 2.3 (B) 교체 경로가 아예 없는 코드 전용 SVG — 이번 작업의 진짜 과제

| 대상 | 파일 | 개수 |
|---|---|---|
| 마을 풍경 (지도) | `src/components/art/RegionLandmark.tsx` | 6 |
| 타이틀 풍경 | `src/components/art/TitleScene.tsx` | 1 |
| 반려 친구 | `src/features/pets/PetArt.tsx` | 4 |
| 루루 옷 (모자 3 + 스카프 3) | `src/features/outfits/OutfitArt.tsx` | 6 |
| 창밖 하늘·숲 (시간 3 + 계절 4) | `RoomBackground.tsx` 내부 | 7 |
| 리본 | `src/components/art/Rosette.tsx` | 1 |
| UI 아이콘 | `src/components/icons/index.tsx` | 38 |
| 수학 필드 전용 그림 | `ShapeIcon`, `ClockField`, `MeasureField`, `HopsField`, `ShareField`, `DoubleField` | 약 10 |
| 가구 대체 모양 | `src/features/room/placeholders/` | 26 (A의 백업이므로 유지) |
| 물건·재료 SVG | `src/components/art/itemArt.tsx` | 43 (A의 백업이므로 유지) |

### 2.4 발견된 불일치 — 스티커

`src/features/stickers/StickerBookScreen.tsx:80` 과 `src/features/stickers/StickerCloseUp.tsx:55` 가 `AssetIcon` 을 거치지 않고 `ItemArt` 를 **직접** 호출한다.

→ `items/apple.png` 를 넣어도 **도감 스티커 36장만 SVG로 남는다.** 두 줄 수정으로 해결.

---

## 3. 기능이 깨지는 지점 — 그림 투입 전에 반드시 고칠 4가지

### ① 방 사진 저장이 빈 액자로 나온다 (심각)

`src/features/photo/roomPhoto.ts` 는 화면의 SVG `innerHTML` 을 떼어 blob SVG 로 만들고 `<img>` 에 태워 캔버스에 그린다. **`<img>` 로 읽힌 SVG 는 외부 리소스를 불러오지 못한다.**

지금은 모든 가구가 벡터라 정상이지만, `<image href="/assets/furniture/leaf-bed.png">` 가 되면 **가구가 전부 사라진 사진**이 저장된다.

→ 직렬화 전에 참조된 PNG 를 `data:` URI 로 인라인해야 한다.

### ② 루루 옷장이 시각적으로 죽는다 (심각)

옷은 `src/components/characters/LuluSvg.tsx:48` 안에서 SVG 좌표(120×150)에 맞춰 합성된다. `lulu-default.png` 가 들어오면 `Character.tsx` 가 `<img>` 분기로 가며 `LuluSvg` 를 아예 그리지 않으므로 **모자·스카프가 사라진다.** 스티커 4·7·11·18·24·30장 보상이 무의미해진다.

→ 옷을 캐릭터 PNG 위에 얹는 별도 레이어로 분리 (권장), 또는 캐릭터 PNG 를 옷 조합별로 제작.

### ③ 창밖 계절·시간과 벽 무늬가 사라진다 (심각)

`src/features/room/RoomBackground.tsx:130` 이 `room-base.png` 가 있으면 `baseStatus !== 'ok'` 가드로 창문·하늘·4계절 숲·꽃잎·가랜드·햇빛을 **전부 건너뛴다.** 한 장짜리 배경으로는 낮/저녁/밤 × 봄/여름/가을/겨울 12가지 분위기를 담을 수 없다.

→ 배경을 레이어로 분할: 벽+바닥 1 / 창밖 하늘 3 / 창밖 숲 4.

### ④ e2e 테스트 1개가 즉시 실패한다

`tests/ui.spec.ts:8` `없는 그림 파일은 아예 요청하지 않는다 (404 없음)` 가 그림 요청이 **0건**임을 단정한다. 진짜 그림이 들어오면 바로 깨진다.

→ "요청한 그림은 모두 200 응답" 으로 의미를 바꾼다.

### 부수 고려 사항

- **가구 색 바꾸기**: 방은 SVG `feColorMatrix hueRotate`, 목록은 CSS `hue-rotate`. PNG 에도 적용은 되지만 수채화 PNG 에서 색조만 돌리면 탁해질 수 있어 눈 확인이 필요하다. (`src/features/room/tints.ts`, 150°/250°)
- **오프라인 설치 용량**: `build/offline.ts` 가 그림을 **전부** precache 한다. 100장 × 40KB ≒ 4MB 가 설치 용량에 추가된다.
- **WebP 전환**: `assetIndex` 는 이미 webp 를 인식하지만, `src/data/assets/assets.test.ts:26` 의 정규식 `^[a-z]+\/[a-z0-9-]+\.png$` 와 데이터 파일의 `.png` 문자열을 함께 바꿔야 한다.
- **git 미초기화**: 이 폴더에 `.git` 이 없다. 100장 이상 + 여러 단계 코드 수정이므로 시작 전 `git init` 권장.

---

## 4. 필요한 이미지 에셋 전체 목록 (약 106장)

| # | 폴더 / 파일 | 장수 | 규격 |
|---|---|---|---|
| 1 | `items/` 물건 30 + 재료 13 | **43** | 64×64 (2배 128), 투명, 아래 그림자 타원 |
| 2 | `characters/{lulu,doto,momo}-{default,happy,thinking,cheer,surprised}` | **15** | 120×150, 머리 가운데 (60,72) |
| 3 | `furniture/` 바닥 가구 | **19** | `width×height` 비율, 아래 가운데 = 바닥 영역 맨 아래 꼭짓점 |
| 4 | `furniture/` 벽 장식 6 + 벽지 1 | **7** | 액자 100×80 · 가랜드 200×32 정면 / 벽지는 이음새 없는 정사각 |
| 5 | `backgrounds/room-base.png` (벽+바닥만) | **1** | 760×640 |
| 6 | `backgrounds/window-sky-{day,evening,night}` | **3** | 신규 경로 |
| 7 | `backgrounds/window-woods-{spring,summer,autumn,winter}` | **4** | 신규 경로 |
| 8 | `backgrounds/title-scene.png` | **1** | 신규 경로 |
| 9 | `landmarks/` 마을 풍경 6 | **6** | 160×110, 신규 경로 |
| 10 | `pets/{duckling,fox-kit,owlet,turtle}` | **4** | 신규 경로 |
| 11 | `outfits/` 모자 3 + 스카프 3 | **6** | 캐릭터 PNG 위 고정 좌표, 신규 경로 |
| — | 스티커 36장 | 0 | `items/` 재사용 |
| — | UI 아이콘 38개 | 0 | **SVG 유지 권장** (글자색 상속·24px 선명도) |
| — | 도형·시계·수직선·측정 블록 | 0 | **SVG 유지 권장** (정확한 수량·대비가 학습의 본질) |

9·10·11 번과 6·7·8 번은 레지스트리에 **새 그룹을 만들어야** 한다.

### 공통 화풍 규칙 (`docs/ART_BIBLE.md` 준수)

- 색: Sage green `#A8C3A0` / Warm cream `#FFF5DF` / Apricot `#F5D0AD` / Oak wood `#B9855A` / Petal pink `#F3C6D2` / Mist blue `#C8DFE8` / Soft lilac `#D9D0EC` / Warm brown `#59483C`
- 선: 갈색 색연필 `#6B5444`, 검은 선 금지
- 빛: 항상 왼쪽 위. 왼쪽 면 밝게, 오른쪽 면 어둡게
- 시점: 방·가구는 2:1 아이소메트릭 (바닥 한 칸 = 120×60)
- 형식: 배경 투명 PNG (또는 WebP), 2배 크기 허용

---

## 5. 단계별 교체 계획

### 0단계 · 기반 정비 — 그림 0장, 코드만 (가장 중요) — ✅ 2026-11-01 완료

3장의 ①~④ 수정 + 신규 레지스트리 그룹 + 스티커 두 줄 + WebP 허용 + 용량 예산 수립.

**검증:** typecheck / 단위 281개 → **285개** / e2e 129개 전부 통과 + `#gallery` 모습 변화 **없음** (그림이 없으므로 화면은 그대로여야 정상)

완료 내용은 아래 '8. 0단계 완료 기록' 참고.

### 1단계 · 물건·재료 43장

가장 안전하다. 기능과 얽힌 것이 없고 화면 10곳에 한꺼번에 반영된다. 스티커 36장도 함께 살아난다.

**검증:** 단위 `그림 현황` 43/43 · `쓰이지 않는 그림` 0 / e2e 보상·공방·가방·도감 / `#gallery` 로 43장 화풍 비교 / axe 접근성

### 2단계 · 캐릭터 15장 + 옷 6장

0단계의 옷 레이어 위에서 진행.

**검증:** `ui.spec.ts:142` 캐릭터 15개 `role=img` / 옷장에서 6종 갈아입기 / 보상·말풍선 화면

### 3단계 · 방 배경 레이어 8장

**검증:** 낮·저녁·밤 × 4계절 12조합 눈 확인(기기 시계 변조) / `data-sky` 속성 테스트 / 벽지 위에 창문이 보이는지 / **방 사진 저장**

### 4단계 · 바닥 가구 19장

**검증:** 놓기·옮기기·돌리기(좌우 뒤집힘)·치우기·되돌리기·모두 치우기 / 색 3종 / 겹침·창문 자리 거부 / `room.spec.ts` 전체 / 방 사진

### 5단계 · 벽 장식 6 + 벽지 1

**검증:** 좌우 벽 각도 기울임 / `high`·`middle` 띠 / 벽지 이음새 / `extras.spec.ts`

### 6단계 · 마을 풍경 6 + 타이틀 1

**검증:** 잠긴 마을 안개·자물쇠, 완성 리본이 그림 위에 보이는지 / 지도 가로 스크롤 / 타이틀 가로 화면

### 7단계 · 반려 4 + 효과

**검증:** `pets.spec.ts` / 움직임 줄이기 / 빈 칸 걸어다니기

### 8단계 · 전체 점검 10 (로드맵 형식)

CPU 6배 느리게 성능 / 코드+그림 용량 / 320px 큰 글씨·844×390 가로, 영어·한국어 / axe 14화면 × 2언어 / 키보드만으로 놀이 끝내기 / 오프라인 설치 용량 / `docs/ART_BIBLE.md`·`public/assets/README.md`·`docs/ROADMAP.md` 갱신

---

## 6. 각 단계의 공통 테스트 방법

```bash
npm run typecheck
npm run test:unit                   # Vitest, 1초 안팎
npx playwright install chromium     # 처음 한 번만
npm run test:e2e                    # Playwright 129개
```

- 단위 테스트의 `그림 현황` 줄이 진행률 계기판이 된다
- `쓰이지 않는 그림` 항목이 파일 이름 오타를 잡아 준다
- `#gallery` (예: `http://localhost:5173/#gallery`) 에서 모든 그림을 한 화면에 모아 화풍을 비교한다
- 테스트 출력을 `| tail` 로 자르면 실패 표시가 가려진다 → 통과·실패 개수 줄을 따로 확인한다 (로드맵 전체 점검 5의 교훈)

---

## 6-1. 단계별 완료 조건과 테스트 항목

각 단계는 아래를 모두 만족해야 '완료'다. 하나라도 어기면 그 단계는 끝나지 않은 것으로 본다.

**모든 단계에 공통으로 적용되는 조건**

| # | 완료 조건 | 확인 방법 |
|---|---|---|
| C1 | `npm run typecheck` 오류 0 | 명령 실행 |
| C2 | 단위 테스트 전부 통과 (기준 285개, 0단계 이후) | `npm run test:unit`, 통과·실패 개수 줄 확인 |
| C3 | 브라우저 테스트 전부 통과 (기준 129개) | `npm run test:e2e` |
| C4 | 그림이 없는 자리는 임시 그래픽으로 정상 표시 | `#gallery` 눈 확인 |
| C5 | 저장·불러오기 호환 (예전 저장본이 그대로 열림) | `save.spec.ts`, 어른 설정 백업 되살리기 |
| C6 | 이름 오타 없음 ('쓰이지 않는 그림' 0개) | `npm run test:unit` 의 그림 경로 테스트 |
| C7 | 그림 요청이 모두 성공 (404 0건) | `ui.spec.ts` 의 '그림 요청은 모두 성공한다' |
| C8 | 그림 전체 용량 ≤ 6MB | `npm run build` 의 `[math-town] 그림 …` 줄, 넘으면 경고 |

**단계마다 더 확인할 것**

| 단계 | 완료 조건 | 테스트 항목 |
|---|---|---|
| 0 | 교체 지점 4곳 수정, 신규 경로 확정, PNG/WebP 양쪽 인식 | C1~C8 + 그림 현황 109자리 집계 |
| 1 | 물건·재료 43장이 모든 화면(놀이·보상·공방·가방·도감)에 반영 | 그림 현황 `mathItem 30/30`, `resource 13/13` / `rewards.spec.ts`, `stickers.spec.ts` / axe |
| 2 | 캐릭터 15장, 옷 6종이 PNG 위에서도 보임 | `ui.spec.ts` 캐릭터 15개 / `outfits.spec.ts` / 보상·말풍선 눈 확인 |
| 3 | 배경 8장, 낮·저녁·밤 × 4계절 12조합 유지, 방 사진 정상 | `room.spec.ts`, 사진 저장 눈 확인, `data-sky` 속성 |
| 4 | 가구 19장, 배치·회전·충돌·색 3종 유지 | `room.spec.ts` 전체, 방 사진, 색 바꾸기 눈 확인 |
| 5 | 벽 장식 6 + 벽지 1, 벽 각도·띠 높이·이음새 정상 | `extras.spec.ts`, 벽지 이음새 눈 확인 |
| 6 | 마을 풍경 6 + 타이틀 1, 안개·자물쇠·리본이 그림 위에 보임 | `i18n.spec.ts`, 지도 가로 스크롤, 타이틀 가로 화면 |
| 7 | 반려 4장, 빈 칸 걸어다니기·움직임 줄이기 유지 | `pets.spec.ts` |
| 8 | 성능·용량·화면 크기·접근성 회귀 없음 | CPU 6배 느리게, 320px·844×390 × 영어·한국어, axe 14화면 × 2언어, 키보드만으로 놀이 끝내기 |

## 7. 승인 전 확인이 필요한 사항

### 7.1 그림 제작 주체

이 작업 환경에는 이미지 생성 도구가 없다 (`ART_BIBLE.md` 가 코드 SVG 를 택한 이유).

- **가능한 범위:** 0단계 기반 정비, 레지스트리·레이어·테스트 정비, 파일 이름·규격·좌표 명세서 작성, 그림 투입 후 적용·검증
- **외부에서 필요한 것:** 106장의 수채화 PNG/WebP 제작 자체

→ 개발 원칙 3(실제 PNG/WebP 제작·적용)을 끝까지 대행할 수 없으므로, 착수 전에 제작 주체를 정해야 한다.

### 7.2 버전 관리

~~현재 폴더에 `.git` 이 없다.~~ 0단계에서 `git init` 하고 기준선 커밋을 만들었다.

---

## 8. 0단계 완료 기록 (2026-11-01)

그림 파일은 한 장도 넣지 않았다. **그림을 넣었을 때 조용히 깨질 곳을 미리 고치는 단계**였다.

| 고친 것 | 파일 | 왜 |
|---|---|---|
| 방 사진에 그림 넣기 | `src/features/photo/roomPhoto.ts` | `<img>` 로 읽은 SVG 는 밖의 그림을 못 불러온다 → 복사본의 `<image>` 를 `data:` 주소로 바꿔 넣는다 |
| 옷 겹 분리 | `src/features/outfits/OutfitLayer.tsx` (새 파일), `LuluSvg.tsx`, `Character.tsx` | 옷이 `LuluSvg` 안에 있어서 루루 PNG 를 넣으면 사라졌다 → 그림 위에 따로 얹는다 |
| 배경 겹 분리 | `src/features/room/RoomBackground.tsx` | `room-base.png` 한 장이 창문·계절·시간을 다 덮어 버렸다 → 바닥·벽 / 하늘 3 / 숲 4 로 나누고, 창문틀·햇빛은 늘 코드로 그린다 |
| 스티커 경로 통일 | `StickerBookScreen.tsx`, `StickerCloseUp.tsx`, `stickers.ts` | `ItemArt` 직접 호출이라 `items/` 그림을 넣어도 스티커만 SVG 로 남았다 |
| 새 그림 자리 등록 | `src/data/assets/assetRegistry.ts` | 창밖 하늘 3·숲 4·타이틀 1·마을 풍경 6·반려 4·옷 6 (24자리). 이름 규칙 `kebab()` 확정 |
| PNG/WebP 양쪽 인식 | `assetRegistry.ts` (`resolveAsset`, `indexAssets`) | 경로는 `.png` 로 적어도 같은 이름의 `.webp` 가 있으면 그 파일을 쓴다 |
| 용량 예산·경고 | `build/offline.ts` (`ASSET_BUDGET_BYTES` 6MB) | 처음 설치할 때 그림을 모두 내려받으므로, 넘으면 빌드가 경고한다 |
| e2e 테스트 뜻 바꾸기 | `tests/ui.spec.ts` | '요청 0건'을 단정해서 그림을 넣으면 깨졌다 → '요청한 그림은 모두 200' |
| 그림 자리 점검 확장 | `src/data/assets/assets.test.ts` | 109자리 집계, 이름 규칙, WebP 우선, 스티커 경로 일치 (테스트 4개 추가) |

**그림 자리 109개** — 배경 2 · 창밖 하늘 3 · 창밖 숲 4 · 캐릭터 15 · 가구 26 · 물건 30 · 재료 13 · 마을 풍경 6 · 반려 4 · 옷 6. 지금은 전부 0/109.

**아직 화면에 연결하지 않은 것** (경로만 등록) — 타이틀 풍경(6단계), 마을 풍경(6단계), 반려 친구(7단계).
그 단계에서 `TitleScene.tsx`, `RegionLandmark.tsx`, `PetArt.tsx` 를 `AssetIcon` 방식으로 바꾼다.

**받아들인 변화 하나** — 옷을 따로 얹으면서 수채화 필터(`#wc-small`)가 루루 몸과 옷에 각각 걸린다.
옷 가장자리의 물감 번짐이 아주 조금 달라진다. 겹을 나누는 목적과 맞바꾼 것이다.
