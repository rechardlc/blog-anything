import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '用户管理',
  description: '管理系统用户',
};

export default function UsersManagementPage() {
  return (
    <div className='space-y-6'>
      <div className='sm:flex sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            用户管理
          </h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            管理系统用户和权限
          </p>
        </div>
        <button className='mt-4 sm:mt-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500'>
          添加用户
        </button>
      </div>

      <div className='bg-white shadow rounded-lg dark:bg-gray-800'>
        <div className='p-4 border-b dark:border-gray-700'>
          <input
            type='text'
            placeholder='搜索用户...'
            className='max-w-md rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600'
          />
        </div>

        <div className='overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  用户
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  角色
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  注册日期
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
                  状态
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
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
                        <span className='text-sm font-medium text-gray-600'>
                          U{index + 1}
                        </span>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          用户 {index + 1}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                          user{index + 1}@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                    {index === 0 ? '管理员' : '用户'}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                    2024-01-{String(index + 1).padStart(2, '0')}
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                      活跃
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm'>
                    <button className='text-blue-600 hover:text-blue-800 mr-3'>
                      编辑
                    </button>
                    <button className='text-red-600 hover:text-red-800'>
                      禁用
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
