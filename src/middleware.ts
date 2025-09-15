import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * 验证用户是否已登录
 * @returns 如果用户已登录返回 true，否则返回 false
 */
async function isAuthenticated(): Promise<boolean> {
  try {
    // 使用 NextAuth 的 auth 函数检查会话
    const session = await auth();
    return !!session;
  } catch (error) {
    console.error('认证检查失败:', error);
    return false;
  }
}

/**
 * 重定向到登录页面
 * @param request - NextRequest 对象
 * @returns 重定向响应
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // // 检查是否访问 admin 路由
  // if (pathname.startsWith('/admin')) {
  //   // 对于 admin 路由，需要验证登录状态
  //   const authenticated = await isAuthenticated();
  //   if (!authenticated) {
  //     // 如果未登录且不是访问登录页面，则重定向到登录页
  //     if (pathname !== '/login') {
  //       return redirectToLogin(request);
  //     }
  //   }
  // }
  // 对于 website 路由或其他路径，不做验证，正常处理
  // return NextResponse.next();
}

// 配置 middleware 匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了以下路径:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 其他静态资源文件
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\..*).*)',
  ],
};
