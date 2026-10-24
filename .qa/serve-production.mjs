// Local QA fixture for the static build and configured Vercel response headers.
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {brotliCompressSync,gzipSync} from 'node:zlib';
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));const root=path.resolve('dist');const cache=new Map();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 for(const rule of config.headers){if(rule.source==='/(.*)'||pathname.startsWith(rule.source.split('/(.*)')[0]))for(const h of rule.headers)res.setHeader(h.key,h.value);}
 if(pathname==='/about/'||pathname==='/routes/'||/^\/routes\/[^/]+\/$/.test(pathname)){const to=pathname==='/about/'?'/about-us/':pathname.replace('/routes/','/trips/');res.writeHead(308,{Location:to});res.end();return;}
 let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 let status=200;if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,'404.html');status=404;}
 const type=types[path.extname(file)]||'application/octet-stream';const encoding=String(req.headers['accept-encoding']||'').includes('br')?'br':String(req.headers['accept-encoding']||'').includes('gzip')?'gzip':'';
 const key=file+fs.statSync(file).mtimeMs+encoding;let content=cache.get(key);if(!content){content=fs.readFileSync(file);if(encoding)content=encoding==='br'?brotliCompressSync(content):gzipSync(content);cache.set(key,content);}
 res.setHeader('Content-Type',type);res.setHeader('Vary','Accept-Encoding');if(encoding)res.setHeader('Content-Encoding',encoding);res.setHeader('Content-Length',content.length);res.writeHead(status);res.end(req.method==='HEAD'?undefined:content);
});server.listen(4401,'127.0.0.1',()=>console.log('Production QA fixture: http://127.0.0.1:4401/'));
