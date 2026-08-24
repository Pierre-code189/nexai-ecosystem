import { NextResponse } from 'next/server';
import { StorageFactory } from '@/lib/solid/StorageFactory';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId') || 'tenant_realestate_01';

  const storage = StorageFactory.getStorage();
  const tenant = await storage.getTenant(tenantId);

  return NextResponse.json({ tenant });
}
