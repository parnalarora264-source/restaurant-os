import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [tables, menu, inventory] = await Promise.all([
      prisma.table.count(),
      prisma.menuItem.count(),
      prisma.inventoryItem.count(),
    ]);
    return Response.json({ ok: true, database: 'connected', latencyMs: Date.now() - started, counts: { tables, menu, inventory } });
  } catch (error) {
    console.error('GET /api/health error:', error);
    return Response.json({ ok: false, database: 'error', latencyMs: Date.now() - started, error: 'Database connection failed' }, { status: 503 });
  }
}
