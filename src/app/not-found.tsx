import Link from 'next/link';

/**
 * 404 Not Found 页面
 * 当用户访问不存在的页面时显示
 */

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-md text-center'>
        {/* 404 图标/插图 */}
        <div className='mx-auto mb-8'>
          <div className='text-6xl font-bold text-gray-300 dark:text-gray-600'>
            404
          </div>
        </div>

        {/* 标题 */}
        <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>
          页面未找到
        </h1>

        {/* 描述 */}
        <p className='mb-8 text-gray-600 dark:text-gray-400'>
          抱歉，您访问的页面不存在或已被移动。
        </p>

        {/* 操作按钮 */}
        <div className='space-y-4'>
          <Link
            href='/'
            className='inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            返回首页
          </Link>

          <Link
            href='/blog'
            className='inline-block w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          >
            浏览博客
          </Link>
        </div>

        {/* 建议链接 */}
        <div className='mt-8'>
          <p className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
            或者您可以尝试：
          </p>
          <div className='space-y-2 text-sm'>
            <Link
              href='/about'
              className='block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              关于我们
            </Link>
            <Link
              href='/contact'
              className='block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              联系我们
            </Link>
            <Link
              href='/search'
              className='block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              搜索内容
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 设置页面元数据
export const metadata = {
  title: '404 - 页面未找到',
  description: '抱歉，您访问的页面不存在。',
};
