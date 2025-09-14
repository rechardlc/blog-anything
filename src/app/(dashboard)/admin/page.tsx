import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: '仪表板',
  description: '后台管理系统主页',
};

export default function AdminDashboard() {
  return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            仪表板
          </h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            欢迎回来，这里是您的博客管理中心
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='bg-white shadow rounded-lg p-5 dark:bg-gray-800'>
            <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              总文章数
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              42
            </div>
          </div>
          <div className='bg-white shadow rounded-lg p-5 dark:bg-gray-800'>
            <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              注册用户
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              1,205
            </div>
          </div>
          <div className='bg-white shadow rounded-lg p-5 dark:bg-gray-800'>
            <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              今日访问
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              3,847
            </div>
          </div>
          <div className='bg-white shadow rounded-lg p-5 dark:bg-gray-800'>
            <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              评论数量
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              268
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='bg-white shadow rounded-lg p-6 dark:bg-gray-800'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              最近文章
            </h3>
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='flex justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      示例文章标题 {index + 1}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      2024-01-0{index + 1}
                    </p>
                  </div>
                  <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200'>
                    已发布
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white shadow rounded-lg p-6 dark:bg-gray-800'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              快速操作
            </h3>
            <div className='space-y-3'>
              <Link
                href='/admin/posts/new'
                className='block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg dark:bg-blue-900/20'
              >
                创建新文章
              </Link>
              <Link
                href='/admin/users'
                className='block p-3 bg-green-50 hover:bg-green-100 rounded-lg dark:bg-green-900/20'
              >
                管理用户
              </Link>
              <Link
                href='/admin/settings'
                className='block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg dark:bg-purple-900/20'
              >
                系统设置
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
