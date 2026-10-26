import CountField from './CountField';
import CompareField from './CompareField';
import AddField from './AddField';
import SubtractField from './SubtractField';
import PatternField from './PatternField';
import ShapesField from './ShapesField';
import GroupsField from './GroupsField';
import MeasureField from './MeasureField';
import HopsField from './HopsField';
import PairsField from './PairsField';
import type { FieldMode } from './useSequence';
import type { MathScene } from '../../../types/math';

// 장면 종류에 맞는 화면을 고른다
export default function SceneField({ scene, mode, onDone }: { scene: MathScene; mode: FieldMode; onDone?: () => void }) {
  switch (scene.kind) {
    case 'count':
      return <CountField scene={scene} mode={mode} onDone={onDone} />;
    case 'compare':
      return <CompareField scene={scene} mode={mode} onDone={onDone} />;
    case 'add':
      return <AddField scene={scene} mode={mode} onDone={onDone} />;
    case 'subtract':
      return <SubtractField scene={scene} mode={mode} onDone={onDone} />;
    case 'pattern':
      return <PatternField scene={scene} mode={mode} onDone={onDone} />;
    case 'shapes':
      return <ShapesField scene={scene} mode={mode} onDone={onDone} />;
    case 'groups':
      return <GroupsField scene={scene} mode={mode} onDone={onDone} />;
    case 'measure':
      return <MeasureField scene={scene} mode={mode} onDone={onDone} />;
    case 'hops':
      return <HopsField scene={scene} mode={mode} onDone={onDone} />;
    case 'pairs':
      return <PairsField scene={scene} mode={mode} onDone={onDone} />;
  }
}
