import { useContext, useEffect, useMemo, useState } from 'react';
import { LocaleContext } from './locale-context.js';
import { messages } from './messages.js';
import { appPath, sitePath } from './paths.js';

export const languages = ['ru', 'en', 'vi'];
export function readLocation() {
  const parts = appPath(location.pathname).split('/').filter(Boolean);
  let saved = 'ru';
  try { saved = localStorage.getItem('homii-language') || 'ru'; } catch { /* Storage can be unavailable in private browsing. */ }
  const lang = languages.includes(parts[0]) ? parts.shift() : languages.includes(saved) ? saved : 'ru';
  return { lang, page: parts.join('/'), search: location.search, hash: location.hash };
}
export function translate(lang, key, values = {}) {
  const text = lang === 'ru' ? key : messages[key]?.[lang] ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}
export function LocaleProvider({ children }) {
  const [route, setRoute] = useState(readLocation);
  useEffect(() => {
    const update = () => setRoute(readLocation());
    window.addEventListener('popstate', update);
    // URL language wins over the stored preference, including direct Pages URLs.
    if (!languages.includes(appPath(location.pathname).split('/')[1])) history.replaceState({}, '', sitePath(`${route.lang}${route.page ? `/${route.page}` : ''}${route.search}${route.hash}`));
    return () => window.removeEventListener('popstate', update);
  }, []);
  useEffect(() => {
    document.documentElement.lang = route.lang;
    try { localStorage.setItem('homii-language', route.lang); } catch { /* Language switching still works without persistence. */ }
  }, [route.lang]);
  useEffect(() => {
    if (!route.hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(route.hash.slice(1))?.scrollIntoView({behavior:'instant'}));
    return () => cancelAnimationFrame(frame);
  }, [route.page, route.hash]);
  const value = useMemo(() => {
    const href = (page = '', hash = '', lang = route.lang) => {
      const [path, query] = page.split('?');
      const params = new URLSearchParams(location.search);
      if (path !== route.page || query !== undefined) ['area','saved','beds','budget','q','sort'].forEach(key=>params.delete(key));
      if (query) new URLSearchParams(query).forEach((v,k) => params.set(k,v));
      const search = params.toString();
      return sitePath(`${lang}${path ? `/${path}` : ''}${search ? `?${search}` : ''}${hash}`);
    };
    const navigate = (page = '', hash = '', lang = route.lang) => {
      const isLanguageChange = lang !== route.lang;
      history.pushState({}, '', href(page, hash, lang));
      setRoute(readLocation());
      if (!isLanguageChange) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        requestAnimationFrame(() => {
          if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
          else document.querySelector('main')?.focus({ preventScroll: true });
        });
      }
    };
    return { ...route, t: (key, values) => translate(route.lang, key, values), href, navigate, changeLanguage: lang => navigate(route.page, location.hash, lang) };
  }, [route]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
export function Link({ to = '', hash = '', children, onClick, ...props }) {
  const { href, navigate } = useLocale();
  return <a {...props} href={href(to, hash)} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;
    event.preventDefault(); navigate(to, hash);
  }}>{children}</a>;
}
