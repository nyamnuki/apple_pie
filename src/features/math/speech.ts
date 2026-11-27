import { en } from '../../i18n/locales/en';
import { lessonKey } from '../../data/math/lessons';
import type { LessonId, LessonTextPart } from '../../types/math';

// ===== 소리로 읽는 놀이 문장 =====
// 화면 글은 수·물건 이름까지 다 보여 주지만, 소리는 미리 녹음해 둔 목소리로 읽는다 (src/services/speech/clips.ts).
// 수·물건이 판마다 바뀌는 문장은 모든 경우를 녹음할 수 없으므로, 그것을 뺀 짧은 문장(say.lessons.<놀이>.<부분>)을 읽는다.
// 짧은 문장이 없는 부분은 화면 글을 그대로 읽는다 (늘 같은 문장이거나, 바뀌는 경우가 적은 문장).

type Translate = (key: string, vars?: Record<string, string | number>) => string;
const SAY = en.say.lessons as Partial<Record<LessonId, Partial<Record<LessonTextPart, string>>>>;

export const hasSay = (id: LessonId, part: LessonTextPart) => Boolean(SAY[id]?.[part]);
export const sayKey = (id: LessonId, part: LessonTextPart) => `say.lessons.${id}.${part}`;

// 놀이 문장 한 부분을 소리로 읽을 글
export function spokenPart(id: LessonId, part: LessonTextPart, vars: Record<string, string>, t: Translate): string {
  return hasSay(id, part) ? t(sayKey(id, part), vars) : t(lessonKey(id, part), vars);
}
