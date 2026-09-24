export type CartLine={id:string;name:string;price:number;qty:number;image:string};
const KEY='restaurant-os-cart';
export function readCart():CartLine[]{if(typeof window==='undefined')return [];try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
export function writeCart(c:CartLine[]){localStorage.setItem(KEY,JSON.stringify(c));window.dispatchEvent(new Event('cart-updated'))}
export function addCart(line:CartLine){const c=readCart();const x=c.find(i=>i.id===line.id);if(x)x.qty++;else c.push({...line,qty:1});writeCart(c)}
export function updateCart(id:string,qty:number){const c=readCart().map(x=>x.id===id?{...x,qty}:x).filter(x=>x.qty>0);writeCart(c)}
export function clearCart(){writeCart([])}
