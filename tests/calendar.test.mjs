import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, addMonths, dateValue, formatDate, monthDays, readDate } from '../src/calendar.js';

test('Date-only values survive local serialization, leap days and year boundaries', () => {
  assert.equal(dateValue(new Date(2026, 8, 21, 0, 1)), '2026-09-21');
  assert.equal(dateValue(readDate('2028-02-29')), '2028-02-29');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2027-01-01', -1), '2026-12-31');
});
test('Month navigation clamps to the last real day; calendar weeks start on Monday', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2028-01-31', 1), '2028-02-29');
  assert.equal(addMonths('2028-02-29', 12), '2029-02-28');
  assert.equal(addMonths('2027-01-31', -1), '2026-12-31');
  for (const value of ['2026-02-01', '2026-09-21', '2028-02-29']) {
    const days = monthDays(value);
    assert.equal(days.length, 42);
    assert.equal(new Set(days).size, 42);
    assert.equal(readDate(days[0]).getDay(), 1);
    assert.ok(days.includes(value));
    assert.equal(days[41], addDays(days[0], 41));
  }
});
test('Visible dates, months and weekdays use the explicit site locale', () => {
  assert.equal(formatDate('2026-09-22', 'vi'), '22/09/2026');
  assert.equal(formatDate('2026-09-22', 'en'), '22/09/2026');
  assert.equal(formatDate('2026-09-22', 'ru'), '22.09.2026');
  for (const lang of ['en', 'vi']) {
    const label = formatDate('2026-09-22', lang, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    assert.ok(!/[А-Яа-яЁё]/.test(label));
  }
  assert.match(formatDate('2026-09-22', 'vi', { month: 'long' }), /tháng/i);
});
