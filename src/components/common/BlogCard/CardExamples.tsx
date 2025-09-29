'use client';

import React from 'react';
import {
  CommonCard,
  CommonCardHeader,
  CommonCardContent,
  CommonCardFooter,
  FullCard,
  type CardVariant,
} from './CommonCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Star,
  User,
  Settings,
  Bell,
  Calendar,
  TrendingUp,
  Award,
  Coffee,
  BookOpen,
} from 'lucide-react';

/**
 * CommonCard 组件使用示例
 * 展示各种变体、尺寸和配置选项
 */
export default function CardExamples() {
  const variants: CardVariant[] = ['default', 'elevated', 'outlined', 'glass', 'gradient', 'minimal'];

  return (
    <div className="space-y-12 p-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-200 bg-clip-text text-transparent">
          CommonCard 组件展示
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          基于 SnowUI 设计理念和 shadcn/ui 构建的通用卡片组件系统
        </p>
      </div>

      {/* 基础变体展示 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">卡片变体</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map((variant) => (
            <CommonCard key={variant} variant={variant} clickable>
              <CommonCardHeader
                title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} 卡片`}
                description={`这是一个 ${variant} 变体的卡片示例`}
                icon={Star}
                badge={{ text: variant, variant: 'secondary' }}
              />
              <CommonCardContent>
                <p className="text-sm text-muted-foreground">
                  展示 {variant} 变体的视觉效果和交互状态。 鼠标悬停查看动画效果。
                </p>
              </CommonCardContent>
              <CommonCardFooter
                metadata="2024-01-01"
                actions={{
                  primary: {
                    text: '查看更多',
                    onClick: () => console.log(`Clicked ${variant}`),
                  },
                  secondary: {
                    text: '分享',
                    onClick: () => console.log('Share'),
                    variant: 'outline',
                  },
                }}
              />
            </CommonCard>
          ))}
        </div>
      </section>

      {/* 实际应用场景 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">实际应用场景</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 用户资料卡片 */}
          <FullCard
            variant="elevated"
            clickable
            header={{
              title: '用户资料',
              description: '管理您的个人信息和偏好设置',
              icon: User,
              iconColor: 'text-blue-500',
              badge: { text: '已验证', variant: 'default' },
              actions: (
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              ),
            }}
            content={{
              children: (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center">
                      <User className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium">张三</p>
                      <p className="text-sm text-muted-foreground">zhangsan@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">开发者</Badge>
                    <Badge variant="outline">高级用户</Badge>
                  </div>
                </div>
              ),
            }}
            footer={{
              actions: {
                primary: {
                  text: '编辑资料',
                  onClick: () => console.log('Edit profile'),
                },
                secondary: {
                  text: '查看详情',
                  onClick: () => console.log('View details'),
                },
              },
            }}
          />

          {/* 统计数据卡片 */}
          <FullCard
            variant="gradient"
            header={{
              title: '月度统计',
              description: '本月网站访问和用户活动数据',
              icon: TrendingUp,
              iconColor: 'text-green-500',
            }}
            content={{
              children: (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">1,234</p>
                      <p className="text-xs text-muted-foreground">页面浏览</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">567</p>
                      <p className="text-xs text-muted-foreground">独立访客</p>
                    </div>
                  </div>
                  <div className="w-full bg-brand-200 dark:bg-brand-700 rounded-full h-2">
                    <div className="bg-brand-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              ),
            }}
            footer={{
              metadata: '最后更新: 2小时前',
              alignment: 'center',
            }}
          />

          {/* 任务卡片 */}
          <FullCard
            variant="outlined"
            clickable
            header={{
              title: '今日任务',
              description: '您今天需要完成的任务列表',
              icon: Calendar,
              iconColor: 'text-purple-500',
              badge: { text: '紧急', variant: 'destructive' },
            }}
            content={{
              children: (
                <div className="space-y-3">
                  {[
                    { task: '完成项目文档', done: true },
                    { task: '团队会议讨论', done: false },
                    { task: '代码审查', done: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          item.done ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                      >
                        {item.done && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : ''}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              ),
            }}
            footer={{
              actions: {
                primary: {
                  text: '添加任务',
                  onClick: () => console.log('Add task'),
                },
              },
            }}
          />

          {/* 成就卡片 */}
          <FullCard
            variant="glass"
            header={{
              title: '最新成就',
              description: '恭喜您获得新的里程碑奖励',
              icon: Award,
              iconColor: 'text-yellow-500',
            }}
            content={{
              children: (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">连续登录达人</h4>
                    <p className="text-sm text-muted-foreground">连续登录 30 天</p>
                  </div>
                </div>
              ),
            }}
            footer={{
              actions: {
                primary: {
                  text: '查看所有成就',
                  onClick: () => console.log('View achievements'),
                },
              },
              alignment: 'center',
            }}
          />

          {/* 通知卡片 */}
          <FullCard
            variant="elevated"
            header={{
              title: '系统通知',
              icon: Bell,
              iconColor: 'text-red-500',
              badge: { text: '3', variant: 'destructive' },
            }}
            content={{
              children: (
                <div className="space-y-3">
                  {[
                    {
                      title: '系统维护通知',
                      time: '2 分钟前',
                      type: 'warning',
                    },
                    { title: '新功能发布', time: '1 小时前', type: 'info' },
                    { title: '安全更新', time: '3 小时前', type: 'success' },
                  ].map((notification, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning'
                            ? 'bg-yellow-500'
                            : notification.type === 'info'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            }}
            footer={{
              actions: {
                primary: {
                  text: '全部已读',
                  onClick: () => console.log('Mark all read'),
                },
                secondary: {
                  text: '设置',
                  onClick: () => console.log('Settings'),
                  variant: 'ghost',
                },
              },
            }}
          />

          {/* 学习进度卡片 */}
          <FullCard
            variant="default"
            header={{
              title: '学习进度',
              description: 'React 高级开发课程',
              icon: BookOpen,
              iconColor: 'text-indigo-500',
            }}
            content={{
              children: (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>已完成</span>
                    <span className="font-medium">7/12 章节</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: '58%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>预计剩余: 5 小时</span>
                    <span>58% 完成</span>
                  </div>
                </div>
              ),
            }}
            footer={{
              actions: {
                primary: {
                  text: '继续学习',
                  onClick: () => console.log('Continue learning'),
                },
              },
            }}
          />
        </div>
      </section>

      {/* 尺寸展示 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">卡片尺寸</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <CommonCard key={size} variant="elevated" size={size}>
              <CommonCardHeader
                title={`${size.toUpperCase()} 尺寸`}
                description={`这是 ${size} 尺寸的卡片`}
                icon={Coffee}
              />
              <CommonCardContent>
                <p className="text-sm text-muted-foreground">展示 {size} 尺寸的卡片效果</p>
              </CommonCardContent>
            </CommonCard>
          ))}
        </div>
      </section>

      {/* 交互状态展示 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">交互状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CommonCard variant="outlined" clickable onClick={() => alert('卡片被点击!')}>
            <CommonCardHeader
              title="可点击卡片"
              description="点击整个卡片区域"
              icon={Heart}
              iconColor="text-red-500"
            />
            <CommonCardContent>
              <p className="text-sm text-muted-foreground">整个卡片都是可点击的，具有悬停和点击动画效果</p>
            </CommonCardContent>
          </CommonCard>

          <CommonCard variant="elevated" animated={false}>
            <CommonCardHeader title="无动画卡片" description="关闭了动画效果" icon={Settings} />
            <CommonCardContent>
              <p className="text-sm text-muted-foreground">这个卡片关闭了动画效果，适合性能敏感的场景</p>
            </CommonCardContent>
          </CommonCard>

          <CommonCard variant="glass">
            <CommonCardHeader
              title="玻璃拟态效果"
              description="现代化的毛玻璃背景"
              icon={Star}
              iconColor="text-brand-500"
            />
            <CommonCardContent>
              <p className="text-sm text-muted-foreground">使用 backdrop-blur 实现的玻璃拟态效果</p>
            </CommonCardContent>
          </CommonCard>
        </div>
      </section>
    </div>
  );
}
