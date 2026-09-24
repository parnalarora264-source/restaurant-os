'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type Item = { id: string; name: string; quantity: number; unit: string; lowAt: number };

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try {
      setError('');
      const data = await apiFetch<{ items: Item[] }>('/api/inventory');
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load inventory');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function change(item: Item) {
    const value = window.prompt(`New quantity for ${item.name}`, String(item.quantity));
    if (value === null) return;
    const quantity = Number(value);
    if (!Number.isFinite(quantity) || quantity < 0) { setError('Enter a valid quantity.'); return; }
    try {
      setBusy(item.id);
      await apiFetch('/api/inventory', { method: 'PUT', body: JSON.stringify({ id: item.id, quantity }) });
      await load();
    } catch (e: any) { setError(e.message || 'Failed to update inventory'); }
    finally { setBusy(null); }
  }

  return <div>
    <p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Stock control</p>
    <h1 className="serif mt-1 text-4xl font-semibold">Inventory</h1>
    {error && <div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}
    {loading ? <p className="mt-8 text-sm text-[#6b6258]">Loading inventory...</p> : items.length === 0 ?
      <div className="mt-8 rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-10 text-center"><h2 className="serif text-2xl font-semibold">No inventory items</h2><p className="mt-2 text-sm text-[#6b6258]">Seed the starter inventory or add stock records.</p></div> :
      <div className="mt-8 overflow-hidden rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF]"><div className="grid grid-cols-4 border-b border-[#D9C7A8] p-4 text-xs font-bold uppercase tracking-wider"><span>Item</span><span>On hand</span><span>Status</span><span>Action</span></div>{items.map(item=>{const low=item.quantity<=item.lowAt;return <div key={item.id} className="grid grid-cols-4 border-b border-[#D9C7A8]/70 p-4 text-sm last:border-0"><span>{item.name}</span><span>{item.quantity} {item.unit}</span><span className={low?'text-[#A85C43]':'text-[#697552]'}>{low?'Low':'Healthy'}</span><button disabled={busy===item.id} onClick={()=>change(item)} className="text-left underline disabled:opacity-50">{busy===item.id?'Updating...':'Update'}</button></div>})}</div>}
  </div>;
}
