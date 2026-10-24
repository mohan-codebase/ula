import {gsap} from 'gsap';
import {onPage,prefersReducedMotion} from '../engine';
import {bannerSlides} from '../data/banner';

export function registerBanner(){
 onPage(()=>{
  const hero=document.querySelector<HTMLElement>('.hero');if(!hero)return;
  const controller=new AbortController();const {signal}=controller;
  const scenes=Array.from(hero.querySelectorAll<HTMLImageElement>('[data-scene]'));
  const tabs=Array.from(hero.querySelectorAll<HTMLButtonElement>('[data-destination]'));
  const pause=hero.querySelector<HTMLButtonElement>('[data-banner-pause]')!;
  const status=hero.querySelector<HTMLElement>('[data-scene-status]')!;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,turning=false,paused=motion.matches,hovered=false,focused=false,inView=true;
  let timer:gsap.core.Tween|null=null;let transition:gsap.core.Timeline|null=null;
  const listen=(el:EventTarget,type:string,fn:EventListener)=>el.addEventListener(type,fn,{signal});
  const navigation=Array.from(hero.querySelectorAll<HTMLButtonElement>('[data-banner-prev], [data-banner-next], [data-destination]'));
  const setTurning=(value:boolean)=>{turning=value;navigation.forEach(button=>button.disabled=value);};
  const stop=()=>{timer?.kill();timer=null;};
  const syncPause=()=>{pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Play banner slideshow':'Pause banner slideshow');};
  const schedule=()=>{stop();if(!paused&&!hovered&&!focused&&inView&&!document.hidden&&!turning)timer=gsap.delayedCall(6,()=>void activate((current+1)%scenes.length,false));};
  const writeLines=(element:Element|null,lines:string[],lastAccent=false)=>{
   if(!element)return;element.replaceChildren();lines.forEach((line,i)=>{if(i)element.append(document.createElement('br'));if(lastAccent&&i===lines.length-1){const span=document.createElement('span');span.textContent=line;element.append(span);}else element.append(document.createTextNode(line));});
  };
  const activate=async(index:number,manual=true)=>{
   if(turning||index===current)return;stop();setTurning(true);
   const previous=scenes[current],next=scenes[index],slide=bannerSlides[index];
   tabs[index].setAttribute('aria-busy','true');
   if(next.dataset.sceneSrc){next.srcset=next.dataset.sceneSrcset||'';next.src=next.dataset.sceneSrc;next.loading='eager';try{await next.decode();delete next.dataset.sceneSrc;}catch{if(signal.aborted)return;tabs[index].removeAttribute('aria-busy');status.textContent='This landscape could not load. Please try again.';setTurning(false);paused=true;syncPause();return;}}
   if(signal.aborted)return;
   tabs[index].removeAttribute('aria-busy');status.textContent=manual?`Slide ${index+1} of ${scenes.length}: ${slide.place.name}`:'';
   const update=()=>{
    current=index;tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
    hero.querySelector('[data-banner-label]')!.textContent=slide.label;
    writeLines(hero.querySelector('[data-banner-title]'),slide.lines,true);
    writeLines(hero.querySelector('[data-banner-description]'),slide.description);
    const action=hero.querySelector<HTMLAnchorElement>('[data-banner-action]')!;action.href=slide.href;action.querySelector('span')!.textContent=slide.action;
    hero.querySelector('[data-scene-name]')!.textContent=`${slide.place.name}, ${slide.place.country}`;
    hero.querySelector('[data-scene-observation]')!.textContent=slide.place.fieldNote;
    hero.querySelector('[data-scene-link]')!.setAttribute('href',`/journeys/${slide.place.slug}/`);
    const count=hero.querySelector('[data-banner-count]')!;count.textContent=`${String(index+1).padStart(2,'0')} / 04`;count.setAttribute('aria-label',`Slide ${index+1} of 4`);
   };
   const finish=()=>{previous.classList.remove('is-current');next.classList.add('is-current');gsap.set(next,{clearProps:'zIndex,clipPath,visibility'});setTurning(false);schedule();};
   if(prefersReducedMotion()){update();finish();return;}
   const copy=hero.querySelectorAll('.hero-content, .scene-field-note, .scene-note');
   gsap.set(next,{visibility:'visible',zIndex:1,clipPath:'inset(0% 0% 0% 100%)'});
   transition=gsap.timeline({onComplete:finish})
    .to(copy,{opacity:0,duration:.17,ease:'power3.out'},0)
    .to(next,{clipPath:'inset(0% 0% 0% 0%)',duration:.85,ease:'expo.inOut'},0)
    .call(update,[],.22)
    .to(copy,{opacity:1,duration:.38,ease:'power3.out'},.3);
  };
  tabs.forEach((tab,i)=>listen(tab,'click',()=>{paused=true;syncPause();void activate(i);stop();}));
  const step=(direction:number)=>{paused=true;syncPause();void activate((current+direction+scenes.length)%scenes.length);stop();};
  listen(hero.querySelector('[data-banner-prev]')!,'click',()=>step(-1));
  listen(hero.querySelector('[data-banner-next]')!,'click',()=>step(1));
  listen(pause,'click',()=>{paused=!paused;syncPause();schedule();});
  listen(hero,'mouseenter',()=>{hovered=true;stop();});listen(hero,'mouseleave',()=>{hovered=false;schedule();});
  listen(hero,'focusin',()=>{focused=true;stop();});listen(hero,'focusout',event=>{focused=hero.contains((event as FocusEvent).relatedTarget as Node|null);schedule();});
  listen(document,'visibilitychange',schedule);
  listen(motion,'change',()=>{if(motion.matches){paused=true;syncPause();stop();}});
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.25});observer.observe(hero);
  syncPause();schedule();
  return()=>{controller.abort();observer.disconnect();stop();transition?.kill();};
 });
}
