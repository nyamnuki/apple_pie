import { readString, writeString, isStorageAvailable } from './localStore';
import { sanitizeGame, sanitizeRoom } from './sanitize';
import { createInitialGameState, type GameState } from '../../app/gameState';
import { DEFAULT_LAYOUT } from '../../features/room/roomState';
import type { RoomLayout } from '../../types/furniture';

// ===== 게임 저장 =====
// 언어 설정(mathTown.locale)과는 다른 칸에 저장한다.
export const SAVE_KEY = 'mathTown.save';
export const BACKUP_KEY = 'mathTown.save.backup'; // 읽을 수 없던 저장본을 버리지 않고 보관하는 칸
export const SCHEMA_VERSION = 2;

// 저장 데이터의 모양 (schemaVersion 이 바뀌면 아래 MIGRATIONS 에 변환 방법을 추가한다)
export interface SaveData {
  schemaVersion: number;
  savedAt: string; // 저장 시각 (ISO 형식)
  game: GameState;
  room: RoomLayout;
}

// 옛 버전 저장본을 다음 버전 모양으로 바꾸는 방법.
// 버전을 올릴 때마다 '이전 번호: 변환 방법' 을 한 줄씩 추가한다.
type Migration = (data: Record<string, unknown>) => Record<string, unknown>;
const MIGRATIONS: Record<number, Migration> = {
  // 1 → 2: 벽 장식(wallItems)이 생겼다. 옛 저장본에는 벽 장식이 없으므로 빈 목록으로.
  1: (data) => {
    const room = typeof data.room === 'object' && data.room !== null ? data.room : {};
    return { ...data, schemaVersion: 2, room: { ...room, wallItems: [] } };
  },
};

// 불러온 결과: loaded(정상) / new(처음) / recovered(망가져서 새로 시작) / unavailable(저장 불가 브라우저)
export type LoadStatus = 'loaded' | 'new' | 'recovered' | 'unavailable';

export interface LoadResult {
  game: GameState;
  room: RoomLayout;
  status: LoadStatus;
}

const fresh = (status: LoadStatus): LoadResult => ({ game: createInitialGameState(), room: DEFAULT_LAYOUT, status });

function migrate(data: Record<string, unknown>): Record<string, unknown> | null {
  let current = data;
  while (typeof current.schemaVersion === 'number' && current.schemaVersion < SCHEMA_VERSION) {
    const step = MIGRATIONS[current.schemaVersion];
    if (!step) return null;
    current = step(current);
  }
  return current.schemaVersion === SCHEMA_VERSION ? current : null; // 모르는(더 새로운) 버전은 읽지 않는다
}

export function loadGame(): LoadResult {
  if (!isStorageAvailable()) return fresh('unavailable');
  const text = readString(SAVE_KEY);
  if (text === null) return fresh('new');

  try {
    const parsed = parseSave(text);
    if (!parsed) throw new Error('unreadable');
    return { ...parsed, status: 'loaded' };
  } catch {
    // 읽을 수 없는 저장본: 지우지 않고 보관해 둔 뒤 새로 시작한다
    writeString(BACKUP_KEY, text);
    return fresh('recovered');
  }
}

// 저장 글(JSON)을 읽어 검사한다: 버전 변환 → 이상한 부분 버리기. 읽을 수 없으면 null.
// 기기 안 저장본과 백업 파일이 같은 규칙을 쓴다.
export function parseSave(text: string): { game: GameState; room: RoomLayout } | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    const record = parsed as Record<string, unknown>;
    if (typeof record.game !== 'object' || record.game === null) return null;
    const data = migrate(record);
    if (!data) return null;
    const game = sanitizeGame(data.game);
    return { game, room: sanitizeRoom(data.room, game) };
  } catch {
    return null;
  }
}

// 백업 파일 내용 (어른 설정 → 파일로 저장). 서버로 보내지 않고 기기에 파일로만 내려받는다.
export const BACKUP_APP = 'math-town';
export function backupText(game: GameState, room: RoomLayout): string {
  return JSON.stringify({ app: BACKUP_APP, schemaVersion: SCHEMA_VERSION, savedAt: new Date().toISOString(), game, room }, null, 2);
}

export function saveGame(game: GameState, room: RoomLayout): boolean {
  const data: SaveData = { schemaVersion: SCHEMA_VERSION, savedAt: new Date().toISOString(), game, room };
  return writeString(SAVE_KEY, JSON.stringify(data));
}

// 마지막 저장 시각 (설정 화면 표시용). 없으면 null
export function readSavedAt(): Date | null {
  try {
    const savedAt = JSON.parse(readString(SAVE_KEY) ?? 'null')?.savedAt;
    const date = typeof savedAt === 'string' ? new Date(savedAt) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  } catch {
    return null;
  }
}
