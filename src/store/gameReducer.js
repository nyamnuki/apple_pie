import { createInitialState, todayKey } from './initialState.js';

// 게임 상태를 바꾸는 모든 동작을 한곳에서 처리한다.
// (2단계 이후 채굴·업그레이드·제련 동작을 여기에 추가해 간다)
export function gameReducer(state, action) {
  switch (action.type) {
    // 자원 더하기: payload = { apple: 2, ... }
    case 'ADD_RESOURCES': {
      const resources = { ...state.resources };
      for (const [k, v] of Object.entries(action.payload)) resources[k] = (resources[k] ?? 0) + v;
      return { ...state, resources };
    }

    // 설정 변경: payload = { sound: false } 등
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // 사용 시간 1초 누적 (날짜가 바뀌면 새로 시작)
    case 'TICK_PLAYTIME': {
      const date = todayKey();
      const seconds = state.playtime.date === date ? state.playtime.seconds + (action.seconds ?? 1) : 0;
      return { ...state, playtime: { date, seconds } };
    }

    // 전체 초기화 (부모 설정에서만 사용)
    case 'RESET_ALL':
      return createInitialState();

    default:
      return state;
  }
}
