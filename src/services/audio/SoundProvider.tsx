import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SOUNDS } from './sound';
import { readString, writeString } from '../storage/localStore';

// 설정은 게임 데이터·언어와 따로 저장한다
export const SETTINGS_KEY = 'mathTown.settings';

interface Settings {
  sound: boolean; // 효과음
  music: boolean; // 배경 음악
}

function loadSettings(): Settings {
  try {
    const raw = JSON.parse(readString(SETTINGS_KEY) ?? '{}');
    // 처음에는 둘 다 켬
    return { sound: typeof raw?.sound === 'boolean' ? raw.sound : true, music: typeof raw?.music === 'boolean' ? raw.music : true };
  } catch {
    return { sound: true, music: true };
  }
}

interface SoundValue {
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
  // 아이가 화면을 한 번이라도 눌렀는지 (브라우저 규칙상 그 뒤에만 음악을 틀 수 있다)
  interacted: boolean;
  play: typeof SOUNDS; // 효과음이 꺼져 있으면 아무것도 하지 않는다
}

const SoundContext = createContext<SoundValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);
  const [interacted, setInteracted] = useState(false);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeString(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const setSoundOn = useCallback((on: boolean) => update({ sound: on }), [update]);
  const setMusicOn = useCallback((on: boolean) => update({ music: on }), [update]);

  // 첫 터치·클릭·키 입력을 기다린다
  useEffect(() => {
    if (interacted) return;
    const mark = () => setInteracted(true);
    window.addEventListener('pointerdown', mark, { once: true });
    window.addEventListener('keydown', mark, { once: true });
    return () => {
      window.removeEventListener('pointerdown', mark);
      window.removeEventListener('keydown', mark);
    };
  }, [interacted]);

  const play = useMemo(() => {
    const silent = Object.fromEntries(Object.keys(SOUNDS).map((k) => [k, () => {}])) as unknown as typeof SOUNDS;
    return settings.sound ? SOUNDS : silent;
  }, [settings.sound]);

  const value = useMemo(
    () => ({ soundOn: settings.sound, setSoundOn, musicOn: settings.music, setMusicOn, interacted, play }),
    [settings, setSoundOn, setMusicOn, interacted, play],
  );
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound 은 SoundProvider 안에서만 쓸 수 있어요');
  return ctx;
}
