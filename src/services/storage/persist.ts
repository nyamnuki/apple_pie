// ===== 저장한 진행 상황을 브라우저가 지우지 않게 =====
// 브라우저는 기기 저장 공간이 모자라면(또는 아이폰 사파리는 한동안 열지 않으면) 사이트 데이터를 지울 수 있다.
// navigator.storage.persist() 로 '이 사이트 데이터는 지우지 말아 주세요'라고 요청한다.
// 크롬·사파리는 조용히 결정하고, 파이어폭스는 허락을 묻는 창을 띄운다 → 파이어폭스에서는 저절로 묻지 않는다.

const storage = () => (typeof navigator !== 'undefined' ? navigator.storage : undefined);
const asksUser = () => typeof navigator !== 'undefined' && /Firefox\//.test(navigator.userAgent);

// 이미 지키고 있는지 (알 수 없으면 null)
export async function isPersisted(): Promise<boolean | null> {
  try {
    return (await storage()?.persisted?.()) ?? null;
  } catch {
    return null;
  }
}

// 요청하기. quiet 이면 창을 띄우는 브라우저(파이어폭스)에서는 하지 않는다.
export async function requestPersist(quiet: boolean): Promise<boolean | null> {
  const s = storage();
  if (!s?.persist || (quiet && asksUser())) return null;
  try {
    if (await s.persisted?.()) return true;
    return await s.persist();
  } catch {
    return null;
  }
}
