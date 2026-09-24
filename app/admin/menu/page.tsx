'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';

const cats = [
  'Pizza',
  'Burgers',
  'Pasta',
  'Momos',
  'Garlic & Sides',
  'Fries',
  'Coffee',
  'Drinks',
  'Desserts',
];

export default function AdminMenu() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<any>({
    name: '',
    category: 'Pizza',
    description: '',
    price: '',
    image: '',
    veg: false,
    featured: false,
    badge: '',
  });

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/menu', { cache: 'no-store' });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Failed to load menu');
    setItems(d.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load().catch((error: any) => {
      setItems([]);
      window.alert(error?.message || 'Failed to load menu');
    });
  }, []);

  function start(x?: any) {
    setForm(
      x
        ? {
            ...x,
            category: x.category || 'Pizza',
            image: x.image || x.imageUrl || '',
            veg: x.veg ?? x.isVeg ?? false,
            featured: x.featured ?? x.isFeatured ?? false,
            price: String(x.price),
          }
        : {
            name: '',
            category: 'Pizza',
            description: '',
            price: '',
            image: '',
            veg: false,
            featured: false,
            badge: '',
          }
    );

    setEditing(x || null);
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';

    const body = editing
      ? { ...form, id: editing.id }
      : { ...form };

    const r = await fetch('/api/menu', {
      method,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      alert((await r.json()).error || 'Could not save');
      setSaving(false);
      return;
    }

    setOpen(false);
    setEditing(null);
    await load();
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm('Delete this menu item?')) return;
    const r = await fetch('/api/menu', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      alert(data.error || 'Could not delete item');
      return;
    }
    await load();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">
            Catalog
          </p>

          <h1 className="serif mt-1 text-4xl font-semibold">
            Menu Management
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            Changes here update the customer menu immediately.
          </p>
        </div>

        <button
          onClick={() => start()}
          className="flex items-center gap-2 rounded-full bg-[#3F4A32] px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add item
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-[#6b6258]">Loading menu...</p>
      ) : (
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((x) => (
          <div
            key={x.id}
            className="flex gap-4 rounded-2xl border border-[#D9C7A8] bg-[#FBF7EF] p-4"
          >
            <img
              src={x.imageUrl || x.image}
              alt={x.name}
              className="h-20 w-20 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-[#697552]">
                {x.categoryDisplayName || x.category}
              </p>

              <h3 className="serif truncate text-xl font-semibold">
                {x.name}
              </h3>

              <p className="text-sm">₹{x.price}</p>

              <p
                className={`text-xs ${
                  x.isAvailable === false
                    ? 'text-[#A85C43]'
                    : 'text-[#697552]'
                }`}
              >
                {x.isAvailable === false ? 'Unavailable' : 'Available'}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => start(x)}
                  className="rounded-full border border-[#D9C7A8] px-3 py-1 text-xs"
                >
                  <Pencil size={13} className="inline" /> Edit
                </button>

                <button
                  onClick={() => del(x.id)}
                  className="rounded-full border border-[#D9C7A8] px-3 py-1 text-xs text-[#A85C43]"
                >
                  <Trash2 size={13} className="inline" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5">
          <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-3xl bg-[#FBF7EF] p-6">
            <div className="flex justify-between">
              <h2 className="serif text-3xl">
                {editing ? 'Edit item' : 'Add item'}
              </h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Item name"
                className="rounded-xl bg-[#F5EEDF] p-3"
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="rounded-xl bg-[#F5EEDF] p-3"
              >
                {cats.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                type="number"
                placeholder="Price"
                className="rounded-xl bg-[#F5EEDF] p-3"
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="rounded-xl bg-[#F5EEDF] p-3"
              />

              <input
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                placeholder="Image URL (optional)"
                className="rounded-xl bg-[#F5EEDF] p-3"
              />

              <label>
                <input
                  type="checkbox"
                  checked={!!form.veg}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      veg: e.target.checked,
                    })
                  }
                />{' '}
                Vegetarian
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                />{' '}
                Featured
              </label>

              <input
                value={form.badge || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    badge: e.target.value,
                  })
                }
                placeholder="Badge e.g. Bestseller"
                className="rounded-xl bg-[#F5EEDF] p-3"
              />

              <button
                disabled={saving}
                onClick={save}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#3F4A32] py-3 font-semibold text-white"
              >
                <Check size={17} />
                Save item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}