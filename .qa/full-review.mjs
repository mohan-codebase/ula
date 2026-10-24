import {launch} from './browser.mjs';
import fs from 'node:fs';
import sharp from 'sharp';
const b=await launch();const axe=fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
const root='.shots/sections';fs.mkdirSync(root,{recursive:true});const reports=[];
for(const [name,path]of [['home','/'],['madurai','/journeys/madurai/'],['ooty','/journeys/ooty/'],['mamallapuram','/journeys/mamallapuram/'],['kanyakumari','/journeys/kanyakumari/'],['rameswaram','/journeys/rameswaram/'],['thanjavur','/journeys/thanjavur/'],['shore-route','/routes/shore-and-stone/'],['nilgiri-route','/routes/nilgiri-reset/'],['island-route','/routes/temple-to-island/'],['journal','/journal/a-morning-in-madurai/'],['colophon','/colophon/'],['404','/a-missing-path/']]){
 const dir=`${root}/${name}`;fs.mkdirSync(dir,{recursive:true});const report={name,errors:[],sizes:[]};const p=await b.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 for(const [mode,width,height]of [['desktop',1440,1000],['mobile',390,844],['reduced',390,844]]){
  await p.setViewportSize({width,height});await p.emulateMedia({reducedMotion:mode==='reduced'?'reduce':'no-preference'});const response=await p.goto(`http://127.0.0.1:4400${path}`);await p.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});await p.waitForTimeout(150);
  await p.screenshot({path:`${dir}/${mode}.png`,fullPage:true});
  const meta=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,height:document.documentElement.scrollHeight}));
  report.sizes.push({mode,status:response.status(),...meta});
  if(mode==='desktop'){await p.evaluate(axe);const a=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.axe=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));}
 }
 fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));reports.push(report);await p.close();console.log(name,JSON.stringify(report));
}
// Capture the signature page turn with matching field note, image and link states.
const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://127.0.0.1:4400/');await p.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
const dir=`${root}/signature`;fs.mkdirSync(dir,{recursive:true});await p.screenshot({path:`${dir}/01-madurai.png`});
await p.getByRole('button',{name:'02 Ooty'}).click();await p.waitForTimeout(320);await p.screenshot({path:`${dir}/02-turn.png`});await p.waitForTimeout(600);await p.screenshot({path:`${dir}/03-ooty.png`});
await p.getByRole('button',{name:'03 Mamallapuram'}).click();await p.waitForTimeout(950);await p.screenshot({path:`${dir}/04-mamallapuram.png`});
await p.getByRole('button',{name:'04 Kanyakumari'}).click();await p.waitForTimeout(950);await p.screenshot({path:`${dir}/05-kanyakumari.png`});
await p.locator('.nav-plan').click();await p.screenshot({path:`${dir}/06-planner.png`});await p.keyboard.press('Escape');
await p.setViewportSize({width:390,height:844});await p.locator('.nav-plan').click();await p.screenshot({path:`${dir}/07-mobile-planner.png`});
await p.locator('input[name=date]').fill('2027-05-16');await p.getByRole('button',{name:'Create my trip brief'}).click();await p.screenshot({path:`${dir}/08-mobile-result.png`});
fs.writeFileSync(`${root}/summary.json`,JSON.stringify(reports,null,2));await b.close();
// Assemble readable storyboard sheets; originals remain available for detailed inspection.
for(const report of reports){const dir=`${root}/${report.name}`;for(const mode of ['desktop','mobile']){const meta=await sharp(`${dir}/${mode}.png`).metadata();const tw=mode==='desktop'?720:390;const th=Math.round(meta.height*tw/meta.width);await sharp(`${dir}/${mode}.png`).resize(tw,th).toFile(`${dir}/${mode}-review.png`);}}
console.log('Complete visual and axe pass finished for all thirteen pages.');
