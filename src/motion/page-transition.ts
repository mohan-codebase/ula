import {gsap} from 'gsap';
import {setTransition} from '../engine';
import {journeys} from '../data/site';
import {routes,experiences} from '../data/explore';

export function prepareTransition(path:string){
 const curtain=document.getElementById('curtain');if(!curtain)return;
 const clean=path.replace(/\/$/,'')||'/';
 const pages:Record<string,string>={'/':'Tamil Nadu','/destinations':'Places to discover','/experiences':'Find your kind of day','/trips':'Your next journey','/routes':'Your next journey','/journal':'Stories from Tamil Nadu','/travel-guide':'Before you set off','/about-us':'The story behind Ula','/about':'The story behind Ula','/contact':'Say vanakkam','/privacy':'Your plans, kept personal','/colophon':'A few field notes'};
 const slug=clean.split('/').at(-1);
 const place=journeys.find(j=>clean.startsWith('/journeys/')&&j.slug===slug);
 const trip=routes.find(r=>/^\/(trips|routes)\//.test(clean)&&r.slug===slug);
 const experience=experiences.find(e=>clean.startsWith('/experiences/')&&e.id===slug);
 const label=pages[clean]||place?.name||trip?.name||experience?.label||'A little further into Tamil Nadu';
 const target=curtain.querySelector('[data-transition-destination]');if(target)target.textContent=label;
 document.documentElement.setAttribute('aria-busy','true');
 curtain.dataset.phase='cover';
}

export function resetTransition(){
 const curtain=document.getElementById('curtain');
 if(curtain){gsap.killTweensOf([curtain,...curtain.querySelectorAll('*')]);gsap.set(curtain,{autoAlpha:0});curtain.dataset.phase='idle';}
 document.documentElement.removeAttribute('aria-busy');
}

export function registerPageTransition(){
 setTransition({
  leave:curtain=>{
   const accent=curtain.querySelector('.curtain__accent');
   const panel=curtain.querySelector('.curtain__panel');
   const letters=curtain.querySelectorAll('.curtain__letter');
   const caption=curtain.querySelector('.curtain__destination');
   const frame=curtain.querySelectorAll('.curtain__frame');
   gsap.killTweensOf([curtain,...curtain.querySelectorAll('*')]);
   return gsap.timeline({defaults:{ease:'expo.inOut'}})
    .set(curtain,{autoAlpha:1})
    .set([accent,panel],{xPercent:-100})
    .set(letters,{yPercent:110,autoAlpha:0})
    .set(caption,{y:10,autoAlpha:0})
    .set(frame,{autoAlpha:0})
    .to(accent,{xPercent:0,duration:.46},0)
    .to(panel,{xPercent:0,duration:.5},.045)
    .to(frame,{autoAlpha:1,duration:.23,ease:'power3.out'},.23)
    .to(letters,{yPercent:0,autoAlpha:1,duration:.32,stagger:.035,ease:'power3.out'},.2)
    .to(caption,{y:0,autoAlpha:1,duration:.26,ease:'power3.out'},.29);
  },
  enter:curtain=>{
   curtain.dataset.phase='reveal';
   return gsap.timeline({defaults:{ease:'expo.inOut'},onComplete:()=>{curtain.dataset.phase='idle';document.documentElement.removeAttribute('aria-busy');}})
    .to(curtain.querySelectorAll('.curtain__destination, .curtain__frame'),{autoAlpha:0,duration:.15,ease:'power3.out'},0)
    .to(curtain.querySelectorAll('.curtain__letter'),{yPercent:-35,autoAlpha:0,duration:.18,stagger:.025,ease:'power3.out'},0)
    .to(curtain.querySelector('.curtain__panel'),{xPercent:100,duration:.52},.065)
    .to(curtain.querySelector('.curtain__accent'),{xPercent:100,duration:.49},.14)
    .set(curtain,{autoAlpha:0});
  }
 });
}
