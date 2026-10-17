// localStorage 읽기/쓰기. 비공개 창 등에서 막혀 있어도 앱이 멈추지 않도록 try/catch 로 감싼다.
// 개인정보는 저장하지 않는다 — 게임 진행 상황만 이 기기 안에 남는다.
const KEY = 'mathTown.save.v1';

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSave(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // 저장 공간이 없거나 막힌 경우 조용히 넘어간다
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}
