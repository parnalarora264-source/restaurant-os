'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { apiFetch } from '@/lib/client-api';

const fields = [
  ['restaurantName','Restaurant name'],['tagline','Tagline'],['phone','Phone'],['address','Address'],['currency','Currency symbol']
] as const;

export default function Settings(){
  const [form,setForm]=useState<Record<string,string>>({restaurantName:"Rolly's Pizzeria",tagline:'Good Food. Good Mood.',phone:'',address:'Delhi',currency:'₹'});
  const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
  useEffect(()=>{apiFetch<{settings:Record<string,string>}>('/api/settings').then(d=>setForm(v=>({...v,...d.settings}))).catch(e=>setError(e.message||'Failed to load settings')).finally(()=>setLoading(false));},[]);
  function set(key:string,value:string){setForm(v=>({...v,[key]:value}));}
  async function save(e:FormEvent){e.preventDefault();try{setSaving(true);setMessage('');setError('');await apiFetch('/api/settings',{method:'PUT',body:JSON.stringify(form)});setMessage('Settings saved.');}catch(e:any){setError(e.message||'Failed to save settings')}finally{setSaving(false)}}
  return <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Control</p><h1 className="serif mt-1 text-4xl font-semibold">Settings</h1>{error&&<div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}{loading?<p className="mt-8 text-sm text-[#6b6258]">Loading settings...</p>:<form onSubmit={save} className="mt-8 max-w-2xl grid gap-4">{fields.map(([key,label])=><label key={key} className="grid gap-2 text-sm font-semibold">{label}<input value={form[key]||''} onChange={e=>set(key,e.target.value)} className="rounded-2xl border border-[#D9C7A8] bg-[#FBF7EF] p-4 outline-none" /></label>)}<button disabled={saving} className="mt-2 rounded-full bg-[#3F4A32] py-3 font-semibold text-white disabled:opacity-60">{saving?'Saving...':'Save settings'}</button>{message&&<p className="text-sm text-[#697552]">{message}</p>}</form>}</div>;
}
