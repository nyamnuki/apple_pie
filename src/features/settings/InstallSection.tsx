import { useEffect, useState } from 'react';
import { Check, Download } from '../../components/icons';
import BigButton from '../../components/BigButton';
import { useI18n, type TranslationKey } from '../../i18n';

type Device = 'ios' | 'android' | 'computer';
const DEVICES: { id: Device; label: TranslationKey; steps: TranslationKey[] }[] = [
  { id: 'ios', label: 'parent.deviceIos', steps: ['parent.iosStep1', 'parent.iosStep2', 'parent.iosStep3'] },
  { id: 'android', label: 'parent.deviceAndroid', steps: ['parent.androidStep1', 'parent.androidStep2', 'parent.androidStep3'] },
  { id: 'computer', label: 'parent.deviceComputer', steps: ['parent.computerStep1', 'parent.computerStep2', 'parent.computerStep3'] },
];

// 지금 기기 짐작 (처음 보여 줄 안내만 고른다. 어른이 다른 기기를 골라 볼 수 있다)
export function guessDevice(ua: string, touchPoints = 0): Device {
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && touchPoints > 1)) return 'ios'; // 아이패드는 맥처럼 보이기도 한다
  if (/Android/.test(ua)) return 'android';
  return 'computer';
}

// 크롬·엣지가 주는 '설치' 요청 (표준이 아니라 타입이 없다)
interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

// 어른 설정: 홈 화면에 추가하는 방법 (기기별 3단계). 이미 앱으로 열었으면 그렇다고만 알린다.
// 브라우저가 바로 설치를 제안할 수 있으면(크롬·엣지) '지금 추가하기' 버튼도 보여 준다.
export default function InstallSection({ className }: { className: string }) {
  const { t } = useI18n();
  const [device, setDevice] = useState<Device>(() => guessDevice(navigator.userAgent, navigator.maxTouchPoints));
  const [installed, setInstalled] = useState(isStandalone);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // 브라우저가 알아서 띄우지 않고 버튼을 누를 때만
      setPrompt(e as InstallPrompt);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const installNow = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    if (outcome === 'accepted') setInstalled(true);
  };

  const steps = DEVICES.find((d) => d.id === device)!.steps;
  return (
    <section aria-labelledby="install-h" className={className}>
      <h2 id="install-h" className="mb-2 flex items-center gap-2 text-2xl font-bold">
        <Download size={28} aria-hidden />
        {t('parent.installTitle')}
      </h2>
      {installed ? (
        <p className="text-lg">{t('parent.installed')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-lg">{t('parent.installBody')}</p>
          {prompt && (
            <BigButton onClick={installNow}>
              <Download size={24} aria-hidden />
              {t('parent.installNow')}
            </BigButton>
          )}
          <div role="radiogroup" aria-label={t('parent.installDevice')} className="grid grid-cols-3 gap-2">
            {DEVICES.map((d) => (
              <BigButton key={d.id} variant={device === d.id ? 'primary' : 'soft'} role="radio" aria-checked={device === d.id} onClick={() => setDevice(d.id)} className="!gap-1 !px-2 !text-base">
                {device === d.id && <Check size={20} strokeWidth={3} aria-hidden className="shrink-0" />}
                {t(d.label)}
              </BigButton>
            ))}
          </div>
          <ol className="flex list-decimal flex-col gap-1 pl-7 text-lg" data-device={device}>
            {steps.map((s) => (
              <li key={s}>{t(s)}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
