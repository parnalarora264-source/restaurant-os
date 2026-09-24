export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ orderId: string }> };

const statusMap: Record<string, string> = {
  NEW: 'New',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

function serialize(order: any) {
  return {
    ...order,
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

function normalizeStatus(value: string) {
  const map: Record<string, string> = {
    New: 'NEW',
    Preparing: 'PREPARING',
    Ready: 'READY',
    Completed: 'COMPLETED',
    Cancelled: 'CANCELLED',
  };
  return map[value] || value;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { orderId } = await params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, table: true },
    });
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });
    return Response.json({ order: serialize(order) });
  } catch (error) {
    console.error('GET order error:', error);
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const status = normalizeStatus(String(body.status || ''));

    const allowed = ['NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return Response.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: { items: true, table: true },
    });

    return Response.json({ order: serialize(order) });
  } catch (error) {
    console.error('PUT order error:', error);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
