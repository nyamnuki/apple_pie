import type { Messages } from '../types';

// 한국어 문구. en.ts 와 키 구조가 완전히 같아야 한다.
// 직역하지 말고 5~7세 아이에게 자연스러운 말로 쓴다.
export const ko: Messages = {
  app: {
    title: '셈셈마을',
    subtitle: '나의 작은 숲속 방',
    promise: '광고 없음 · 결제 없음 · 개인정보 수집 없음',
  },
  menu: {
    start: '시작하기',
    play: '놀이하기',
    decorate: '방 꾸미기',
    settings: '설정',
    back: '뒤로',
  },
  room: {
    title: '나만의 숲속 방',
    placeholder: '아늑한 방이 곧 여기에 생겨요.',
  },
  settings: {
    title: '설정',
    language: '언어',
    english: '영어',
    korean: '한국어',
    selected: '선택됨',
    languageHint: '게임 전체에 쓸 언어를 골라요.',
  },
  math: {
    tryAgain: '다른 방법으로 해 볼까?',
  },
  reward: {
    title: '새로운 것을 발견했어요!',
  },
  common: {
    comingSoon: '곧 만나요!',
    comingSoonDetail: '아직 만들고 있는 곳이에요.',
  },
  a11y: {
    openSettings: '설정 열기',
    goBack: '뒤로 가기',
    mascot: '다정한 토끼 친구',
  },
};
