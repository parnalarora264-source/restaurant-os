'use client';

import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { addCart } from '@/lib/store';

export default function AddButton({ item }: { item: any }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl || item.image || '',
      qty: 1,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 900);
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-2 rounded-full bg-[#3F4A32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#697552]"
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? 'Added' : 'Add'}
    </button>
  );
}