/**
 * Header 组件
 * 网站头部导航组件
 */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config } from '@/lib/env';
import Image from 'next/image';
import NavsList, { type Nav } from '@/website/components/layout/NavsList';
import Search from '@/website/components/Search';
import SwitchMode from '@/website/components/SwitchMode';
import { generateId } from '@/lib/utils';
export default function Header() {
  const [navsList, setNavsList] = useState<Nav[]>([]);
  const navs: Nav[] = [
    // { name: 'Home', href: '/', id: generateId() },
    { name: 'Blog', href: '/blog', id: generateId(), active: false },
    { name: 'Projects', href: '/projects', id: generateId(), active: false },
    { name: 'Contact', href: '/contact', id: generateId(), active: false },
    { name: 'More', href: '/more', id: generateId(), active: false },
  ];
  const handleNavClick = (id: string) => {
    setNavsList(navsList.map(n => ({ ...n, active: n.id === id })));
  };
  useEffect(() => {
    setNavsList(navs);
  }, []);
  return (
    <nav
      className='flex items-center justify-between py-4 md:py-6 px-4 md:px-6 
                    max-w-7xl mx-auto bg-background/80 backdrop-blur-sm w-full'
    >
      <div className='flex items-center space-x-3 cursor-pointer flex-shrink-0'>
        <Image
          src='/avatar.jpg'
          alt='Avatar'
          width={40}
          height={40}
          className='
                     hover:animate-spin-accelerate
                     cursor-pointer rounded'
        />
        <Link
          href='/'
          className='text-lg font-medium text-zinc-900 dark:text-zinc-100 
                        whitespace-nowrap transition-all 
                      duration-200 hover:scale-105'
        >
          Richard Blog
        </Link>
      </div>
      <div className='flex-shrink-0 ml-4 flex items-center'>
        <NavsList navsList={navsList} handleNavClick={handleNavClick} />
        <Search />
        <SwitchMode />
      </div>
    </nav>
  );
}
