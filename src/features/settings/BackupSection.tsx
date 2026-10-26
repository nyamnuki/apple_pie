import { useRef, useState, type ChangeEvent } from 'react';
import { Save, Download, Upload } from '../../components/icons';
import BigButton from '../../components/BigButton';
import { useGame } from '../../app/GameProvider';
import { useRoom } from '../room/RoomProvider';
import { backupText, parseSave } from '../../services/storage/gameSave';
import { LESSONS } from '../../data/math/lessons';
import { useI18n } from '../../i18n';
import type { GameState } from '../../app/gameState';
import type { RoomLayout } from '../../types/furniture';

type Step = { kind: 'idle' } | { kind: 'saved' } | { kind: 'bad' } | { kind: 'confirm'; data: { game: GameState; room: RoomLayout } } | { kind: 'restored' };

// 어른 설정: 진행 상황을 파일로 저장하고, 파일에서 되살린다 (기기를 바꿀 때).
// 파일은 이 기기에만 내려받고, 어디로도 보내지 않는다. 되살리기 전에는 무엇이 들어 있는지 보여 주고 한 번 더 묻는다.
export default function BackupSection({ className }: { className: string }) {
  const { t, formatNumber } = useI18n();
  const { game, dispatch } = useGame();
  const { layout, dispatch: roomDispatch } = useRoom();
  const [step, setStep] = useState<Step>({ kind: 'idle' });
  const input = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([backupText(game, layout)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `math-town-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStep({ kind: 'saved' });
  };

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 같은 파일을 다시 고를 수 있게
    if (!file) return;
    // 아주 큰 파일은 저장본이 아니다
    const data = file.size < 1_000_000 ? parseSave(await file.text()) : null;
    setStep(data ? { kind: 'confirm', data } : { kind: 'bad' });
  };

  const restore = () => {
    if (step.kind !== 'confirm') return;
    dispatch({ type: 'load', state: step.data.game });
    roomDispatch({ type: 'load', layout: step.data.room });
    setStep({ kind: 'restored' });
  };

  return (
    <section aria-labelledby="backup-h" className={className}>
      <h2 id="backup-h" className="mb-2 flex items-center gap-2 text-2xl font-bold">
        <Save size={28} aria-hidden />
        {t('parent.backupTitle')}
      </h2>
      <p className="mb-3 text-lg">{t('parent.backupBody')}</p>

      {step.kind === 'confirm' ? (
        <div role="alertdialog" aria-labelledby="backup-h" aria-describedby="backup-confirm" className="flex flex-col gap-3">
          <p id="backup-confirm" className="text-lg font-semibold">
            {t('parent.restoreConfirm', {
              lessons: formatNumber(step.data.game.completedLessons.length),
              total: formatNumber(LESSONS.length),
              stickers: formatNumber(step.data.game.stickers.length),
            })}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <BigButton variant="soft" onClick={() => setStep({ kind: 'idle' })}>
              {t('parent.cancel')}
            </BigButton>
            <BigButton onClick={restore}>{t('parent.restoreYes')}</BigButton>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <BigButton variant="soft" onClick={download}>
            <Download size={24} aria-hidden />
            {t('parent.backupButton')}
          </BigButton>
          <BigButton variant="soft" onClick={() => input.current?.click()}>
            <Upload size={24} aria-hidden />
            {t('parent.restoreButton')}
          </BigButton>
          <input ref={input} type="file" accept=".json,application/json" className="hidden" aria-label={t('parent.restoreButton')} onChange={pick} data-testid="restore-file" />
        </div>
      )}
      {step.kind !== 'idle' && step.kind !== 'confirm' && (
        <p role="status" className="mt-3 text-lg font-semibold">
          {t(step.kind === 'saved' ? 'parent.backupSaved' : step.kind === 'bad' ? 'parent.restoreBad' : 'parent.restoreDone')}
        </p>
      )}
    </section>
  );
}
