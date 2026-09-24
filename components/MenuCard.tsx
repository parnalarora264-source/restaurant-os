import AddButton from './AddButton';
import { Leaf } from 'lucide-react';

export default function MenuCard({ item }: { item: any }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#D9C7A8] bg-[#FBF7EF] shadow-[0_8px_30px_rgba(64,53,42,.06)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {item.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-[#F5EEDF]/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3F4A32]">
            {item.badge}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#697552]">
              {item.categoryDisplayName || item.category}
            </p>

            <h3 className="serif mt-1 text-xl font-semibold">
              {item.name}
            </h3>
          </div>

          {item.veg && (
            <span
              className="rounded-full border border-[#697552] p-1 text-[#697552]"
              title="Vegetarian"
            >
              <Leaf size={13} />
            </span>
          )}
        </div>

        <p className="min-h-10 text-sm leading-5 text-[#6b6258]">
          {item.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="serif text-xl font-semibold">
            ₹{item.price}
          </span>

          <AddButton item={item} />
        </div>
      </div>
    </article>
  );
}
