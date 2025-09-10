import ThemeColorDemo from '@/website/components/ThemeColorDemo';
import Card from '@/website/blog/components/Card';

export default function HomePage() {
  return (
    <div className='container mx-auto'>
      <ThemeColorDemo />

      {/* 博客卡片演示 */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6 text-foreground'>
          博客卡片主题色阴影效果
        </h2>
        <p className='text-muted-foreground mb-6'>
          鼠标移入卡片查看主题色阴影效果
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}
