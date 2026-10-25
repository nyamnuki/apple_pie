import { defineConfig, devices } from '@playwright/test';

// ===== 자동 테스트 설정 =====
// npm test 를 실행하면: 배포용으로 빌드 → 미리보기 서버를 켜고 → tests/ 의 테스트를 실제 브라우저(Chromium)로 돌린다.
// 처음 한 번은 브라우저를 내려받아야 한다:  npx playwright install chromium
const PORT = 4321;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}/`,
    ...devices['Pixel 7'], // 기본은 휴대폰 크기 (테스트마다 바꿀 수 있음)
    browserName: 'chromium',
    // 서비스 워커(인터넷 없이 실행)는 보통 테스트에서 끈다. tests/offline.spec.ts 에서만 켠다.
    serviceWorkers: 'block',
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
