'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Utensils,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MenuCard from '@/components/MenuCard';

export default function Home() {
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((d) => setMenu(d.items || []))
      .catch((err) => {
        console.error('Failed to load menu:', err);
      });
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.35em] text-[#697552]">
              WELCOME TO ROLLY'S
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="serif mt-5 text-6xl font-semibold leading-[.95] md:text-8xl"
            >
              Good food.
              <br />
              Good mood.
            </motion.h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#6b6258]">
              A warm neighbourhood pizzeria and café for slow afternoons,
              quick bites and very good coffee.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="flex items-center gap-2 rounded-full bg-[#3F4A32] px-6 py-3 font-semibold text-white"
              >
                Order now
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-[#D9C7A8] px-6 py-3 font-semibold"
              >
                Our story
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-5 text-sm text-[#6b6258]">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                11 AM — 11 PM
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Delhi
              </span>

              <span className="flex items-center gap-2">
                <Star size={16} />
                Loved locally
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#3F4A32] p-3 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85"
              alt="Pizza"
              className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      {/* HOUSE FAVOURITES */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#697552]">
                From the kitchen
              </p>

              <h2 className="serif mt-2 text-4xl font-semibold">
                House favourites.
              </h2>
            </div>

            <Link
              href="/menu"
              className="text-sm font-semibold underline"
            >
              See full menu
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {menu
              .filter((x) => x.isFeatured)
              .slice(0, 3)
              .map((x) => (
                <MenuCard key={x.id} item={x} />
              ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#3F4A32] px-6 py-20 text-[#F5EEDF]">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <Utensils />

            <h3 className="serif mt-4 text-2xl">
              Old-school charm
            </h3>

            <p className="mt-2 text-[#D9C7A8]">
              Vintage soul, modern comfort.
            </p>
          </div>

          <div>
            <Star />

            <h3 className="serif mt-4 text-2xl">
              Made to order
            </h3>

            <p className="mt-2 text-[#D9C7A8]">
              Freshly prepared, every time.
            </p>
          </div>

          <div>
            <Clock />

            <h3 className="serif mt-4 text-2xl">
              Easy ordering
            </h3>

            <p className="mt-2 text-[#D9C7A8]">
              Browse, order and track online.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}