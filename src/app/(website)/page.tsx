import ThemeColorDemo from '@/website/components/ThemeColorDemo';
import Card from '@/app/components/Card';
import CardExamples from '@/components/common/BlogCard/CardExamples';

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <ThemeColorDemo />

      {/* 博客卡片演示 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">博客卡片主题色阴影效果</h2>
        <p className="text-muted-foreground mb-6">鼠标移入卡片查看主题色阴影效果</p>
        <h2 className="text-2xl font-bold mb-6 text-foreground">卡片组件演示</h2>
        <CardExamples />
      </div>
    </div>
  );
}
