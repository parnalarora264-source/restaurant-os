'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

const nextStatus: Record<string,string> = { New:'Preparing', Preparing:'Ready', Ready:'Completed' };

type Order = { id: string; customer: string; table: number|string; status: string; items: { name: string; qty: number }[] };

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try { const data = await apiFetch<{orders: Order[]}>('/api/orders'); setOrders((data.orders||[]).filter(x=>x.status!=='Completed'&&x.status!=='Cancelled')); setError(''); }
    catch(e:any){ setError(e.message || 'Failed to load kitchen orders'); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); const timer=window.setInterval(()=>{if(document.visibilityState==='visible')load()},15000); return()=>window.clearInterval(timer); },[]);

  async function advance(order: Order){ const status=nextStatus[order.status]; if(!status)return; try{setBusy(order.id);await apiFetch(`/api/orders/${order.id}`,{method:'PUT',body:JSON.stringify({status})});await load();}catch(e:any){setError(e.message||'Failed to update order')}finally{setBusy(null)} }

  return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">KDS</p><h1 className="serif mt-1 text-4xl font-semibold">Kitchen Display</h1>{error&&<div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}
    {loading?<p className="mt-8 text-sm text-[#6b6258]">Loading kitchen...</p>:<div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{orders.map(x=><div key={x.id} className="rounded-3xl bg-[#3F4A32] p-6 text-[#F5EEDF]"><div className="flex justify-between"><b>{x.id}</b><span className="rounded-full bg-[#697552] px-3 py-1 text-xs">{x.status}</span></div><p className="mt-5 text-sm text-[#D9C7A8]">{x.customer} · Table {x.table}</p><div className="mt-4 space-y-2">{(x.items||[]).map((i,index)=><div key={`${i.name}-${index}`} className="flex justify-between border-b border-[#697552] pb-2"><span>{i.name}</span><b>×{i.qty}</b></div>)}</div><button disabled={busy===x.id} onClick={()=>advance(x)} className="mt-5 w-full rounded-full bg-[#F5EEDF] py-2 text-sm font-semibold text-[#3F4A32] disabled:opacity-50">{busy===x.id?'Updating...':nextStatus[x.status]}</button></div>)}{!orders.length&&<p className="text-[#6b6258]">Kitchen is clear.</p>}</div>}
  </div>;
}
