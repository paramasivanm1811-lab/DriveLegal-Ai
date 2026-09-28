import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const clientPasskey = request.headers.get('x-admin-passkey');
    const adminPasskey = process.env.ADMIN_PASSKEY || 'admin123';
    const { id } = await params;

    console.log(`[API DELETE /api/laws/${id}] Verifying admin revoke access:`);
    console.log(" - Has Server Session:", !!session);
    console.log(" - Client Header Passkey:", clientPasskey);
    console.log(" - Expected Server Passkey:", adminPasskey);

    if (!session && clientPasskey !== adminPasskey) {
      console.error(`[API DELETE /api/laws/${id}] Auth mismatch! Unauthorized.`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[API DELETE /api/laws/${id}] Attempting to revoke regulation in database...`);
    await prisma.law.delete({
      where: { id }
    });
    
    console.log(`[API DELETE /api/laws/${id}] SUCCESS! Revoked law.`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API DELETE /api/laws] FATAL EXCEPTION OCCURRED DURING DELETION:`, error);
    return NextResponse.json({ error: 'Failed to delete law' }, { status: 500 });
  }
}
