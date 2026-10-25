import { defineConfig } from 'vitest/config';

// ===== 단위 테스트 설정 (Vitest) =====
// 화면 없이 규칙만 빠르게 검사한다: 정답 계산, 레슨 데이터, 보상·제작, 방 배치, 저장, 번역.
// 테스트 파일은 src 안의 *.test.ts (브라우저 테스트 tests/*.spec.ts 와 따로 실행된다)
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
