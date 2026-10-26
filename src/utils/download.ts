// 파일 하나를 기기에 내려받는다 (백업 파일, 방 사진). 어디로도 보내지 않는다.
export function downloadBlob(blob: Blob, fileName: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // 내려받기가 시작된 뒤에 지운다 (바로 지우면 일부 브라우저에서 내려받지 못한다)
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
