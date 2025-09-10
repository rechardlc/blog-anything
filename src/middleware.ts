import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 让根目录正常使用 website 布局
  // 不需要重定向，Next.js 会自然使用 app/page.tsx

  // 其他路径正常处理
  return NextResponse.next();
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
