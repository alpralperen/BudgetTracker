import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    
    // Check against env var
    const validPin = process.env.APP_PIN || '123456'; // Default fallback if not set

    if (pin === validPin) {
      const response = NextResponse.json({ success: true });
      // Set HTTP-only cookie
      response.cookies.set({
        name: 'auth_session',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json({ success: false, message: 'Geçersiz PIN' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 });
  }
}
