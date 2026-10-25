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
    viewLabel: '내 방',
  },
  decorate: {
    title: '방 꾸미기',
    trayLabel: '방에 놓을 수 있는 물건',
    hintPick: '방에 놓을 물건을 골라 봐요!',
    hintPlace: '+ 표시가 있는 곳을 눌러 놓아 봐요.',
    hintSelected: '옮기거나, 돌리거나, 치울 수 있어요.',
    hintMove: '+ 표시가 있는 새 자리를 눌러요.',
    placed: '좋아요! 딱 맞게 들어갔어요.',
    spotTaken: '거기는 자리가 없어요. + 표시가 있는 곳을 눌러 봐요.',
    cantTurn: '여기서는 돌릴 자리가 부족해요.',
    noSpace: '방이 꽉 찼어요. 먼저 물건 하나를 치워 봐요.',
    wallpaperOn: '벽이 새것처럼 바뀌었어요!',
    wallpaperOff: '원래 벽으로 돌아왔어요.',
    inRoom: '방에 있음',
    move: '옮기기',
    turn: '돌리기',
    putAway: '치우기',
    done: '다 했어요',
    cancel: '그만두기',
  },
  furniture: {
    leafBed: { name: '나뭇잎 침대', description: '커다란 초록 잎으로 만든 폭신한 침대예요.' },
    petalRug: { name: '꽃잎 러그', description: '꽃잎을 모아 만든 동그란 러그예요.' },
    mushroomLamp: { name: '버섯 조명', description: '밤이 되면 은은하게 빛나는 버섯이에요.' },
    forestBookshelf: { name: '숲속 책장', description: '동화책이 가득 꽂힌 나무 책장이에요.' },
    woodenDesk: { name: '나무 책상', description: '그림 그리고 숫자 세기 좋은 작은 책상이에요.' },
    flowerPot: { name: '꽃 화분', description: '작은 꽃이 방긋 핀 화분이에요.' },
    toyChest: { name: '장난감 상자', description: '장난감을 소중히 넣어 두는 상자예요.' },
    woodlandWallpaper: { name: '숲속 벽지', description: '나뭇잎과 작은 별이 그려진 벽지예요.' },
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
    floorSpot: '바닥 {row}번째 줄 {col}번째 칸',
    furnitureInRoom: '방에 있는 {name}',
    furnitureSelected: '{name}, 선택됨',
  },
};
