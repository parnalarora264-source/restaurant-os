'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type Order = { id: string; orderNumber?: string; customer?: string; table?: number|string; total: number; status: string; items: { qty: number; name: string }[] };

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try {
      setError('');
      const data = await apiFetch<{ orders: Order[] }>('/api/orders');
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (e: any) { setError(e.message || 'Failed to load orders'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') load(); }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  async function status(id: string, next: string) {
    try { setBusy(id); await apiFetch(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status: next }) }); await load(); }
    catch (e: any) { setError(e.message || 'Failed to update order'); }
    finally { setBusy(null); }
  }

  return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Operations</p><h1 className="serif mt-1 text-4xl font-semibold">Orders</h1>
    {error && <div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}
    {loading ? <p className="mt-8 text-sm text-[#6b6258]">Loading orders...</p> : <div className="mt-8 overflow-hidden rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF]"><div className="divide-y divide-[#D9C7A8]">{orders.map(x=><div key={x.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center"><div><b>{x.orderNumber || x.id}</b><p className="text-sm">{x.customer || 'Guest'} · Table {x.table ?? '—'}</p><p className="mt-1 text-xs text-[#6b6258]">{(x.items||[]).map((i)=>`${i.qty}× ${i.name}`).join(', ')}</p></div><div><b>₹{x.total}</b><p className="text-xs text-[#6b6258]">{x.status}</p></div><div className="flex gap-2">{x.status==='New'&&<button disabled={busy===x.id} onClick={()=>status(x.id,'Preparing')} className="rounded-full bg-[#3F4A32] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Accept</button>}{x.status==='Preparing'&&<button disabled={busy===x.id} onClick={()=>status(x.id,'Ready')} className="rounded-full bg-[#B89452] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Ready</button>}{x.status==='Ready'&&<button disabled={busy===x.id} onClick={()=>status(x.id,'Completed')} className="rounded-full bg-[#697552] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Complete</button>}</div></div>)}{!orders.length&&<p className="p-12 text-center text-[#6b6258]">No orders yet.</p>}</div></div>}
  </div>;
}
