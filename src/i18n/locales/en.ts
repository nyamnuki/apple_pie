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
    viewLabel: 'Your room',
  },
  decorate: {
    title: 'Decorate',
    trayLabel: 'Things you can put in your room',
    hintPick: 'Pick something for your room!',
    hintPlace: 'Tap a spot with a + to put it there.',
    hintSelected: 'You can move it, turn it, or put it away.',
    hintMove: 'Tap a new spot with a +.',
    placed: 'Nice! It fits just right.',
    spotTaken: 'That spot is busy. Try a spot with a +.',
    cantTurn: "There isn't enough room to turn it here.",
    noSpace: 'The room is full. Put something away first.',
    wallpaperOn: 'Your walls look brand new!',
    wallpaperOff: 'Back to plain walls.',
    inRoom: 'In room',
    move: 'Move',
    turn: 'Turn',
    putAway: 'Put away',
    done: 'Done',
    cancel: 'Cancel',
  },
  furniture: {
    leafBed: { name: 'Leaf Bed', description: 'A soft bed made of big green leaves.' },
    petalRug: { name: 'Petal Rug', description: 'A round rug made of flower petals.' },
    mushroomLamp: { name: 'Mushroom Lamp', description: 'A mushroom that glows softly at night.' },
    forestBookshelf: { name: 'Forest Bookshelf', description: 'A wooden shelf full of storybooks.' },
    woodenDesk: { name: 'Wooden Desk', description: 'A little desk for drawing and counting.' },
    flowerPot: { name: 'Flower Pot', description: 'A pot of happy little flowers.' },
    toyChest: { name: 'Toy Chest', description: 'A chest to keep your toys safe.' },
    woodlandWallpaper: { name: 'Woodland Wallpaper', description: 'Wallpaper with leaves and tiny stars.' },
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
    floorSpot: 'Floor spot, row {row}, column {col}',
    furnitureInRoom: '{name} in your room',
    furnitureSelected: '{name}, selected',
  },
};
