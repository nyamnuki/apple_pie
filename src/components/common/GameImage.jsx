import { useState } from 'react';

// 이미지 자리. asset = { src, emoji } (src/assets/images.js 참고)
// 실제 이미지 파일이 있으면 그림을, 없으면(로드 실패) emoji 를 보여준다.
export default function GameImage({ asset, alt = '', className = '', emojiClassName = 'text-5xl' }) {
  const [failed, setFailed] = useState(false);

  if (!asset) return null;
  if (failed || !asset.src) {
    return (
      <span role="img" aria-label={alt} className={`inline-flex items-center justify-center leading-none ${emojiClassName} ${className}`}>
        {asset.emoji}
      </span>
    );
  }
  return <img src={asset.src} alt={alt} className={`object-contain ${className}`} onError={() => setFailed(true)} draggable={false} />;
}
