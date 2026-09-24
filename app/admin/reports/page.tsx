'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type Report = { summary: { totalOrders:number; totalRevenue:number; completedOrders:number; pendingOrders:number; customers:number; averageOrder:number }; orders:any[] };

export default function Reports(){
  const [data,setData]=useState<Report|null>(null); const [error,setError]=useState('');
  useEffect(()=>{apiFetch<Report>('/api/reports').then(setData).catch(e=>setError(e.message||'Failed to load reports'));},[]);
  if(error) return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Analytics</p><h1 className="serif mt-1 text-4xl font-semibold">Reports</h1><div className="mt-8 rounded-3xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-6 text-sm text-[#8f4935]">{error}</div></div>;
  if(!data) return <p className="p-8">Loading reports...</p>;
  const s=data.summary; const cards=[['Revenue',`₹${Number(s.totalRevenue||0).toFixed(0)}`],['Orders',s.totalOrders],['Customers',s.customers],['Completed',s.completedOrders],['Pending',s.pendingOrders],['Avg. order',`₹${Number(s.averageOrder||0).toFixed(0)}`]];
  return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Analytics</p><h1 className="serif mt-1 text-4xl font-semibold">Reports</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([title,value])=><div key={title} className="rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-6"><p className="text-sm text-[#6b6258]">{title}</p><p className="serif mt-2 text-3xl font-semibold">{String(value)}</p></div>)}</div><div className="mt-6 rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-8"><h2 className="serif text-2xl font-semibold">Recent orders</h2><div className="mt-5 space-y-2">{data.orders.slice(0,10).map(o=><div key={o.id} className="flex items-center justify-between rounded-2xl bg-[#F5EEDF] p-4 text-sm"><span>{o.orderNumber||o.id}</span><span>{o.status}</span><b>₹{o.total}</b></div>)}{!data.orders.length&&<p className="text-sm text-[#6b6258]">No orders yet.</p>}</div></div></div>;
}
