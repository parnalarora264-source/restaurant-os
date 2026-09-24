export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

function serialize(item: any) {
  return {
    id: item.id,
    categoryId: item.categoryId,
    category: item.category?.name ?? '',
    categoryDisplayName: item.category?.displayName ?? item.category?.name ?? '',
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    imageUrl: item.imageUrl ?? '',
    image: item.imageUrl ?? '',
    isVeg: item.isVeg,
    veg: item.isVeg,
    isFeatured: item.isFeatured,
    featured: item.isFeatured,
    badge: item.badge,
    isAvailable: item.isAvailable,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

const include = { category: true } as const;

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      include,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return Response.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/menu error:', error);
    return Response.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

async function getCategory(name: string) {
  return prisma.category.upsert({
    where: { name },
    update: { displayName: name, isActive: true },
    create: { name, displayName: name },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? '').trim();
    const categoryName = String(body.category ?? '').trim();
    const price = Number(body.price);
    if (!name || !categoryName || !Number.isFinite(price) || price < 0) {
      return Response.json({ error: 'Name, category and valid price are required' }, { status: 400 });
    }
    const category = await getCategory(categoryName);
    const max = await prisma.menuItem.aggregate({ _max: { sortOrder: true } });
    const item = await prisma.menuItem.create({
      data: {
        categoryId: category.id, name,
        description: body.description ? String(body.description) : null,
        price: Math.round(price),
        imageUrl: body.image ? String(body.image) : null,
        isVeg: Boolean(body.veg), isFeatured: Boolean(body.featured),
        badge: body.badge ? String(body.badge) : null,
        isAvailable: body.isAvailable !== false,
        sortOrder: (max._max.sortOrder ?? -1) + 1,
      }, include,
    });
    return Response.json({ item: serialize(item) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/menu error:', error);
    return Response.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id ?? '').trim();
    if (!id) return Response.json({ error: 'Menu item id is required' }, { status: 400 });
    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: 'Menu item not found' }, { status: 404 });

    let categoryId = existing.categoryId;
    if (body.category !== undefined) {
      const categoryName = String(body.category).trim();
      if (!categoryName) return Response.json({ error: 'Category is required' }, { status: 400 });
      categoryId = (await getCategory(categoryName)).id;
    }

    const price = body.price === undefined ? existing.price : Number(body.price);
    if (!Number.isFinite(price) || price < 0) return Response.json({ error: 'Invalid price' }, { status: 400 });

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        categoryId,
        name: body.name !== undefined ? String(body.name).trim() : existing.name,
        description: body.description !== undefined ? (body.description ? String(body.description) : null) : existing.description,
        price: Math.round(price),
        imageUrl: body.image !== undefined ? (body.image ? String(body.image) : null) : existing.imageUrl,
        isVeg: body.veg !== undefined ? Boolean(body.veg) : existing.isVeg,
        isFeatured: body.featured !== undefined ? Boolean(body.featured) : existing.isFeatured,
        badge: body.badge !== undefined ? (body.badge ? String(body.badge) : null) : existing.badge,
        isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : existing.isAvailable,
      }, include,
    });
    return Response.json({ item: serialize(item) });
  } catch (error) {
    console.error('PUT /api/menu error:', error);
    return Response.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const itemId = String(id ?? '').trim();
    if (!itemId) return Response.json({ error: 'Menu item id is required' }, { status: 400 });
    const existing = await prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!existing) return Response.json({ error: 'Menu item not found' }, { status: 404 });
    const linkedOrders = await prisma.orderItem.count({ where: { menuItemId: itemId } });
    if (linkedOrders > 0) {
      const item = await prisma.menuItem.update({ where: { id: itemId }, data: { isAvailable: false }, include });
      return Response.json({ item: serialize(item), archived: true });
    }
    await prisma.menuItem.delete({ where: { id: itemId } });
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/menu error:', error);
    return Response.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
