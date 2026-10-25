// 영어 문구 (기본 언어).
// 새 문구를 추가할 때는 여기에 먼저 넣고, ko.ts 에도 같은 키로 넣는다.
// (ko.ts 에 빠뜨리면 빌드할 때 TypeScript 가 오류로 알려준다)
export const en = {
  app: {
    title: 'Math Town',
    subtitle: 'My Little Woodland Room',
    promise: 'No ads · No purchases · No personal data',
  },
  menu: {
    start: 'Start',
    play: 'Play',
    decorate: 'Decorate',
    settings: 'Settings',
    back: 'Back',
  },
  room: {
    title: 'My Woodland Room',
    placeholder: 'Your cozy room will appear here soon.',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    english: 'English',
    korean: 'Korean',
    selected: 'Selected',
    languageHint: 'Choose the language for the whole game.',
  },
  math: {
    tryAgain: "Let's try another way!",
  },
  reward: {
    title: 'You discovered something new!',
  },
  common: {
    comingSoon: 'Coming soon!',
    comingSoonDetail: 'This part is still being built.',
  },
  a11y: {
    openSettings: 'Open settings',
    goBack: 'Go back',
    mascot: 'A friendly bunny',
  },
};
