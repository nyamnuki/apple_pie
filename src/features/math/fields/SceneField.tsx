import CountField from './CountField';
import CompareField from './CompareField';
import AddField from './AddField';
import SubtractField from './SubtractField';
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
  }
}
