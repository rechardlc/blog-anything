import Link from 'next/link';
import { cn } from '@/lib/utils';
export type Nav = {
  name: string;
  href: string;
  id: string;
  active: boolean;
};
type Props = {
  navsList: Nav[];
  handleNavClick: (id: string) => void;
};

/**
 * 获取随机位置
 */
const getPosition = () => {
  const positions = ['top', 'left', 'right', 'bottom'];
  return positions[Math.floor(Math.random() * positions.length)];
};

const Navs = (props: Props) => {
  return (
    <div className='flex items-center space-x-4 md:space-x-4'>
      {props.navsList.map(nav => {
        return (
          <Link
            key={nav.id}
            href={nav.href}
            onClick={() => props.handleNavClick(nav.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-500',
              'rounded-[8px] overflow-hidden hover:text-zinc-900 hover:before:block',
              'dark:hover:text-zinc-50 transition-colors duration-200',
              nav.active && 'dark:text-zinc-50 text-zinc-900 before:!block',
              'whitespace-nowrap hover:scale-105 relative',
              "before:content-[''] before:absolute before:h-[200%] before:w-[200%]",
              'before:bg-zinc-800 dark:before:bg-zinc-100 before:-z-10',
              `before:top-[50%] before:left-[50%] before:origin-top-left`,
              'before:animate-spin-constant-slow before:hidden',
              "after:content-[''] after:absolute after:inset-[2px] after:bg-zinc-50",
              'after:rounded-[inherit] after:-z-[1] after:dark:bg-zinc-800'
            )}
          >
            {nav.name}
          </Link>
        );
      })}
    </div>
  );
};

export default Navs;
