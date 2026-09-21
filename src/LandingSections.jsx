import { Link, useLocale } from './locale.jsx';
import { assetPath } from './paths.js';
import { useEffect, useRef, useState } from 'react';
import { useArtworkReveal } from './useArtworkReveal.js';
import { ArrowRightIcon, ArrowUpRightIcon, ArrowUpIcon, CheckIcon, PlusIcon, ChatCircleDotsIcon, EyeIcon, FileTextIcon, KeyIcon, MapPinIcon } from '@phosphor-icons/react';
const districts = [{
  name: 'Ан Тхыонг',
  mood: 'Кофе, прогулки и море',
  text: 'Для тех, кто хочет начинать день с прогулки к пляжу.',
  count: 2
}, {
  name: 'Нгу Хань Шон',
  mood: 'Больше места для жизни',
  text: 'Когда хочется простора и своего спокойного ритма.',
  count: 0
}, {
  name: 'Хай Тяу',
  mood: 'Город по соседству',
  text: 'Для тех, кому ближе городская жизнь и набережная.',
  count: 1
}, {
  name: 'Шон Тра',
  mood: 'Море и зелень',
  text: 'Когда хочется быть ближе к морю и полуострову.',
  count: 1
}, {
  name: 'Лиен Тьеу',
  mood: 'Свой повседневный ритм',
  text: 'Ещё одно направление для индивидуального подбора.',
  count: 0
}];
export function DistrictSection({
  onChoose,
  onRequest,
  illustrated = false
}) {
  const {
    t
  } = useLocale();
  const [active, setActive] = useState(0);
  const artworkRoot = useArtworkReveal(illustrated);
  const district = districts[active];
  return <section id="districts" className="page-section district-section" ref={artworkRoot}>
    <div className="editorial-heading"><div><p className="eyebrow">{t("НЕ ТОЛЬКО КВАРТИРА. ВАША ЖИЗНЬ ВОКРУГ.")}</p><h2>{t("Пять районов.")}<br />{t("Какой из них — ваш?")}</h2></div><p>{t("Море за углом, любимая кофейня или окна на реку. Начните с того, что делает день хорошим.")}</p></div>
    <div className="district-layout">
      <figure data-artwork={illustrated ? true : undefined} className={`district-photo ${illustrated ? 'district-sculpture' : ''}`}><img src={illustrated ? assetPath('glass-coast-v2.webp') : assetPath('danang-neighborhood.webp')} alt={illustrated ? t('Сине-золотая стеклянная скульптура морской волны и прибрежного города') : t('Иллюстрация утренней приморской улицы с пальмами')} loading="lazy" /><figcaption><MapPinIcon size={20} /><span>{t("Дананг, Вьетнам")}<small>{illustrated ? t('Море, город и ваш собственный ритм.') : t('У каждого дня может быть такой маршрут.')}</small></span></figcaption></figure>
      <div className="district-picker"><div className="district-tabs" role="tablist" aria-orientation="vertical" aria-label={t("Выберите район")}>{districts.map((d, i) => <button type="button" key={d.name} id={`district-tab-${i}`} role="tab" aria-selected={active === i} aria-controls="district-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
            let next = i;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % districts.length;else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + districts.length) % districts.length;else if (e.key === 'Home') next = 0;else if (e.key === 'End') next = districts.length - 1;else return;
            e.preventDefault();
            setActive(next);
            document.getElementById(`district-tab-${next}`)?.focus();
          }}><span className="district-index">0{i + 1}</span><span><strong>{t(d.name)}</strong><small>{t(d.mood)}</small></span><ArrowUpRightIcon size={24} weight="light" /></button>)}</div>
        <div id="district-panel" className="district-panel" role="tabpanel" aria-labelledby={`district-tab-${active}`}><p>{t(district.text)}</p>{district.count ? <button className="text-button" onClick={() => onChoose(district.name)}>{t("Квартиры в этом районе")}<span className="district-count">{district.count}</span><ArrowRightIcon size={19} /></button> : <button className="text-button" onClick={() => onRequest(district.name)}>{t("Подобрать квартиру в районе")}<ArrowRightIcon size={19} /></button>}</div>
      </div>
    </div>
  </section>;
}
const steps = [{
  title: 'Расскажите о себе',
  text: 'Бюджет, даты и ваши привычки. Нужен стол для работы или балкон для завтраков?',
  Icon: ChatCircleDotsIcon
}, {
  title: 'Посмотрите квартиры',
  text: 'Выберите то, что откликается. Покажем лично или проведём просмотр по видео.',
  Icon: EyeIcon
}, {
  title: 'Разберитесь в условиях',
  text: 'Стоимость, депозит, коммунальные платежи и договор — обсудим до заезда.',
  Icon: FileTextIcon
}, {
  title: 'Почувствуйте себя дома',
  text: 'Согласуем заселение и поможем разобраться с бытовыми вопросами на месте.',
  Icon: KeyIcon
}];
const processImages = ['glass-chat-v2', 'glass-home-v2', 'glass-document-v2', 'glass-keys-v2'];
export function ProcessSection({
  onRequest,
  illustrated = false
}) {
  const {
    t
  } = useLocale();
  const artworkRoot = useArtworkReveal(illustrated);
  return <section id="how-it-works" className="page-section process-section" ref={artworkRoot}>
    <div className="editorial-heading"><div><p className="eyebrow">{t("ОТ ПЕРВОГО СООБЩЕНИЯ ДО КЛЮЧЕЙ")}</p><h2>{t("Переезд — большой шаг.")}<br />{t("Сделаем его понятным.")}</h2></div><button className="text-button" onClick={onRequest}>{t("Начать с пожеланий")}<ArrowRightIcon size={20} /></button></div>
    <div className="process-grid">{steps.map(({
        title,
        text,
        Icon
      }, i) => <article key={title} className="process-step">{illustrated && <div className="process-art" data-artwork style={{
          '--art-delay': `${i * 70}ms`
        }}><img src={assetPath(`${processImages[i]}.webp`)} alt="" loading="lazy" /></div>}<div className="step-top"><span>0{i + 1}</span><Icon size={29} weight="light" /></div><h3>{t(title)}</h3><p>{t(text)}</p></article>)}</div>
    <div className="commission-note"><span className="commission-number">0<span>%</span></span><div><h3>{t("Комиссия для арендатора")}</h3><p>{t("Нашу работу оплачивает собственник. Вы выбираете дом — мы помогаем с поиском и оформлением.")}</p></div></div>
  </section>;
}
export function LeadSection() {
  const {
    t
  } = useLocale();
  const [done, setDone] = useState(false);
  const [rooms, setRooms] = useState('any');
  const result = useRef(null);
  useEffect(() => {
    if (done) result.current?.focus({
      preventScroll: true
    });
  }, [done]);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return <section id="find-home" className="lead-section">
    <div className="lead-copy"><p className="eyebrow">{t("ДОМ НАЧИНАЕТСЯ С РАЗГОВОРА")}</p><h2>{t("Каким будет")}<br />{t("ваш Дананг?")}</h2><p>{t("Расскажите, как вы хотите жить.")}<br />{t("Начнём с нескольких квартир, которые подходят именно вам.")}</p><div className="lead-points"><span><CheckIcon size={18} />{t("Подбор без комиссии")}</span><span><CheckIcon size={18} />{t("Русский · English · Tiếng Việt")}</span><span><CheckIcon size={18} />{t("Просмотр лично или по видео")}</span></div><div className="lead-signature"><span>Danang Homii</span><small>{t("Свой ритм. Свой район. Свой дом.")}</small></div></div>
    <div className="lead-form-card">{done ? <div className="lead-success" ref={result} tabIndex={-1} role="status"><CheckIcon size={43} weight="light" /><p className="eyebrow">{t("ВСЁ ГОТОВО")}</p><h3>{t("Первый шаг сделан.")}</h3><p>{t("Так будет выглядеть заявка на подбор. В этом прототипе данные остаются только в браузере и никуда не отправляются.")}</p><button className="navy-button" onClick={() => setDone(false)}>{t("Заполнить ещё раз")}<ArrowRightIcon size={19} /></button></div> : <><h3>{t("Начнём с простого")}</h3><p className="lead-form-intro">{t("Расскажите о бюджете и планах. Дату можно уточнить позже.")}</p><form onSubmit={e => {
          e.preventDefault();
          const contact = e.currentTarget.elements.contact;
          if (contact.value.trim().length < 3) {
            contact.setCustomValidity(t('Укажите никнейм или номер, чтобы мы могли связаться с вами.'));
            contact.reportValidity();
            return;
          }
          setDone(true);
        }}>
      <div className="lead-field-row"><label>{t("Бюджет в месяц, $")}<input name="budget" type="number" min="100" max="10000" step="10" placeholder={t("Например, 700")} required /></label><label>{t("Дата заезда — необязательно")}<input name="arrival" type="date" min={minDate} /></label></div>
      <fieldset className="room-choices"><legend>{t("Сколько спален?")}</legend><div>{[['any', 'Любые'], ['0', 'Студия'], ['1', '1 спальня'], ['2', '2 спальни']].map(([value, room]) => <label key={value} className={rooms === value ? 'chosen' : ''}><input type="radio" name="bedrooms" value={value} checked={rooms === value} onChange={() => setRooms(value)} /><span>{t(room)}</span></label>)}</div></fieldset>
      <label>{t("Telegram или WhatsApp")}<input name="contact" onInput={e => e.currentTarget.setCustomValidity('')} placeholder={t("@username или номер телефона")} autoComplete="off" minLength="3" required /></label>
      <button type="submit" className="navy-button">{t("Получить подборку")}<ArrowRightIcon size={20} /></button><p className="lead-form-note">{t("Демонстрация: заявка никуда не отправляется.")}</p>
    </form></>}</div>
  </section>;
}
const questions = [['Нужно ли платить за подбор?', 'Арендатор не платит комиссию за подбор и просмотры. Нашу работу оплачивает собственник. Стоимость аренды и остальные платежи обсуждаем отдельно по каждой квартире.'], ['Можно посмотреть квартиру, пока я в другой стране?', 'Да, начать можно с просмотра по видео. Покажем квартиру и обсудим детали, которые сложно оценить по фотографиям. Дату просмотра согласуем в переписке.'], ['На какой срок можно снять жильё?', 'Здесь мы ориентируемся на долгосрочную аренду — от трёх месяцев. Укажите даты заезда и предполагаемый срок: условия и доступность нужно уточнять по каждому объекту.'], ['Что входит в стоимость аренды?', 'Набор включённых услуг зависит от квартиры. До принятия решения уточним арендную плату, электричество, воду, интернет, уборку и размер депозита.'], ['Пока не знаю, какой район выбрать. Что делать?', 'Расскажите о своём обычном дне: работаете ли вы из дома, любите ли тишину, важно ли ходить к морю пешком. Это поможет начать поиск с подходящих районов.']];
export function FaqSection({
  onRequest
}) {
  const {
    t
  } = useLocale();
  const [open, setOpen] = useState(null);
  return <section id="questions" className="page-section faq-section"><div className="faq-intro"><p className="eyebrow">{t("ПЕРЕД ПЕРЕЕЗДОМ")}</p><h2>{t("Вы, наверное,")}<br />{t("хотели спросить.")}</h2><p>{t("А если ваш вопрос другой —")}<br />{t("начнём с него.")}</p><button className="text-button" onClick={onRequest}>{t("Обсудить подбор")}<ArrowRightIcon size={19} /></button></div><div className="faq-list">{questions.map(([question, answer], i) => <div className={`faq-item ${open === i ? 'faq-open' : ''}`} key={question}><h3><button aria-expanded={open === i} aria-controls={`faq-answer-${i}`} id={`faq-question-${i}`} onClick={() => setOpen(open === i ? null : i)}>{t(question)}<PlusIcon size={21} /></button></h3><div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} hidden={open !== i}><p>{t(answer)}</p></div></div>)}</div></section>;
}
export function AboutSection() {
  const {
    t
  } = useLocale();
  return <section id="about" className="page-section about-section"><p className="eyebrow">{t("МЫ — DANANG HOMII")}</p><h2>{t("Знаем Дананг.")}<br />{t("Проверяем детали.")}</h2><p>{t("Перед тем как предложить квартиру, оцениваем её состояние, расположение и то, насколько она подходит вашему образу жизни. Помогаем с просмотром и остаёмся на связи после заселения.")}</p><Link className="text-button about-link" to="about">{t("Больше о нас")}<ArrowUpRightIcon size={19} /></Link></section>;
}
export function FullFooter({
  onRequest,
  onInfo
}) {
  const {
    t
  } = useLocale();
  return <footer className="full-footer"><div className="footer-main"><div className="footer-brand"><Link className="brand"><img className="brand-symbol" src={assetPath('brandmark-coastal-gradient.webp')} width="52" height="52" alt="" /><strong>Danang Homii</strong></Link><p>{t("Ваше место в Дананге.")}<br />{t("И люди, которые помогут его найти.")}</p><span>Đà Nẵng, Việt Nam</span></div><div className="footer-nav"><p>{t("НАЙТИ СВОЁ")}</p><Link to="apartments" hash="">{t("Квартиры")}</Link><Link to="districts" hash="">{t("Районы Дананга")}</Link><Link to="" hash="#find-home">{t("Индивидуальный подбор")}</Link></div><div className="footer-nav"><p>{t("РАЗОБРАТЬСЯ")}</p><Link to="how-to-rent" hash="">{t("Как проходит аренда")}</Link><Link to="how-to-rent" hash="#questions">{t("Частые вопросы")}</Link><Link to="about" hash="">{t("О нас")}</Link><Link to="guides">{t("Полезное")}</Link><Link to="owners">{t("Собственникам")}</Link></div><div className="footer-contact"><p>{t("НАЧНЁМ С РАЗГОВОРА?")}</p><button onClick={onRequest}>{t("Найдём ваш дом")}<ArrowUpRightIcon size={24} /></button><span>{t("На русском, английском и вьетнамском.")}</span></div></div><div className="footer-bottom"><span>© 2026 Danang Homii</span><button onClick={onInfo}>{t("О демонстрационной версии")}</button><a href="#main-content" aria-label={t("Вернуться наверх")}>{t("Наверх")}<ArrowUpIcon size={16} /></a></div></footer>;
}
