// 벽지 그림이 없을 때 쓰는 나뭇잎·작은 별 무늬 (방의 벽과 목록 썸네일이 같은 무늬를 쓴다)
export default function WallpaperPattern({ id }: { id: string }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="60" height="60">
      <rect width="60" height="60" fill="#A8C3A0" />
      <ellipse cx="15" cy="18" rx="7" ry="4" fill="#D5E4C8" transform="rotate(-35 15 18)" />
      <ellipse cx="45" cy="45" rx="7" ry="4" fill="#D5E4C8" transform="rotate(35 45 45)" />
      <circle cx="45" cy="14" r="2.5" fill="#FFF5DF" />
      <circle cx="14" cy="46" r="2" fill="#FFF5DF" />
    </pattern>
  );
}
