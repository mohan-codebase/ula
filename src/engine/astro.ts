// Astro adapter (ClientRouter). Call start(setup) once from the layout's <script>.
// The leave animation runs IN PARALLEL with fetching the next page, so transitions add no latency.
import { boot, cleanup, enter, leave, syncFlags, startScroll } from './index';
import {prepareTransition,resetTransition} from '../motion/page-transition';

let navigating = false;

export function start(setup?: () => void) {
  document.addEventListener('astro:before-preparation', (e) => {
    navigating = true;
    prepareTransition(e.to.pathname);
    const load = e.loader;
    e.loader = async () => {
      try{await Promise.all([leave(),load()]);}
      catch(error){navigating=false;resetTransition();startScroll();throw error;}
    };
  });
  document.addEventListener('astro:before-swap', () => cleanup());
  document.addEventListener('astro:after-swap', () => {
    syncFlags(); // Astro replaces <html> attributes; restore flags before paint
    if(navigating){document.documentElement.setAttribute('aria-busy','true');const curtain=document.getElementById('curtain');if(curtain)curtain.dataset.phase='reveal';}
    document.getElementById('loader')?.remove(); // the loader is first-load only
  });
  document.addEventListener('astro:page-load', () => {
    if (!navigating) return void boot(setup); // first load (boot is idempotent)
    navigating = false;
    enter().finally(resetTransition);
  });
  // Module scripts run after parsing: boot now instead of waiting for the first astro:page-load.
  boot(setup);
}
