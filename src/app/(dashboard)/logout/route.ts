import { signOut } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * 登出路由处理器
 * 使用 NextAuth 的 signOut 函数处理用户登出
 */
export async function GET() {
  try {
    // 使用 NextAuth 的 signOut 函数
    await signOut({ redirect: false });

    // 重定向到登录页面
    const loginUrl = new URL(
      '/login',
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('登出失败:', error);

    // 即使出错也重定向到登录页面
    const loginUrl = new URL(
      '/login',
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(loginUrl);
  }
}
