import { Hammer, LayoutGrid, RotateCcw } from 'lucide-react';
import BigButton from '../../components/BigButton';
import ResourceChip from '../../components/ResourceChip';
import Character from '../../components/characters/Character';
import { bundleEntries } from '../../utils/bundles';
import { useI18n } from '../../i18n';
import type { ResourceBundle } from '../../types/resources';

interface Props {
  rewards: ResourceBundle;
  bonus: ResourceBundle; // 처음 끝냈을 때 보너스 (없으면 빈 묶음)
  discovery: string; // 이번 놀이에서 발견한 원리
  onWorkshop: () => void;
  onAgain: () => void;
  onMoreGames: () => void;
}

// 보상 화면: 받은 재료를 크게 보여주고, 발견한 원리를 다시 짚어 준다. (화려한 효과는 쓰지 않는다)
export default function RewardPanel({ rewards, bonus, discovery, onWorkshop, onAgain, onMoreGames }: Props) {
  const { t } = useI18n();
  const bonusEntries = bundleEntries(bonus);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <Character expression="happy" size={110} bob />
      <h2 className="text-3xl font-bold sm:text-4xl">{t('reward.title')}</h2>

      <section aria-labelledby="reward-got" className="w-full max-w-md rounded-3xl bg-cream p-5 shadow-pop-sm">
        <h3 id="reward-got" className="mb-3 text-xl font-semibold">
          {t('reward.youGot')}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {bundleEntries(rewards).map(([id, n], i) => (
            <span key={id} className="animate-rise" style={{ animationDelay: `${i * 150}ms` }}>
              <ResourceChip id={id} amount={n} prefix="+" size="lg" />
            </span>
          ))}
        </div>
        {bonusEntries.length > 0 && (
          <div className="mt-4 animate-rise rounded-2xl border-4 border-dashed border-oak/50 p-3" style={{ animationDelay: '450ms' }}>
            <p className="mb-2 text-lg font-bold text-oak">{t('reward.firstTimeBonus')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {bonusEntries.map(([id, n]) => (
                <ResourceChip key={id} id={id} amount={n} prefix="+" size="lg" />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="w-full max-w-md rounded-3xl bg-moss/70 p-4">
        <h3 className="mb-1 text-lg text-oak">{t('math.learned')}</h3>
        <p className="text-lg font-semibold">{discovery}</p>
      </section>

      <div className="grid w-full max-w-md gap-3">
        <BigButton size="lg" onClick={onWorkshop}>
          <Hammer size={28} aria-hidden />
          {t('reward.goWorkshop')}
        </BigButton>
        <div className="grid grid-cols-2 gap-3">
          <BigButton variant="soft" onClick={onAgain}>
            <RotateCcw size={24} aria-hidden />
            {t('math.again')}
          </BigButton>
          <BigButton variant="soft" onClick={onMoreGames}>
            <LayoutGrid size={24} aria-hidden />
            {t('math.moreGames')}
          </BigButton>
        </div>
      </div>
    </main>
  );
}
