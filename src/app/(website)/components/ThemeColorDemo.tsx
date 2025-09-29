'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Palette, Eye, Code, Sparkles, Layers, Zap, Heart, Star, Moon, Sun } from 'lucide-react';

/**
 * SnowUI 风格主题色演示组件
 * 展示现代化的主题色配置和交互效果
 */
export default function ThemeColorDemo() {
  const brandShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const colorPalettes = [
    { name: 'Primary', class: 'bg-primary', textClass: 'text-primary' },
    {
      name: 'Secondary',
      class: 'bg-secondary',
      textClass: 'text-secondary-foreground',
    },
    { name: 'Accent', class: 'bg-accent', textClass: 'text-accent-foreground' },
    { name: 'Muted', class: 'bg-muted', textClass: 'text-muted-foreground' },
  ];

  const statusColors = [
    { name: 'Success', class: 'bg-green-500', icon: '✓', desc: '成功状态' },
    { name: 'Warning', class: 'bg-yellow-500', icon: '⚠', desc: '警告提示' },
    { name: 'Info', class: 'bg-blue-500', icon: 'ℹ', desc: '信息展示' },
    {
      name: 'Destructive',
      class: 'bg-destructive',
      icon: '✕',
      desc: '危险操作',
    },
  ];

  return (
    <div className="space-y-12 p-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-700">
          <Palette className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <span className="text-sm font-medium text-brand-700 dark:text-brand-300">SnowUI Design System</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-200 bg-clip-text text-transparent">
          主题色彩系统演示
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          探索现代化的色彩配置方案，体验流畅的交互动效和精致的视觉设计
        </p>
      </div>

      {/* 核心主题色 */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">核心主题色</CardTitle>
              <CardDescription className="text-brand-100">
                系统核心色彩配置，支持明暗主题自动切换
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorPalettes.map((color, index) => (
              <div
                key={color.name}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div
                    className={cn(
                      'w-full h-20 rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl',
                      color.class,
                    )}
                  ></div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">{color.name}</h4>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {color.class}
                    </Badge>
                    <p className={cn('text-sm', color.textClass)}>示例文本颜色</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 品牌色谱 */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">品牌色谱系统</CardTitle>
              <CardDescription className="text-purple-100">
                完整的色彩梯度，从浅到深的11级配色方案
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-11 gap-2">
              {brandShades.map((shade, index) => (
                <div
                  key={shade}
                  className="group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-3">
                    <div
                      className={cn(
                        'h-16 w-full rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:z-10 relative',
                        `bg-brand-${shade}`,
                      )}
                      style={{ backgroundColor: `hsl(var(--brand-${shade}))` }}
                    ></div>
                    <div className="text-center">
                      <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{shade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <Badge variant="outline" className="font-mono">
                <Code className="h-3 w-3 mr-1" />
                bg-brand-500
              </Badge>
              <Badge variant="outline" className="font-mono">
                <Eye className="h-3 w-3 mr-1" />
                text-brand-600
              </Badge>
              <Badge variant="outline" className="font-mono">
                <Zap className="h-3 w-3 mr-1" />
                border-brand-300
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 状态色系统 */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">状态色系统</CardTitle>
              <CardDescription className="text-emerald-100">
                语义化的状态色彩，传达明确的用户反馈信息
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statusColors.map((status, index) => (
              <div
                key={status.name}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div
                    className={cn(
                      'h-24 w-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 group-hover:scale-105',
                      status.class,
                    )}
                  >
                    {status.icon}
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-lg">{status.name}</h4>
                    <p className="text-sm text-muted-foreground">{status.desc}</p>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {status.class}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 交互组件演示 */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">交互组件演示</CardTitle>
              <CardDescription className="text-indigo-100">基于主题色的按钮组件和交互状态</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* 按钮组 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                按钮样式
              </h4>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  主要按钮
                </Button>
                <Button variant="secondary" size="lg">
                  <Sun className="h-4 w-4 mr-2" />
                  次要按钮
                </Button>
                <Button variant="outline" size="lg">
                  <Moon className="h-4 w-4 mr-2" />
                  边框按钮
                </Button>
                <Button variant="ghost" size="lg">
                  <Eye className="h-4 w-4 mr-2" />
                  幽灵按钮
                </Button>
                <Button variant="destructive" size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  危险按钮
                </Button>
              </div>
            </div>

            {/* 尺寸变化 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">按钮尺寸</h4>
              <div className="flex items-center gap-4">
                <Button size="sm" variant="outline">
                  小型
                </Button>
                <Button size="default" variant="outline">
                  默认
                </Button>
                <Button size="lg" variant="outline">
                  大型
                </Button>
              </div>
            </div>

            {/* 特殊效果 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">特殊效果</h4>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Sparkles className="h-4 w-4 mr-2" />
                  渐变按钮
                </Button>
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  极简风格
                </Button>
                <Button className="bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Star className="h-4 w-4 mr-2" />
                  悬浮效果
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 使用指南 */}
      <Card className="border-2 border-dashed border-brand-300 dark:border-brand-600 bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900 dark:to-brand-800">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-200 dark:bg-brand-700">
              <Code className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">快速开始</span>
            </div>
            <h3 className="text-xl font-bold text-brand-800 dark:text-brand-200">开始使用 SnowUI 主题系统</h3>
            <p className="text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
              复制上述任意样式类名，即可在您的项目中应用相同的设计效果。 所有颜色都支持明暗主题自动切换。
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Badge className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2">Tailwind CSS v3</Badge>
              <Badge className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2">CSS Variables</Badge>
              <Badge className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2">Dark Mode Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
