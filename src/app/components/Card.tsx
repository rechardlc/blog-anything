import {
  Card,
  //   CardActions,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
export default function Comp() {
  const card = {
    title: 'Card Title',
    description: 'Card Description',
    publishTime: '2023-01-01',
    content:
      '本文系统拆解了费曼学习法的理论根基与实践路径，从认知科学的三大支柱（建构主义、认知负荷理论、双环学习）到 “选题聚焦 — 模拟教学 — 漏洞回填 — 简化压缩” 的四步闭环机制，深入解析其跨学科应用场景（从量子力学到诗歌赏析），并结合 AI、VR 等现代技术探讨落地创新。同时，提供了不同教育阶段的实践指南、避坑策略、模板案例及未来展望，全方位呈现这一以 “教别人 = 深度学习” 为核心的高效学习方法论，助力读者实现从被动接收到主动创造的学习跃迁。',
  };
  return (
    <Card className="min-w-40 cursor-pointer transition-all duration-300 ease-out hover:shadow-brand-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] group">
      <CardHeader className="flex-col items-start gap-2">
        <CardTitle
          className={cn(
            'pb-2 transition-colors duration-300 ease-out group-hover:text-brand-500 relative',
            'after:absolute after:content-[""] after:w-0 after:bottom-0 after:left-0 after:h-[1px] after:bg-brand-500',
            'after:group-hover:w-full after:transition-all after:duration-500 after:ease-out',
          )}
        >
          {card.title}
        </CardTitle>
        <CardDescription className="text-xs">{card.description}</CardDescription>
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent>
        <span
          className={cn(
            'bg-gradient-to-r from-brand-300 to-brand-300 bg-[length:0px_2px] bg-no-repeat',
            'bg-right-bottom group-hover:bg-[length:100%_2px] duration-1000 ease-out',
            'group-hover:bg-left-bottom leading-loose transition-[background-size]',
            'dark:from-brand-700 dark:to-brand-700',
          )}
        >
          {card.content}
        </span>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-right w-full dark:text-zinc-300 text-zinc-700">{card.publishTime}</p>
      </CardFooter>
    </Card>
  );
}
