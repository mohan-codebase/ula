export function resolveDeployment(env:Record<string,string|undefined>){
 const value=env.SITE_URL?.trim()||env.VERCEL_PROJECT_PRODUCTION_URL?.trim()||env.VERCEL_URL?.trim();
 if(!value&&env.VERCEL==='1')throw new Error('Set SITE_URL or enable Vercel System Environment Variables before deploying.');
 const url=new URL(value?(value.includes('://')?value:`https://${value}`):'http://127.0.0.1:4400');
 const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||(!local&&url.protocol!=='https:')||!['http:','https:'].includes(url.protocol))throw new Error('SITE_URL must be an HTTPS origin without a path, credentials, query or fragment.');
 if(local&&env.VERCEL==='1')throw new Error('Vercel deployments cannot use a localhost origin.');
 const indexable=!local&&env.VERCEL_ENV!=='preview'&&env.VERCEL_ENV!=='development';
 return {origin:url.origin,indexable};
}
export const deployment=resolveDeployment(process.env);
