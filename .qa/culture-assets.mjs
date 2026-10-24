import fs from 'node:fs';import sharp from 'sharp';
const headers={'User-Agent':'UlaTravelPortfolio/1.0 (photo attribution research)'};
const credits=JSON.parse(fs.readFileSync('assets/tamil-nadu/credits.json','utf8'));
for(const[slug,title]of[['filter-coffee','Indian_filter_coffee'],['thanjavur-art','Thanjavur_painting']]){
 const response=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,{headers});if(!response.ok)throw Error(`${title}: ${response.status}`);const summary=await response.json();
 const bits=new URL(summary.originalimage.source).pathname.split('/');const filename=decodeURIComponent(bits.includes('thumb')?bits.at(-2):bits.at(-1));
 const api=new URL('https://commons.wikimedia.org/w/api.php');api.search=new URLSearchParams({action:'query',format:'json',titles:`File:${filename}`,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1600'});
 const data=await(await fetch(api,{headers})).json();const info=Object.values(data.query.pages)[0].imageinfo[0];const image=await fetch(info.thumburl||info.url,{headers});if(!image.ok)throw Error(`${slug}: ${image.status}`);
 const buffer=Buffer.from(await image.arrayBuffer());const format=(await sharp(buffer).metadata()).format;fs.writeFileSync(`assets/tamil-nadu/${slug}-source.${format}`,buffer);
 for(const width of[800,1600])await sharp(buffer).resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(`public/images/${slug}${width===800?'-small':''}.webp`);
 const meta=info.extmetadata;const credit={slug,file:filename,source:info.descriptionurl,author:meta.Artist?.value||'See source page',license:meta.LicenseShortName?.value||'See source page',licenseUrl:meta.LicenseUrl?.value,modifications:'Resized, converted to WebP and displayed with layout cropping.'};const i=credits.findIndex(c=>c.slug===slug);if(i>=0)credits[i]=credit;else credits.push(credit);
 console.log(slug,filename,meta.LicenseShortName?.value,await sharp(buffer).metadata());
}
fs.writeFileSync('assets/tamil-nadu/credits.json',JSON.stringify(credits,null,2));
