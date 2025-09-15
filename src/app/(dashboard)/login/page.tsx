'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Github,
  Twitter,
  Chrome,
  Sun,
  Moon,
  Monitor,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// 登录表单验证 schema
const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名').min(2, '用户名至少需要2个字符'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少需要6位字符'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 登录页面组件
 * 提供用户登录和登出功能
 */
const Login = () => {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 表单提交处理
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('登录成功！');
        window.location.href = '/admin';
      } else {
        form.setError('root', {
          message: result.error || '登录失败，请稍后重试',
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      form.setError('root', {
        message: '网络错误，请稍后重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-primary' />
          <p className='text-muted-foreground'>加载中...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
        <Card className='w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80'>
          <CardHeader className='text-center'>
            <Avatar className='mx-auto mb-4 h-16 w-16 ring-4 ring-primary/20'>
              <AvatarImage
                src={session.user?.image || ''}
                alt={session.user?.name || ''}
              />
              <AvatarFallback className='bg-primary text-primary-foreground'>
                {session.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className='text-2xl'>欢迎回来！</CardTitle>
            <CardDescription>
              已登录为: {session.user?.name || session.user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-sm text-muted-foreground text-center space-y-2'>
              <div className='flex items-center justify-center space-x-2'>
                <Badge variant='secondary' className='text-xs'>
                  {session.user?.email}
                </Badge>
              </div>
              <p className='text-xs'>登录状态良好</p>
            </div>
            <div className='flex space-x-2'>
              <Button
                onClick={() => (window.location.href = '/admin')}
                className='flex-1'
              >
                进入管理后台
              </Button>
              <Button
                variant='outline'
                onClick={() => signOut()}
                className='flex-1'
              >
                登出
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className='w-4 h-4' />;
      case 'dark':
        return <Moon className='w-4 h-4' />;
      default:
        return <Monitor className='w-4 h-4' />;
    }
  };

  const socialProviders = [
    {
      name: 'GitHub',
      icon: Github,
      color: 'hover:bg-gray-100 dark:hover:bg-gray-700',
      variant: 'outline' as const,
      onClick: () => {
        try {
          signIn('github');
        } catch (error) {
          console.error('GitHub 登录失败:', error);
          form.setError('root', {
            message: 'GitHub 登录暂不可用，请使用账号密码登录',
          });
        }
      },
    },
    {
      name: 'Google',
      icon: Chrome,
      color: 'hover:bg-red-50 dark:hover:bg-red-950/20',
      variant: 'outline' as const,
      disabled: true,
      onClick: () => {
        form.setError('root', {
          message: 'Google 登录功能暂未配置',
        });
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
      variant: 'outline' as const,
      disabled: true,
      onClick: () => {
        form.setError('root', {
          message: 'Twitter 登录功能暂未配置',
        });
      },
    },
  ];

  return (
    <TooltipProvider>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative'>
        {/* 主题切换按钮 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={toggleTheme}
              className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
            >
              {getThemeIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              当前主题:{' '}
              {theme === 'light'
                ? '浅色'
                : theme === 'dark'
                  ? '深色'
                  : '跟随系统'}
            </p>
          </TooltipContent>
        </Tooltip>

        <Card className='w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80'>
          <CardHeader className='text-center space-y-2'>
            <div className='mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4'>
              <Lock className='w-6 h-6 text-primary-foreground' />
            </div>
            <CardTitle className='text-2xl font-bold'>
              Richard 博客管理后台
            </CardTitle>
            <CardDescription>使用您的账户登录以访问管理功能</CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* 错误提示 */}
            {form.formState.errors.root && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                {/* 用户名 */}
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                          <Input
                            placeholder='请输入用户名'
                            className='pl-10'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 密码 */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='请输入密码'
                            className='pl-10 pr-10'
                            {...field}
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                          >
                            {showPassword ? (
                              <EyeOff className='w-4 h-4' />
                            ) : (
                              <Eye className='w-4 h-4' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full transition-all duration-200 transform hover:scale-[1.02]'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      登录中...
                    </>
                  ) : (
                    '登录'
                  )}
                </Button>
              </form>
            </Form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white dark:bg-gray-800 px-2 text-muted-foreground'>
                  或者使用以下方式登录
                </span>
              </div>
            </div>

            {/* 社交登录 */}
            <div className='grid grid-cols-3 gap-3'>
              {socialProviders.map(provider => {
                const Icon = provider.icon;
                return (
                  <Tooltip key={provider.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={provider.variant}
                        onClick={provider.onClick}
                        disabled={provider.disabled || isSubmitting}
                        className={`h-12 w-full transition-all duration-200 transform hover:scale-105 ${provider.color}`}
                      >
                        <Icon className='w-5 h-5' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {provider.name} {provider.disabled ? '(暂未配置)' : ''}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <div className='text-center text-sm text-muted-foreground'>
              <p>
                没有账户？{' '}
                <a
                  href='/register'
                  className='text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline'
                >
                  立即注册
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Login;
