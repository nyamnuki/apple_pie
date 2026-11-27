import { translate } from '../../i18n/translate';
import { LESSONS, lessonKey } from '../math/lessons';
import { REGIONS } from '../regions/regions';
import { FURNITURE } from '../furniture/furniture';
import { STICKERS } from '../stickers/stickers';
import { PETS } from '../../features/pets/pets';
import { sceneVars } from '../../features/math/answers';
import { lessonForPlay, MAX_BOOST } from '../../features/math/variation';
import { spokenPart } from '../../features/math/speech';
import { countWord } from '../../services/speech/speech';
import { lineKey } from '../../services/speech/clips';
import type { Locale } from '../../i18n/types';
import type { LessonTextPart, MathScene } from '../../types/math';

// ===== 녹음할 문장 목록 =====
// 앱이 소리로 읽을 수 있는 모든 문장 (녹음해 둔 목소리로 읽기 위해: services/speech/clips.ts).
// 놀이는 판마다 바뀌므로 여러 판을 실제로 만들어 보고 읽을 문장을 모은다.
// 수·물건이 바뀌는 문장은 짧은 듣기용 문장으로 읽으므로 (math/speech.ts) 목록이 유한하다.
// 새 문장을 더하면 이 목록에 저절로 들어가고, 녹음이 없으면 lines.test.ts 가 알려 준다.

const PLAYS = 160; // 놀이마다 만들어 볼 판 수 (도전 단계·난이도마다)

export function voiceLines(locale: Locale): string[] {
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const tr = (key: string) => translate(locale, key);
  const fmt = (n: number) => String(n);
  const lines = new Set<string>();
  const add = (text: string) => {
    const k = lineKey(text);
    if (k) lines.add(k);
  };
  const vars = (scene: MathScene) => sceneVars(scene, fmt, tr);

  for (const lesson of LESSONS) {
    add(t(lessonKey(lesson.id, 'title')));
    for (const part of ['observe', 'manipulate', 'manipulateDone'] as LessonTextPart[]) add(t(lessonKey(lesson.id, part), vars(lesson.explore)));
    add(t(lessonKey(lesson.id, 'discover')));
    for (const level of ['normal', 'hard'] as const)
      for (let boost = 0; boost <= MAX_BOOST; boost++)
        for (let p = 0; p < PLAYS; p++) {
          const v = lessonForPlay(lesson, p, level, boost);
          for (const part of ['predict', 'verify'] as LessonTextPart[]) add(spokenPart(lesson.id, part, vars(v.predict), t));
          for (const part of ['apply', 'hint1', 'hint2', 'hint3', 'correct'] as LessonTextPart[]) add(spokenPart(lesson.id, part, vars(v.apply), t));
        }
  }

  for (const key of ['math.checking', 'math.guessRight', 'math.guessGood', 'math.tryAgain', 'math.completeTitle', 'math.chooseLesson', 'workshop.intro', 'breaks.body', 'settings.slowVoiceOn', 'settings.slowVoiceOff', 'daily.stamp', 'room.lightOn', 'room.lightOff'])
    add(t(key));
  for (const r of REGIONS) add(t(`regions.intro.${r.id}`));
  // 방: 루루의 질문, 안내 (이름이 들어가는 안내는 짧은 문장으로)
  for (const q of ['floor', 'lights', 'wall', 'seats', 'all', 'countTogether']) add(t(`room.quiz.${q}`));
  for (const tip of ['firstGame', 'cozy1', 'cozy2', 'cozy3']) add(t(`room.tips.${tip}`));
  for (const s of ['newRegion', 'place', 'canCraft', 'quizRight']) add(t(`say.room.${s}`));
  // 이름 (읽기 버튼, 스티커 크게 보기, 친구 인사)
  for (const f of FURNITURE) add(t(f.nameKey));
  for (const s of STICKERS) add(t(s.nameKey));
  for (const pet of PETS) add(t('pets.hello', { name: t(pet.nameKey) }));
  // 셀 때 읽는 수 ('하나, 둘, 셋…')
  for (let n = 1; n <= 100; n++) add(countWord(n, locale));

  return [...lines].sort();
}
