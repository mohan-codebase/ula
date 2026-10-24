import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import {deployment} from './src/config/deployment.ts';
export default defineConfig({
 site:deployment.origin,
 output:'static',
 markdown:{syntaxHighlight:false},
 trailingSlash:'always',
 integrations:[sitemap({filter:url=>!new URL(url).pathname.startsWith('/routes/')&&new URL(url).pathname!=='/about/'})],
 prefetch:{prefetchAll:false,defaultStrategy:'hover'},
 build:{inlineStylesheets:'never'},
 security:{csp:{directives:["default-src 'self'","img-src 'self' data:","font-src 'self'","connect-src 'self'","object-src 'none'","base-uri 'self'","form-action 'self'"],styleDirective:{resources:["'self'","'unsafe-inline'"]}}}
});
