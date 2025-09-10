import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '文章管理',
  description: '管理博客文章',
};

export default function PostsManagementPage() {
  return (
    <div className='space-y-6'>
      <div className='sm:flex sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            文章管理
          </h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            管理您的所有博客文章
          </p>
        </div>
        <Link
          href='/admin/posts/new'
          className='mt-4 sm:mt-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500'
        >
          新建文章
        </Link>
      </div>

      <div className='bg-white shadow rounded-lg dark:bg-gray-800'>
        <div className='p-4 border-b dark:border-gray-700'>
          <div className='flex gap-4'>
            <input
              type='text'
              placeholder='搜索文章...'
              className='flex-1 max-w-md rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'
            />
            <select className='rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'>
              <option>所有状态</option>
              <option>已发布</option>
              <option>草稿</option>
            </select>
          </div>
        </div>

        <div className='overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  标题
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  状态
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  发布日期
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  操作
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                      示例文章标题 {index + 1}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                      已发布
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                    2024-01-{String(index + 1).padStart(2, '0')}
                  </td>
                  <td className='px-6 py-4 text-sm'>
                    <button className='text-blue-600 hover:text-blue-800 mr-3'>
                      编辑
                    </button>
                    <button className='text-red-600 hover:text-red-800'>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
