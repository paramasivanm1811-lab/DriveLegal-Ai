import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import defaultLawsData from '@/data/laws.json';

export async function GET() {
  try {
    let laws = await prisma.law.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (laws.length === 0) {
      await prisma.law.createMany({
        data: defaultLawsData.map(law => ({
          tier: law.tier,
          district: law.district,
          title: law.title,
          desc: law.desc,
          authority: law.authority,
          penalty: law.penalty,
          vehicleType: law.vehicleType || null,
          category: law.category || null,
        }))
      });
      laws = await prisma.law.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(laws);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch laws' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const clientPasskey = req.headers.get('x-admin-passkey');
    const adminPasskey = process.env.ADMIN_PASSKEY || 'admin123';

    console.log("[API POST /api/laws] Verifying admin write access:");
    console.log(" - Has Server Session:", !!session);
    console.log(" - Client Header Passkey:", clientPasskey);
    console.log(" - Expected Server Passkey:", adminPasskey);

    if (!session && clientPasskey !== adminPasskey) {
      console.error("[API POST /api/laws] Auth mismatch! Unauthorized.");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, desc, tier, district, authority, penalty, vehicleType, category } = body;

    if (!title || !desc || !tier || !district || !authority || !penalty) {
      console.error("[API POST /api/laws] Missing required fields in body:", body);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log("[API POST /api/laws] Attempting to create law in database...");
    const newLaw = await prisma.law.create({
      data: {
        title,
        desc,
        tier,
        district,
        authority,
        penalty,
        vehicleType,
        category,
      }
    });

    console.log("[API POST /api/laws] SUCCESS! Created law ID:", newLaw.id);
    return NextResponse.json(newLaw, { status: 201 });
  } catch (error) {
    console.error("[API POST /api/laws] FATAL EXCEPTION OCCURRED DURING CREATION:", error);
    return NextResponse.json({ error: 'Failed to create law' }, { status: 500 });
  }
}
