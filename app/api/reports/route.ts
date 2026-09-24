export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, revenue, completed, pending, customers, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { status: { in: ['NEW', 'PREPARING', 'READY'] } } }),
      prisma.customer.count(),
      prisma.order.findMany({
        select: { id: true, orderNumber: true, customerName: true, status: true, total: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const totalOrders = total;
    const totalRevenue = Number(revenue._sum.total ?? 0);

    return Response.json({
      summary: {
        totalOrders,
        totalRevenue,
        completedOrders: completed,
        pendingOrders: pending,
        customers,
        averageOrder: totalOrders ? totalRevenue / totalOrders : 0,
      },
      orders: recentOrders,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return Response.json({ error: 'Failed to generate reports' }, { status: 500 });
  }
}
