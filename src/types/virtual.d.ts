// build/assetIndex.ts 가 만드는 그림 파일 목록 (public/assets/ 기준 경로)
declare module 'virtual:asset-index' {
  const files: string[];
  export default files;
}
