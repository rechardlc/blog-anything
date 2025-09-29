import { Metadata } from 'next';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '文章管理',
  description: '管理博客文章',
};

// 模拟文章数据
const posts = [
  {
    id: 1,
    title: 'Next.js 15 的新特性解析',
    excerpt: '深入了解 Next.js 15 带来的革命性变化和新功能...',
    status: 'published',
    author: '张三',
    publishDate: '2024-01-15',
    views: 1234,
    comments: 12,
    category: '技术',
    featured: true,
  },
  {
    id: 2,
    title: 'React 服务器组件深入理解',
    excerpt: '探索 React Server Components 的工作原理和最佳实践...',
    status: 'draft',
    author: '李四',
    publishDate: '2024-01-14',
    views: 856,
    comments: 8,
    category: '前端',
    featured: false,
  },
  {
    id: 3,
    title: 'TypeScript 5.0 升级指南',
    excerpt: '从 TypeScript 4.x 升级到 5.0 的完整指南...',
    status: 'published',
    author: '王五',
    publishDate: '2024-01-13',
    views: 2341,
    comments: 25,
    category: '编程',
    featured: true,
  },
  {
    id: 4,
    title: 'Tailwind CSS 最佳实践',
    excerpt: '掌握 Tailwind CSS 的高级用法和性能优化技巧...',
    status: 'review',
    author: '赵六',
    publishDate: '2024-01-12',
    views: 1567,
    comments: 18,
    category: '样式',
    featured: false,
  },
  {
    id: 5,
    title: '现代化前端构建工具对比',
    excerpt: '比较 Vite、Webpack、Rollup 等主流构建工具...',
    status: 'scheduled',
    author: '孙七',
    publishDate: '2024-01-20',
    views: 0,
    comments: 0,
    category: '工具',
    featured: false,
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
    case 'scheduled':
      return <Badge className="status-badge">定时发布</Badge>;
    default:
      return <Badge className="status-badge">未知</Badge>;
  }
}

export default function PostsManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">文章管理</h1>
              <p className="page-description">管理您的所有博客文章</p>
            </div>
            <Button asChild className="sm:w-auto w-full">
              <Link href="/admin/posts/new">
                <Plus className="w-4 h-4 mr-2" />
                新建文章
              </Link>
            </Button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <Card className="snow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="搜索文章标题、内容或作者..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="状态筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="review">待审核</SelectItem>
                    <SelectItem value="scheduled">定时发布</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有分类</SelectItem>
                    <SelectItem value="tech">技术</SelectItem>
                    <SelectItem value="frontend">前端</SelectItem>
                    <SelectItem value="programming">编程</SelectItem>
                    <SelectItem value="tools">工具</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 文章列表 */}
        <Card className="snow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              文章列表
              <Badge variant="secondary" className="ml-auto">
                {posts.length} 篇文章
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="snow-table">
                <thead>
                  <tr>
                    <th className="text-left">文章信息</th>
                    <th className="text-left">状态</th>
                    <th className="text-left">作者</th>
                    <th className="text-left">数据</th>
                    <th className="text-left">发布时间</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div className="flex items-start space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm line-clamp-1">{post.title}</h3>
                              {post.featured && (
                                <Badge variant="secondary" className="text-xs">
                                  推荐
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <span className="px-2 py-1 bg-muted rounded text-xs">{post.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{getStatusBadge(post.status)}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{post.author}</span>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {post.comments}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.publishDate}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                预览
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            显示 1-{posts.length} 条，共 {posts.length} 条记录
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
