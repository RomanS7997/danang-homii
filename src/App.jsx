import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { mountBasemap } from './basemap.js';
import { createMapNavigation } from './map-navigation.js';
import { useHeroMapReveal } from './useHeroMapReveal.js';
import { assetPath } from './paths.js';
import { DistrictSection, ProcessSection, LeadSection, FaqSection, AboutSection, FullFooter } from './LandingSections.jsx';
import { Link, useLocale } from './locale.jsx';
import { CatalogPage, PropertyPage, DistrictsPage, RentalPage, GuidesPage, GuidePage, AboutPage, OwnersPage, NotFound, areaIds, areaNames, pageTitles, guides } from './Pages.jsx';
import 'leaflet/dist/leaflet.css';
import { ArrowRightIcon, ArrowDownIcon, ArrowUpRightIcon, ArrowClockwiseIcon, CaretLeftIcon, CaretRightIcon, MapPinIcon, MapTrifoldIcon, FrameCornersIcon, CrosshairIcon, XIcon, EyeIcon, ShieldCheckIcon, UsersIcon, FileTextIcon, BedIcon, RulerIcon, HeartIcon, CheckIcon, PlusIcon, MinusIcon, SlidersHorizontalIcon, ListIcon } from '@phosphor-icons/react';
// Illustrative inventory only. Stable IDs connect routes, map markers and saved
// favourites; replace factual fields together when real listings are connected.
export const homes = [{
  id: 'seaside',
  title: 'Светлая квартира у моря',
  short: 'Квартира у моря',
  district: 'Ан Тхыонг',
  price: 620,
  rooms: 1,
  area: 55,
  coords: [16.0495, 108.2452],
  image: assetPath('apartment-seaside.webp'),
  description: 'Светлая гостиная, отдельная спальня и балкон. Спокойные оттенки, много дневного света и море неподалёку.',
  tag: 'Рядом с морем',
  features: ['Балкон', 'Отдельная спальня', 'Рабочее место']
}, {
  id: 'studio',
  title: 'Уютная студия в Ан Тхыонг',
  short: 'Уютная студия',
  district: 'Ан Тхыонг',
  price: 480,
  rooms: 0,
  area: 38,
  coords: [16.0354, 108.2411],
  image: assetPath('apartment-studio.webp'),
  description: 'Компактное пространство с кухней, удобной кроватью и уютным местом у окна. Всё, что нужно для спокойного ритма жизни.',
  tag: 'Уютная студия',
  features: ['Своя кухня', 'Место для работы', 'Стиральная машина']
}, {
  id: 'river',
  title: 'Апартаменты с видом на реку',
  short: 'Квартира с видом на реку',
  district: 'Хай Тяу',
  price: 780,
  rooms: 2,
  area: 72,
  coords: [16.0722, 108.2175],
  image: assetPath('apartment-river.webp'),
  description: 'Просторная гостиная с окнами на город и реку. Две спальни, деревянная мебель и место для ужинов дома.',
  tag: 'Вид на реку',
  features: ['2 спальни', 'Вид на реку', 'Обеденная зона']
}, {
  id: 'family',
  title: 'Просторная квартира для семьи',
  short: 'Квартира для семьи',
  district: 'Шон Тра',
  price: 950,
  rooms: 2,
  area: 86,
  coords: [16.088, 108.245],
  image: assetPath('apartment-family.webp'),
  description: 'Большая общая гостиная, отдельные спальни и зелёный балкон. Достаточно места и для работы, и для отдыха вместе.',
  tag: 'Больше пространства',
  features: ['2 спальни', 'Зелёный балкон', 'Большая гостиная']
}];
const roomText = n => n === 0 ? 'Студия' : n === 1 ? '1 спальня' : '2 спальни';
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Leaflet owns interaction/markers; basemap.js owns vector/raster rendering.
// React updates selection without replacing buttons or losing keyboard focus.
function CityMap({
  selected,
  onSelect,
  mode = 'split',
  className = '',
  all = homes,
  quiet = true,
  reveal = true
}) {
  const {
    t,
    lang
  } = useLocale();
  const node = useRef(null);
  const map = useRef(null);
  const navigation = useRef(null);
  const inventory = useRef(all);
  inventory.current = all;
  const markers = useRef([]);
  const latest = useRef(onSelect);
  latest.current = onSelect;
  const [status, setStatus] = useState('loading');
  const [basemap, setBasemap] = useState(quiet ? 'vector' : 'osm');
  const [retry, setRetry] = useState(0);
  const [narrow, setNarrow] = useState(window.innerWidth < 760);
  const [dense, setDense] = useState(false);
  const [zoom, setZoom] = useState(13);
  const [seen, setSeen] = useState(mode === 'full');
  const [pinPhase, setPinPhase] = useState('waiting');
  useEffect(() => {
    if (seen || !node.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .2)) {
        setSeen(true);
        observer.disconnect();
      }
    }, { threshold: .2 });
    observer.observe(node.current);
    return () => observer.disconnect();
  }, [seen]);
  useEffect(() => {
    if (!reveal || !seen || status === 'loading') {
      setPinPhase('waiting');
      return;
    }
    if (mode === 'full' || prefersReduced()) {
      setPinPhase('shown');
      return;
    }
    setPinPhase('entering');
    const timer = setTimeout(() => setPinPhase('shown'), 1450);
    return () => clearTimeout(timer);
  }, [reveal, seen, status, mode]);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 759px)');
    const changed = () => setNarrow(mq.matches);
    mq.addEventListener('change', changed);
    return () => mq.removeEventListener('change', changed);
  }, []);
  useLayoutEffect(() => {
    if (!node.current) return;
    const m = L.map(node.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 100,
      // Our element observer also handles the hero's opening transition.
      trackResize: false,
      attributionControl: true,
      minZoom: 10,
      maxZoom: 18,
      zoomSnap: .25,
      zoomAnimation: !prefersReduced(),
      fadeAnimation: !prefersReduced(),
      markerZoomAnimation: !prefersReduced()
    });
    map.current = m;
    m.attributionControl.setPrefix(false);
    const controls = createMapNavigation(m, {
      bounds: () => L.latLngBounds(inventory.current.map(h => h.coords)),
      onZoom: setZoom,
      animate: () => !prefersReduced(),
      fitOptions: () => {
        const isNarrow = window.innerWidth < 760;
        const height = node.current?.clientHeight || 600;
        return mode === 'atlas' ? {
          paddingTopLeft: [isNarrow ? 48 : 130, 54],
          paddingBottomRight: [isNarrow ? 48 : 140, Math.max(280, height - 226)],
          maxZoom: 13.75
        } : {
          paddingTopLeft: [40, mode === 'full' && isNarrow ? 120 : 96],
          paddingBottomRight: [40, mode === 'full' && isNarrow ? 105 : 88],
          maxZoom: 14.5
        };
      }
    });
    navigation.current = controls;
    const resize = () => {
      setDense(mode === 'split' && node.current.clientHeight < 380);
      controls.resize();
    };
    resize();
    const removeBasemap = mountBasemap(m, quiet, (next, kind) => {
      setStatus(next);
      setBasemap(kind);
    });
    const ro = new ResizeObserver(resize);
    ro.observe(node.current);
    return () => {
      ro.disconnect();
      controls.destroy();
      navigation.current = null;
      removeBasemap();
      m.remove();
      map.current = null;
    };
  }, [mode, retry, quiet]);
  useEffect(() => {
    if (!map.current) return;
    const focusedLabel = document.activeElement?.getAttribute('aria-label');
    markers.current.forEach(entry => entry.layer.remove());
    const connectorUpdaters = [];
    markers.current = all.map((home, index) => {
      const offsets = narrow ? {
        seaside: [48, -4],
        studio: [-42, -12],
        river: [-30, -3],
        family: [48, 0]
      } : {
        seaside: [110, -12],
        studio: [-132, -39],
        river: [-115, -5],
        family: [104, 0]
      };
      const compactOffsets = {
        seaside: [36, 0],
        studio: [-36, 0],
        river: [-18, 0],
        family: [18, 0]
      };
      const offset = mode === 'atlas' ? offsets[home.id] : dense ? compactOffsets[home.id] : [0, 0];
      const offsetLabel = offset[0] !== 0 || offset[1] !== 0;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `price-marker ${home.id === selected.id ? 'is-selected' : ''} ${offsetLabel ? 'is-offset' : ''}`;
      button.textContent = `$${home.price}`;
      button.setAttribute('aria-label', t('Показать {home}, ${price} в месяц', {
        home: t(home.short),
        price: home.price
      }));
      button.setAttribute('aria-pressed', String(home.id === selected.id));
      button.style.setProperty('--marker-delay', `${index * 160}ms`);
      // Selecting a price should not also double-click-zoom or start a drag.
      L.DomEvent.disableClickPropagation(button);
      button.addEventListener('click', e => {
        e.stopPropagation();
        latest.current(home);
      });
      const marker = L.marker(home.coords, {
        icon: L.divIcon({
          className: 'home-marker',
          html: button,
          iconSize: [74, 44],
          iconAnchor: [37 - offset[0], 22 - offset[1]]
        }),
        keyboard: false,
        zIndexOffset: home.id === selected.id ? 400 : 10
      });
      if (!offsetLabel) return { home, button, marker, layer: marker.addTo(map.current) };
      const color = home.id === selected.id ? '#b68a49' : '#617487';
      const dot = L.circleMarker(home.coords, {
        className: 'home-connector',
        radius: 4,
        color: '#fcfaf5',
        weight: 2,
        fill: true,
        fillColor: color,
        fillOpacity: 1
      });
      const line = L.polyline([], {
        className: 'home-connector',
        color,
        weight: 1,
        opacity: .65,
        interactive: false
      });
      const update = () => {
        if (map.current) {
          const anchor = map.current.latLngToLayerPoint(home.coords);
          const end = map.current.layerPointToLatLng(anchor.add(L.point(offset[0], offset[1])));
          line.setLatLngs([home.coords, end]);
        }
      };
      const group = L.layerGroup([line, dot, marker]).addTo(map.current);
      update();
      connectorUpdaters.push(update);
      return { home, button, marker, dot, line, layer: group };
    });
    if (focusedLabel) [...node.current.querySelectorAll('.price-marker')].find(button => button.getAttribute('aria-label') === focusedLabel)?.focus({
      preventScroll: true
    });
    const updateLines = () => connectorUpdaters.forEach(update => update());
    const m = map.current;
    m.on('zoomend moveend resize', updateLines);
    return () => m.off('zoomend moveend resize', updateLines);
  }, [all, mode, retry, narrow, quiet, dense, lang]);
  useEffect(() => {
    // Keep the actual buttons: selection must not restart every arrival or lose focus.
    markers.current.forEach(({ home, button, marker, dot, line }) => {
      const active = home.id === selected.id;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
      marker.setZIndexOffset(active ? 400 : 10);
      const color = active ? '#b68a49' : '#617487';
      dot?.setStyle({ fillColor: color });
      line?.setStyle({ color });
    });
  }, [selected.id, all, mode, retry, narrow, quiet, dense, lang]);
  useEffect(() => {
    // Sidebar arrows may select a home outside the visitor's zoomed viewport.
    if (mode === 'full') map.current?.panInside(selected.coords, {
      paddingTopLeft: [120, window.innerWidth < 760 ? 140 : 100], paddingBottomRight: [50, 130], animate: !prefersReduced()
    });
  }, [selected.id, mode]);
  const gestureHint = mode === 'full' ? 'Колёсико — масштаб. Перетаскивайте карту, нажимайте на цены.' : null;
  return <div className={`city-map ${className}`} data-map-zoom={zoom} data-basemap={basemap} data-map-status={status} data-pin-reveal={!reveal || !seen || status === 'loading' ? 'waiting' : pinPhase}>
    <div ref={node} className="leaflet-canvas" aria-label={t("Карта Дананга с демонстрационными квартирами")} />
    {gestureHint && <div className="map-gesture-hint"><span className="map-desktop-hint">{t(gestureHint)}</span><span className="map-touch-hint">{t('Раздвиньте пальцы для приближения. Нажмите на цену.')}</span></div>}
    {status === 'loading' && <div className="map-status">{t("Загружаем карту…")}</div>}
    {status === 'error' && <div className="map-status map-error"><span>{t("Карта не загрузилась. Квартиры можно выбрать в каталоге.")}</span><button onClick={() => {
        setStatus('loading');
        setRetry(r => r + 1);
      }}>{t("Повторить")}</button></div>}
    <div className="map-controls"><div className="map-zoom" role="group" aria-label={t('Масштаб карты')}><button aria-label={t("Приблизить карту")} title={t("Приблизить карту")} disabled={zoom >= 18} onClick={() => map.current?.zoomIn()}><PlusIcon size={20} /></button><button aria-label={t("Отдалить карту")} title={t("Отдалить карту")} disabled={zoom <= 10} onClick={() => map.current?.zoomOut()}><MinusIcon size={20} /></button></div><div className="map-location-controls"><button aria-label={t('Показать все квартиры на карте')} title={t('Показать все квартиры на карте')} onClick={() => navigation.current?.overview()}><FrameCornersIcon size={20}/>{mode === 'full' && <span>{t('Все квартиры')}</span>}</button><button aria-label={t('Приблизить выбранную квартиру')} title={t('Приблизить выбранную квартиру')} onClick={() => navigation.current?.locate(selected.coords)}><CrosshairIcon size={20}/>{mode === 'full' && <span>{t('Выбранная')}</span>}</button></div></div>
  </div>;
}
function Photo({
  home,
  className = '',
  onNext,
  onPrev,
  onDetails,
  compact = false,
  atlas = false
}) {
  const {
    t
  } = useLocale();
  return <div className={`photo-window ${className} ${atlas ? 'photo-atlas' : ''}`}>
    {homes.map(photo => <img key={photo.id} className={`apartment-photo ${photo.id === home.id ? 'photo-active' : ''}`} src={photo.image} alt={photo.id === home.id ? t(home.title) : ''} aria-hidden={photo.id !== home.id} fetchPriority={photo.id === home.id ? 'high' : 'low'} />)}
    {!compact && <>
      {!atlas && <div className="photo-top-note"><span>{t("Лично проверяем жильё")}</span><span>{String(homes.findIndex(h => h.id === home.id) + 1).padStart(2, '0')} / 04</span></div>}
      <div className="photo-caption" aria-live="polite">
        {!atlas && <button className="round-button previous" onClick={onPrev} aria-label={t("Предыдущая квартира")}><CaretLeftIcon size={22} /></button>}
        <div key={`caption-${home.id}`} className="caption-info"><strong>{atlas ? t(home.title) : t(home.short)}</strong><span>{t(home.district)} <span className="meta-dot">·</span> {t(roomText(home.rooms))} <span className="meta-dot">·</span> {home.area}{"\u00a0"}{t("м²")}</span></div>
        <div key={`price-${home.id}`} className="price"><strong>${home.price}</strong><span>{t("/ месяц")}</span></div>
        {atlas ? <button className="navy-button photo-cta" onClick={onDetails}>{t("Смотреть квартиру")}<ArrowUpRightIcon size={19} /></button> : <button className="round-button next" onClick={onNext} aria-label={t("Следующая квартира")}><CaretRightIcon size={22} /></button>}
      </div>
    </>}
  </div>;
}
function Modal({
  children,
  title,
  onClose,
  wide = false,
  className = ''
}) {
  const {
    t
  } = useLocale();
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'wide-modal' : ''} ${className}`} onCancel={e => {
    e.preventDefault();
    onClose();
  }} onClick={e => {
    if (e.target === ref.current) onClose();
  }} aria-label={t(title)}>
    <button className="round-button close-modal" aria-label={t("Закрыть")} onClick={onClose}><XIcon size={22} /></button>{children}
  </dialog>;
}
function RequestForm({
  close,
  home,
  district
}) {
  const {
    t
  } = useLocale();
  const [done, setDone] = useState(false);
  const result = useRef(null);
  const viewing = Boolean(home);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  useEffect(() => {
    if (done) result.current?.focus({
      preventScroll: true
    });
  }, [done]);
  function submit(e) {
    e.preventDefault();
    const contact = e.currentTarget.elements.contact;
    if (contact.value.trim().length < 3) {
      contact.setCustomValidity(t('Укажите никнейм или номер, чтобы мы могли связаться с вами.'));
      contact.reportValidity();
      return;
    }
    setDone(true);
  }
  return <Modal onClose={close} title={viewing ? t('Договоримся о просмотре') : t('Подобрать квартиру')} className={`request-modal ${viewing ? 'viewing-request' : ''}`}>
    {done ? <div className="form-success" ref={result} tabIndex={-1} role="status">
      <ShieldCheckIcon size={48} weight="light" />
      <p className="eyebrow">{t("ЗАЯВКА В ПРОТОТИПЕ")}</p>
      <h2>{viewing ? t('Запрос на просмотр готов.') : t('Пожелания собраны.')}</h2>
      {viewing && <p className="request-chosen-title">{t(home.title)}</p>}
      <p>{viewing ? t('На рабочем сайте мы свяжемся с вами и согласуем время просмотра.') : t('На рабочем сайте мы свяжемся с вами и предложим подходящие квартиры.')} {t("В этом демо данные никуда не отправляются.")}</p>
      <button className="navy-button" onClick={close}>{t("Вернуться к квартирам")}<ArrowRightIcon size={18} /></button>
    </div> : <>
      <p className="eyebrow">{viewing ? t('ПРОСМОТР КВАРТИРЫ') : t('НАЧНЁМ С ВАШИХ ПОЖЕЛАНИЙ')}</p>
      <h2>{viewing ? t('Договоримся о просмотре.') : t('Найдём ваше место.')}</h2>
      <p>{viewing ? t('Оставьте контакт — согласуем просмотр лично или по видео.') : district ? t('Начнём с квартир в районе {district}. Расскажите, что для вас важно.', {
          district: t(district)
        }) : t('Укажите бюджет и пожелания. Дату заезда можно уточнить позже.')}</p>
      {viewing && <div className="viewing-home">
        <img src={home.image} alt="" />
        <div><strong>{t(home.title)}</strong><span>{t(home.district)} · {t(roomText(home.rooms))} · {home.area}{"\u00a0"}{t("м²")}</span><b>${home.price}<small> {t("/ месяц")}</small></b></div>
      </div>}
      <form className={viewing ? 'viewing-form' : ''} onSubmit={submit}>
        {!viewing && <>
          <label>{t("Бюджет в месяц, $")}<input required name="budget" type="number" min="100" max="10000" placeholder={t("Например, 700")} /></label>
          <label><span>{t("Дата заезда")} <small className="field-optional">{t("необязательно")}</small></span><input name="date" type="date" min={minDate} /></label>
          <label>{t("Спальни")}<select name="rooms" defaultValue="any"><option value="any">{t("Неважно")}</option><option value="0">{t("Студия")}</option><option value="1">{t("1 спальня")}</option><option value="2">{t("2 спальни")}</option></select></label>
        </>}
        <label>{t("Telegram или WhatsApp")}<input name="contact" required minLength={3} placeholder={t("@username или номер телефона")} autoComplete="off" onInput={e => e.currentTarget.setCustomValidity('')} /></label>
        {viewing && <label><span>{t("Когда удобно посмотреть?")} <small className="field-optional">{t("необязательно")}</small></span><input name="viewingTime" placeholder={t("Например, завтра после 15:00")} maxLength={160} /></label>}
        <button className="navy-button" type="submit">{viewing ? t('Обсудить просмотр') : t('Получить подборку')} <ArrowRightIcon size={18} /></button>
        <p className="demo-note">{t("Демонстрация: заявка никуда не отправляется.")}</p>
      </form>
    </>}
  </Modal>;
}
export function App() {
  const {
    t,
    lang,
    page,
    search,
    navigate,
    changeLanguage
  } = useLocale();
  const initial = new URLSearchParams(window.location.search).get('variant');
  const designPreview = new URLSearchParams(window.location.search).get('preview') === '1';
  const [variant, setVariant] = useState(initial === '3' ? 3 : 2);
  const [visualStyle, setVisualStyle] = useState(() => new URLSearchParams(window.location.search).get('style') === 'calm' ? 'calm' : 'gradient');
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selected, setSelected] = useState(homes[0]);
  const { mapOpen, mapSettled, resetting, setMapOpen, restart: replayMap } = useHeroMapReveal(!page, variant);
  const [modal, setModal] = useState(null);
  const [requestHome, setRequestHome] = useState(null);
  const [requestDistrict, setRequestDistrict] = useState(null);
  const [filter, setFilter] = useState('Все');
  const [showAll, setShowAll] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('homii-favorites') || '[]');
      return Array.isArray(saved) ? saved.filter(id => homes.some(h => h.id === id)) : [];
    } catch {
      return [];
    }
  });
  const [menu, setMenu] = useState(false);
  const [hint, setHint] = useState(false);
  const hero = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem('homii-favorites', JSON.stringify(favorites));
    } catch {/* Favorites still work for this session. */}
  }, [favorites]);
  useEffect(() => {
    setMenu(false);
    setModal(null);
  }, [page, search]);
  useEffect(() => {
    const [section, slug] = page.split('/');
    const key = section === 'apartments' && slug ? homes.find(h => h.id === slug)?.title : section === 'guides' && slug ? guides.find(g => g.id === slug)?.title : pageTitles[page];
    document.title = `${t(key || 'Страница не найдена')} — Danang Homii`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('Подбор квартир для долгосрочной аренды в Дананге. Районы, просмотры и помощь с заселением.'));
  }, [page, lang]);
  function favorite(id) {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  }
  function openDetails(home = selected) {
    setSelected(home);
    setModal(null);
    navigate(`apartments/${home.id}`);
  }
  function openMap(home) {
    setSelected(home);
    setModal('map');
  }
  function chooseArea(name) {
    navigate(`apartments?area=${areaIds[areaNames.indexOf(name)] || 'all'}`);
  }
  useEffect(() => {
    homes.forEach(h => {
      const image = new Image();
      image.src = h.image;
    });
  }, []);
  function changeVariant(v) {
    if (v === variant) return;
    setVariant(v);
    setMapOpen(prefersReduced());
    const u = new URL(location.href);
    u.searchParams.set('variant', v);
    history.replaceState({}, '', u);
    window.scrollTo({
      top: 0,
      behavior: prefersReduced() ? 'instant' : 'smooth'
    });
  }
  function changeStyle(next) {
    setVisualStyle(next);
    const u = new URL(location.href);
    u.searchParams.set('style', next);
    history.replaceState({}, '', u);
  }
  function restart() {
    replayMap();
    window.scrollTo({
      top: 0,
      behavior: prefersReduced() ? 'instant' : 'smooth'
    });
  }
  function selectHome(h) {
    setSelected(h);
    setHint(true);
  }
  function step(n) {
    selectHome(homes[(homes.findIndex(h => h.id === selected.id) + n + homes.length) % homes.length]);
  }
  function request(h = null, district = null) {
    setRequestHome(h);
    setRequestDistrict(district);
    setModal('request');
  }
  const visibleHomes = homes.filter(h => filter === 'Все' || filter === 'У моря' && h.id === 'seaside' || filter === 'Студии' && h.rooms === 0 || filter === '2 спальни' && h.rooms === 2 || filter === 'Избранное' && favorites.includes(h.id) || filter === h.district);
  const displayedHomes = filter === 'Все' && !showAll ? visibleHomes.slice(0, 3) : visibleHomes;
  function scrollSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReduced() ? 'instant' : 'smooth'
    });
    setMenu(false);
  }
  function scrollCatalog() {
    document.getElementById('apartments')?.scrollIntoView({
      behavior: 'smooth'
    });
    setMenu(false);
  }
  return <div className={`design-shell design-${visualStyle} ${designPreview ? 'is-design-preview' : ''}`}>
    <header className="site-header" onKeyDown={e => { if (e.key === 'Escape' && menu) { setMenu(false); document.querySelector('.menu-button')?.focus(); } }}>
      <Link className="brand" aria-label={t("Danang Homii — на главную")}><img className="brand-symbol" src={assetPath('brandmark-coastal-gradient.webp')} width="52" height="52" alt="" /><strong>Danang Homii</strong></Link>
      <nav id="site-navigation" className={menu ? 'nav-open' : ''} aria-label={t("Главная навигация")}>{[['apartments', 'Квартиры'], ['districts', 'Районы'], ['how-to-rent', 'Как снять'], ['guides', 'Полезное'], ['about', 'О нас']].map(([to, label]) => <Link key={to} to={to} aria-current={page === to || page.startsWith(`${to}/`) ? 'page' : undefined}>{t(label)}</Link>)}<button className="mobile-menu-request" onClick={()=>{setMenu(false);request();}}>{t("Подобрать жильё")}<ArrowRightIcon size={18}/></button></nav>
      <div className="header-right"><label className="language-picker"><span className="sr-only">{t('Язык сайта')}</span><select aria-label={t('Язык сайта')} value={lang} onChange={e => changeLanguage(e.target.value)}><option value="ru" lang="ru">RU</option><option value="en" lang="en">EN</option><option value="vi" lang="vi">VI</option></select></label><button className="navy-button header-cta" onClick={() => request()}>{t("Подобрать жильё")}<ArrowUpRightIcon size={18}/></button><button className="round-button menu-button" aria-label={t(menu ? 'Закрыть меню' : 'Открыть меню')} aria-expanded={menu} aria-controls="site-navigation" onClick={() => setMenu(!menu)}>{menu ? <XIcon size={23}/> : <ListIcon size={23}/>}</button></div>
    </header>

    <main tabIndex={-1} id="main-content">
      {!page ? <>
      {variant === 2 ? <section className="split-hero" ref={hero} aria-label={t("Квартира и район")}>
        <div className="split-intro"><div className="hero-heading"><p className="eyebrow">{t("ДОЛГОСРОЧНАЯ АРЕНДА В ДАНАНГЕ")}</p><h1>{t("Сначала влюбитесь в квартиру.")}<br />{t("Потом — в её район.")}</h1></div><p className="hero-service-copy">{t("Подберём квартиру под ваш бюджет и привычки, покажем варианты и поможем с заселением.")}<ArrowDownIcon size={28} weight="light" /></p></div>
        <div className={`split-stage ${resetting ? 'intro-reset' : ''} ${mapOpen ? 'map-open' : ''} ${mapSettled ? 'map-settled' : ''}`}>
          <Photo home={selected} onNext={() => step(1)} onPrev={() => step(-1)} />
          <div className="mobile-photo-action"><button className="navy-button" onClick={() => openDetails()}>{t("Подробнее о квартире")}<ArrowRightIcon size={20} /></button></div>
          <div className="split-map" inert={!mapOpen || !mapSettled} aria-hidden={!mapOpen || !mapSettled}><CityMap reveal={mapOpen && mapSettled} quiet={visualStyle === 'gradient'} selected={selected} onSelect={selectHome} /></div>
          <div className="map-view-toggle" role="group" aria-label={t("Режим просмотра")}><button onClick={() => setMapOpen(false)} aria-pressed={!mapOpen}>{t("Фото")}</button><button onClick={() => setMapOpen(true)} aria-pressed={mapOpen}><MapTrifoldIcon size={17} />{t("Фото + карта")}</button></div>
          {mapOpen && <button className="map-expand" onClick={() => setModal('map')}><FrameCornersIcon size={18} />{t("Развернуть карту")}</button>}
        </div>
        <div className="split-bottom"><button className="navy-button visit-button" onClick={() => openDetails()}>{t("Подробнее о квартире")}<ArrowRightIcon size={23} /></button><span><ShieldCheckIcon size={33} weight="light" />{t("Без комиссии арендатора")}</span><span><FileTextIcon size={33} weight="light" />{t("Помогаем с оформлением")}</span></div>
      </section> : <section className={`atlas-hero ${resetting ? 'intro-reset' : ''} ${mapOpen ? 'atlas-map-open' : ''} ${mapSettled ? 'map-settled' : ''}`} ref={hero} aria-label={t("Найдите своё место на карте")}>
        <div className="atlas-map-layer" inert={!mapOpen || !mapSettled} aria-hidden={!mapOpen || !mapSettled}><CityMap reveal={mapOpen && mapSettled} quiet={visualStyle === 'gradient'} selected={selected} onSelect={selectHome} mode="atlas" /></div>
        <div className="atlas-content"><p className="eyebrow">{t("ЖИТЬ В ДАНАНГЕ")}</p><h1>{t("Найдите")}<br />{t("своё место")}<br />{t("у моря.")}</h1><p className="atlas-description">{t("Выбирайте квартиру")}<br />{t("и сразу смотрите, где она находится.")}</p><button className="navy-button" onClick={() => request()}>{t("Подобрать квартиру")}<ArrowRightIcon size={23} /></button><div className="atlas-switch" role="group" aria-label={t("Вид первого экрана")}><button onClick={() => setMapOpen(false)} aria-pressed={!mapOpen}>{t("Интерьер")}</button><button onClick={() => setMapOpen(true)} aria-pressed={mapOpen}><MapPinIcon size={18} weight="fill" />{t("На карте")}</button></div><p className="click-hint">{t("Нажмите на цену, чтобы увидеть квартиру")}</p></div>
        <div className="atlas-selected"><Photo home={selected} atlas onDetails={() => openDetails()} /><div className="atlas-navigation"><button className="round-button" aria-label={t("Предыдущая квартира")} onClick={() => step(-1)}><CaretLeftIcon size={20} /></button><span>{String(homes.findIndex(h => h.id === selected.id) + 1).padStart(2, '0')} / 04</span><button className="round-button" aria-label={t("Следующая квартира")} onClick={() => step(1)}><CaretRightIcon size={20} /></button></div></div>
        {mapOpen && <button className="atlas-expand round-button" aria-label={t("Развернуть карту")} onClick={() => setModal('map')}><FrameCornersIcon size={24} /></button>}
      </section>}

      {variant === 3 && <div className="trust-row"><div><EyeIcon size={29} /><span><strong>{t("Проверяем лично")}</strong><small>{t("Смотрим на квартиру глазами жильца.")}</small></span></div><div><UsersIcon size={29} /><span><strong>{t("Без комиссии арендатора")}</strong><small>{t("Нашу работу оплачивает собственник.")}</small></span></div><div><FileTextIcon size={29} /><span><strong>{t("Помогаем с оформлением")}</strong><small>{t("От первого просмотра до заселения.")}</small></span></div></div>}

      <section id="apartments" className="catalog">
        <div className="section-heading"><h2>{variant === 2 ? t('Ещё квартиры, которые стоит увидеть') : t('Квартиры с характером')}</h2><Link className="text-button" to="apartments">{t("Все квартиры")}<ArrowRightIcon size={20} /></Link></div>
        <div className="catalog-toolbar"><div className="filter-list" aria-label={t("Фильтры квартир")}>{['Все', 'У моря', 'Студии', '2 спальни', 'Избранное'].map(f => <button key={f} className={filter === f ? 'active' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>{t(f)}{f === 'Избранное' && favorites.length > 0 ? ` · ${favorites.length}` : ''}</button>)}{!['Все', 'У моря', 'Студии', '2 спальни', 'Избранное'].includes(filter) && <button className="active" aria-label={t('Сбросить район {district}', {
                district: t(filter)
              })} onClick={() => setFilter('Все')}>{filter}<XIcon size={14} /></button>}</div><span aria-live="polite">{t('Показано {count} из 4 квартир', {
                count: displayedHomes.length
              })}</span></div>
        <div className={`home-grid ${displayedHomes.length === 4 ? 'expanded-grid' : ''}`}>{displayedHomes.map(home => <article className={`home-card ${selected.id === home.id ? 'home-selected' : ''}`} key={home.id}>
          <button className="card-image-button" onClick={() => {
                openDetails(home);
              }} aria-label={t('Подробнее: {home}', {
                home: t(home.title)
              })}><img src={home.image} alt={t(home.title)} loading="lazy" /><span className="home-tag">{t(home.tag)}</span></button>
          <button className={`favorite ${favorites.includes(home.id) ? 'is-favorite' : ''}`} aria-label={t(favorites.includes(home.id) ? 'Убрать из избранного: {home}' : 'В избранное: {home}', {
                home: t(home.title)
              })} aria-pressed={favorites.includes(home.id)} onClick={() => setFavorites(f => f.includes(home.id) ? f.filter(id => id !== home.id) : [...f, home.id])}><HeartIcon size={21} weight={favorites.includes(home.id) ? 'fill' : 'regular'} /></button>
          <div className="home-card-copy"><div className="home-card-title"><h3>{t(home.title)}</h3><div className="price"><strong>${home.price}</strong><span>{t("/ месяц")}</span></div></div><p><MapPinIcon size={16} />{t(home.district)}<span>·</span><BedIcon size={17} />{t(roomText(home.rooms))}<span>·</span>{home.area}{"\u00a0"}{t("м²")}</p><button className="text-button" onClick={() => {
                  selectHome(home);
                  setMapOpen(true);
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}>{t("Показать на карте")}<ArrowUpRightIcon size={18} /></button></div>
        </article>)}</div>
        {visibleHomes.length === 0 && <div className="empty-state"><HeartIcon size={32} /><h3>{t("Сохраните то, что понравилось.")}</h3><p>{t("Нажмите сердечко на карточке — квартира появится здесь.")}</p><button className="navy-button" onClick={() => setFilter('Все')}>{t("Посмотреть квартиры")}</button></div>}
        <div className="catalog-tail"><p className="catalog-demo">{t("Демонстрационная подборка: фото, цены и расположение приведены для примера.")}</p>{filter === 'Все' && !showAll && <button className="catalog-more" onClick={() => setShowAll(true)}>{t("Показать ещё квартиру")}<PlusIcon size={17} /></button>}{filter === 'Все' && showAll && <button className="catalog-more" onClick={() => {
              setShowAll(false);
              scrollCatalog();
            }}>{t("Свернуть подборку")}<MinusIcon size={17} /></button>}</div>
      </section>
      <DistrictSection illustrated={visualStyle === 'gradient'} onChoose={chooseArea} onRequest={name => request(null, name)} />
      <ProcessSection illustrated={visualStyle === 'gradient'} onRequest={() => scrollSection('find-home')} />
      <LeadSection />
      <FaqSection onRequest={() => request()} />
      <AboutSection />
      </> : page === 'apartments' ? <CatalogPage homes={homes} favorites={favorites} onFavorite={favorite} onMap={openMap} onRequest={request} /> : page.startsWith('apartments/') && page.split('/').length === 2 ? <PropertyPage home={homes.find(h => h.id === page.split('/')[1])} homes={homes} favorites={favorites} onFavorite={favorite} onMap={openMap} onRequest={request} /> : page === 'districts' ? <DistrictsPage onChoose={chooseArea} onRequest={name => request(null, typeof name === 'string' ? name : null)} illustrated={visualStyle === 'gradient'} /> : page === 'how-to-rent' ? <RentalPage onRequest={() => request()} illustrated={visualStyle === 'gradient'} /> : page === 'guides' ? <GuidesPage /> : page.startsWith('guides/') && page.split('/').length === 2 ? <GuidePage id={page.split('/')[1]} onRequest={() => request()} /> : page === 'about' ? <AboutPage onRequest={() => request()} /> : page === 'owners' ? <OwnersPage /> : <NotFound />}
    </main>

    <FullFooter onRequest={() => request()} onInfo={() => setModal('about')} />
    {designPreview && <aside className="prototype-controls style-comparison" aria-label={t("Сравнение стилей")}>
      <span className="prototype-label">{t("СТИЛЬ")}</span><div role="group" aria-label={t("Цветовой стиль")}><button aria-pressed={visualStyle === 'gradient'} onClick={() => changeStyle('gradient')}>{t("С градиентами")}</button><button aria-pressed={visualStyle === 'calm'} onClick={() => changeStyle('calm')}>{t("Спокойный")}</button></div>
      <button className="replay-button" aria-label={t("Повторить анимацию")} title={t("Повторить анимацию")} onClick={restart}><ArrowClockwiseIcon size={20} /></button>
      <button className="composition-toggle" aria-label={t("Варианты hero")} title={t("Варианты hero")} aria-expanded={comparisonOpen} aria-controls="hero-comparison" onClick={() => setComparisonOpen(!comparisonOpen)}><SlidersHorizontalIcon size={20} /></button>
      {comparisonOpen && <div id="hero-comparison" className="composition-options" role="group" aria-label={t("Вариант hero")} onKeyDown={e => {
        if (e.key === 'Escape') {
          setComparisonOpen(false);
          e.currentTarget.parentElement.querySelector('.composition-toggle')?.focus();
        }
      }}><span>{t("КОМПОЗИЦИЯ HERO")}</span><button aria-pressed={variant === 2} onClick={() => {
          changeVariant(2);
          setComparisonOpen(false);
        }}>{t("Вариант 2 · фото рядом с картой")}</button><button aria-pressed={variant === 3} onClick={() => {
          changeVariant(3);
          setComparisonOpen(false);
        }}>{t("Вариант 3 · фото поверх карты")}</button></div>}
    </aside>}

    {modal === 'request' && <RequestForm home={requestHome} district={requestDistrict} close={() => setModal(null)} />}
    {modal === 'map' && <Modal title={t("Квартиры на карте Дананга")} onClose={() => setModal(null)} wide className="full-map-modal"><div className="full-map"><CityMap quiet={visualStyle === 'gradient'} mode="full" selected={selected} onSelect={selectHome} /></div><div className="map-details"><p className="eyebrow">{t("ДАНАНГ · ВЫБЕРИТЕ ТОЧКУ")}</p><div className="map-home-switcher"><button className="round-button" aria-label={t('Предыдущая квартира')} onClick={() => step(-1)}><CaretLeftIcon size={20}/></button><span aria-live="polite">{t('Квартира {current} из {total}', {current: homes.findIndex(h => h.id === selected.id) + 1, total: homes.length})}</span><button className="round-button" aria-label={t('Следующая квартира')} onClick={() => step(1)}><CaretRightIcon size={20}/></button></div><img key={selected.image} src={selected.image} alt={t(selected.title)} /><h2>{t(selected.title)}</h2><p>{t(selected.district)} · {t(roomText(selected.rooms))} · {selected.area}{"\u00a0"}{t("м²")}</p><div className="price"><strong>${selected.price}</strong><span>{t("/ месяц")}</span></div><button className="navy-button" onClick={() => openDetails()}>{t("Подробнее о квартире")}<ArrowRightIcon size={19} /></button><p className="demo-note">{t("Объекты и координаты демонстрационные.")}</p></div></Modal>}
    {modal === 'about' && <Modal title={t("О концепте Danang Homii")} onClose={() => setModal(null)}><p className="eyebrow">DANANG HOMII</p><h2>{t("Дом начинается с ощущения.")}</h2><p>{t("Этот концепт помогает сначала увидеть квартиру, а затем понять её место в городе. Фото и карта связаны: нажимайте на цены, сравнивайте интерьеры и сохраняйте понравившиеся варианты.")}</p><p className="demo-note">{t("Перед вами локальный прототип. Квартиры, цены и координаты — примеры; фотографии созданы для дизайна. Сервис бронирования и отправка заявок не подключены.")}</p></Modal>}
    <div className="sr-only" aria-live="polite">{hint ? t('Выбрана {home}, {price} долларов в месяц', {
        home: t(selected.title),
        price: selected.price
      }) : ''}</div>
  </div>;
}
