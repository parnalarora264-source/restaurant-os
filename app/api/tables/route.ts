export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

function serialize(table: any) {
  return { ...table, n: table.number, s: table.status };
}

export async function GET() {
  try {
    const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
    return Response.json({ tables: tables.map(serialize) });
  } catch (error) {
    console.error('GET /api/tables error:', error);
    return Response.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const number = Number(body.number);
    if (!Number.isInteger(number) || number < 1) {
      return Response.json({ error: 'Invalid table number' }, { status: 400 });
    }
    const table = await prisma.table.create({ data: { number } });
    return Response.json({ table: serialize(table) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tables error:', error);
    return Response.json({ error: 'Failed to create table' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const number = Number(body.number);
    const allowedStatuses = ['AVAILABLE', 'OCCUPIED', 'PAYMENT_PENDING', 'CLEANING'] as const;

    if (!Number.isInteger(number)) return Response.json({ error: 'Invalid table number' }, { status: 400 });
    if (!allowedStatuses.includes(body.status)) return Response.json({ error: 'Invalid table status' }, { status: 400 });

    const table = await prisma.table.update({
      where: { number },
      data: { status: body.status },
    });
    return Response.json({ table: serialize(table) });
  } catch (error) {
    console.error('PUT /api/tables error:', error);
    return Response.json({ error: 'Failed to update table' }, { status: 500 });
  }
}
