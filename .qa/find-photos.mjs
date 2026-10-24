import fs from 'node:fs';import sharp from 'sharp';
const queries={madurai:'Meenakshi temple Madurai',ooty:'Nilgiris tea plantation',mamallapuram:'Shore Temple Mahabalipuram',kanyakumari:'Vivekananda Rock Memorial',rameswaram:'Ramanathaswamy temple corridor',thanjavur:'Brihadisvara Temple Thanjavur'};
const headers={'User-Agent':'UlaPortfolio/1.0 (photo research; Wikimedia attribution retained)'};
const all={};
for(const[slug,query]of Object.entries(queries)){
 const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',format:'json',generator:'search',gsrnamespace:'6',gsrsearch:query+' filetype:bitmap',gsrlimit:'12',prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'640'});
 const response=await fetch(url,{headers});if(!response.ok)throw Error(`${slug} ${response.status}`);const data=await response.json();
 const items=Object.values(data.query?.pages||{}).map(p=>({title:p.title,...p.imageinfo?.[0]})).filter(p=>p.width>=2000&&p.height>=1200&&p.size<45000000&&/CC BY|CC0|Public domain/i.test(p.extmetadata?.LicenseShortName?.value||''));
 all[slug]=items;fs.mkdirSync(`.shots/photo-research/${slug}`,{recursive:true});const tiles=[];
 for(let i=0;i<items.length;i++){const item=items[i];try{const r=await fetch(item.thumburl,{headers});if(!r.ok)throw Error(r.status);const buffer=Buffer.from(await r.arrayBuffer());const tile=await sharp(buffer).resize(400,250,{fit:'contain',background:'#e8e9e3'}).jpeg({quality:85}).toBuffer();fs.writeFileSync(`.shots/photo-research/${slug}/${i}.jpg`,tile);const text=`${i} · ${item.width}×${item.height} · ${item.extmetadata.LicenseShortName.value}`;const label=Buffer.from(`<svg width="400" height="35"><rect width="400" height="35" fill="#17211D"/><text x="12" y="23" fill="white" font-family="Arial" font-size="14">${text.replaceAll('&','&amp;')}</text></svg>`);tiles.push({input:tile,left:(i%3)*400,top:Math.floor(i/3)*285});tiles.push({input:label,left:(i%3)*400,top:Math.floor(i/3)*285+250});}catch(e){console.log(slug,i,'thumbnail failed',e.message);}}
 if(tiles.length)await sharp({create:{width:1200,height:Math.ceil(items.length/3)*285,channels:3,background:'#e8e9e3'}}).composite(tiles).jpeg({quality:90}).toFile(`.shots/photo-research/${slug}-sheet.jpg`);
 console.log(slug,items.map((p,i)=>`${i}: ${p.title} (${p.width}x${p.height})`).join('\n'));
}
fs.writeFileSync('.shots/photo-research/candidates.json',JSON.stringify(all,null,2));
