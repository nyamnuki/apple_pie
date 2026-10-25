import { useEffect, useState } from 'react';
import { playMusic, stopMusic, type TrackId } from './music';
import { useSound } from './SoundProvider';

// 화면에는 보이지 않는 배경 음악 담당.
// 음악이 켜져 있고, 아이가 화면을 한 번 눌렀고, 앱이 보이는 동안에만 track 을 튼다.
// (다른 앱으로 넘어가거나 화면을 끄면 멈춰서 배터리를 아낀다)
export default function MusicManager({ track }: { track: TrackId }) {
  const { musicOn, interacted } = useSound();
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  useEffect(() => {
    if (musicOn && interacted && visible) playMusic(track);
    else stopMusic();
  }, [musicOn, interacted, visible, track]);

  // 앱이 꺼질 때 음악도 정리
  useEffect(() => () => stopMusic(0.1), []);

  return null;
}
