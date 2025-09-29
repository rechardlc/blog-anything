'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  Sun,
  Moon,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

// 表单验证 schema
const formSchema = z
  .object({
    username: z
      .string()
      .min(2, '用户名至少需要2个字符')
      .max(50, '用户名不能超过50个字符')
      .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
    email: z.string().email('请输入有效的邮箱地址').min(1, '邮箱地址是必需的'),
    password: z
      .string()
      .min(6, '密码至少需要6位字符')
      .regex(/[a-z]/, '密码必须包含小写字母')
      .regex(/[A-Z]/, '密码必须包含大写字母')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, '密码必须包含特殊符号'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

/**
 * 注册页面组件
 * 提供用户注册功能，包含详细的密码验证
 */
const Register = () => {
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 密码强度计算
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
    return strength;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // 显示成功消息
        alert('注册成功！请使用您的账户登录。');
        window.location.href = '/login';
      } else {
        // 显示错误消息
        if (result.details && Array.isArray(result.details)) {
          form.setError('password', {
            message: result.details.join(', '),
          });
        } else {
          form.setError('root', {
            message: result.error || '注册失败，请稍后重试',
          });
        }
      }
    } catch (error) {
      console.error('注册错误:', error);
      form.setError('root', {
        message: '网络错误，请稍后重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const password = form.watch('password') || '';
  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = [
    { text: '至少6位字符', valid: password.length >= 6 },
    { text: '包含小写字母', valid: /[a-z]/.test(password) },
    { text: '包含大写字母', valid: /[A-Z]/.test(password) },
    {
      text: '包含特殊符号',
      valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  const getStrengthText = (strength: number) => {
    if (strength < 25) return '很弱';
    if (strength < 50) return '弱';
    if (strength < 75) return '中等';
    if (strength < 100) return '强';
    return '很强';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
      {/* 主题切换按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        title={`当前主题: ${theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统'}`}
      >
        {getThemeIcon()}
      </Button>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Richard 博客注册</CardTitle>
          <CardDescription>创建您的管理账户</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 错误提示 */}
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 用户名 */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="请输入用户名" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>用户名只能包含字母、数字和下划线</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 邮箱 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱地址</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" placeholder="请输入邮箱地址" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 密码 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="请输入密码"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>

                    {/* 密码强度指示器 */}
                    {password.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">密码强度:</span>
                          <span
                            className={`font-medium ${
                              passwordStrength < 50
                                ? 'text-red-500'
                                : passwordStrength < 75
                                  ? 'text-yellow-500'
                                  : 'text-green-500'
                            }`}
                          >
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <Progress value={passwordStrength} className="h-2" />
                      </div>
                    )}

                    {/* 密码要求检查列表 */}
                    {password.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {passwordRequirements.map((requirement, index) => (
                          <div key={index} className="flex items-center text-xs">
                            {requirement.valid ? (
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-2 text-gray-400" />
                            )}
                            <span
                              className={
                                requirement.valid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                              }
                            >
                              {requirement.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 确认密码 */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="请再次输入密码"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="w-full transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? '注册中...' : '注册账户'}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">已有账户？</span>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/login')}
              className="w-full"
              disabled={isSubmitting}
            >
              返回登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
