'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Lock, Loader2, Github, Chrome, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 登录页面加载状态组件
 * 带有动画效果的骨架屏
 */
export default function Loading() {
  const [progress, setProgress] = useState(0);

  // 模拟加载进度
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      {/* 主卡片容器 */}
      <Card className='w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80'>
        <CardHeader className='text-center space-y-4'>
          {/* Logo 区域 */}
          <div className='mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-pulse'>
            <Lock className='w-6 h-6 text-primary animate-spin' />
          </div>

          {/* 标题骨架屏 */}
          <div className='space-y-2 float-animation'>
            <Skeleton className='h-8 w-48 mx-auto skeleton-shimmer' />
            <Skeleton className='h-4 w-64 mx-auto skeleton-shimmer stagger-animation-1' />
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* 加载进度条 */}
          <div className='space-y-2'>
            <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>正在加载登录页面...</span>
            </div>
            <Progress value={progress} className='w-full' />
          </div>

          {/* 表单骨架屏 */}
          <div className='space-y-4 float-animation stagger-animation-2'>
            {/* 用户名输入框骨架 */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16 skeleton-shimmer' />
              <Skeleton className='h-10 w-full skeleton-shimmer' />
            </div>

            {/* 密码输入框骨架 */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12 skeleton-shimmer' />
              <Skeleton className='h-10 w-full skeleton-shimmer' />
            </div>

            {/* 登录按钮骨架 */}
            <Skeleton className='h-10 w-full skeleton-shimmer' />
          </div>

          {/* 分隔线 */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Skeleton className='h-px w-full' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white dark:bg-gray-800 px-2'>
                <Skeleton className='h-3 w-24' />
              </span>
            </div>
          </div>

          {/* 社交登录按钮骨架 */}
          <div className='grid grid-cols-3 gap-3 float-animation stagger-animation-3'>
            {[Github, Chrome, Twitter].map((Icon, index) => (
              <div
                key={index}
                className='h-12 w-full border rounded-md flex items-center justify-center bg-muted/10 skeleton-shimmer hover:scale-105 transition-transform'
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Icon className='w-5 h-5 text-muted-foreground/50 animate-pulse' />
              </div>
            ))}
          </div>

          {/* 注册链接骨架 */}
          <div className='text-center float-animation stagger-animation-3'>
            <Skeleton className='h-4 w-40 mx-auto skeleton-shimmer' />
          </div>
        </CardContent>
      </Card>

      {/* 浮动动画元素 */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* 装饰性动画圆圈 */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-primary/20 rounded-full animate-bounce'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 200}ms`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
