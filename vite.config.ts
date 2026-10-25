import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { offline } from './build/offline';
import { assetIndex } from './build/assetIndex';

// base: './' 로 빌드하면 어느 주소(하위 폴더 포함)에 올려도 파일 경로가 깨지지 않는다.
export default defineConfig({
  plugins: [react(), assetIndex(), offline()], // offline: 인터넷 없이 실행되도록 sw.js 를 만든다
  base: './',
});
