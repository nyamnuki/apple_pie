import { Component, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import AppShell from '../components/AppShell';
import BigButton from '../components/BigButton';
import Character from '../components/characters/Character';
import { useI18n } from '../i18n';

// 예상하지 못한 오류가 나도 하얀 화면 대신 안내 화면을 보여준다.
// (저장된 진행 상황은 이 기기에 그대로 남아 있다)
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // 개발할 때 원인을 찾을 수 있도록 콘솔에 남긴다
    console.error('[Math Town] 화면 오류:', error);
  }

  render() {
    return this.state.failed ? <ErrorScreen /> : this.props.children;
  }
}

function ErrorScreen() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <Character expression="surprised" size={130} />
        <h1 className="text-3xl font-bold">{t('error.title')}</h1>
        <p className="max-w-sm text-xl">{t('error.body')}</p>
        <BigButton size="lg" onClick={() => window.location.reload()}>
          <RotateCcw size={28} aria-hidden />
          {t('error.restart')}
        </BigButton>
      </div>
    </AppShell>
  );
}
