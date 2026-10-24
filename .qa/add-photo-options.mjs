import fs from 'node:fs';import sharp from 'sharp';
const headers={'User-Agent':'UlaPortfolio/1.0 (photo research; Wikimedia attribution retained)'};
const candidates=JSON.parse(fs.readFileSync('.shots/photo-research/candidates.json','utf8'));
const queries={madurai:{titles:'File:India - Madurai temple - 0781.jpg'},rameswaram:{gsrsearch:'Dhanushkodi beach filetype:bitmap',generator:'search',gsrnamespace:'6',gsrlimit:'8'},ooty:{gsrsearch:'Ooty lake filetype:bitmap',generator:'search',gsrnamespace:'6',gsrlimit:'6'}};
for(const[slug,query]of Object.entries(queries)){
 const api=new URL('https://commons.wikimedia.org/w/api.php');api.search=new URLSearchParams({action:'query',format:'json',...query,prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'700'});
 const data=await(await fetch(api,{headers})).json();const items=Object.values(data.query?.pages||{}).map(p=>({title:p.title,...p.imageinfo?.[0]})).filter(p=>p.width>=2000&&p.height>=1200&&/CC BY|CC0|Public domain/i.test(p.extmetadata?.LicenseShortName?.value||''));
 const composite=[];for(let i=0;i<items.length;i++){const p=items[i];const index=candidates[slug].length;candidates[slug].push(p);const response=await fetch(p.thumburl,{headers});if(!response.ok)continue;const tile=await sharp(Buffer.from(await response.arrayBuffer())).resize(400,250,{fit:'contain',background:'#e8e9e3'}).toBuffer();const label=Buffer.from(`<svg width="400" height="35"><rect width="400" height="35" fill="#17211D"/><text x="12" y="23" fill="white" font-family="Arial" font-size="14">${index} · ${p.width}×${p.height}</text></svg>`);composite.push({input:tile,left:i%3*400,top:Math.floor(i/3)*285},{input:label,left:i%3*400,top:Math.floor(i/3)*285+250});console.log(slug,index,p.title);}
 if(items.length)await sharp({create:{width:1200,height:Math.ceil(items.length/3)*285,channels:3,background:'#e8e9e3'}}).composite(composite).jpeg().toFile(`.shots/photo-research/${slug}-extra.jpg`);
}
fs.writeFileSync('.shots/photo-research/candidates.json',JSON.stringify(candidates,null,2));
