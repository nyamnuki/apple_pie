import { useCallback, useEffect, useRef, useState } from 'react';

// 장면을 보여주는 방식
//  static      : 그냥 보여주기 (누를 수 없음)
//  interactive : 아이가 직접 눌러서 진행
//  demo        : 하나씩 자동으로 진행 (시범·확인하기)
//  revealed    : 처음부터 끝난 모습
export type FieldMode = 'static' | 'interactive' | 'demo' | 'revealed';

interface Options {
  steps: number; // 몇 번 누르면 끝나는지
  mode: FieldMode;
  demoOrder: number[]; // 자동 진행할 때 누를 물건 순서
  onDone?: () => void; // 끝났을 때 한 번 불린다
}

const DEMO_DELAY = 800; // 자동 진행 간격 (ms)

// '몇 번째 물건을 눌렀는지'를 기억하는 도우미. 모든 수학 장면이 같이 쓴다.
export function useSequence({ steps, mode, demoOrder, onDone }: Options) {
  const [picked, setPicked] = useState<number[]>(() => (mode === 'revealed' ? demoOrder.slice(0, steps) : []));
  const finished = picked.length >= steps;

  const pick = useCallback(
    (index: number) => setPicked((prev) => (prev.length >= steps || prev.includes(index) ? prev : [...prev, index])),
    [steps],
  );

  // 자동 진행: 다음 순서의 물건을 하나씩 누른다
  useEffect(() => {
    if (mode !== 'demo' || finished) return;
    const next = demoOrder.find((i) => !picked.includes(i));
    if (next === undefined) return;
    const timer = setTimeout(() => pick(next), DEMO_DELAY);
    return () => clearTimeout(timer);
  }, [mode, finished, picked, demoOrder, pick]);

  // 끝나면 한 번만 알려준다
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const reported = useRef(false);
  useEffect(() => {
    if (finished && !reported.current && (mode === 'interactive' || mode === 'demo')) {
      reported.current = true;
      onDoneRef.current?.();
    }
  }, [finished, mode]);

  return { picked, pick, finished };
}

// 0, 1, 2, ... n-1
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
