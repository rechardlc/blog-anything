import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // 清除认证 token
  cookies().delete('auth-token');

  // 重定向到登录页面
  const loginUrl = new URL(
    '/login',
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  );
  return NextResponse.redirect(loginUrl);
}
