import { useEffect, useRef } from 'react';

// ===== 휴대폰의 뒤로 가기 버튼 =====
// 앱 화면 이동은 브라우저 기록에 남지 않아서, 안드로이드의 뒤로 가기 버튼(또는 브라우저 뒤로)이
// 앱을 통째로 닫아 버린다. 그래서 기록에 '자리 하나'를 끼워 두고, 뒤로 가기가 오면
// 지금 화면이 정한 '뒤로' 동작(머리말의 ← 버튼과 같은 것)을 대신 하고 자리를 다시 끼운다.
// 맨 위 창(크게 보기 등)이 먼저 받는다. 받을 화면이 없으면(타이틀) 브라우저에 맡겨 앱을 나간다.

const handlers: (() => void)[] = [];
let armed = false;

const arm = () => history.pushState({ mathTown: 'back' }, '');

function onPopState() {
  const top = handlers[handlers.length - 1];
  if (!top) {
    armed = false; // 타이틀: 한 번 더 누르면 앱을 나간다
    return;
  }
  arm();
  top();
}

// handler 가 있으면 뒤로 가기를 받는다 (없으면 받지 않는다). 나중에 등록한 것이 먼저.
export function useBackHandler(handler: (() => void) | undefined) {
  const ref = useRef(handler);
  ref.current = handler;
  const active = Boolean(handler);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    if (!armed) {
      armed = true;
      arm();
      window.removeEventListener('popstate', onPopState);
      window.addEventListener('popstate', onPopState);
    }
    const fn = () => ref.current?.();
    handlers.push(fn);
    return () => {
      const i = handlers.lastIndexOf(fn);
      if (i >= 0) handlers.splice(i, 1);
    };
  }, [active]);
}
