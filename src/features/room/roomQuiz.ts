import { getFurniture } from '../../data/furniture/furniture';
import type { TranslationKey } from '../../i18n';
import type { RoomLayout } from '../../types/furniture';

// ===== 방 속 수학: 루루의 질문 =====
// 아이가 꾸민 방이 곧 수학 장면이다. 방에 있는 물건으로 '몇 개일까?'를 묻고,
// 답한 뒤에는 센 물건 위에 1, 2, 3… 번호를 붙여 같이 세어 본다.

export type QuizKind = 'lights' | 'wall' | 'floor' | 'seats' | 'all';

export interface RoomQuiz {
  kind: QuizKind;
  question: TranslationKey;
  counted: string[]; // 세는 물건 uid (번호를 붙일 순서: 뒤에서 앞으로)
  answer: number;
  choices: number[];
}

const QUESTION: Record<QuizKind, TranslationKey> = {
  lights: 'room.quiz.lights',
  wall: 'room.quiz.wall',
  floor: 'room.quiz.floor',
  seats: 'room.quiz.seats',
  all: 'room.quiz.all',
};

function countedFor(kind: QuizKind, layout: RoomLayout): string[] {
  const floor = [...layout.placed].sort((a, b) => a.gx + a.gy - (b.gx + b.gy));
  const cat = (uid: string, list: { uid: string; furnitureId: string }[]) => getFurniture(list.find((p) => p.uid === uid)!.furnitureId)?.category;
  switch (kind) {
    case 'lights':
      return floor.filter((p) => cat(p.uid, floor) === 'light').map((p) => p.uid);
    case 'seats':
      return floor.filter((p) => ['seat', 'bed'].includes(cat(p.uid, floor) ?? '')).map((p) => p.uid);
    case 'floor':
      return floor.filter((p) => cat(p.uid, floor) !== 'rug').map((p) => p.uid);
    case 'wall':
      return layout.wallItems.map((w) => w.uid);
    case 'all':
      return [...layout.wallItems.map((w) => w.uid), ...floor.map((p) => p.uid)];
  }
}

// 선택지 4 개: 정답 둘레의 수 (0 보다 작으면 위쪽으로)
export function quizChoices(answer: number): number[] {
  const start = Math.max(1, Math.min(answer - 1, answer - (answer % 2)));
  return [start, start + 1, start + 2, start + 3];
}

// n 번째 질문 (n 이 바뀔 때마다 다음 종류). 셀 물건이 하나도 없는 종류는 건너뛴다.
export function roomQuiz(layout: RoomLayout, n: number): RoomQuiz | null {
  const kinds: QuizKind[] = ['floor', 'lights', 'wall', 'seats', 'all'];
  for (let k = 0; k < kinds.length; k++) {
    const kind = kinds[(n + k) % kinds.length];
    const counted = countedFor(kind, layout);
    if (counted.length === 0) continue;
    return { kind, question: QUESTION[kind], counted, answer: counted.length, choices: quizChoices(counted.length) };
  }
  return null;
}
