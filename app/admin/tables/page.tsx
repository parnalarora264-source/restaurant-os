'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

const statuses = ['AVAILABLE', 'OCCUPIED', 'PAYMENT_PENDING', 'CLEANING'] as const;

type Table = { id: string; n: number; s: string };

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setError('');
      const data = await apiFetch<{ tables: Table[] }>('/api/tables');
      setTables(Array.isArray(data.tables) ? data.tables : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function next(table: Table) {
    const index = statuses.indexOf(table.s as any);
    const status = statuses[(index + 1 + statuses.length) % statuses.length];
    try {
      setBusy(table.id);
      await apiFetch('/api/tables', {
        method: 'PUT',
        body: JSON.stringify({ number: table.n, status }),
      });
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to update table');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">Floor</p>
      <h1 className="serif mt-1 text-4xl font-semibold">Table Management</h1>

      {error && <div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">{error}</div>}

      {loading ? (
        <p className="mt-8 text-sm text-[#6b6258]">Loading tables...</p>
      ) : tables.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-10 text-center">
          <h2 className="serif text-2xl font-semibold">No tables configured</h2>
          <p className="mt-2 text-sm text-[#6b6258]">Seed or add your restaurant tables in the database.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {tables.map((table) => (
            <button
              onClick={() => next(table)}
              disabled={busy === table.id}
              key={table.id}
              className="rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-6 text-left transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5EEDF] text-xl font-bold">{table.n}</div>
              <p className="mt-5 text-xs font-bold tracking-widest">{table.s.replaceAll('_', ' ')}</p>
              <p className="mt-1 text-xs text-[#6b6258]">{busy === table.id ? 'Updating...' : 'Tap to change'}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
