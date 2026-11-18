'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { boot, cleanup, enter, leave, syncFlags, startScroll } from '../engine/index';
import { prepareTransition, resetTransition } from '../motion/page-transition';
import { setupMotion } from '../motion/setup';

export function ClientRuntime() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    syncFlags();

    // Update active navigation link state
    document.querySelectorAll('header nav a').forEach((a) => {
      const href = a.getAttribute('href');
      const isHome = href === '/' && pathname === '/';
      const isMatch = href && href !== '/' && pathname.startsWith(href);
      if (isHome || isMatch) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    boot(setupMotion);
    const curtain = document.getElementById('curtain');
    if (curtain?.dataset.phase === 'reveal') {
      void enter().finally(resetTransition);
    }

    return () => {
      cleanup();
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

      e.preventDefault();
      prepareTransition(url.pathname);
      void leave()
        .then(() => {
          const curtain = document.getElementById('curtain');
          if (curtain) curtain.dataset.phase = 'reveal';
          router.push(url.pathname + url.search + url.hash);
        })
        .catch(() => {
          resetTransition();
          startScroll();
          location.href = url.href;
        });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return null;
}
