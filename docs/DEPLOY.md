# 배포 안내 (인터넷에 올리기)

이 게임은 서버가 필요 없는 **정적 사이트**입니다. `npm run build` 로 만든 `dist/` 폴더만 올리면 됩니다.
빌드는 상대 경로(`base: './'`)로 만들어서 `https://주소/` 든 `https://주소/apple_pie/` 같은 하위 폴더든 그대로 동작합니다.

> 진행 상황은 주소(도메인)마다 따로 저장됩니다. 주소를 바꾸면 아이의 진행 상황은 새로 시작됩니다.

## 방법 1. GitHub Pages (추천 — 무료, 자동 갱신)

주소: `https://nyamnuki.github.io/apple_pie/`

### ① Pages 켜기 (저장소 주인이 한 번만)
1. GitHub 에서 `nyamnuki/apple_pie` 저장소 → **Settings** → 왼쪽 **Pages**
2. **Build and deployment → Source** 를 **GitHub Actions** 로 바꿉니다.

### ② 자동 배포 설정 파일 (이미 들어 있음)
`.github/workflows/deploy.yml` 이 저장소에 들어 있습니다. 아래는 그 내용입니다.
`main` 이 바뀔 때마다 자동으로 빌드해 위 주소에 올립니다.
(공개 저장소는 GitHub Actions 사용 시간이 무료입니다. ①이 꺼져 있으면 배포가 실패로 표시됩니다.)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch: # Actions 탭에서 손으로도 실행 가능

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### ③ 확인
저장소의 **Actions** 탭에서 "Deploy to GitHub Pages" 가 초록색 ✓ 이 되면 주소로 들어가 봅니다.

## 방법 2. Netlify Drop (가장 간단 — 계정만 있으면 끝)

1. 내 컴퓨터에서 `npm run build`
2. https://app.netlify.com/drop 에 `dist` 폴더를 끌어다 놓기
3. 나오는 주소로 접속 (업데이트할 때마다 다시 끌어다 놓기)

## 방법 3. 아무 웹 호스팅

`dist/` 안의 파일(`index.html`, `assets/`)을 웹 서버의 원하는 폴더에 그대로 복사하면 됩니다.
특별한 서버 설정은 필요 없습니다.

## 태블릿 홈 화면에 아이콘으로 두기

배포한 주소를 태블릿 브라우저로 연 뒤:
- **iPad (Safari):** 공유 버튼 → "홈 화면에 추가"
- **Android (Chrome):** 메뉴(⋮) → "홈 화면에 추가"

## 배포 전 확인

```bash
npm test          # 자동 테스트 (처음 한 번: npx playwright install chromium)
npm run build     # dist/ 생성
npm run preview   # 배포될 모습 미리 보기
```
