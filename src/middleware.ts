import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

// 配置 middleware 匹配的路径
export const config = {
  matcher: [
    /*
     * 只拦截需要认证的路径:
     * - /admin 及其子路径 (管理后台)
     *
     * 自动排除 (withAuth 默认不处理):
     * - /api/* (API 路由)
     * - /_next/* (Next.js 内部资源)
     * - /favicon.ico (图标)
     * - 静态资源文件
     *
     * 不拦截网站前台路径:
     * - / (首页)
     * - /blog/* (博客页面)
     * - /projects, /contact, /more (其他页面)
     * - /login, /register (登录注册页面让 withAuth 自动处理)
     */
    '/admin/:path*',
  ],
};
