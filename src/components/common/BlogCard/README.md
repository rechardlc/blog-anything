# CommonCard 通用卡片组件

基于 SnowUI 设计理念和 shadcn/ui 构建的功能强大的通用卡片组件系统。

## 特性

- 🎨 **6种视觉变体**: default, elevated, outlined, glass, gradient, minimal
- 📏 **4种尺寸规格**: sm, md, lg, xl
- 🎭 **丰富的交互效果**: 悬停动画、点击反馈、状态变化
- 🧩 **模块化设计**: 可单独使用头部、内容、底部组件
- 🌙 **深色模式支持**: 完全适配明暗主题切换
- ♿ **无障碍友好**: 符合 WCAG 标准的可访问性

## 快速开始

```tsx
import { FullCard } from '@/components/common';

function Example() {
  return (
    <FullCard
      variant="elevated"
      header={{
        title: '卡片标题',
        description: '卡片描述信息',
        icon: Star,
        badge: { text: '新功能', variant: 'default' },
      }}
      content={{
        children: <div>这里是卡片内容</div>,
      }}
      footer={{
        actions: {
          primary: { text: '确认', onClick: () => console.log('确认') },
          secondary: { text: '取消', onClick: () => console.log('取消') },
        },
      }}
    />
  );
}
```

## 组件 API

### CommonCard (基础卡片)

| 属性      | 类型        | 默认值    | 描述             |
| --------- | ----------- | --------- | ---------------- |
| variant   | CardVariant | 'default' | 卡片视觉变体     |
| size      | CardSize    | 'md'      | 卡片尺寸         |
| animated  | boolean     | true      | 是否启用动画效果 |
| clickable | boolean     | false     | 是否可点击       |
| onClick   | () => void  | -         | 点击回调函数     |

### CardVariant 变体说明

- **default**: 标准边框和阴影
- **elevated**: 无边框，突出阴影效果
- **outlined**: 加粗边框，无阴影
- **glass**: 玻璃拟态效果，毛玻璃背景
- **gradient**: 品牌色渐变背景
- **minimal**: 极简风格，无边框无阴影

### CardHeaderProps (头部配置)

| 属性        | 类型       | 描述           |
| ----------- | ---------- | -------------- |
| title       | string     | 卡片标题       |
| description | string     | 卡片描述       |
| icon        | LucideIcon | 图标组件       |
| iconColor   | string     | 图标颜色样式类 |
| badge       | object     | 徽章配置       |
| actions     | ReactNode  | 头部操作按钮   |

### CardFooterProps (底部配置)

| 属性      | 类型   | 描述               |
| --------- | ------ | ------------------ |
| actions   | object | 主要和次要操作按钮 |
| metadata  | string | 元数据信息         |
| alignment | string | 对齐方式           |

## 使用示例

### 1. 基础用法

```tsx
import { CommonCard, CommonCardHeader, CommonCardContent } from '@/components/common';

<CommonCard variant="elevated">
  <CommonCardHeader title="基础卡片" />
  <CommonCardContent>
    <p>这是卡片内容</p>
  </CommonCardContent>
</CommonCard>;
```

### 2. 带图标和徽章

```tsx
import { Star } from 'lucide-react';

<FullCard
  header={{
    title: '特色功能',
    icon: Star,
    iconColor: 'text-yellow-500',
    badge: { text: '热门', variant: 'default' },
  }}
  content={{ children: <div>功能介绍</div> }}
/>;
```

### 3. 可点击卡片

```tsx
<CommonCard variant="outlined" clickable onClick={() => console.log('点击!')}>
  <CommonCardContent>
    <p>点击我试试</p>
  </CommonCardContent>
</CommonCard>
```

### 4. 带操作按钮

```tsx
<FullCard
  footer={{
    actions: {
      primary: {
        text: '保存',
        onClick: handleSave,
      },
      secondary: {
        text: '取消',
        onClick: handleCancel,
        variant: 'outline',
      },
    },
  }}
/>
```

## 样式定制

组件使用 Tailwind CSS 类名，支持通过 `className` 属性进行样式覆盖：

```tsx
<CommonCard className="custom-shadow hover:border-blue-500" variant="outlined">
  {/* 内容 */}
</CommonCard>
```

## 最佳实践

1. **性能优化**: 对于大量卡片渲染，考虑设置 `animated={false}`
2. **用户体验**: 可点击卡片建议添加明确的视觉提示
3. **内容层次**: 合理使用标题、描述和徽章建立信息层次
4. **操作引导**: 主要操作使用 primary 按钮，次要操作使用 secondary

## TypeScript 支持

所有组件都提供完整的 TypeScript 类型定义，支持智能提示和类型检查。

```tsx
import type { CardVariant, FullCardProps } from '@/components/common';

const config: FullCardProps = {
  variant: 'elevated', // 类型安全
  header: {
    title: '标题', // 必需属性会有提示
  },
};
```
