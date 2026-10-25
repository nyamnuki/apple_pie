// localStorage 를 안전하게 쓰는 도우미.
// 비공개 창이나 저장 공간 부족으로 localStorage 가 막혀 있어도 앱이 멈추지 않게 한다.

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

// 저장에 성공하면 true
export function writeString(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // 저장이 막힌 환경에서는 조용히 넘어간다 (이번 실행 동안은 화면에 그대로 반영됨)
    return false;
  }
}

// 이 브라우저에서 저장할 수 있는지 확인 (시험 삼아 썼다 지워 본다)
export function isStorageAvailable(): boolean {
  const key = 'mathTown.__test__';
  try {
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
