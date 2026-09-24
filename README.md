# RestaurantOS — Rolly's Pizzeria

A full-stack Next.js/TypeScript restaurant operating system foundation built from the supplied RestaurantOS specifications.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Next.js Route Handlers
- Prisma + PostgreSQL schema

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

Customer: /
Menu: /menu
Cart: /cart
Checkout: /checkout
Admin: /admin
POS: /admin/pos
KDS: /admin/kitchen
Orders: /admin/orders

## PostgreSQL
Set DATABASE_URL in `.env.local` and run Prisma migrations when wiring persistent data:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

The demo order API is intentionally runnable without a database so the UI can be tested immediately. Prisma schema is included for the production persistence layer.

## Production diagnostics

After configuring `DATABASE_URL`, run `npx prisma generate` and `node prisma/seed.js` once to create the starter menu, 12 tables, and inventory records. The app also exposes `GET /api/health` to verify the production database connection and record counts.
