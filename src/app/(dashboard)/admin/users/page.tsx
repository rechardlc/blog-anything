import { Metadata } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Ban,
  Shield,
  Mail,
  Calendar,
  Users,
  Eye,
  Trash2,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '用户管理',
  description: '管理系统用户',
};

// 模拟用户数据
const users = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: '/avatar.jpg',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
    joinDate: '2023-06-15',
    postsCount: 25,
    commentsCount: 128,
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    avatar: null,
    role: 'editor',
    status: 'active',
    lastLogin: '2024-01-14 09:15',
    joinDate: '2023-08-22',
    postsCount: 12,
    commentsCount: 67,
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    avatar: null,
    role: 'author',
    status: 'active',
    lastLogin: '2024-01-13 16:45',
    joinDate: '2023-09-10',
    postsCount: 8,
    commentsCount: 45,
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    avatar: null,
    role: 'subscriber',
    status: 'inactive',
    lastLogin: '2023-12-20 11:20',
    joinDate: '2023-10-05',
    postsCount: 0,
    commentsCount: 23,
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    avatar: null,
    role: 'author',
    status: 'banned',
    lastLogin: '2023-11-30 08:30',
    joinDate: '2023-11-01',
    postsCount: 3,
    commentsCount: 15,
  },
];

function getRoleBadge(role: string) {
  switch (role) {
    case 'admin':
      return <Badge className="status-badge error">管理员</Badge>;
    case 'editor':
      return <Badge className="status-badge warning">编辑者</Badge>;
    case 'author':
      return <Badge className="status-badge info">作者</Badge>;
    case 'subscriber':
      return <Badge className="status-badge">订阅者</Badge>;
    default:
      return <Badge className="status-badge">未知</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="status-badge success">活跃</Badge>;
    case 'inactive':
      return <Badge className="status-badge warning">不活跃</Badge>;
    case 'banned':
      return <Badge className="status-badge error">已封禁</Badge>;
    default:
      return <Badge className="status-badge">未知</Badge>;
  }
}

export default function UsersManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">用户管理</h1>
              <p className="page-description">管理系统用户和权限</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="sm:w-auto w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  添加用户
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新用户</DialogTitle>
                  <DialogDescription>创建一个新的用户账户并分配角色权限</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">用户名</label>
                    <Input placeholder="请输入用户名" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">邮箱地址</label>
                    <Input type="email" placeholder="请输入邮箱地址" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">用户角色</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subscriber">订阅者</SelectItem>
                        <SelectItem value="author">作者</SelectItem>
                        <SelectItem value="editor">编辑者</SelectItem>
                        <SelectItem value="admin">管理员</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">创建用户</Button>
                    <Button variant="outline" className="flex-1">
                      取消
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <Card className="snow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="搜索用户名、邮箱..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="角色筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有角色</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="editor">编辑者</SelectItem>
                    <SelectItem value="author">作者</SelectItem>
                    <SelectItem value="subscriber">订阅者</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="状态筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">不活跃</SelectItem>
                    <SelectItem value="banned">已封禁</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 用户列表 */}
        <Card className="snow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              用户列表
              <Badge variant="secondary" className="ml-auto">
                {users.length} 位用户
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="snow-table">
                <thead>
                  <tr>
                    <th className="text-left">用户信息</th>
                    <th className="text-left">角色</th>
                    <th className="text-left">状态</th>
                    <th className="text-left">活动数据</th>
                    <th className="text-left">最后登录</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || ''} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              加入于 {user.joinDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {user.postsCount} 篇文章
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {user.commentsCount} 条评论
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-muted-foreground">{user.lastLogin}</div>
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
                              <DropdownMenuLabel>用户操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑信息
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="w-4 h-4 mr-2" />
                                修改角色
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem className="text-yellow-600">
                                  <Ban className="w-4 h-4 mr-2" />
                                  禁用账户
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <Shield className="w-4 h-4 mr-2" />
                                  激活账户
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除用户
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
            显示 1-{users.length} 条，共 {users.length} 条记录
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
              下一页
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
