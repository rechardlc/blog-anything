import { Metadata } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Search,
  MessageSquare,
  Shield,
  Palette,
  Database,
  Save,
  RefreshCw,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '系统设置',
  description: '配置系统参数',
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='page-header'>
          <h1 className='page-title'>系统设置</h1>
          <p className='page-description'>配置系统参数和选项</p>
        </div>

        <Tabs defaultValue='general' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-6'>
            <TabsTrigger value='general'>基础设置</TabsTrigger>
            <TabsTrigger value='seo'>SEO 设置</TabsTrigger>
            <TabsTrigger value='comments'>评论设置</TabsTrigger>
            <TabsTrigger value='security'>安全设置</TabsTrigger>
            <TabsTrigger value='theme'>主题设置</TabsTrigger>
            <TabsTrigger value='advanced'>高级设置</TabsTrigger>
          </TabsList>

          {/* 基础设置 */}
          <TabsContent value='general' className='space-y-6'>
            <Card className='snow-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Globe className='w-5 h-5' />
                  网站基础信息
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='site-name'>网站名称</Label>
                  <Input
                    id='site-name'
                    defaultValue='Blog-Any'
                    placeholder='请输入网站名称'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='site-description'>网站描述</Label>
                  <Textarea
                    id='site-description'
                    defaultValue='基于 Next.js 的现代化博客平台'
                    placeholder='请输入网站描述'
                    rows={3}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='site-url'>网站地址</Label>
                  <Input
                    id='site-url'
                    defaultValue='https://blog-any.example.com'
                    placeholder='请输入网站地址'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='admin-email'>管理员邮箱</Label>
                    <Input
                      id='admin-email'
                      type='email'
                      defaultValue='admin@example.com'
                      placeholder='请输入管理员邮箱'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='timezone'>时区设置</Label>
                    <Select defaultValue='asia/shanghai'>
                      <SelectTrigger>
                        <SelectValue placeholder='选择时区' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='asia/shanghai'>
                          亚洲/上海 (UTC+8)
                        </SelectItem>
                        <SelectItem value='america/new_york'>
                          美国/纽约 (UTC-5)
                        </SelectItem>
                        <SelectItem value='europe/london'>
                          欧洲/伦敦 (UTC+0)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO 设置 */}
          <TabsContent value='seo' className='space-y-6'>
            <Card className='snow-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Search className='w-5 h-5' />
                  搜索引擎优化
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='meta-keywords'>默认关键词</Label>
                  <Input
                    id='meta-keywords'
                    defaultValue='博客, Next.js, React, TypeScript'
                    placeholder='请输入关键词，用逗号分隔'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='google-analytics'>Google Analytics ID</Label>
                  <Input id='google-analytics' placeholder='G-XXXXXXXXXX' />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='google-search-console'>
                    Google Search Console
                  </Label>
                  <Input id='google-search-console' placeholder='验证代码' />
                </div>

                <div className='space-y-4'>
                  <Label>SEO 功能</Label>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='auto-sitemap'>自动生成 Sitemap</Label>
                        <p className='text-sm text-muted-foreground'>
                          自动为搜索引擎生成网站地图
                        </p>
                      </div>
                      <Switch id='auto-sitemap' defaultChecked />
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='open-graph'>Open Graph 标签</Label>
                        <p className='text-sm text-muted-foreground'>
                          为社交媒体分享生成 OG 标签
                        </p>
                      </div>
                      <Switch id='open-graph' defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 评论设置 */}
          <TabsContent value='comments' className='space-y-6'>
            <Card className='snow-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MessageSquare className='w-5 h-5' />
                  评论管理
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='enable-comments'>启用评论功能</Label>
                      <p className='text-sm text-muted-foreground'>
                        允许用户在文章下发表评论
                      </p>
                    </div>
                    <Switch id='enable-comments' defaultChecked />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='comment-moderation'>评论审核</Label>
                      <p className='text-sm text-muted-foreground'>
                        新评论需要管理员审核后才能显示
                      </p>
                    </div>
                    <Switch id='comment-moderation' />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='guest-comments'>游客评论</Label>
                      <p className='text-sm text-muted-foreground'>
                        允许未登录用户发表评论
                      </p>
                    </div>
                    <Switch id='guest-comments' defaultChecked />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='email-notifications'>邮件通知</Label>
                      <p className='text-sm text-muted-foreground'>
                        新评论时发送邮件通知给管理员
                      </p>
                    </div>
                    <Switch id='email-notifications' defaultChecked />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='comment-length'>评论最大长度</Label>
                    <Input
                      id='comment-length'
                      type='number'
                      defaultValue='500'
                      placeholder='字符数'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='comment-rate-limit'>评论频率限制</Label>
                    <Select defaultValue='1'>
                      <SelectTrigger>
                        <SelectValue placeholder='选择时间间隔' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>无限制</SelectItem>
                        <SelectItem value='1'>1分钟</SelectItem>
                        <SelectItem value='5'>5分钟</SelectItem>
                        <SelectItem value='10'>10分钟</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 安全设置 */}
          <TabsContent value='security' className='space-y-6'>
            <Card className='snow-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='w-5 h-5' />
                  安全与隐私
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='two-factor'>双因素认证</Label>
                      <p className='text-sm text-muted-foreground'>
                        为管理员账户启用双因素认证
                      </p>
                    </div>
                    <Switch id='two-factor' />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='login-attempts'>登录尝试限制</Label>
                      <p className='text-sm text-muted-foreground'>
                        限制错误登录尝试次数，防止暴力破解
                      </p>
                    </div>
                    <Switch id='login-attempts' defaultChecked />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='https-only'>强制 HTTPS</Label>
                      <p className='text-sm text-muted-foreground'>
                        将所有 HTTP 请求重定向到 HTTPS
                      </p>
                    </div>
                    <Switch id='https-only' defaultChecked />
                  </div>
                </div>

                <div className='space-y-4'>
                  <Label>备份设置</Label>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='backup-frequency'>备份频率</Label>
                      <Select defaultValue='daily'>
                        <SelectTrigger>
                          <SelectValue placeholder='选择备份频率' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='daily'>每日</SelectItem>
                          <SelectItem value='weekly'>每周</SelectItem>
                          <SelectItem value='monthly'>每月</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='backup-retention'>保留天数</Label>
                      <Input
                        id='backup-retention'
                        type='number'
                        defaultValue='30'
                        placeholder='天数'
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 主题设置 */}
          <TabsContent value='theme' className='space-y-6'>
            <Card className='snow-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Palette className='w-5 h-5' />
                  外观主题
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label>默认主题</Label>
                  <Select defaultValue='system'>
                    <SelectTrigger>
                      <SelectValue placeholder='选择默认主题' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='light'>浅色主题</SelectItem>
                      <SelectItem value='dark'>深色主题</SelectItem>
                      <SelectItem value='system'>跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-4'>
                  <Label>功能设置</Label>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='theme-switcher'>主题切换器</Label>
                        <p className='text-sm text-muted-foreground'>
                          在网站上显示主题切换按钮
                        </p>
                      </div>
                      <Switch id='theme-switcher' defaultChecked />
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label htmlFor='custom-css'>自定义 CSS</Label>
                        <p className='text-sm text-muted-foreground'>
                          允许添加自定义样式代码
                        </p>
                      </div>
                      <Switch id='custom-css' />
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='custom-css-code'>自定义 CSS 代码</Label>
                  <Textarea
                    id='custom-css-code'
                    placeholder='/* 在此添加自定义 CSS 代码 */'
                    rows={6}
                    className='font-mono text-sm'
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 高级设置 */}
          <TabsContent value='advanced' className='space-y-6'>
            <Card className='snow-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Database className='w-5 h-5' />
                  高级配置
                  <Badge variant='destructive' className='ml-2'>
                    危险操作
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='p-4 border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 rounded-lg'>
                    <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                      ⚠️
                      以下操作可能会影响网站正常运行，请谨慎操作并确保有完整备份。
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 border border-border rounded-lg'>
                      <div>
                        <h4 className='font-medium'>清除缓存</h4>
                        <p className='text-sm text-muted-foreground'>
                          清除所有系统缓存，可能会临时影响性能
                        </p>
                      </div>
                      <Button variant='outline' size='sm'>
                        <RefreshCw className='w-4 h-4 mr-2' />
                        清除缓存
                      </Button>
                    </div>

                    <div className='flex items-center justify-between p-4 border border-border rounded-lg'>
                      <div>
                        <h4 className='font-medium'>重建索引</h4>
                        <p className='text-sm text-muted-foreground'>
                          重新构建搜索索引，提高搜索性能
                        </p>
                      </div>
                      <Button variant='outline' size='sm'>
                        <Database className='w-4 h-4 mr-2' />
                        重建索引
                      </Button>
                    </div>

                    <div className='flex items-center justify-between p-4 border border-destructive rounded-lg'>
                      <div>
                        <h4 className='font-medium text-destructive'>
                          重置系统
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          将所有设置恢复为默认值，此操作不可逆
                        </p>
                      </div>
                      <Button variant='destructive' size='sm'>
                        重置系统
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 保存按钮 */}
        <div className='flex justify-end space-x-4'>
          <Button variant='outline'>重置更改</Button>
          <Button>
            <Save className='w-4 h-4 mr-2' />
            保存设置
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
