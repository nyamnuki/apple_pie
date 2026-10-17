import { RESOURCE_KEYS } from '../data/resources.js';
import { BUILDING_KEYS } from '../data/buildings.js';
import { REGIONS } from '../data/regions.js';

// 오늘 날짜 문자열(YYYY-MM-DD, 기기 시간 기준) — 일일 사용 시간 초기화에 쓴다
export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const zeroMap = (keys, value = 0) => Object.fromEntries(keys.map((k) => [k, value]));

// 저장되는 게임 상태의 기본값
export const createInitialState = () => ({
  version: 1,
  resources: zeroMap(RESOURCE_KEYS),
  // 도토리 굴집은 처음부터 1레벨로 시작
  buildings: { ...zeroMap(BUILDING_KEYS), acornBurrow: 1 },
  // 지역별 클리어 횟수
  progress: zeroMap(REGIONS.map((r) => r.id)),
  // 제련으로 얻은 보물(버프) 목록
  treasures: [],
  settings: {
    dailyLimit: 20, // 분 단위, null = 무제한
    sound: true,
  },
  // 오늘 사용한 시간(초)
  playtime: { date: todayKey(), seconds: 0 },
  currentCombo: 0,
  bestCombo: 0,
});

// 저장본과 기본값을 합친다. 나중에 자원·건물이 추가돼도 옛 저장본이 깨지지 않는다.
export function hydrate(saved) {
  const base = createInitialState();
  if (!saved || typeof saved !== 'object') return base;
  const merged = {
    ...base,
    ...saved,
    resources: { ...base.resources, ...saved.resources },
    buildings: { ...base.buildings, ...saved.buildings },
    progress: { ...base.progress, ...saved.progress },
    settings: { ...base.settings, ...saved.settings },
    playtime: { ...base.playtime, ...saved.playtime },
  };
  // 날짜가 바뀌었으면 오늘 사용 시간을 0으로
  if (merged.playtime.date !== todayKey()) merged.playtime = { date: todayKey(), seconds: 0 };
  return merged;
}
