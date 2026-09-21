import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRightIcon, ArrowUpRightIcon, MapPinIcon, SunIcon, CoffeeIcon, MoonIcon, WavesIcon, LeafIcon, BuildingsIcon, CheckIcon, ListChecksIcon, CalculatorIcon, LaptopIcon, UsersIcon, PawPrintIcon } from '@phosphor-icons/react';
import { Link, useLocale } from './locale.jsx';
import { assetPath } from './paths.js';
import { copy, neighbourhoods, priorities, recommendAreas, viewingChecks, movingStages, standards, ownerPrep, calculateMoveBudget } from './enrichment-content.js';

const priorityIcons = {sea:WavesIcon,cafes:CoffeeIcon,city:BuildingsIcon,space:SunIcon,nature:LeafIcon};
const dayIcons = [SunIcon,CoffeeIcon,MoonIcon];
const findArea = id => neighbourhoods.find(area=>area.id===id) || neighbourhoods[0];

// Real buttons with roving focus keep every tab group usable without a mouse.
function TabRow({items,value,onChange,label,idPrefix,className=''}) {
  const refs=useRef([]);
  function keyDown(event,index) {
    const keys={ArrowRight:(index+1)%items.length,ArrowLeft:(index+items.length-1)%items.length,Home:0,End:items.length-1};
    if(keys[event.key]===undefined)return;
    event.preventDefault(); const next=keys[event.key];onChange(items[next].id);refs.current[next]?.focus();
  }
  return <div className={`explore-tabs ${className}`} role="tablist" aria-label={label}>{items.map((item,i)=><button ref={el=>{refs.current[i]=el;}} key={item.id} id={`${idPrefix}-tab-${item.id}`} type="button" role="tab" aria-selected={value===item.id} aria-controls={`${idPrefix}-panel`} tabIndex={value===item.id?0:-1} onClick={()=>onChange(item.id)} onKeyDown={event=>keyDown(event,i)}>{item.icon}{item.label}</button>)}</div>;
}

export function EditorialFigure({image,alt='',className='',priority=false}) {
  const {t}=useLocale();
  return <figure className={`editorial-figure ${className}`}><img src={assetPath(`editorial/${image}.webp`)} alt={alt} width="1536" height="1024" loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined}/><figcaption>{t(copy.illustration)}</figcaption></figure>;
}

export function DistrictExplorer() {
  const {t,search}=useLocale();
  const [selected,setSelected]=useState(()=>findArea(new URLSearchParams(search).get('area')).id);
  const [day,setDay]=useState('0');
  const [chosen,setChosen]=useState([]);
  const [pair,setPair]=useState(['an-thuong','hai-chau']);
  const panel=useRef(null);
  const area=findArea(selected), matches=recommendAreas(chosen);
  useEffect(()=>{setSelected(findArea(new URLSearchParams(search).get('area')).id);},[search]);
  function choose(id,scroll=false) {
    setSelected(id);setDay('0');
    const url=new URL(location.href);url.searchParams.set('area',id);history.replaceState({},'',url);
    if(scroll)requestAnimationFrame(()=>{panel.current?.scrollIntoView({behavior:'smooth',block:'start'});panel.current?.focus({preventScroll:true});});
  }
  function setComparison(index,id) {
    setPair(current=>{const next=[...current];if(next[1-index]===id)next[1-index]=current[index];next[index]=id;return next;});
  }
  const compareRows=[[copy.shore,'shore'],[copy.routine,'rhythm'],[copy.mobility,'mobility'],[copy.consider,'trade'],[copy.check,'check']];
  return <>
    <section className="district-explorer" ref={panel} tabIndex={-1} aria-label={t(copy.explore)}>
      <TabRow idPrefix="neighbourhood" label={t(copy.explore)} items={neighbourhoods.map((a,i)=>({id:a.id,label:<><span className="tab-number">0{i+1}</span>{t(a.name)}</>}))} value={selected} onChange={choose}/>
      <div id="neighbourhood-panel" role="tabpanel" aria-labelledby={`neighbourhood-tab-${selected}`} className="explore-panel">
        <EditorialFigure image={area.image} alt={`${t(area.name)} · ${t(copy.illustration)}`} priority/>
        <div className="explore-story" key={area.id}>
          <p className="eyebrow"><MapPinIcon size={16}/>{t(area.name)} · Đà Nẵng</p>
          <h2>{t(area.title)}</h2><p className="explore-summary">{t(area.summary)}</p>
          <div className="explore-fit"><CheckIcon size={20}/><div><h3>{t(copy.who)}</h3><p>{t(area.fit)}</p></div></div>
          <div className="explore-actions"><Link className="navy-button" to={`apartments?area=${area.id}`}>{t(copy.homes)}<ArrowRightIcon size={18}/></Link><a className="text-button" href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(area.query)}`} target="_blank" rel="noreferrer">{t(copy.map)}<ArrowUpRightIcon size={18}/></a></div>
        </div>
      </div>
      <div className="explore-daily">
        <div className="explore-day"><div className="explore-day-heading"><h3>{t(copy.dayTitle)}</h3><TabRow idPrefix="area-day" label={t(copy.dayTitle)} items={[copy.morning,copy.daytime,copy.evening].map((label,i)=>{const Icon=dayIcons[i];return {id:String(i),label:t(label),icon:<Icon size={18}/>};})} value={day} onChange={setDay}/></div><p id="area-day-panel" role="tabpanel" aria-labelledby={`area-day-tab-${day}`} key={`${selected}-${day}`}>{t(area.day[Number(day)])}</p><small>{t(copy.dayNote)}</small></div>
        <div className="explore-cautions"><div><h3>{t(copy.consider)}</h3><p>{t(area.trade)}</p></div><div><h3>{t(copy.check)}</h3><p>{t(area.check)}</p></div></div>
      </div>
      <p className="explore-region-note">{t(copy.regionNote)}</p>
    </section>
    <section className="lifestyle-tool" aria-labelledby="lifestyle-heading"><div className="tool-heading"><p className="eyebrow">01 / {t('Районы')}</p><h2 id="lifestyle-heading">{t(copy.quizTitle)}</h2><p>{t(copy.quizIntro)}</p></div>
      <div className="priority-chips">{priorities.map(({id,label})=>{const Icon=priorityIcons[id];return <button key={id} aria-pressed={chosen.includes(id)} onClick={()=>setChosen(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id])}><Icon size={22}/>{t(label)}{chosen.includes(id)&&<CheckIcon size={16}/>}</button>;})}</div>
      {chosen.length?<><div className="match-header"><h3 aria-live="polite">{t(copy.quizResult)}</h3><button className="text-button" onClick={()=>setChosen([])}>{t(copy.reset)}</button></div><div className="area-matches">{matches.map(({area,matched})=><article key={area.id}><img src={assetPath(`editorial/${area.image}.webp`)} alt="" loading="lazy" width="1536" height="1024"/><div><h3>{t(area.name)}</h3><p>{t(copy.match,{items:matched.map(id=>t(priorities.find(item=>item.id===id).label)).join(' · ')})}</p><button className="text-button" onClick={()=>choose(area.id,true)}>{t(copy.readArea)}<ArrowUpRightIcon size={18}/></button></div></article>)}</div><p className="tool-note">{t(copy.editorial)}</p></>:<p className="priority-empty">{t(copy.quizEmpty)}</p>}
    </section>
    <section className="area-compare" aria-labelledby="comparison-heading"><div className="tool-heading"><p className="eyebrow">02 / {t('Районы')}</p><h2 id="comparison-heading">{t(copy.compareTitle)}</h2><p>{t(copy.compareIntro)}</p></div><div className="compare-pickers">{pair.map((id,index)=><label key={index}>{t(index?copy.secondArea:copy.firstArea)}<select value={id} onChange={event=>setComparison(index,event.target.value)}>{neighbourhoods.map(a=><option key={a.id} value={a.id}>{t(a.name)}</option>)}</select></label>)}</div><div className="compare-table" role="table" aria-label={t(copy.compareTitle)}><div className="compare-row compare-column-head" role="row"><span role="columnheader" className="sr-only">{t(copy.compareIntro)}</span>{pair.map(id=><strong role="columnheader" key={id}>{t(findArea(id).name)}</strong>)}</div>{compareRows.map(([label,key])=><div className="compare-row" role="row" key={key}><h3 role="rowheader">{t(label)}</h3>{pair.map(id=><p key={id} role="cell">{t(findArea(id)[key])}</p>)}</div>)}</div></section>
    <details className="guide-sources"><summary>{t(copy.sources)}</summary><p>{t(copy.sourcesNote)}</p><ul>{neighbourhoods.map(a=><li key={a.id}><a href={a.source} target="_blank" rel="noreferrer">{t(a.name)} · {new URL(a.source).hostname.replace('www.','')}<ArrowUpRightIcon size={15}/></a></li>)}</ul></details>
  </>;
}

const checklistKey='homii-viewing-checklist-v1';
function readChecks() {
  try {const value=JSON.parse(localStorage.getItem(checklistKey)||'[]');return Array.isArray(value)?[...new Set(value.filter(i=>Number.isInteger(i)&&i>=0&&i<viewingChecks.length))]:[];}catch{return [];}
}
export function ViewingChecklist() {
  const {t}=useLocale();const [checked,setChecked]=useState(readChecks);const id=useId();
  useEffect(()=>{try{localStorage.setItem(checklistKey,JSON.stringify(checked));}catch{/* The checklist remains usable when browser storage is unavailable. */}},[checked]);
  return <section className="viewing-tool" aria-labelledby={`${id}-heading`}><div className="tool-heading"><ListChecksIcon size={28}/><h2 id={`${id}-heading`}>{t(copy.checklistTitle)}</h2><p>{t(copy.checklistIntro)}</p></div><div className="checklist-progress"><span role="status">{t(copy.progress,{done:checked.length,total:viewingChecks.length})}</span><button className="text-button" onClick={()=>setChecked([])} disabled={!checked.length}>{t(copy.checklistReset)}</button></div><progress value={checked.length} max={viewingChecks.length} aria-label={t(copy.checklistTitle)}/><div className="viewing-checks">{viewingChecks.map(([title,body],i)=><label className={checked.includes(i)?'checked':''} key={title}><input type="checkbox" checked={checked.includes(i)} onChange={()=>setChecked(current=>current.includes(i)?current.filter(n=>n!==i):[...current,i])}/><span><strong>{t(title)}</strong><span>{t(body)}</span></span></label>)}</div>{checked.length===viewingChecks.length&&<p className="checklist-complete" role="status"><CheckIcon size={20}/>{t(copy.allChecked)}</p>}</section>;
}

export function MovingJourney({initial=0}) {
  const {t}=useLocale();const [step,setStep]=useState(String(initial));const id=useId();const active=movingStages[Number(step)];
  return <section className="moving-journey"><div className="tool-heading"><h2>{t(copy.journeyTitle)}</h2></div><TabRow idPrefix={id} label={t(copy.journeyTitle)} className="journey-tabs" items={movingStages.map((stage,i)=>({id:String(i),label:<><span>0{i+1}</span>{t(stage.title)}</>}))} value={step} onChange={setStep}/><div className="journey-body" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${step}`}><div><span className="journey-number">0{Number(step)+1}</span><p className="eyebrow">{t(copy.nextStep)}</p><h3>{t(active.subtitle)}</h3></div><ol key={step}>{active.items.map(item=><li key={item}><CheckIcon size={19}/>{t(item)}</li>)}</ol></div></section>;
}

export function BudgetPlanner() {
  const {t,lang}=useLocale();const [values,setValues]=useState(['620','620','80']);const totals=calculateMoveBudget(...values);
  const money=value=>new Intl.NumberFormat(lang==='vi'?'vi-VN':lang==='ru'?'ru-RU':'en-US',{style:'currency',currency:'USD',currencyDisplay:'narrowSymbol',minimumFractionDigits:0,maximumFractionDigits:2}).format(value);
  return <section className="budget-tool"><div className="tool-heading"><CalculatorIcon size={28}/><h2>{t(copy.budgetTitle)}</h2><p>{t(copy.budgetIntro)}</p></div><div className="budget-layout"><div className="budget-fields">{[copy.rent,copy.deposit,copy.extras].map((label,i)=><label key={label}>{t(label)}<input type="number" min="0" step="any" inputMode="decimal" value={values[i]} onChange={event=>setValues(current=>current.map((v,n)=>n===i?event.target.value:v))}/></label>)}</div><div className="budget-results" aria-live="polite">{totals?<><div><span>{t(copy.regular)}</span><strong>{money(totals.monthly)}</strong></div><div><span>{t(copy.initial)}</span><strong>{money(totals.initial)}</strong></div></>:<p>{t(copy.invalidBudget)}</p>}</div></div><p className="tool-note">{t(copy.budgetNote)}</p></section>;
}

export function AreaCallout({areaId}) {
  const {t}=useLocale();const area=areaId&&findArea(areaId);
  return <section className="area-callout"><MapPinIcon size={30}/><div><h2>{t(copy.around)}</h2><p>{t(copy.aroundNote)}</p></div><Link className="text-button" to={`districts${area?`?area=${area.id}`:''}`}>{area?t(area.name):t(copy.districtLink)}<ArrowRightIcon size={20}/></Link></section>;
}
export function LifestyleStandards() {
  const {t}=useLocale();const icons={work:LaptopIcon,family:UsersIcon,pet:PawPrintIcon};
  return <section className="lifestyle-standards"><div className="tool-heading"><h2>{t(copy.standardsTitle)}</h2></div><div className="practical-cards">{standards.map(item=>{const Icon=icons[item.icon];return <article key={item.icon}><Icon size={30}/><p className="eyebrow">{t(item.title)}</p><h3>{t(item.question)}</h3><p>{t(item.body)}</p></article>;})}</div></section>;
}
export function OwnerPreparation() {
  const {t}=useLocale();return <section className="owner-preparation"><div className="tool-heading"><h2>{t(copy.ownerReady)}</h2><p>{t(copy.ownerIntro)}</p></div><div className="practical-cards">{ownerPrep.map(([title,body],i)=><article key={title}><span className="prep-number">0{i+1}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div></section>;
}
