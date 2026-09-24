export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
    return Response.json({
      settings: Object.fromEntries(rows.map((x) => [x.key, x.value])),
    });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return Response.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid settings' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
