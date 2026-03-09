/**
 * 日本時間（JST = UTC+9）での「今日」を返すユーティリティ
 * サーバー（Vercel）はUTCで動作するため、
 * new Date() をそのまま使うと日本時間とずれる
 */

export function getJSTDate(): { year: number; month: number; day: number } {
  const now = new Date();
  // Asia/Tokyo タイムゾーンで日付を取得
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  return {
    year: jst.getFullYear(),
    month: jst.getMonth() + 1,
    day: jst.getDate(),
  };
}

export function getJSTNow(): Date {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}
