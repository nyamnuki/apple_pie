import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 상대 경로(base: './')로 빌드해서 어느 하위 주소에 올려도 이미지·스크립트 경로가 깨지지 않게 한다.
export default defineConfig({
  plugins: [react()],
  base: './',
});
