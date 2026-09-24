'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type Customer = { id: string; name: string; phone?: string | null; orders: number; spend: number };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ customers: Customer[] }>('/api/customers')
      .then((data) => setCustomers(Array.isArray(data.customers) ? data.customers : []))
      .catch((e) => setError(e.message || 'Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">CRM</p><h1 className="serif mt-1 text-4xl font-semibold">Customers</h1><p className="mt-2 text-sm text-[#6b6258]">Built automatically from real orders.</p>
    {error && <div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}
    {loading ? <p className="mt-8 text-sm text-[#6b6258]">Loading customers...</p> : <div className="mt-8 overflow-hidden rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF]"><div className="grid grid-cols-4 border-b border-[#D9C7A8] p-4 text-xs font-bold uppercase tracking-wider"><span>Customer</span><span>Phone</span><span>Orders</span><span>Spend</span></div>{customers.map(x=><div key={x.id || x.phone || x.name} className="grid grid-cols-4 border-b border-[#D9C7A8]/70 p-4 text-sm last:border-0"><span>{x.name}</span><span>{x.phone||'—'}</span><span>{x.orders}</span><b>₹{Number(x.spend||0).toFixed(0)}</b></div>)}{!customers.length&&<p className="p-10 text-center text-sm text-[#6b6258]">No customers yet. Place an order to create one.</p>}</div>}
  </div>;
}
