export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

function serialize(item: any) {
  return { ...item, lowAt: item.lowStockAt };
}

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
    return Response.json({ items: items.map(serialize) });
  } catch (error) {
    console.error('GET /api/inventory error:', error);
    return Response.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || '');
    const quantity = Number(body.quantity);
    if (!id || !Number.isFinite(quantity) || quantity < 0) {
      return Response.json({ error: 'Invalid inventory data' }, { status: 400 });
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { quantity },
    });
    return Response.json({ item: serialize(item) });
  } catch (error) {
    console.error('PUT /api/inventory error:', error);
    return Response.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
