// localStorage 를 안전하게 쓰는 도우미.
// 비공개 창이나 저장 공간 부족으로 localStorage 가 막혀 있어도 앱이 멈추지 않게 한다.

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장이 막힌 환경에서는 조용히 넘어간다 (이번 실행 동안은 화면에 그대로 반영됨)
  }
}
