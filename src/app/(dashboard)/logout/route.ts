import { NextResponse } from 'next/server';

/**
 * 登出路由处理器
 * 在服务端清除会话并重定向到登录页面
 */
export async function GET() {
  try {
    // 创建登录页面 URL
    const loginUrl = new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

    // 创建响应并清除相关 cookies
    const response = NextResponse.redirect(loginUrl);

    // 清除 NextAuth 相关的 cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Host-next-auth.csrf-token');

    return response;
  } catch (error) {
    console.error('登出失败:', error);

    // 即使出错也重定向到登录页面
    const loginUrl = new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    return NextResponse.redirect(loginUrl);
  }
}
