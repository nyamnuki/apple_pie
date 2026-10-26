import { useEffect, useRef, useState } from 'react';
import BigButton from '../../components/BigButton';
import RegionIcon from '../../components/RegionIcon';
import { ItemArt } from '../../components/art/itemArt';
import { ArrowLeft, ArrowRight, Volume2, X } from '../../components/icons';
import { getRegion } from '../../data/regions/regions';
import type { StickerDef } from '../../data/stickers/stickers';
import { useI18n } from '../../i18n';
import { useSound } from '../../services/audio/SoundProvider';
import { canSpeak, speak, stopSpeaking } from '../../services/speech/speech';

interface Props {
  list: StickerDef[]; // 모은 스티커 (도감 순서). 화살표로 넘겨 본다
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

// 스티커 크게 보기: 큰 그림, 이름, 받은 마을. 열거나 넘길 때 이름을 읽어 준다 (자동 읽기를 켰을 때).
// Esc 나 닫기로 닫으면 누른 스티커로 초점이 돌아간다 (StickerBookScreen).
export default function StickerCloseUp({ list, index, onIndex, onClose }: Props) {
  const { t, tKey, locale } = useI18n();
  const { voiceOn, interacted } = useSound();
  const [speakable] = useState(() => canSpeak(locale));
  const closeRef = useRef<HTMLButtonElement>(null);
  const sticker = list[index];
  const name = tKey(sticker.nameKey);
  const many = list.length > 1;
  const go = (step: number) => onIndex((index + step + list.length) % list.length);

  useEffect(() => closeRef.current?.focus(), []);
  useEffect(() => {
    if (speakable && voiceOn && interacted) speak(name, locale);
  }, [name, locale, speakable, voiceOn, interacted]);
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
        else if (many && e.key === 'ArrowLeft') go(-1);
        else if (many && e.key === 'ArrowRight') go(1);
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="sticker-name" className="storybook-card relative flex max-h-full w-full max-w-sm flex-col items-center gap-3 overflow-y-auto rounded-[2rem] p-6 text-center [@media(max-height:500px)]:max-w-xl [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:p-4">
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t('stickers.close')} className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream shadow-pop-sm">
          <X size={26} aria-hidden />
        </button>
        {/* 흰 테두리를 두른 큰 스티커 (도감처럼 살짝 기울임) */}
        <span key={sticker.id} data-closeup={sticker.id} className="mt-4 flex h-44 w-44 shrink-0 animate-hop items-center justify-center rounded-[2.5rem] bg-white shadow-pop-sm ring-8 ring-white [@media(max-height:500px)]:mt-0 [@media(max-height:500px)]:h-36 [@media(max-height:500px)]:w-36">
          <span className="rotate-[-4deg]">
            <ItemArt path={sticker.art} size={136} />
          </span>
        </span>
        <div className="flex w-full flex-col items-center gap-3">
          <h2 id="sticker-name" className="text-3xl font-bold">
            {name}
          </h2>
          <p className="flex items-center gap-2 text-lg font-semibold">
            <RegionIcon id={sticker.region} size={28} />
            {t('stickers.from', { region: tKey(getRegion(sticker.region).nameKey) })}
          </p>
          {speakable && (
            <BigButton variant="sage" onClick={() => speak(name, locale)}>
              <Volume2 size={26} aria-hidden />
              {t('stickers.hear')}
            </BigButton>
          )}
          {many && (
            <div className="grid w-full grid-cols-2 gap-3">
              <BigButton variant="soft" onClick={() => go(-1)} aria-label={t('stickers.prev')}>
                <ArrowLeft size={28} aria-hidden />
              </BigButton>
              <BigButton variant="soft" onClick={() => go(1)} aria-label={t('stickers.next')}>
                <ArrowRight size={28} aria-hidden />
              </BigButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
