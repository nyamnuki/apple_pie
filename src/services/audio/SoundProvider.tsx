import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SOUNDS, audio } from './sound';
import { readString, writeString } from '../storage/localStore';

// 설정은 게임 데이터·언어와 따로 저장한다
export const SETTINGS_KEY = 'mathTown.settings';

interface Settings {
  sound: boolean; // 효과음
  music: boolean; // 배경 음악
  voice: boolean; // 말풍선이 바뀌면 자동으로 읽어 주기
  bigText: boolean; // 큰 글씨 (앱 전체 글자 12.5% 크게)
  breakMinutes: 0 | 15 | 20 | 30; // 쉬어 가기 알림 (0 = 끔). 어른 설정에서 바꾼다
}

function loadSettings(): Settings {
  try {
    const raw = JSON.parse(readString(SETTINGS_KEY) ?? '{}');
    // 처음에는 모두 켬 (글을 아직 못 읽는 아이를 위해 읽어 주기도 켬)
    const flag = (v: unknown) => (typeof v === 'boolean' ? v : true);
    const breakMinutes = [0, 15, 20, 30].includes(raw?.breakMinutes) ? raw.breakMinutes : 20;
    return { sound: flag(raw?.sound), music: flag(raw?.music), voice: flag(raw?.voice), bigText: raw?.bigText === true, breakMinutes };
  } catch {
    return { sound: true, music: true, voice: true, bigText: false, breakMinutes: 20 };
  }
}

interface SoundValue {
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
  voiceOn: boolean; // 자동 읽어 주기
  setVoiceOn: (on: boolean) => void;
  bigText: boolean;
  setBigText: (on: boolean) => void;
  breakMinutes: Settings['breakMinutes'];
  setBreakMinutes: (m: Settings['breakMinutes']) => void;
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
  const setVoiceOn = useCallback((on: boolean) => update({ voice: on }), [update]);
  const setBigText = useCallback((on: boolean) => update({ bigText: on }), [update]);
  const setBreakMinutes = useCallback((m: Settings['breakMinutes']) => update({ breakMinutes: m }), [update]);

  // 큰 글씨: <html> 에 표시해 두면 CSS 가 글자 기준 크기를 키운다 (모든 글자가 rem 단위라 함께 커진다)
  useEffect(() => {
    document.documentElement.toggleAttribute('data-big-text', settings.bigText);
  }, [settings.bigText]);

  // 첫 터치·클릭·키 입력을 기다린다.
  // 브라우저는 손가락을 '뗄 때'(pointerup·touchend·click)나 키를 누를 때만 소리를 허락하므로
  // 그 순간에 바로 오디오를 만들고 깨운다. (pointerdown 은 휴대폰에서 허락으로 치지 않는다)
  useEffect(() => {
    if (interacted) return;
    const events = ['pointerup', 'touchend', 'click', 'keydown'] as const;
    const mark = () => {
      audio();
      setInteracted(true);
    };
    events.forEach((e) => window.addEventListener(e, mark));
    return () => events.forEach((e) => window.removeEventListener(e, mark));
  }, [interacted]);

  const play = useMemo(() => {
    const silent = Object.fromEntries(Object.keys(SOUNDS).map((k) => [k, () => {}])) as unknown as typeof SOUNDS;
    return settings.sound ? SOUNDS : silent;
  }, [settings.sound]);

  const value = useMemo(
    () => ({ soundOn: settings.sound, setSoundOn, musicOn: settings.music, setMusicOn, voiceOn: settings.voice, setVoiceOn, bigText: settings.bigText, setBigText, breakMinutes: settings.breakMinutes, setBreakMinutes, interacted, play }),
    [settings, setSoundOn, setMusicOn, setVoiceOn, setBigText, setBreakMinutes, interacted, play],
  );
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound 은 SoundProvider 안에서만 쓸 수 있어요');
  return ctx;
}
