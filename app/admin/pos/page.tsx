'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type MenuCategory = {
  id?: string;
  name?: string;
  displayName?: string;
  sortOrder?: number;
  isActive?: boolean;
};

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category?: string | MenuCategory;
  categoryDisplayName?: string;
  isAvailable?: boolean;
  image?: string;
};

type CartItem = MenuItem & {
  qty: number;
};

export default function POS() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ items: MenuItem[] }>('/api/menu')
      .then((data) => {
        setMenu(Array.isArray(data.items) ? data.items : []);
      })
      .catch((e) => {
        setError(e.message || 'Failed to load menu');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const add = (item: MenuItem) => {
    setCart((current) => {
      const found = current.find((i) => i.id === item.id);

      if (found) {
        return current.map((i) =>
          i.id === item.id
            ? {
                ...i,
                qty: i.qty + 1,
              }
            : i
        );
      }

      return [
        ...current,
        {
          ...item,
          qty: 1,
        },
      ];
    });
  };

  const remove = (itemId: string) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const getCategoryName = (item: MenuItem) => {
    if (item.categoryDisplayName) {
      return item.categoryDisplayName;
    }

    if (typeof item.category === 'string') {
      return item.category;
    }

    if (item.category?.displayName) {
      return item.category.displayName;
    }

    if (item.category?.name) {
      return item.category.name;
    }

    return 'Menu';
  };

  async function sale() {
    if (!cart.length) return;

    try {
      setBusy(true);
      setError('');

      await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer: 'POS Customer',
          items: cart,
        }),
      });

      setCart([]);

      window.alert('Sale completed and order recorded.');
    } catch (e: any) {
      setError(e.message || 'Could not complete sale');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.25em] text-[#697552]">
        Fast service
      </p>

      <h1 className="serif mt-1 text-4xl font-semibold">
        Point of Sale
      </h1>

      {error && (
        <div className="mt-6 rounded-2xl border border-[#A85C43]/30 bg-[#A85C43]/10 p-4 text-sm text-[#8f4935]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-[#6b6258]">
          Loading POS...
        </p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* MENU */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {menu
              .filter((item) => item.isAvailable !== false)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => add(item)}
                  className="rounded-2xl border border-[#D9C7A8] bg-[#FBF7EF] p-4 text-left hover:-translate-y-0.5"
                >
                  <p className="text-xs uppercase tracking-wider text-[#697552]">
                    {getCategoryName(item)}
                  </p>

                  <h3 className="serif mt-1 text-xl font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-2">
                    ₹{Number(item.price)}
                  </p>
                </button>
              ))}

            {!menu.length && (
              <p className="text-sm text-[#6b6258]">
                No menu items available.
              </p>
            )}
          </div>

          {/* CURRENT BILL */}
          <aside className="h-fit rounded-3xl bg-[#3F4A32] p-6 text-[#F5EEDF]">
            <h2 className="serif text-2xl">
              Current bill
            </h2>

            <div className="mt-5 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p>
                      {item.name} ×{item.qty}
                    </p>

                    <p className="mt-1 text-xs opacity-70">
                      ₹{Number(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => remove(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5EEDF] text-[#3F4A32]"
                    >
                      −
                    </button>

                    <button
                      onClick={() => add(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5EEDF] text-[#3F4A32]"
                    >
                      +
                    </button>

                    <span className="ml-1 min-w-[55px] text-right">
                      ₹{Number(item.price) * item.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {cart.length === 0 && (
              <p className="mt-5 text-sm opacity-70">
                No items added yet.
              </p>
            )}

            <div className="my-5 border-t border-[#697552]" />

            <div className="flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              disabled={busy || !cart.length}
              onClick={sale}
              className="mt-6 w-full rounded-full bg-[#F5EEDF] py-3 font-semibold text-[#3F4A32] disabled:opacity-50"
            >
              {busy ? 'Saving...' : 'Complete sale'}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}