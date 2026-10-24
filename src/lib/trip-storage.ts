import {journeys} from '../data/site';
import {routes} from '../data/explore';
export function readTrip(today:string):Record<string,string>|null{
 try{
  const raw:unknown=JSON.parse(localStorage.getItem('tamilnadu-trip')||'null');
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const value=raw as Record<string,unknown>;const saved:Record<string,string>={};
  if(typeof value.destination!=='string'||!journeys.some(j=>j.slug===value.destination))return null;
  saved.destination=value.destination;
  saved.route=typeof value.route==='string'&&routes.some(r=>r.slug===value.route&&r.destination===value.destination)?value.route:'';
  const date=typeof value.date==='string'?value.date:'';
  saved.date=/^\d{4}-\d{2}-\d{2}$/.test(date)&&date>=today&&Number.isFinite(Date.parse(date))?date:'';
  if(typeof value.travelers==='string'&&['Just me','Two travelers','Friends or family'].includes(value.travelers))saved.travelers=value.travelers;
  if(typeof value.pace==='string'&&['Slow mornings, room to wander','A little adventure every day','Temples, local food and heritage'].includes(value.pace))saved.pace=value.pace;
  return saved;
 }catch{return null;}
}
