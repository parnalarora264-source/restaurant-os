export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

function serialize(order: any) {
  const statusMap: Record<string, string> = {
    NEW: 'New',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return {
    ...order,
    orderNumber: order.orderNumber,
    customer: order.customerName || 'Guest',
    phone: order.customerPhone,
    table: order.table?.number ?? '—',
    status: statusMap[order.status] || order.status,
    items: (order.items || []).map((item: any) => ({
      ...item,
      qty: item.quantity,
      price: item.unitPrice,
    })),
  };
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, table: true },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json({ orders: orders.map(serialize) });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const items = body.items.map((x: any) => ({
      name: String(x.name || ''),
      quantity: Math.max(1, Number(x.qty ?? x.quantity ?? 1)),
      unitPrice: Number(x.price ?? x.unitPrice ?? 0),
      menuItemId: x.id ? String(x.id) : undefined,
    }));

    if (items.some((x: any) => !x.name || !Number.isFinite(x.unitPrice))) {
      return Response.json({ error: 'Invalid cart item' }, { status: 400 });
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    );

    const tableNumber = Number(body.table);
    let tableId: string | undefined;

    if (Number.isInteger(tableNumber)) {
      const table = await prisma.table.findUnique({ where: { number: tableNumber } });
      if (table) tableId = table.id;
    }

    const order = await prisma.order.create({
      data: {
        tableId,
        customerName: body.customer ? String(body.customer) : 'Guest',
        customerPhone: body.phone ? String(body.phone) : null,
        total,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            menuItemId: item.menuItemId || undefined,
          })),
        },
      },
      include: { items: true, table: true },
    });

    if (body.phone) {
      await prisma.customer.upsert({
        where: { phone: String(body.phone) },
        update: {
          name: String(body.customer || 'Guest'),
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
          lastOrderAt: new Date(),
        },
        create: {
          name: String(body.customer || 'Guest'),
          phone: String(body.phone),
          totalOrders: 1,
          totalSpent: total,
          lastOrderAt: new Date(),
        },
      });
    }

    return Response.json({ order: serialize(order) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
