import SessionProvider from '@/components/providers/SessionProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | 后台管理 - Blog-Any',
    default: '后台管理 - Blog-Any',
  },
};

/**
 * Dashboard 布局组件
 * 提供基础的元数据配置，具体布局由各个页面自己处理
 */
export default function BackLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
