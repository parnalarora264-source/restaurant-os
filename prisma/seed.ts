import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const file = path.join(process.cwd(), 'data', 'restaurant.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  const menu = data.menu;

  for (let i = 0; i < menu.length; i++) {
    const item = menu[i];

    const category = await prisma.category.upsert({
      where: {
        name: item.category,
      },
      update: {
        displayName: item.category,
        sortOrder: i,
        isActive: true,
      },
      create: {
        name: item.category,
        displayName: item.category,
        sortOrder: i,
        isActive: true,
      },
    });

    await prisma.menuItem.upsert({
      where: {
        id: item.id,
      },
      update: {
        categoryId: category.id,
        name: item.name,
        description: item.description ?? null,
        price: Number(item.price),
        imageUrl: item.image ?? null,
        isVeg: Boolean(item.veg ?? false),
        isFeatured: Boolean(item.featured ?? false),
        badge: item.badge ?? null,
        isAvailable: true,
        sortOrder: i,
      },
      create: {
        id: item.id,
        categoryId: category.id,
        name: item.name,
        description: item.description ?? null,
        price: Number(item.price),
        imageUrl: item.image ?? null,
        isVeg: Boolean(item.veg ?? false),
        isFeatured: Boolean(item.featured ?? false),
        badge: item.badge ?? null,
        isAvailable: true,
        sortOrder: i,
      },
    });

    console.log(`Seeded: ${item.name}`);
  }

  console.log(`\n✅ Seeded ${menu.length} menu items`);
  // Starter floor plan. Existing tables are preserved.
  for (let number = 1; number <= 12; number++) {
    await prisma.table.upsert({
      where: { number },
      update: {},
      create: { number },
    });
  }

  // Starter inventory. Existing quantities are preserved.
  const inventory = [
    ['Mozzarella', 8, 'kg', 2],
    ['Tomato Sauce', 12, 'kg', 3],
    ['Flour', 25, 'kg', 5],
    ['Coffee Beans', 4, 'kg', 1],
    ['Burger Patties', 40, 'pcs', 10],
    ['Momos', 60, 'pcs', 15],
    ['French Fries', 15, 'kg', 4],
    ['Chocolate Brownie', 20, 'pcs', 5],
  ] as const;

  for (const [name, quantity, unit, lowStockAt] of inventory) {
    await prisma.inventoryItem.upsert({
      where: { name },
      update: { unit, lowStockAt },
      create: { name, quantity, unit, lowStockAt },
    });
  }

  console.log('✅ Seeded floor tables and inventory');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
