'use client';

/**
 * 全局错误边界组件
 * 处理应用程序中的错误状态
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 在生产环境中，这里可以记录错误到错误监控服务
    console.error('应用程序错误:', error);
  }, [error]);

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-md text-center'>
        {/* 错误图标 */}
        <div className='mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center'>
          <svg
            className='h-8 w-8 text-red-600 dark:text-red-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        {/* 错误标题 */}
        <h1 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
          出现了一些问题
        </h1>

        {/* 错误描述 */}
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          很抱歉，页面加载时遇到了错误。请稍后重试。
        </p>

        {/* 操作按钮 */}
        <div className='space-y-3'>
          <button
            onClick={reset}
            className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            重试
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          >
            返回首页
          </button>
        </div>

        {/* 开发环境下显示错误详情 */}
        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 dark:text-gray-400'>
              错误详情 (仅开发环境显示)
            </summary>
            <pre className='mt-2 whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200'>
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
