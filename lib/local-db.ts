import fs from 'fs';
import path from 'path';
import { menu as seedMenu, MenuItem } from './data';

export type StoredOrder = { id:string; table:string; customer:string; phone?:string; items:{name:string;qty:number;price:number}[]; total:number; status:'New'|'Preparing'|'Ready'|'Completed'; createdAt:string };
export type StoredTable = { n:number; s:'AVAILABLE'|'OCCUPIED'|'PAYMENT_PENDING'|'CLEANING' };
export type InventoryItem = { id:string; name:string; quantity:number; unit:string; lowAt:number };

type DB = { menu: MenuItem[]; orders: StoredOrder[]; tables: StoredTable[]; inventory: InventoryItem[] };
const file = path.join(process.cwd(), 'data', 'restaurant.json');
const seed: DB = {
  menu: seedMenu,
  orders: [],
  tables: Array.from({length:12},(_,i)=>({n:i+1,s:i<4?'OCCUPIED':i===4?'PAYMENT_PENDING':'AVAILABLE'})),
  inventory: [
    {id:'mozzarella',name:'Mozzarella',quantity:42,unit:'kg',lowAt:15},
    {id:'tomatoes',name:'Tomatoes',quantity:18,unit:'kg',lowAt:10},
    {id:'coffee-beans',name:'Coffee Beans',quantity:8,unit:'kg',lowAt:10},
    {id:'flour',name:'Flour',quantity:65,unit:'kg',lowAt:15},
    {id:'pepperoni',name:'Pepperoni',quantity:11,unit:'kg',lowAt:8},
    {id:'packaging',name:'Packaging',quantity:120,unit:'units',lowAt:150},
  ]
};
function ensure(){ if(!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file),{recursive:true}); if(!fs.existsSync(file)) fs.writeFileSync(file,JSON.stringify(seed,null,2)); }
export function readDB():DB { ensure(); try{return JSON.parse(fs.readFileSync(file,'utf8')) as DB}catch{fs.writeFileSync(file,JSON.stringify(seed,null,2)); return structuredClone(seed)} }
export function writeDB(db:DB){ensure(); fs.writeFileSync(file,JSON.stringify(db,null,2));}
export function getMenu(){return readDB().menu}
export function saveMenu(items:MenuItem[]){const db=readDB();db.menu=items;writeDB(db);return items}
export function getOrders(){return readDB().orders}
export function addOrder(input:Omit<StoredOrder,'id'|'createdAt'|'status'>){const db=readDB();const order:StoredOrder={...input,id:'ORD-'+Date.now().toString(36).slice(-6).toUpperCase(),createdAt:new Date().toISOString(),status:'New'};db.orders.unshift(order);writeDB(db);return order}
export function updateOrder(id:string,status:StoredOrder['status']){const db=readDB();const i=db.orders.findIndex(x=>x.id===id);if(i<0)return null;db.orders[i].status=status;writeDB(db);return db.orders[i]}
export function getTables(){return readDB().tables}
export function updateTable(n:number,status:StoredTable['s']){const db=readDB();const t=db.tables.find(x=>x.n===n);if(!t)return null;t.s=status;writeDB(db);return t}
export function getInventory(){return readDB().inventory}
export function updateInventory(id:string,quantity:number){const db=readDB();const x=db.inventory.find(i=>i.id===id);if(!x)return null;x.quantity=Math.max(0,quantity);writeDB(db);return x}
