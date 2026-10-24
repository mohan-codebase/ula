import fs from 'node:fs';import sharp from 'sharp';
const subjects={madurai:'Meenakshi_Temple',ooty:'Ooty',mamallapuram:'Shore_Temple',kanyakumari:'Vivekananda_Rock_Memorial',rameswaram:'Ramanathaswamy_Temple',thanjavur:'Brihadisvara_Temple'};
const credits=[];const headers={'User-Agent':'TamilNaduTravelPrototype/1.0 (image attribution research)'};
for(const[slug,title]of Object.entries(subjects)){
 const summary=await(await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,{headers})).json();
 const original=summary.originalimage.source;const bits=new URL(original).pathname.split('/');const filename=decodeURIComponent(bits.includes('thumb')?bits.at(-2):bits.at(-1));
 const api=new URL('https://commons.wikimedia.org/w/api.php');api.search=new URLSearchParams({action:'query',format:'json',titles:`File:${filename}`,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1600'});
 const data=await(await fetch(api,{headers})).json();const info=Object.values(data.query.pages)[0].imageinfo[0];
 const response=await fetch(info.thumburl||info.url,{headers});if(!response.ok)throw Error(`${slug}: ${response.status}`);const buffer=Buffer.from(await response.arrayBuffer());
 fs.writeFileSync(`assets/tamil-nadu/${slug}-source.jpg`,buffer);
 for(const width of [800,1600])await sharp(buffer).resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${slug}${width===800?'-small':''}.webp`);
 const meta=info.extmetadata;credits.push({slug,file:filename,source:info.descriptionurl,author:meta.Artist?.value||'See source page',license:meta.LicenseShortName?.value||'See source page',licenseUrl:meta.LicenseUrl?.value,attribution:meta.Attribution?.value,modifications:'Resized and converted to WebP; displayed with layout cropping.'});
 fs.writeFileSync('assets/tamil-nadu/credits.json',JSON.stringify(credits,null,2));console.log(slug,filename,meta.LicenseShortName?.value);
}
