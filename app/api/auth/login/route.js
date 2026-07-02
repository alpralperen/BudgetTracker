import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    
    // Check against env var
    const validPin = process.env.APP_PIN || '123456'; // Default fallback if not set

    if (pin === validPin) {
      const response = NextResponse.json({ success: true });
      // Set HTTP-only session cookie (expires when browser closes)
      response.cookies.set({
        name: 'app_auth_token',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json({ success: false, message: 'Geçersiz PIN' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 });
  }
}
