export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

function serialize(customer: any) {
  return {
    ...customer,
    orders: customer.totalOrders,
    spend: customer.totalSpent,
  };
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { totalSpent: 'desc' } });
    return Response.json({ customers: customers.map(serialize) });
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return Response.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
