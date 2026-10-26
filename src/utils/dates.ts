// 기기 날짜 기준 '2026-10-26' (오늘의 문제 도장, 날마다 끝낸 놀이 수)
export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
