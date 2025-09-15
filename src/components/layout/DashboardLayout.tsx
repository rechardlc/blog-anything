'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Menu,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Home,
  Bell,
  Search,
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: '仪表板',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: '文章管理',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: '系统设置',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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

  const SidebarContent = () => (
    <div className='flex h-full flex-col overflow-y-auto glass border-r'>
      <div className='flex h-16 shrink-0 items-center px-6'>
        <Link
          href='/admin'
          className='flex items-center space-x-2 font-bold text-xl'
        >
          <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-sm'>B</span>
          </div>
          <span className='hidden lg:block'>Blog-Any</span>
        </Link>
      </div>
      <nav className='flex-1 px-4 pb-4'>
        <ul className='sidebar-nav'>
          {navigation.map(item => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`sidebar-nav-item group ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <TooltipProvider>
      <div className='flex h-screen bg-background'>
        {/* 桌面端侧边栏 */}
        <div className='hidden lg:flex lg:w-64 lg:flex-col'>
          <SidebarContent />
        </div>

        {/* 移动端侧边栏 */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side='left' className='w-64 p-0'>
            <SidebarContent />
          </SheetContent>

          {/* 主内容区域 */}
          <div className='flex flex-1 flex-col overflow-hidden'>
            {/* 顶部导航栏 */}
            <header className='glass border-b px-4 lg:px-6'>
              <div className='flex h-16 items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <SheetTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='lg:hidden'
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Menu className='h-5 w-5' />
                    </Button>
                  </SheetTrigger>

                  <div className='hidden md:flex items-center space-x-2'>
                    <Search className='h-4 w-4 text-muted-foreground' />
                    <input
                      type='text'
                      placeholder='搜索...'
                      className='snow-input w-64 h-8'
                    />
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  {/* 主题切换 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={toggleTheme}
                        className='h-9 w-9'
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

                  {/* 通知按钮 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-9 w-9 relative'
                        onClick={() =>
                          setNotificationPanelOpen(!notificationPanelOpen)
                        }
                      >
                        <Bell className='h-4 w-4' />
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center'>
                          <span className='text-[10px] text-white font-bold'>
                            3
                          </span>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>通知 (3 条新消息)</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* 返回前台 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        asChild
                        className='h-9 w-9'
                      >
                        <Link href='/'>
                          <Home className='h-4 w-4' />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>返回前台</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* 用户菜单 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='relative h-9 w-9 rounded-full'
                      >
                        <Avatar className='h-9 w-9'>
                          <AvatarImage src='/avatar.jpg' alt='管理员' />
                          <AvatarFallback>管</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className='w-56'
                      align='end'
                      forceMount
                    >
                      <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                          <p className='text-sm font-medium leading-none'>
                            管理员
                          </p>
                          <p className='text-xs leading-none text-muted-foreground'>
                            admin@example.com
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href='/admin/settings'>
                          <Settings className='mr-2 h-4 w-4' />
                          <span>设置</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href='/logout'>
                          <LogOut className='mr-2 h-4 w-4' />
                          <span>退出登录</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            {/* 主内容区 */}
            <main className='flex-1 overflow-y-auto p-6'>
              <div className='mx-auto max-w-7xl'>{children}</div>
            </main>
          </div>
        </Sheet>

        {/* 通知面板 */}
        {notificationPanelOpen && (
          <div className='fixed inset-0 z-50 lg:relative lg:inset-auto'>
            <div
              className='absolute inset-0 bg-black/20 backdrop-blur-sm lg:hidden'
              onClick={() => setNotificationPanelOpen(false)}
            />
            <div className='absolute right-0 top-0 h-full lg:relative'>
              <NotificationPanel />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
