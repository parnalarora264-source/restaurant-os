'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';

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

type MenuItem = {
  id: string;
  name: string;
  category?: any;
  description?: string;
  price: number;
  image?: string;
  veg?: boolean;
  featured?: boolean;
  badge?: string;
  isAvailable?: boolean;
};

type FormState = {
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  veg: boolean;
  featured: boolean;
  badge: string;
};

const emptyForm: FormState = {
  name: '',
  category: 'Pizza',
  description: '',
  price: '',
  image: '',
  veg: false,
  featured: false,
  badge: '',
};

/*
  API kabhi category ko string bhej sakti hai
  aur kabhi object:

  "Pizza"

  ya

  {
    id: "...",
    name: "Pizza",
    displayName: "Pizza"
  }

  Ye function dono cases handle karta hai.
*/
function getCategoryName(category: any): string {
  if (!category) return 'Pizza';

  if (typeof category === 'string') {
    return category;
  }

  return (
    category.displayName ||
    category.name ||
    category.title ||
    'Pizza'
  );
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<FormState>({
    ...emptyForm,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/menu', {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Could not load menu');
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      console.error('Menu load error:', err);
      setError(err?.message || 'Could not load menu');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function start(item?: MenuItem) {
    if (item) {
      setEditing(item);

      setForm({
        name: item.name || '',
        category: getCategoryName(item.category),
        description: item.description || '',
        price:
          item.price !== undefined && item.price !== null
            ? String(item.price)
            : '',
        image: item.image || '',
        veg: Boolean(item.veg),
        featured: Boolean(item.featured),
        badge: item.badge || '',
      });
    } else {
      setEditing(null);
      setForm({
        ...emptyForm,
      });
    }

    setError('');
    setOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setOpen(false);
    setEditing(null);
    setForm({
      ...emptyForm,
    });
  }

  function updateForm<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function save() {
    if (!form.name.trim()) {
      alert('Please enter item name.');
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      alert('Please enter a valid price.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      /*
        IMPORTANT:
        category ko object nahi bhejna.
        API ko simple category name bhej rahe hain.
      */
      const payload = {
        ...(editing ? { id: editing.id } : {}),
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        veg: Boolean(form.veg),
        featured: Boolean(form.featured),
        badge: form.badge.trim(),
      };

      const response = await fetch('/api/menu', {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            (editing
              ? 'Could not update menu item'
              : 'Could not create menu item')
        );
      }

      setOpen(false);
      setEditing(null);
      setForm({
        ...emptyForm,
      });

      await load();
    } catch (err: any) {
      console.error('Menu save error:', err);
      setError(err?.message || 'Could not save menu item');
      alert(err?.message || 'Could not save menu item');
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this menu item?'
    );

    if (!confirmed) return;

    try {
      setDeleting(id);
      setError('');

      const response = await fetch('/api/menu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Could not delete menu item'
        );
      }

      await load();
    } catch (err: any) {
      console.error('Menu delete error:', err);
      setError(err?.message || 'Could not delete menu item');
      alert(err?.message || 'Could not delete menu item');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">
            Catalog
          </p>

          <h1 className="serif mt-1 text-4xl font-semibold">
            Menu Management
          </h1>

          <p className="mt-2 text-sm text-[#6b6258]">
            Changes here update the customer menu.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-[#D9C7A8] bg-[#FBF7EF] px-4 py-3 text-sm font-semibold"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>

          <button
            onClick={() => start()}
            className="flex items-center gap-2 rounded-full bg-[#3F4A32] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add item
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#A85C43]">
          <b>Menu error:</b> {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="mt-10 flex items-center justify-center rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] py-20">
          <div className="flex items-center gap-3 text-sm text-[#6b6258]">
            <Loader2 size={20} className="animate-spin" />
            Loading menu...
          </div>
        </div>
      ) : (
        <>
          {/* EMPTY */}
          {!items.length && (
            <div className="mt-8 rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] p-12 text-center">
              <h2 className="serif text-2xl font-semibold">
                No menu items
              </h2>

              <p className="mt-2 text-sm text-[#6b6258]">
                Add your first menu item to get started.
              </p>

              <button
                onClick={() => start()}
                className="mt-6 rounded-full bg-[#3F4A32] px-5 py-3 text-sm font-semibold text-white"
              >
                Add first item
              </button>
            </div>
          )}

          {/* MENU GRID */}
          {items.length > 0 && (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const categoryName = getCategoryName(item.category);

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-[#D9C7A8] bg-[#FBF7EF]"
                  >
                    {/* IMAGE */}
                    <div className="relative h-48 bg-[#F5EEDF]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || 'Menu item'}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-sm text-[#6b6258]">
                          No image
                        </div>
                      )}

                      {item.featured && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#3F4A32] px-3 py-1 text-xs font-semibold text-white">
                          Featured
                        </span>
                      )}

                      {item.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#D9C7A8] px-3 py-1 text-xs font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wider text-[#697552]">
                        {categoryName}
                      </p>

                      <div className="mt-1 flex items-start justify-between gap-3">
                        <h3 className="serif text-xl font-semibold">
                          {item.name}
                        </h3>

                        {item.veg && (
                          <span
                            title="Vegetarian"
                            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#697552] text-xs text-[#697552]"
                          >
                            V
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-[#6b6258]">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <p className="serif text-xl font-semibold">
                          ₹{Number(item.price || 0).toFixed(0)}
                        </p>

                        <span
                          className={`text-xs font-semibold ${
                            item.isAvailable === false
                              ? 'text-[#A85C43]'
                              : 'text-[#697552]'
                          }`}
                        >
                          {item.isAvailable === false
                            ? 'Unavailable'
                            : 'Available'}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => start(item)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#D9C7A8] px-3 py-2 text-xs font-semibold"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => del(item.id)}
                          disabled={deleting === item.id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#D9C7A8] px-3 py-2 text-xs font-semibold text-[#A85C43] disabled:opacity-50"
                        >
                          {deleting === item.id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}

                          {deleting === item.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5">
          <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-3xl bg-[#FBF7EF] p-6 shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#697552]">
                  Catalog
                </p>

                <h2 className="serif mt-1 text-3xl font-semibold">
                  {editing ? 'Edit item' : 'Add item'}
                </h2>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-full p-2 hover:bg-[#F5EEDF] disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            {/* FORM */}
            <div className="mt-6 grid gap-4">
              {/* NAME */}
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Item name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    updateForm('name', e.target.value)
                  }
                  placeholder="e.g. Margherita Pizza"
                  className="w-full rounded-xl bg-[#F5EEDF] p-3 outline-none ring-[#697552] focus:ring-2"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    updateForm('category', e.target.value)
                  }
                  className="w-full rounded-xl bg-[#F5EEDF] p-3 outline-none ring-[#697552] focus:ring-2"
                >
                  {cats.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Price
                </label>

                <input
                  value={form.price}
                  onChange={(e) =>
                    updateForm('price', e.target.value)
                  }
                  type="number"
                  min="0"
                  placeholder="Price"
                  className="w-full rounded-xl bg-[#F5EEDF] p-3 outline-none ring-[#697552] focus:ring-2"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateForm('description', e.target.value)
                  }
                  placeholder="Short description"
                  rows={4}
                  className="w-full resize-none rounded-xl bg-[#F5EEDF] p-3 outline-none ring-[#697552] focus:ring-2"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Image URL
                </label>

                <input
                  value={form.image}
                  onChange={(e) =>
                    updateForm('image', e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl bg-[#F5EEDF] p-3 outline-none ring-[#697552] focus:ring-2"
                />
              </div>

              {/* CHECKBOXES */}
              <div className="grid gap-3 rounded-2xl bg-[#F5EEDF] p-4">
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.veg}
                    onChange={(e) =>
                      updateForm('veg', e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Vegetarian
                </label>

                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateForm('featured', e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Featured item
                </label>
              </div>

              {/* BADGE */}
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Badge
                </label>

                <input
                  value={form.badge}
                  onChange={(e) =>
                    updateForm('badge', e.target.value)
                  }
                  placeholder="e.g. Bestseller"
                  className="w-full rounded-xl bg-[#F5EEDF] p-3 outline-none ring-[#697552] focus:ring-2"
                />
              </div>

              {/* SAVE */}
              <button
                onClick={save}
                disabled={saving}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#3F4A32] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    {editing ? 'Update item' : 'Save item'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
