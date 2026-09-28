import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { district, violationTitle } = await req.json();
    
    const result = await prisma.law.findFirst({
      where: {
        title: violationTitle,
        OR: [
          { tier: 'state' },
          { district }
        ]
      }
    });

    if (result) {
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({ success: false, message: 'No matching law found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
