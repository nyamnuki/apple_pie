# Math Town — My Little Woodland Room

5~7세 어린이를 위한 수학 놀이 + 숲속 방 꾸미기 웹 게임입니다.
기본 언어는 영어이고, 설정에서 한국어를 고를 수 있습니다.

## 실행 방법

```bash
npm install      # 처음 한 번만: 필요한 패키지 설치
npm run dev      # 개발 서버 실행 → 터미널에 나오는 주소를 브라우저로 열기
npm run build    # 배포용 파일 만들기 (타입 검사 포함) → dist/ 폴더
npm run preview  # 만든 배포용 파일을 미리 보기
```

## 문구(번역) 고치는 법

- 화면 문구는 모두 `src/i18n/locales/en.ts`(영어)와 `ko.ts`(한국어)에 있습니다.
- 새 문구는 두 파일에 **같은 키**로 넣습니다. 한쪽에 빠뜨리면 `npm run build` 가 오류로 알려줍니다.
- 화면 코드에서는 `t('menu.play')` 처럼 키로 불러 씁니다.

## 폴더 안내

| 폴더 | 내용 |
|---|---|
| `src/app/` | 화면 전환, 타이틀 화면 |
| `src/features/room/` | 내 방 화면, 아이소메트릭 방 그리기, 배치 규칙 |
| `src/features/room/decorate/` | 방 꾸미기 화면 (놓기·옮기기·돌리기·치우기) |
| `src/features/settings/` | 설정 화면 (언어 선택) |
| `src/features/math/` | 수학 놀이 (놀이 고르기, 6단계 진행, 힌트, 장면 화면) |
| `src/data/math/` | 수학 놀이 목록 (수량·정답·선택지·보상 재료)과 물건 그림 |
| `src/features/rewards/` | 놀이를 끝냈을 때 보상 화면 |
| `src/features/workshop/` | 공방 (재료로 가구 만들기) |
| `src/features/inventory/` | 내 가방 (모은 재료와 가진 가구) |
| `src/data/resources/`, `src/data/regions/` | 마을별 재료와 마을 목록 |
| `src/app/gameState.ts` | 플레이어 상태 (재료·가구·끝낸 놀이)와 보상·만들기 규칙 |
| `src/data/furniture/` | 가구 목록 (크기, 차지하는 칸, 그림 경로, 이름 키) |
| `src/data/assets/` | Asset Registry — 그림 경로 모음 |
| `src/types/` | 데이터 모양 정의 (가구, 방 배치) |
| `src/components/` | 여러 화면에서 같이 쓰는 버튼·틀 |
| `src/i18n/` | 다국어 시스템과 언어 파일 |
| `src/services/` | 브라우저 저장, 그림 파일 확인 도우미 |
| `src/styles/` | 색상 변수와 공통 스타일 |
| `public/assets/` | 그림 파일 넣는 곳 (규칙은 그 폴더의 README) |

## 수학 놀이 추가하는 법

1. `src/types/math.ts` 의 `LessonId` 에 새 id 추가
2. `src/data/math/lessons.ts` 에 장면(수량)과 선택지 추가 — 정답은 자동 계산
3. `src/i18n/locales/en.ts`, `ko.ts` 의 `lessons` 에 같은 id 로 문장 12개 추가
   (빠뜨리면 `npm run build` 가 알려줍니다)

## 보상과 공방

- 놀이를 끝까지 하면 그 마을의 재료를 받습니다 (정답 여부와 상관없음). 처음 끝낸 놀이는 황금 도토리 보너스.
- 받는 재료는 `src/data/math/lessons.ts` 의 `rewards` / `firstTimeBonus` 에서 바꿉니다.
- 가구 레시피는 `src/data/furniture/furniture.ts` 의 `unlockCondition` 에 있습니다.
- 아직 열리지 않은 마을(`src/data/regions/regions.ts` 의 `open: false`)의 재료가 필요한 가구는 자물쇠와 함께 보입니다.

## 가구 추가하는 법

1. `src/data/furniture/furniture.ts` 에 한 줄 추가 (처음부터 가짐 또는 레시피)
2. `src/i18n/locales/en.ts`, `ko.ts` 의 `furniture` 에 이름과 설명 추가
3. (선택) `public/assets/furniture/` 에 그림 넣기 — 없으면 색 상자로 보입니다

## 저장 키

- `mathTown.locale` — 선택한 언어 (게임 진행 데이터와 따로 저장)
