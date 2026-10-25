import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { SOUNDS } from './sound';
import { readString, writeString } from '../storage/localStore';

// 설정은 게임 데이터·언어와 따로 저장한다
export const SETTINGS_KEY = 'mathTown.settings';

interface Settings {
  sound: boolean;
}

function loadSettings(): Settings {
  try {
    const raw = JSON.parse(readString(SETTINGS_KEY) ?? '{}');
    return { sound: typeof raw?.sound === 'boolean' ? raw.sound : true }; // 처음에는 소리 켬
  } catch {
    return { sound: true };
  }
}

interface SoundValue {
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  play: typeof SOUNDS; // 소리가 꺼져 있으면 아무것도 하지 않는다
}

const SoundContext = createContext<SoundValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundOn, setOn] = useState(() => loadSettings().sound);

  const setSoundOn = useCallback((on: boolean) => {
    setOn(on);
    writeString(SETTINGS_KEY, JSON.stringify({ sound: on }));
  }, []);

  const play = useMemo(() => {
    const silent = Object.fromEntries(Object.keys(SOUNDS).map((k) => [k, () => {}])) as unknown as typeof SOUNDS;
    return soundOn ? SOUNDS : silent;
  }, [soundOn]);

  const value = useMemo(() => ({ soundOn, setSoundOn, play }), [soundOn, setSoundOn, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound 은 SoundProvider 안에서만 쓸 수 있어요');
  return ctx;
}
