/**
 * 全局加载组件
 * 在页面路由切换时显示加载状态
 */

export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center space-y-4'>
        {/* 加载动画 */}
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>

        {/* 加载文本 */}
        <p className='text-sm text-gray-600 dark:text-gray-400'>正在加载...</p>
      </div>
    </div>
  );
}
