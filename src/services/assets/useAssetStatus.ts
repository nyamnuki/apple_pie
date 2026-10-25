import { useCallback, useSyncExternalStore } from 'react';
import { hasAsset } from '../../data/assets/assetRegistry';

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
  // 빌드 때 없던 그림은 내려받지 않는다
  if (!hasAsset(url.slice(url.indexOf('assets/') + 'assets/'.length))) {
    statusCache.set(url, 'missing');
    return;
  }
  statusCache.set(url, 'loading');
  const img = new Image();
  img.onload = () => setStatus(url, 'ok');
  img.onerror = () => setStatus(url, 'missing');
  img.src = url;
}

// 아직 확인 전: 목록에 없으면 바로 'missing' (첫 화면부터 임시 그래픽, 깜빡임 없음)
function initial(url: string): AssetStatus {
  check(url);
  return statusCache.get(url) ?? 'loading';
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
  return useSyncExternalStore(subscribe, () => (url ? (statusCache.get(url) ?? initial(url)) : 'missing'));
}
