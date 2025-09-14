import { Metadata } from 'next';
import Link from 'next/link';
import { SessionProvider } from "next-auth/react"
export const metadata: Metadata = {
  title: {
    template: '%s | 后台管理 - Blog-Any',
    default: '后台管理 - Blog-Any',
  },
};

export default function BackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider >
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-out'>
        <header className='bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-out'>
          <div className='max-w-7xl mx-auto px-4 h-16 flex justify-between items-center'>
            <Link
              href='/admin'
              className='text-xl font-bold text-gray-900 dark:text-white'
            >
              Blog-Any 管理后台
            </Link>
            <div className='flex items-center space-x-4'>
              <Link
                href='/'
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400'
              >
                返回前台
              </Link>
              <Link
                href='/logout'
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400'
              >
                登出
              </Link>
            </div>
          </div>
        </header>

        <div className='flex'>
          <nav className='w-64 bg-white shadow-sm border-r dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-out animate-theme-fade'>
            <div className='p-4 space-y-2'>
              <Link
                href='/admin'
                className='block p-2 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              >
                仪表板
              </Link>
              <Link
                href='/admin/posts'
                className='block p-2 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              >
                文章管理
              </Link>
              <Link
                href='/admin/users'
                className='block p-2 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              >
                用户管理
              </Link>
              <Link
                href='/admin/settings'
                className='block p-2 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              >
                系统设置
              </Link>
            </div>
          </nav>

          <main className='flex-1 p-6 animate-theme-fade'>{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
