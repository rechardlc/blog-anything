import { ReactNode } from 'react';
import Header from '@/website/components/layout/Header';
import Footer from '@/website/components/layout/Footer';

/**
 * 前台页面布局组件
 * 为所有前台页面提供统一的布局结构
 */

interface FrontLayoutProps {
  children: ReactNode;
}

export default function FrontLayout({ children }: FrontLayoutProps) {
  return (
    <div className='min-h-screen mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-6xl xl:px-0 transition-all duration-300 ease-out'>
      <div className='min-h-screen flex flex-col animate-theme-fade'>
        <Header />
        <main className='py-8 flex-1'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
