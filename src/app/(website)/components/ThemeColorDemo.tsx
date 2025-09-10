'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * 主题色演示组件
 * 展示如何使用 Tailwind CSS v3 的主题色配置
 */
export default function ThemeColorDemo() {
  return (
    <div className='space-y-8 p-6'>
      <div>
        <h2 className='text-2xl font-bold mb-4 text-foreground'>
          Tailwind CSS v3 主题色演示
        </h2>
        <p className='text-muted-foreground mb-6'>
          以下展示了不同的主题色配置和使用方式
        </p>
      </div>

      {/* 基础主题色 */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>基础主题色</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-primary rounded-lg'></div>
            <p className='text-sm text-center'>Primary</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-primary
            </code>
          </div>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-secondary rounded-lg'></div>
            <p className='text-sm text-center'>Secondary</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-secondary
            </code>
          </div>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-accent rounded-lg'></div>
            <p className='text-sm text-center'>Accent</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-accent
            </code>
          </div>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-muted rounded-lg'></div>
            <p className='text-sm text-center'>Muted</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-muted
            </code>
          </div>
        </div>
      </Card>

      {/* 自定义品牌色 */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>自定义品牌色 (Brand)</h3>
        <div className='grid grid-cols-5 md:grid-cols-11 gap-2'>
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
            <div key={shade} className='space-y-2'>
              <div
                className={`w-full h-12 rounded-lg bg-brand-${shade}`}
                style={{ backgroundColor: `hsl(var(--brand-${shade}))` }}
              ></div>
              <p className='text-xs text-center'>{shade}</p>
            </div>
          ))}
        </div>
        <div className='mt-4 text-sm text-muted-foreground'>
          <p>
            使用方式:{' '}
            <code className='bg-muted px-2 py-1 rounded'>bg-brand-500</code>
          </p>
          <p>
            主色调:{' '}
            <code className='bg-muted px-2 py-1 rounded'>text-brand-500</code>
          </p>
        </div>
      </Card>

      {/* 状态色 */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>状态色</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-success rounded-lg'></div>
            <p className='text-sm text-center'>Success</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-success
            </code>
          </div>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-warning rounded-lg'></div>
            <p className='text-sm text-center'>Warning</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-warning
            </code>
          </div>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-info rounded-lg'></div>
            <p className='text-sm text-center'>Info</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-info
            </code>
          </div>
          <div className='space-y-2'>
            <div className='w-full h-16 bg-destructive rounded-lg'></div>
            <p className='text-sm text-center'>Destructive</p>
            <code className='text-xs bg-muted px-2 py-1 rounded block text-center'>
              bg-destructive
            </code>
          </div>
        </div>
      </Card>

      {/* 按钮示例 */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>按钮组件示例</h3>
        <div className='flex flex-wrap gap-4'>
          <Button variant='default'>Primary Button</Button>
          <Button variant='secondary'>Secondary Button</Button>
          <Button variant='outline'>Outline Button</Button>
          <Button variant='ghost'>Ghost Button</Button>
          <Button variant='destructive'>Destructive Button</Button>
        </div>
      </Card>
    </div>
  );
}
