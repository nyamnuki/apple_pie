import { useCallback, useSyncExternalStore } from 'react';

// 그림 파일이 있는지 확인하는 도우미.
// 'ok' 면 그림을 쓰고, 'loading'(확인 중)이나 'missing'(없음)이면 임시 그래픽을 그린다.
// 같은 그림은 한 번만 확인해서 결과를 기억한다.
export type AssetStatus = 'loading' | 'ok' | 'missing';

const statusCache = new Map<string, AssetStatus>();
const listeners = new Map<string, Set<() => void>>();

function setStatus(url: string, status: AssetStatus) {
  statusCache.set(url, status);
  listeners.get(url)?.forEach((notify) => notify());
}

function check(url: string) {
  if (statusCache.has(url)) return;
  statusCache.set(url, 'loading');
  const img = new Image();
  img.onload = () => setStatus(url, 'ok');
  img.onerror = () => setStatus(url, 'missing');
  img.src = url;
}

export function useAssetStatus(url: string | null): AssetStatus {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!url) return () => {};
      check(url);
      let set = listeners.get(url);
      if (!set) listeners.set(url, (set = new Set()));
      set.add(notify);
      return () => {
        set.delete(notify);
      };
    },
    [url],
  );
  return useSyncExternalStore(subscribe, () => (url ? (statusCache.get(url) ?? 'loading') : 'missing'));
}
