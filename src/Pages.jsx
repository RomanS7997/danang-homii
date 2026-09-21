import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon, ArrowUpRightIcon, ArrowLeftIcon, HeartIcon, MapPinIcon, BedIcon, CheckIcon, SlidersHorizontalIcon, MagnifyingGlassIcon, XIcon, HouseLineIcon } from '@phosphor-icons/react';
import { Link, useLocale, translate } from './locale.jsx';
import { DistrictSection, ProcessSection, FaqSection, LeadSection } from './LandingSections.jsx';
import { assetPath } from './paths.js';

// Pages share the same home IDs and locale context as the hero. Filters remain
// in the URL so a shared link, browser Back and refresh reproduce the selection.

export const areaNames = ['Ан Тхыонг', 'Нгу Хань Шон', 'Хай Тяу', 'Шон Тра', 'Лиен Тьеу'];
export const areaIds = ['an-thuong', 'ngu-hanh-son', 'hai-chau', 'son-tra', 'lien-chieu'];
export const roomLabel = n => n === 0 ? 'Студия' : n === 1 ? '1 спальня' : '2 спальни';
export const pageTitles = { '': 'Аренда квартир в Дананге', apartments: 'Квартиры', districts: 'Районы Дананга', 'how-to-rent': 'Как снять', guides: 'Полезное', about: 'О нас', owners: 'Собственникам' };

export function PageIntro({ eyebrow, title, description, art, children }) {
  const { t } = useLocale();
  return <section className={`page-intro ${art ? 'with-intro-art' : ''}`}>
    <div><p className="eyebrow">{t(eyebrow)}</p><h1>{t(title)}</h1><p className="page-intro-description">{t(description)}</p>{children}</div>
    {art && <img src={assetPath(`${art}.webp`)} alt="" className="page-intro-art"/>}
  </section>;
}
export function HomeCard({ home, favorites, onFavorite, onMap }) {
  const { t } = useLocale();
  const saved = favorites.includes(home.id);
  return <article className="home-card">
    <Link to={`apartments/${home.id}`} className="card-image-button" aria-label={t('Подробнее: {home}', {home: t(home.title)})}><img src={home.image} alt={t(home.title)} loading="lazy"/><span className="home-tag">{t(home.tag)}</span></Link>
    <button className={`favorite ${saved ? 'is-favorite' : ''}`} aria-label={t(saved ? 'Убрать из избранного: {home}' : 'В избранное: {home}', {home: t(home.title)})} aria-pressed={saved} onClick={() => onFavorite(home.id)}><HeartIcon size={21} weight={saved ? 'fill' : 'regular'}/></button>
    <div className="home-card-copy"><div className="home-card-title"><h3><Link to={`apartments/${home.id}`}>{t(home.title)}</Link></h3><div className="price"><strong>${home.price}</strong><span>{t('/ месяц')}</span></div></div><p><MapPinIcon size={16}/>{t(home.district)}<span>·</span><BedIcon size={17}/>{t(roomLabel(home.rooms))}<span>·</span>{home.area} {t('м²')}</p><button className="text-button" onClick={() => onMap(home)}>{t('Показать на карте')} <ArrowUpRightIcon size={18}/></button></div>
  </article>;
}
export function CatalogPage({ homes, favorites, onFavorite, onMap, onRequest }) {
  const { t, search } = useLocale();
  const parameters = new URLSearchParams(search);
  const [area, setArea] = useState(parameters.get('area') || 'all');
  const [bedrooms, setBedrooms] = useState(parameters.get('beds') || 'all');
  const [budget, setBudget] = useState(parameters.get('budget') || '');
  const [query, setQuery] = useState(parameters.get('q') || '');
  const [savedOnly, setSavedOnly] = useState(parameters.get('saved') === '1');
  const [sort, setSort] = useState(parameters.get('sort') || 'recommended');
  useEffect(() => { const p = new URLSearchParams(search); setArea(p.get('area') || 'all'); setSavedOnly(p.get('saved') === '1'); setBedrooms(p.get('beds') || 'all'); setBudget(p.get('budget') || ''); setQuery(p.get('q') || ''); setSort(p.get('sort') || 'recommended'); }, [search]);
  useEffect(() => {
    const url = new URL(location.href);
    const values = {area:area==='all'?'':area,beds:bedrooms==='all'?'':bedrooms,budget,q:query,saved:savedOnly?'1':'',sort:sort==='recommended'?'':sort};
    Object.entries(values).forEach(([key,value])=>value?url.searchParams.set(key,value):url.searchParams.delete(key));
    history.replaceState({},'',url);
  }, [area,bedrooms,budget,query,savedOnly,sort]);
  const normalize = text => text.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const normalizedQuery = normalize(query.trim());
  const visible = homes.filter(home => (area === 'all' || home.district === areaNames[areaIds.indexOf(area)]) && (bedrooms === 'all' || home.rooms === Number(bedrooms)) && (!budget || home.price <= Number(budget)) && (!savedOnly || favorites.includes(home.id)) && (!normalizedQuery || normalize(['ru','en','vi'].flatMap(language=>[home.title,home.district,home.tag].map(key=>translate(language,key))).join(' ')).includes(normalizedQuery))).sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : 0);
  function reset() { setArea('all'); setBedrooms('all'); setBudget(''); setQuery(''); setSavedOnly(false); setSort('recommended'); }
  return <div className="inner-page catalog-page">
    <PageIntro eyebrow="НАЙТИ СВОЁ МЕСТО" title="Дом под ваш ритм." description="У моря, у реки или ближе к любимым кофейням. Начните с того, что важно именно вам."/>
    <section className="search-panel" aria-label={t('Фильтры квартир')}>
      <label className="search-field"><span>{t('Поиск')}</span><div><MagnifyingGlassIcon size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('Название или район')}/></div></label>
      <label>{t('Район')}<select value={area} onChange={e => setArea(e.target.value)}><option value="all">{t('Все районы')}</option>{areaNames.map((name,i) => <option key={name} value={areaIds[i]}>{t(name)}</option>)}</select></label>
      <label>{t('Спальни')}<select value={bedrooms} onChange={e => setBedrooms(e.target.value)}><option value="all">{t('Неважно')}</option>{[0,1,2].map(n => <option key={n} value={n}>{t(roomLabel(n))}</option>)}</select></label>
      <label>{t('До $ в месяц')}<input type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)} placeholder={t('Без ограничения')}/></label>
    </section>
    <div className="listing-toolbar"><span role="status">{t('Найдено квартир: {count}', {count: visible.length})}</span><button className={`saved-filter ${savedOnly ? 'active' : ''}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><HeartIcon size={19} weight={savedOnly ? 'fill' : 'regular'}/>{t('Избранное')} · {favorites.length}</button><label className="sort-label"><span className="sr-only">{t('Сортировка')}</span><SlidersHorizontalIcon size={18}/><select value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">{t('Рекомендуем')}</option><option value="low">{t('Сначала дешевле')}</option><option value="high">{t('Сначала дороже')}</option></select></label></div>
    <div className="home-grid catalog-page-grid">{visible.map(home => <HomeCard key={home.id} {...{home, favorites, onFavorite, onMap}}/>)}</div>
    {!visible.length && <div className="empty-state search-empty"><HouseLineIcon size={40} weight="light"/><h2>{t('Пока нет совпадений.')}</h2><p>{t('Попробуйте другие фильтры или расскажите, какой дом вы ищете.')}</p><div><button className="navy-button" onClick={reset}>{t('Сбросить фильтры')}<XIcon size={17}/></button><button className="text-button" onClick={() => onRequest()}>{t('Получить подборку')}<ArrowRightIcon size={18}/></button></div></div>}
    <p className="catalog-demo">{t('Демонстрационная подборка: фото, цены и расположение приведены для примера.')}</p>
    <HelpBand onRequest={onRequest}/>
  </div>;
}
export function HelpBand({ onRequest }) {
  const {t}=useLocale();
  return <section className="help-band"><div><p className="eyebrow">{t('НЕ ОБЯЗАТЕЛЬНО ИСКАТЬ В ОДИНОЧКУ')}</p><h2>{t('Расскажите, что для вас дом.')}</h2><p>{t('Поможем сузить поиск и сравнить подходящие варианты.')}</p></div><button className="navy-button" onClick={() => onRequest()}>{t('Получить подборку')}<ArrowRightIcon size={20}/></button></section>;
}
export function PropertyPage({ home, homes, favorites, onFavorite, onMap, onRequest }) {
  const { t } = useLocale();
  if (!home) return <NotFound/>;
  const saved = favorites.includes(home.id);
  return <div className="inner-page property-page">
    <nav className="breadcrumbs" aria-label={t('Вы здесь')}><Link>{t('Главная')}</Link><span>/</span><Link to="apartments">{t('Квартиры')}</Link><span>/</span><span>{t(home.short)}</span></nav>
    <div className="property-title"><div><p className="eyebrow">{t(home.district)} · {t('Дананг')}</p><h1>{t(home.title)}</h1></div><button className="save-property" aria-pressed={saved} onClick={() => onFavorite(home.id)}><HeartIcon size={21} weight={saved ? 'fill' : 'regular'}/>{t(saved ? 'Сохранено' : 'Сохранить')}</button></div>
    <figure className="property-photo"><img src={home.image} alt={t(home.title)} fetchPriority="high"/><figcaption>{t('Иллюстрация квартиры для демонстрационной версии')}</figcaption></figure>
    <div className="property-layout"><div className="property-story"><div className="property-facts"><span><BedIcon size={22}/>{t(roomLabel(home.rooms))}</span><span>{home.area} {t('м²')}</span><button onClick={() => onMap(home)}><MapPinIcon size={22}/>{t('На карте')}<ArrowUpRightIcon size={16}/></button></div><h2>{t('Место для вашей жизни.')}</h2><p>{t(home.description)}</p><div className="property-features">{home.features.map(feature => <span key={feature}><CheckIcon size={20}/>{t(feature)}</span>)}</div><h2>{t('До решения уточним детали.')}</h2><p>{t('Условия зависят от квартиры и дат. На просмотре обсудим всё, что влияет на ваш комфорт и расходы.')}</p><dl className="rental-terms">{['Срок аренды и дата заезда', 'Депозит и порядок возврата', 'Электричество, вода и интернет', 'Уборка, питомцы и правила дома'].map(term => <div key={term}><dt>{t(term)}</dt><dd>{t('Уточняем индивидуально')}</dd></div>)}</dl></div>
      <aside className="property-inquiry"><p className="eyebrow">{t('ВАШ СЛЕДУЮЩИЙ ШАГ')}</p><div className="price"><strong>${home.price}</strong><span>{t('/ месяц')}</span></div><p>{t('Посмотрите квартиру лично или по видео. Удобное время согласуем с вами.')}</p><button className="navy-button" onClick={() => onRequest(home)}>{t('Обсудить просмотр')}<ArrowRightIcon size={20}/></button><span className="inquiry-assurance"><CheckIcon size={17}/>{t('Без комиссии арендатора')}</span><p className="demo-note">{t('Демонстрационная квартира. Фото созданы для макета, цена и расположение приведены для примера.')}</p></aside></div>
    <section className="related-homes"><div className="editorial-heading"><h2>{t('Ещё немного вдохновения.')}</h2><Link to="apartments" className="text-button">{t('Все квартиры')}<ArrowRightIcon size={19}/></Link></div><div className="home-grid">{homes.filter(h=>h.id!==home.id).slice(0,3).map(home=><HomeCard key={home.id} {...{home,favorites,onFavorite,onMap}}/>)}</div></section>
  </div>;
}
export function DistrictsPage({ onChoose, onRequest, illustrated }) {
  const { t } = useLocale();
  return <div className="inner-page districts-page"><PageIntro eyebrow="ДАНАНГ БЛИЖЕ, ЧЕМ КАЖЕТСЯ" title="Найдите свой район." description="Сначала представьте обычный день: путь к морю, рабочее место, прогулку за кофе. Район должен подходить вашей жизни."/><DistrictSection {...{onChoose, onRequest, illustrated}}/><section className="area-notes"><h2>{t('На что смотреть вокруг дома')}</h2><div>{[['Ваш ежедневный маршрут', 'Пройдите путь до пляжа, магазина и места работы. Проверьте, комфортен ли он именно вам.'], ['Звуки и соседство', 'Загляните в район днём и вечером: кафе, стройка и движение могут менять впечатление.'], ['Дом и его окружение', 'Посмотрите на подъезд, парковку, освещение улицы и то, как устроен вход в здание.']].map(([title,body],i)=><article key={title}><span>0{i+1}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div></section><HelpBand onRequest={onRequest}/></div>;
}
export function RentalPage({ onRequest, illustrated }) {
  return <div className="inner-page rental-page"><PageIntro eyebrow="СПОКОЙНО. ПО ШАГАМ." title="От знакомства до ключей." description="Понятный поиск, внимательный просмотр и условия, которые вы обсудили заранее." art="glass-keys-v2"/><ProcessSection {...{onRequest,illustrated}}/><FaqSection onRequest={onRequest}/><HelpBand onRequest={onRequest}/></div>;
}

export const guides = [
  {id:'choose-your-neighbourhood',title:'Как выбрать район под свой ритм',category:'Районы',image:'glass-coast-v2',intro:'Начните с привычек, а не с названия района. Простой способ понять, где вам будет удобно.',sections:[
    ['Представьте обычный вторник', 'Где вы работаете, покупаете продукты, гуляете и отдыхаете? Составьте короткий список мест, до которых хочется добираться без лишних усилий.'],
    ['Проверьте маршрут на месте', 'После просмотра прогуляйтесь по соседним улицам. Обратите внимание на тротуары, переходы, парковку и дорогу к нужным вам местам.'],
    ['Вернитесь в другое время', 'Тихая улица утром может стать оживлённой вечером. Если есть возможность, оцените район в то время, когда обычно будете дома.'],
    ['Сравните два варианта', 'Выберите два района и запишите, что нравится и что смущает в каждом. Это полезнее, чем пытаться найти один идеальный район для всех.']
  ]},
  {id:'viewing-checklist',title:'Что проверить на просмотре квартиры',category:'Просмотр',image:'glass-home-v2',intro:'Свет, тишина и бытовые детали. Сохраните этот список перед личным или видеопросмотром.',sections:[
    ['Свет и воздух', 'Откройте шторы, посмотрите на окна, проверьте вентиляцию и кондиционер. Попросите показать квартиру при дневном свете.'],
    ['Вода и техника', 'Проверьте напор воды, горячую воду, плиту, холодильник и стиральную машину. Уточните, кто отвечает за ремонт оборудования.'],
    ['Работа и отдых', 'Оцените место для стола, розетки, хранение вещей и звуки с улицы. Если работаете из дома, попросите проверить интернет во время просмотра.'],
    ['Вопросы до решения', 'Уточните полный состав ежемесячных платежей, правила дома и состояние мебели. Попросите зафиксировать согласованные условия письменно.']
  ]},
  {id:'moving-in',title:'Первые дни в новом доме',category:'Заселение',image:'glass-keys-v2',intro:'Несколько простых действий, которые помогут спокойно освоиться после переезда.',sections:[
    ['Пройдите квартиру вместе', 'При получении ключей осмотрите комнаты и технику, отметьте существующие повреждения и сохраните фотографии состояния квартиры.'],
    ['Сохраните важные контакты', 'Запишите контакты собственника или управляющего, договоритесь, как сообщать о бытовых проблемах и кому звонить при срочном вопросе.'],
    ['Разберитесь с домом', 'Уточните, где оставлять мусор, как пользоваться парковкой, общими зонами и входными ключами. Проверьте, что все комплекты ключей работают.'],
    ['Дайте себе время', 'Найдите ближайший магазин, выберите маршрут для прогулок и устройте удобное рабочее место. Маленькие привычки помогают почувствовать себя дома.']
  ]}
];
export function GuidesPage() {
  const {t}=useLocale();
  return <div className="inner-page guides-page"><PageIntro eyebrow="ЗАМЕТКИ О ЖИЗНИ В ДАНАНГЕ" title="Переехать. И освоиться." description="Небольшие практические материалы: от выбора района до первого утра в новом доме."/><div className="guide-grid">{guides.map((guide,i)=><Link to={`guides/${guide.id}`} className="guide-card" key={guide.id}><div className="guide-art"><img src={assetPath(`${guide.image}.webp`)} alt=""/></div><div className="guide-copy"><p className="eyebrow">{t(guide.category)}<span>0{i+1}</span></p><h2>{t(guide.title)}</h2><p>{t(guide.intro)}</p><span className="text-button">{t('Читать материал')}<ArrowUpRightIcon size={20}/></span></div></Link>)}</div></div>;
}
export function GuidePage({id,onRequest}) {
  const {t}=useLocale();
  const guide=guides.find(g=>g.id===id);
  if(!guide)return <NotFound/>;
  return <div className="inner-page article-page"><Link to="guides" className="text-button article-back"><ArrowLeftIcon size={18}/>{t('Все материалы')}</Link><PageIntro eyebrow={guide.category} title={guide.title} description={guide.intro} art={guide.image}/><div className="article-layout"><aside><p className="eyebrow">{t('В ЭТОМ МАТЕРИАЛЕ')}</p>{guide.sections.map(([title],i)=><a key={title} href={`#part-${i}`}>{String(i+1).padStart(2,'0')} · {t(title)}</a>)}</aside><article>{guide.sections.map(([title,body],i)=><section id={`part-${i}`} key={title}><p className="eyebrow">0{i+1}</p><h2>{t(title)}</h2><p>{t(body)}</p></section>)}</article></div><HelpBand onRequest={onRequest}/></div>;
}
export function AboutPage({onRequest}) {
  const {t}=useLocale();
  return <div className="inner-page about-page"><PageIntro eyebrow="МЫ — DANANG HOMII" title="Знаем город. Слушаем вас." description="Помогаем найти в Дананге пространство, в котором удобно жить. Начинаем с ваших привычек и остаёмся рядом на пути к новому дому." art="glass-chat-v2"/><section className="about-story"><img src={assetPath('danang-neighborhood.webp')} alt={t('Иллюстрация приморской улицы Дананга')}/><div><p className="eyebrow">{t('МЕСТНЫЙ ВЗГЛЯД. ПОНЯТНЫЙ ПОДХОД.')}</p><h2>{t('За красивой фотографией — повседневная жизнь.')}</h2><p>{t('Нам важно, что будет после просмотра: удобно ли работать, легко ли добираться, подходит ли вам окружение. Поэтому обсуждаем не только метры и цену, но и ваш обычный день.')}</p>{[['Внимание к деталям','Состояние квартиры, расположение и условия аренды — разбираем до решения.'],['Понятный разговор','Объясняем варианты и отвечаем на вопросы без давления.'],['Помощь с переездом','Согласуем просмотр и заселение, помогаем разобраться с бытовыми вопросами.']].map(([h,p])=><div className="about-principle" key={h}><CheckIcon size={21}/><div><h3>{t(h)}</h3><p>{t(p)}</p></div></div>)}</div></section><section className="contact-block" id="contacts"><div><p className="eyebrow">{t('ДАВАЙТЕ ПОЗНАКОМИМСЯ')}</p><h2>{t('Ваш дом начинается с разговора.')}</h2><p>{t('На русском, английском и вьетнамском.')}</p><p className="contact-location"><MapPinIcon size={20}/>Đà Nẵng, Việt Nam</p></div><div><p>{t('Укажите пожелания и удобный способ связи. Так мы сможем начать с того, что для вас действительно важно.')}</p><button className="navy-button" onClick={()=>onRequest()}>{t('Обсудить подбор')}<ArrowRightIcon size={20}/></button><Link to="owners" className="text-button">{t('Я собственник жилья')}<ArrowUpRightIcon size={18}/></Link></div></section></div>;
}
export function OwnersPage() {
  const {t}=useLocale();
  const [done,setDone]=useState(false);
  const result=useRef(null);
  useEffect(()=>{if(done)result.current?.focus();},[done]);
  return <div className="inner-page owners-page"><PageIntro eyebrow="СОБСТВЕННИКАМ" title="Найдём тех, кому подойдёт ваш дом." description="Расскажите о квартире. Обсудим её особенности, условия аренды и то, каким жильцам она подойдёт." art="glass-home-v2"/><div className="owners-layout"><div><h2>{t('Начнём с деталей.')}</h2><p>{t('Для знакомства достаточно района, типа жилья и контакта. Фотографии и условия можно обсудить следующим шагом.')}</p><ol className="owner-steps">{[['Знакомимся с объектом','Уточняем состояние, расположение и особенности квартиры.'],['Согласуем условия','Обсуждаем стоимость, срок аренды и порядок сотрудничества.'],['Организуем просмотры','Помогаем потенциальным жильцам понять, подходит ли им ваш дом.']].map(([title,body],i)=><li key={title}><span>0{i+1}</span><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}</ol></div><div className="owner-form-card">{done?<div className="form-success" role="status" ref={result} tabIndex={-1}><CheckIcon size={42}/><h2>{t('Информация об объекте готова.')}</h2><p>{t('Демонстрация: заявка никуда не отправляется.')}</p><button className="navy-button" onClick={()=>setDone(false)}>{t('Заполнить ещё раз')}<ArrowRightIcon size={19}/></button></div>:<form onSubmit={e=>{e.preventDefault(); const c=e.currentTarget.elements.contact; if(c.value.trim().length<3){c.setCustomValidity(t('Укажите никнейм или номер, чтобы мы могли связаться с вами.'));c.reportValidity();return;}setDone(true);}}><h2>{t('Расскажите о квартире')}</h2><label>{t('Как к вам обращаться?')}<input name="name" autoComplete="name" placeholder={t('Ваше имя')}/></label><div className="owner-field-row"><label>{t('Район')}<select name="area" required defaultValue=""><option value="" disabled>{t('Выберите район')}</option>{areaNames.map((a,i)=><option value={areaIds[i]} key={a}>{t(a)}</option>)}<option value="other">{t('Другой район')}</option></select></label><label>{t('Тип жилья')}<select name="type"><option value="apartment">{t('Квартира')}</option><option value="studio">{t('Студия')}</option><option value="house">{t('Дом или вилла')}</option></select></label></div><label>{t('Что важно знать об объекте?')}<textarea name="details" rows="3" placeholder={t('Площадь, спальни, желаемая стоимость аренды')} maxLength={1500}/></label><label>{t('Telegram или WhatsApp')}<input name="contact" required minLength={3} onInput={e=>e.currentTarget.setCustomValidity('')} placeholder={t('@username или номер телефона')}/></label><button className="navy-button" type="submit">{t('Обсудить сотрудничество')}<ArrowRightIcon size={19}/></button><p className="demo-note">{t('Демонстрация: заявка никуда не отправляется.')}</p></form>}</div></div></div>;
}
export function NotFound(){const {t}=useLocale();return <div className="inner-page not-found"><p className="eyebrow">404</p><h1>{t('Кажется, здесь пока никто не живёт.')}</h1><p>{t('Такой страницы нет. Вернёмся к поиску вашего дома?')}</p><Link className="navy-button" to="apartments">{t('Посмотреть квартиры')}<ArrowRightIcon size={20}/></Link></div>;}
