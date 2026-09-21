import { useId, useLayoutEffect, useRef, useState } from 'react';
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon, XIcon } from '@phosphor-icons/react';
import { useLocale } from './locale.jsx';
import { addDays, addMonths, dateValue, formatDate, monthDays, readDate } from './calendar.js';

/** Custom date UI shared by the lead form and request dialog. Only the hidden
 * ISO value is submitted; browser language never controls visible date text. */
export function DatePicker({ name, label, min = dateValue() }) {
  const { lang, t } = useLocale();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(min);
  const [position, setPosition] = useState({});
  const dialog = useRef(null);
  const trigger = useRef(null);
  const focusDay = useRef(false);
  const id = useId();
  const today = dateValue();
  const month = focused.slice(0, 7);
  const monthTitle = formatDate(focused, lang, { month: 'long', year: 'numeric' });
  const days = monthDays(focused);
  const weekdays = monthDays('2026-06-01').slice(0, 7);

  useLayoutEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    panel.showModal();
    const previousOverflow = document.body.style.overflow;
    // The request dialog already owns its scroll lock. Do not restore a stale
    // nested lock if browser navigation unmounts both dialogs at once.
    const ownsScrollLock = !panel.parentElement.closest('dialog[open]');
    if (ownsScrollLock) document.body.style.overflow = 'hidden';
    const place = () => {
      const anchor = trigger.current.getBoundingClientRect();
      const box = panel.getBoundingClientRect();
      const below = anchor.bottom + 8;
      const top = below + box.height <= window.innerHeight - 12 ? below : anchor.top - box.height - 8;
      setPosition({
        '--calendar-x': `${Math.max(12, Math.min(anchor.right - box.width, window.innerWidth - box.width - 12))}px`,
        '--calendar-y': `${Math.max(12, Math.min(top, window.innerHeight - box.height - 12))}px`
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('resize', place);
      panel.close();
      if (ownsScrollLock) document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open && focusDay.current) {
      dialog.current.querySelector(`[data-date="${focused}"]`)?.focus({ preventScroll: true });
      focusDay.current = false;
    }
  }, [open, focused]);

  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  function choose(day) {
    if (day && day < min) return;
    setValue(day);
    close();
  }
  function move(next, focus = true) {
    focusDay.current = focus;
    setFocused(next < min ? min : next);
  }
  function dayKey(event, day) {
    let next;
    const weekday = (readDate(day).getDay() + 6) % 7;
    if (event.key === 'ArrowLeft') next = addDays(day, -1);
    if (event.key === 'ArrowRight') next = addDays(day, 1);
    if (event.key === 'ArrowUp') next = addDays(day, -7);
    if (event.key === 'ArrowDown') next = addDays(day, 7);
    if (event.key === 'Home') next = addDays(day, -weekday);
    if (event.key === 'End') next = addDays(day, 6 - weekday);
    if (event.key === 'PageUp') next = addMonths(day, event.shiftKey ? -12 : -1);
    if (event.key === 'PageDown') next = addMonths(day, event.shiftKey ? 12 : 1);
    if (next) { event.preventDefault(); move(next); }
  }

  return <div className="date-field">
    <span className="date-field-label" id={`${id}-label`}>{label}</span>
    <input type="hidden" name={name} value={value}/>
    <button ref={trigger} type="button" className={`date-trigger ${value ? 'has-date' : ''}`}
      aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open}
      aria-controls={open ? `${id}-calendar` : undefined}
      onClick={() => { move(value && value >= min ? value : min); setOpen(true); }}>
      <span id={`${id}-value`}>{value ? formatDate(value, lang) : t('Выберите дату')}</span>
      <CalendarBlankIcon size={20} aria-hidden="true"/>
    </button>
    {open && <dialog ref={dialog} id={`${id}-calendar`} className="date-calendar" style={position}
      aria-labelledby={`${id}-title`} onCancel={event => {
        // Escape closes this calendar first, not the enclosing request dialog.
        event.preventDefault(); event.stopPropagation(); close();
      }} onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="date-calendar-heading">
        <span id={`${id}-title`}>{t('Дата заезда')}</span>
        <button type="button" className="date-icon-button" onClick={close} aria-label={t('Закрыть календарь')}><XIcon size={18}/></button>
      </div>
      <div className="date-month-nav">
        <button type="button" className="date-icon-button" disabled={month <= min.slice(0, 7)}
          onClick={() => move(addMonths(focused, -1), false)} aria-label={t('Предыдущий месяц')}><CaretLeftIcon size={19}/></button>
        <span id={`${id}-month`} aria-live="polite">{monthTitle[0].toUpperCase() + monthTitle.slice(1)}</span>
        <button type="button" className="date-icon-button" onClick={() => move(addMonths(focused, 1), false)} aria-label={t('Следующий месяц')}><CaretRightIcon size={19}/></button>
      </div>
      <table className="date-grid" role="grid" aria-labelledby={`${id}-month`}>
        <thead><tr>{weekdays.map(day => <th scope="col" key={day} aria-label={formatDate(day, lang, { weekday: 'long' })}>{formatDate(day, lang, { weekday: lang === 'vi' ? 'narrow' : 'short' })}</th>)}</tr></thead>
        <tbody>{Array.from({ length: 6 }, (_, week) => <tr key={week}>
          {days.slice(week * 7, week * 7 + 7).map(day => <td key={day} aria-selected={day === value}>
            <button type="button" data-date={day} disabled={day < min} tabIndex={day === focused ? 0 : -1}
              className={`${day.slice(0, 7) !== month ? 'outside-month' : ''} ${day === value ? 'selected-date' : ''}`}
              aria-label={formatDate(day, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              aria-current={day === today ? 'date' : undefined} onKeyDown={event => dayKey(event, day)}
              onClick={() => choose(day)}>{readDate(day).getDate()}</button>
          </td>)}
        </tr>)}</tbody>
      </table>
      <div className="date-calendar-footer">
        <button type="button" disabled={today < min} onClick={() => choose(today)}>{t('Сегодня')}</button>
        <button type="button" onClick={() => choose('')}>{t('Без даты')}</button>
      </div>
    </dialog>}
  </div>;
}
