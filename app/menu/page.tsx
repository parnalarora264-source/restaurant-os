'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import MenuCard from '@/components/MenuCard';
import { categories } from '@/lib/data';
import { useSearchParams } from 'next/navigation';

function MenuContent() {
  const params = useSearchParams();

  const [menu, setMenu] = useState<any[]>([]);
  const initial = params.get('category') || 'All';

  const [cat, setCat] = useState(initial);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((d) => setMenu(d.items || []));
  }, []);

  const items = useMemo(() => {
    return menu.filter(
      (x) =>
        x.isAvailable !== false &&
        (cat === 'All' || x.category === cat) &&
        (!q ||
          x.name.toLowerCase().includes(q.toLowerCase()) ||
          (x.description || '').toLowerCase().includes(q.toLowerCase()))
    );
  }, [menu, cat, q]);

  return (
    <div className="min-h-screen bg-[#F5EEDF] px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-[#697552]">
            The Rolly's menu
          </p>

          <h1 className="serif mt-3 text-5xl font-semibold md:text-7xl">
            Something for every craving.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[#6b6258]">
            Pizza, comfort food, coffee and sweet things — served with our
            old-school charm.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697552]"
              size={19}
            />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the menu..."
              className="w-full rounded-2xl bg-[#F5EEDF] py-3 pl-11 pr-4 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal
              size={18}
              className="shrink-0 text-[#697552]"
            />

            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                  cat === c
                    ? 'bg-[#3F4A32] text-white'
                    : 'bg-[#F5EEDF] text-[#40352A]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => (
            <MenuCard key={x.id} item={x} />
          ))}
        </div>

        {!items.length && (
          <div className="py-24 text-center">
            <h2 className="serif text-3xl">Nothing found.</h2>

            <p className="mt-2 text-[#6b6258]">
              Try another search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5EEDF] px-5 py-20 text-center">
          <p className="text-[#6b6258]">Loading menu...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}