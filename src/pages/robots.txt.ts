import {deployment} from '../config/deployment';
export const GET=()=>new Response(`User-agent: *\n${deployment.indexable?'Allow: /':'Disallow: /'}\nSitemap: ${deployment.origin}/sitemap-index.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
