import { useEffect, useState } from 'react';

// 방 분위기를 기기 시계에 맞춘다: 낮(6~17시) / 저녁(17~20시) / 밤(그 밖)
export type TimeOfDay = 'day' | 'evening' | 'night';

export function timeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 6 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
}

// 1분마다 다시 확인 (방을 보는 동안 해가 지면 바뀐다)
export function useTimeOfDay(): TimeOfDay {
  const [time, setTime] = useState(() => timeOfDay(new Date()));
  useEffect(() => {
    const timer = window.setInterval(() => setTime(timeOfDay(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}
