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
| `src/features/` | 기능별 화면 (room: 내 방, settings: 설정) |
| `src/components/` | 여러 화면에서 같이 쓰는 버튼·틀 |
| `src/i18n/` | 다국어 시스템과 언어 파일 |
| `src/services/storage/` | 브라우저 저장(localStorage) 도우미 |
| `src/styles/` | 색상 변수와 공통 스타일 |

## 저장 키

- `mathTown.locale` — 선택한 언어 (게임 진행 데이터와 따로 저장)
