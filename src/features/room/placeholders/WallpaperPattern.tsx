// 벽지 그림이 없을 때 쓰는 나뭇잎·꽃잎 무늬 (목록 썸네일용. 방의 벽은 RoomBackground 의 같은 무늬를 쓴다)
export default function WallpaperPattern({ id }: { id: string }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="66" height="66">
      <rect width="66" height="66" fill="#DCE8D0" />
      <path d="M8 31 Q15 8 29 20 Q24 34 8 31Z" fill="#A8C3A0" />
      <path d="M39 57 Q37 39 55 36 Q58 50 39 57Z" fill="#B9D1AD" />
      <circle cx="48" cy="12" r="2.5" fill="#F3C6D2" />
      <circle cx="29" cy="43" r="2" fill="#FFF5DF" />
    </pattern>
  );
}
