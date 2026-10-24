import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {onPage,prefersReducedMotion,scrollToTarget,stopScroll,startScroll} from '../engine';
import {journeys} from '../data/site';
import {routes} from '../data/explore';
import {tripDetails} from '../data/trip-details';
import {registerDiscovery} from './discovery';
import {readTrip} from '../lib/trip-storage';
import {registerPageTransition} from './page-transition';
import {registerBanner} from './banner';
export function setupMotion(){
 registerDiscovery();
 registerBanner();
 registerPageTransition();
 onPage(()=>{
  const events=new AbortController();const signal=events.signal;const reduced=prefersReducedMotion();
  const listen=(el:EventTarget|null,type:string,fn:EventListener)=>el?.addEventListener(type,fn,{signal});
  const menu=document.querySelector<HTMLElement>('#mobile-nav');const toggle=document.querySelector<HTMLButtonElement>('.menu-toggle');
  const closeMenu=()=>{if(menu)menu.hidden=true;toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation');};
  listen(toggle,'click',()=>{if(!menu)return;const open=menu.hidden;menu.hidden=!open;toggle?.setAttribute('aria-expanded',String(open));toggle?.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  listen(menu,'click',e=>{if((e.target as HTMLElement).closest('a,button'))closeMenu();});
  listen(document,'keydown',e=>{if((e as KeyboardEvent).key==='Escape'){if(menu&&!menu.hidden){closeMenu();toggle?.focus();}}});
  listen(document,'click',e=>{if(menu&&!menu.hidden&&!(e.target as HTMLElement).closest('.header'))closeMenu();});
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a=>listen(a,'click',e=>{if(a.classList.contains('skip-link'))return;const target=a.getAttribute('href');if(target?.startsWith('#')&&document.querySelector(target)){e.preventDefault();scrollToTarget(target);history.replaceState(null,'',target);}}));
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(btn=>listen(btn,'click',()=>{
   const value=btn.dataset.filter;let count=0;
   document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
   document.querySelectorAll<HTMLElement>('[data-category]').forEach(card=>{card.hidden=value!=='All places'&&value!==card.dataset.category;if(!card.hidden)count++;});
   const label=document.querySelector('[data-filter-count]');if(label)label.textContent=`${count} ${count===1?'place':'places'} to explore`;
   ScrollTrigger.refresh();
  }));
  const dialog=document.querySelector<HTMLDialogElement>('#planner')!;
  const form=document.querySelector<HTMLFormElement>('#trip-form')!;
  const formView=document.querySelector<HTMLElement>('.planner-form')!;
  const resultView=document.querySelector<HTMLElement>('.planner-result')!;
  const dateInput=form.elements.namedItem('date') as HTMLInputElement;
  const destinationSelect=form.elements.namedItem('destination') as HTMLSelectElement;
  const routeSelect=form.elements.namedItem('route') as HTMLSelectElement;
  const syncRoute=()=>{const route=routes.find(r=>r.slug===routeSelect.value);if(route&&route.destination!==destinationSelect.value)routeSelect.value='';};
  listen(destinationSelect,'change',syncRoute);
  listen(routeSelect,'change',()=>{const route=routes.find(r=>r.slug===routeSelect.value);if(route)destinationSelect.value=route.destination;});
  const now=new Date();dateInput.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  let briefText='';let lastTrigger:HTMLElement|null=null;let chosenSlug=journeys[0].slug;
  const showForm=()=>{formView.hidden=false;resultView.hidden=true;};
  const readSaved=()=>readTrip(dateInput.min);
  document.querySelectorAll<HTMLElement>('[data-plan]').forEach(button=>listen(button,'click',()=>{
   lastTrigger=button;closeMenu();showForm();const saved=readSaved();if(saved){for(const [key,value]of Object.entries(saved)){const el=form.elements.namedItem(key) as HTMLInputElement|null;if(el&&typeof value==='string')el.value=value;}}
   const destination=button.dataset.planDestination;const route=routes.find(r=>r.slug===button.dataset.planRoute);
   if(route){destinationSelect.value=route.destination;routeSelect.value=route.slug;}else if(destination){destinationSelect.value=destination;routeSelect.value='';}
   if(!destinationSelect.value)destinationSelect.value=journeys[0].slug;syncRoute();
   dialog.showModal();stopScroll();
  }));
  listen(document.querySelector('.dialog-close'),'click',()=>dialog.close());
  listen(dialog,'close',()=>{startScroll();lastTrigger?.focus();});
  listen(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();const m=e as MouseEvent;if(m.clientX<r.left||m.clientX>r.right||m.clientY<r.top||m.clientY>r.bottom)dialog.close();}});
  listen(form,'submit',e=>{
   e.preventDefault();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));const j=journeys.find(j=>j.slug===data.destination)!;const selectedRoute=routes.find(r=>r.slug===data.route&&r.destination===j.slug);const plan=selectedRoute||j;chosenSlug=plan.slug;
   const formatted=new Date(String(data.date)+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
   const summary=document.querySelector('#trip-summary')!;summary.replaceChildren();
   const heading=document.createElement('h3');heading.textContent=plan.name;summary.append(heading);
   for(const line of [`${formatted} · ${data.travelers}`,String(data.pace),`${plan.days} days of inspiration: ${plan.route}`]){const p=document.createElement('p');p.textContent=line;summary.append(p);}
   const link=document.createElement('a');link.href=selectedRoute?`/trips/${selectedRoute.slug}/`:`/journeys/${j.slug}/`;link.textContent=selectedRoute?'Read the full route':`Read the ${j.name} field notes`;link.addEventListener('click',()=>{dialog.close();},{signal});summary.append(link);
   const details=selectedRoute?tripDetails[selectedRoute.slug]:null;
   const detailedDays=details?details.days.map((day,i)=>`Day ${i+1} · ${day.title}\nOvernight: ${day.overnight}\n${day.summary}\n\n${day.blocks.map(block=>`${block.time}: ${block.title}\n${block.text}`).join('\n\n')}\n\nPlanning note: ${day.note}\nAlternative: ${day.alternative}`).join('\n\n'):plan.stops.map((s,i)=>`${i+1}. ${s[0]}\n${s[1]}`).join('\n\n');
   const practical=details?`\n\nTRAVEL & STAYS\n${[...details.transport,...details.stays].map(item=>`${item.title}\n${item.text}`).join('\n\n')}\n\nFOOD & BUDGET\n${[...details.food,...details.budget].map(item=>`${item.title}\n${item.text}`).join('\n\n')}\n\nBEFORE YOU GO\n${details.season}\n\nPACKING\n${details.packing.map(item=>`• ${item}`).join('\n')}\n\nOFFICIAL LINKS\n${details.sources.map(source=>`${source.label}: ${source.href}`).join('\n')}`:'';
   briefText=`ULA · YOUR TAMIL NADU TRIP BRIEF\n\n${plan.name}\n${formatted}\n${data.travelers}\n${data.pace}\n\n${plan.days} days of inspiration\n${plan.route}\n\n${detailedDays}${practical}\n\nIllustrative itinerary. Nothing has been booked. Check current transport, entry requirements and conditions before travel.\n`;
   try{localStorage.setItem('tamilnadu-trip',JSON.stringify(data));}catch{}
   formView.hidden=true;resultView.hidden=false;dialog.scrollTop=0;document.querySelector<HTMLButtonElement>('#download-brief')?.focus();
  });
  listen(document.querySelector('#edit-brief'),'click',()=>{showForm();(form.elements.namedItem('destination')as HTMLElement).focus();});
  listen(document.querySelector('#download-brief'),'click',()=>{const url=URL.createObjectURL(new Blob([briefText],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`ula-${chosenSlug}-trip.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  const contactForm=document.querySelector<HTMLFormElement>('#contact-form');
  listen(contactForm,'submit',e=>{
   e.preventDefault();if(!contactForm||!contactForm.reportValidity())return;
   const data=new FormData(contactForm);
   const message=`ULA · CONTACT NOTE\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${data.get('topic')}\n\n${data.get('message')}\n\nPrepared locally. This message has not been sent.\n`;
   const url=URL.createObjectURL(new Blob([message],{type:'text/plain;charset=utf-8'}));
   const link=document.createElement('a');link.href=url;link.download='ula-contact-note.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   const status=document.querySelector('#contact-status');if(status)status.textContent='Your message file is ready. It has not been sent; message delivery is not connected yet.';
  });
  listen(document.querySelector('#clear-storage'),'click',()=>{try{localStorage.removeItem('tamilnadu-trip');}catch{}const status=document.querySelector('#storage-status');if(status)status.textContent='Your saved trip brief has been cleared from this browser.';});
  return()=>{events.abort();if(dialog.open){dialog.close();startScroll();}};
 });
}
