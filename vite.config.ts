import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 로 빌드하면 어느 주소(하위 폴더 포함)에 올려도 파일 경로가 깨지지 않는다.
export default defineConfig({
  plugins: [react()],
  base: './',
});
