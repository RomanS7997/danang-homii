export const dateLocales = { ru: 'ru-RU', en: 'en-GB', vi: 'vi-VN' };

// Date-only values stay in local time. UTC serialization would shift the day
// for visitors in some time zones; noon also avoids daylight-saving boundaries.
export function dateValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function readDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}
export function addDays(value, amount) {
  const date = readDate(value);
  date.setDate(date.getDate() + amount);
  return dateValue(date);
}
export function addMonths(value, amount) {
  const date = readDate(value);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + amount);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return dateValue(date);
}
export function monthDays(value) {
  const first = `${value.slice(0, 7)}-01`;
  const mondayOffset = (readDate(first).getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) => addDays(first, index - mondayOffset));
}
export function formatDate(value, lang, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  return new Intl.DateTimeFormat(dateLocales[lang], options).format(readDate(value));
}
