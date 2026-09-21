import { useEffect, useId, useRef, useState } from 'react';
import { CaretDownIcon, CheckIcon, GlobeHemisphereWestIcon } from '@phosphor-icons/react';
import { languages, languageNames, useLocale } from './locale.jsx';

/** Language actions use the existing router so filters, scroll and form state survive. */
export function LanguagePicker({ onOpen }) {
  const { lang, page, t, changeLanguage } = useLocale();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const options = useRef([]);
  const initialFocus = useRef(0);
  const menuId = useId();

  useEffect(() => { setOpen(false); }, [page]);
  useEffect(() => {
    if (!open) return;
    options.current[initialFocus.current]?.focus();
    const dismiss = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  const show = (index = languages.indexOf(lang)) => {
    initialFocus.current = index;
    onOpen?.();
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return <div className="language-picker" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button className="language-trigger" type="button" ref={trigger}
      aria-label={`${t('Язык сайта')}: ${languageNames[lang]}`}
      aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined}
      onClick={() => open ? close() : show()}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          show(event.key === 'ArrowDown' ? 0 : languages.length - 1);
        }
      }}>
      <GlobeHemisphereWestIcon className="language-globe" size={18} aria-hidden="true"/>
      <span>{lang.toUpperCase()}</span>
      <CaretDownIcon className="language-caret" size={12} aria-hidden="true"/>
    </button>
    {open && <div className="language-menu" id={menuId} role="menu" aria-label={t('Язык сайта')}
      onKeyDown={event => {
        const index = options.current.indexOf(document.activeElement);
        let next;
        if (event.key === 'ArrowDown') next = (index + 1) % languages.length;
        if (event.key === 'ArrowUp') next = (index + languages.length - 1) % languages.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = languages.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          options.current[next]?.focus();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}>
      <p className="language-menu-label">{t('Язык сайта')}</p>
      {languages.map((code, index) => <button type="button" key={code}
        role="menuitemradio" aria-checked={code === lang} tabIndex={-1}
        ref={element => { options.current[index] = element; }}
        onClick={() => { changeLanguage(code); close(); }}>
        <span className="language-code" aria-hidden="true">{code.toUpperCase()}</span>
        <span lang={code}>{languageNames[code]}</span>
        {code === lang && <CheckIcon size={17} weight="bold" aria-hidden="true"/>}
      </button>)}
    </div>}
  </div>;
}
