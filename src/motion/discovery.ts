import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {onPage} from '../engine';
import {seasons} from '../data/explore';

export function registerDiscovery(){
 onPage(()=>{
  const controller=new AbortController();const signal=controller.signal;
  const tabs=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-experience]'));
  const panels=Array.from(document.querySelectorAll<HTMLElement>('[data-experience-panel]'));
  const activate=(index:number)=>{
   tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
   panels.forEach(panel=>{panel.hidden=panel.dataset.experiencePanel!==tabs[index]?.dataset.experience;});
   ScrollTrigger.refresh();
  };
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>activate(index),{signal});
   tab.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();activate(next);tabs[next]?.focus();
   },{signal});
  });
  const monthButtons=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-month]'));
  const seasonPanels=Array.from(document.querySelectorAll<HTMLElement>('[data-season-panel]'));
  monthButtons.forEach(button=>button.addEventListener('click',()=>{
   const month=Number(button.dataset.month);const season=seasons.find(s=>s.months.includes(month));if(!season)return;
   monthButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   seasonPanels.forEach(panel=>{panel.hidden=panel.dataset.seasonPanel!==season.id;});
   ScrollTrigger.refresh();
  },{signal}));
  document.querySelectorAll<HTMLDetailsElement>('.faq-list details, .trip-alternative').forEach(detail=>detail.addEventListener('toggle',()=>ScrollTrigger.refresh(),{signal}));
  return()=>controller.abort();
 });
}
