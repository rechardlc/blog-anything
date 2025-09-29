import { Metadata } from 'next';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  Calendar,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '仪表板',
  description: '后台管理系统主页',
};

// 模拟数据
const stats = [
  {
    title: '总文章数',
    value: '42',
    change: '+12%',
    trend: 'up',
    icon: FileText,
    description: '相比上月',
  },
  {
    title: '注册用户',
    value: '1,205',
    change: '+8%',
    trend: 'up',
    icon: Users,
    description: '相比上月',
  },
  {
    title: '今日访问',
    value: '3,847',
    change: '-2%',
    trend: 'down',
    icon: Eye,
    description: '相比昨日',
  },
  {
    title: '评论数量',
    value: '268',
    change: '+15%',
    trend: 'up',
    icon: MessageSquare,
    description: '相比上月',
  },
];

const recentPosts = [
  {
    id: 1,
    title: 'Next.js 15 的新特性解析',
    status: 'published',
    date: '2024-01-15',
    views: 1234,
  },
  {
    id: 2,
    title: 'React 服务器组件深入理解',
    status: 'draft',
    date: '2024-01-14',
    views: 856,
  },
  {
    id: 3,
    title: 'TypeScript 5.0 升级指南',
    status: 'published',
    date: '2024-01-13',
    views: 2341,
  },
  {
    id: 4,
    title: 'Tailwind CSS 最佳实践',
    status: 'published',
    date: '2024-01-12',
    views: 1567,
  },
  {
    id: 5,
    title: '现代化前端构建工具对比',
    status: 'review',
    date: '2024-01-11',
    views: 934,
  },
];

const quickActions = [
  {
    title: '创建新文章',
    description: '开始写作新的博客文章',
    href: '/admin/posts/new',
    icon: Plus,
    color: 'bg-blue-500',
  },
  {
    title: '管理用户',
    description: '查看和管理系统用户',
    href: '/admin/users',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: '系统设置',
    description: '配置系统参数和选项',
    href: '/admin/settings',
    icon: ArrowUpRight,
    color: 'bg-purple-500',
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return <Badge className="status-badge success">已发布</Badge>;
    case 'draft':
      return <Badge className="status-badge warning">草稿</Badge>;
    case 'review':
      return <Badge className="status-badge info">待审核</Badge>;
    default:
      return <Badge className="status-badge">未知</Badge>;
  }
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="page-header">
          <h1 className="page-title">仪表板</h1>
          <p className="page-description">欢迎回来，这里是您的博客管理中心</p>
        </div>

        {/* 专业统计卡片 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="snow-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] mb-3">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black mt-2">{stat.value}</p>
                    <div className="flex items-center mt-4 text-sm">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                      )}
                      <span
                        className={`font-bold text-lg ${
                          stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground ml-2 font-medium">{stat.description}</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-3xl border border-border">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 最近文章 - SnowUI 风格 */}
          <Card className="snow-card">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">最近文章</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-2xl font-semibold hover:scale-105 transition-transform"
                >
                  <Link href="/admin/posts">
                    查看全部
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-1 mb-2">{post.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">{getStatusBadge(post.status)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 快速操作 - SnowUI 风格 */}
          <Card className="snow-card">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold">快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center p-5 border border-border rounded-2xl hover:bg-muted transition-colors group"
                >
                  <div className={`p-3 rounded-2xl ${action.color} mr-4`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{action.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 最近活动 - SnowUI 风格 */}
        <Card className="snow-card">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold">最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: '发布了文章',
                  target: 'Next.js 15 的新特性解析',
                  time: '2 小时前',
                  type: 'publish',
                  color: 'bg-emerald-500',
                },
                {
                  action: '新用户注册',
                  target: 'user@example.com',
                  time: '4 小时前',
                  type: 'user',
                  color: 'bg-blue-500',
                },
                {
                  action: '收到新评论',
                  target: 'React 服务器组件深入理解',
                  time: '6 小时前',
                  type: 'comment',
                  color: 'bg-amber-500',
                },
                {
                  action: '更新了设置',
                  target: '网站基本信息',
                  time: '1 天前',
                  type: 'settings',
                  color: 'bg-purple-500',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-accent/20 transition-all duration-200"
                >
                  <div className={`p-3 ${activity.color} rounded-2xl shadow-lg`}>
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span className="text-foreground">{activity.action}</span>
                      <span className="text-muted-foreground ml-1">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
