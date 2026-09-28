import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { passkey } = body;

    const adminPasskey = process.env.ADMIN_PASSKEY || 'admin123';

    if (passkey === adminPasskey) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid passkey.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
