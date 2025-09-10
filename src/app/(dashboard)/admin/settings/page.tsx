import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '系统设置',
  description: '配置系统参数',
};

export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          系统设置
        </h1>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
          配置系统参数和选项
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <div className='bg-white shadow rounded-lg p-6 dark:bg-gray-800'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            网站设置
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                网站名称
              </label>
              <input
                type='text'
                defaultValue='Blog-Any'
                className='mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                网站描述
              </label>
              <textarea
                rows={3}
                defaultValue='基于 Next.js 的现代化博客平台'
                className='mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'
              />
            </div>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg p-6 dark:bg-gray-800'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            SEO 设置
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                默认关键词
              </label>
              <input
                type='text'
                defaultValue='博客, Next.js, React, TypeScript'
                className='mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Google Analytics ID
              </label>
              <input
                type='text'
                placeholder='G-XXXXXXXXXX'
                className='mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'
              />
            </div>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg p-6 dark:bg-gray-800'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            评论设置
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='comments-enabled'
                className='h-4 w-4 text-blue-600 border-gray-300 rounded'
              />
              <label
                htmlFor='comments-enabled'
                className='ml-2 text-sm text-gray-900 dark:text-white'
              >
                启用评论功能
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='comments-moderation'
                className='h-4 w-4 text-blue-600 border-gray-300 rounded'
              />
              <label
                htmlFor='comments-moderation'
                className='ml-2 text-sm text-gray-900 dark:text-white'
              >
                评论需要审核
              </label>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500'>
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
