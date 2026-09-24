'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type MenuItem = { id: string; name: string; price: number; category?: string; categoryDisplayName?: string; isAvailable?: boolean; image?: string };
type CartItem = MenuItem & { qty: number };

export default function POS() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{apiFetch<{items:MenuItem[]}>('/api/menu').then(d=>setMenu(Array.isArray(d.items)?d.items:[])).catch(e=>setError(e.message||'Failed to load menu')).finally(()=>setLoading(false));},[]);
  const add=(item:MenuItem)=>setCart(v=>{const found=v.find(i=>i.id===item.id);return found?v.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...v,{...item,qty:1}]});
  const total=cart.reduce((sum,item)=>sum+Number(item.price)*item.qty,0);

  async function sale(){if(!cart.length)return;try{setBusy(true);await apiFetch('/api/orders',{method:'POST',body:JSON.stringify({customer:'POS Customer',items:cart})});setCart([]);setError('');window.alert('Sale completed and order recorded.');}catch(e:any){setError(e.message||'Could not complete sale')}finally{setBusy(false)}}

  return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Fast service</p><h1 className="serif mt-1 text-4xl font-semibold">Point of Sale</h1>{error&&<div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}
    {loading?<p className="mt-8 text-sm text-[#6b6258]">Loading POS...</p>:<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{menu.filter(x=>x.isAvailable!==false).map(x=><button onClick={()=>add(x)} key={x.id} className="rounded-2xl border border-[#D9C7A8] bg-[#FBF7EF] p-4 text-left hover:-translate-y-0.5"><p className="text-xs uppercase tracking-wider text-[#697552]">{x.categoryDisplayName||x.category||'Menu'}</p><h3 className="serif mt-1 text-xl font-semibold">{x.name}</h3><p className="mt-2">₹{x.price}</p></button>)}{!menu.length&&<p className="text-sm text-[#6b6258]">No menu items available.</p>}</div><aside className="h-fit rounded-3xl bg-[#3F4A32] p-6 text-[#F5EEDF]"><h2 className="serif text-2xl">Current bill</h2><div className="mt-5 space-y-2">{cart.map(x=><div key={x.id} className="flex justify-between text-sm"><span>{x.name} ×{x.qty}</span><span>₹{x.price*x.qty}</span></div>)}</div><div className="my-5 border-t border-[#697552]"/><div className="flex justify-between text-xl font-semibold"><span>Total</span><span>₹{total}</span></div><button disabled={busy||!cart.length} onClick={sale} className="mt-6 w-full rounded-full bg-[#F5EEDF] py-3 font-semibold text-[#3F4A32] disabled:opacity-50">{busy?'Saving...':'Complete sale'}</button></aside></div>}
  </div>;
}
