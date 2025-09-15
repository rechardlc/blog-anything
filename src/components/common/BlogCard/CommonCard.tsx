import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// 卡片变体类型
export type CardVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'glass'
  | 'gradient'
  | 'minimal';

// 卡片尺寸类型
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

// 基础属性接口
export interface CommonCardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
  animated?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// 头部属性接口
export interface CardHeaderProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: React.ReactNode;
}

// 内容属性接口
export interface CardContentProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// 底部属性接口
export interface CardFooterProps {
  children?: React.ReactNode;
  actions?: {
    primary?: {
      text: string;
      onClick: () => void;
      loading?: boolean;
      disabled?: boolean;
    };
    secondary?: {
      text: string;
      onClick: () => void;
      variant?: 'outline' | 'ghost';
    };
  };
  metadata?: string;
  alignment?: 'left' | 'center' | 'right' | 'between';
}

// 完整的卡片属性接口
export interface FullCardProps extends CommonCardProps {
  header?: CardHeaderProps;
  content?: CardContentProps;
  footer?: CardFooterProps;
}

// 卡片变体样式映射
const cardVariantClasses: Record<CardVariant, string> = {
  default: 'border bg-background shadow-sm',
  elevated:
    'border-0 bg-background shadow-lg hover:shadow-xl transition-shadow duration-300',
  outlined:
    'border-2 bg-background shadow-none hover:border-brand-300 dark:hover:border-brand-600',
  glass:
    'border border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-lg',
  gradient:
    'border-0 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900 dark:to-brand-800 shadow-lg',
  minimal: 'border-0 bg-transparent shadow-none',
};

// 卡片尺寸样式映射
const cardSizeClasses: Record<CardSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

// 内容内边距样式映射
const contentPaddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

// 底部对齐样式映射
const footerAlignmentClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
};

/**
 * SnowUI 风格的通用卡片组件
 * 基于 shadcn/ui Card 组件构建，提供丰富的变体和配置选项
 */
export function CommonCard({
  children,
  className,
  variant = 'default',
  size = 'md',
  animated = true,
  clickable = false,
  onClick,
  ...props
}: CommonCardProps) {
  const baseClasses = cn(
    'transition-all duration-300 ease-out',
    cardVariantClasses[variant],
    cardSizeClasses[size],
    {
      'hover:-translate-y-1 hover:scale-[1.02] cursor-pointer': clickable,
      'transform-gpu': animated,
      'active:scale-[0.98]': clickable,
    },
    className
  );

  return (
    <Card
      className={baseClasses}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </Card>
  );
}

/**
 * 卡片头部组件
 */
export function CommonCardHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'text-brand-500',
  badge,
  actions,
}: CardHeaderProps) {
  return (
    <CardHeader className='space-y-3'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3 flex-1'>
          {Icon && (
            <div
              className={cn(
                'p-2 rounded-lg bg-brand-100 dark:bg-brand-800',
                iconColor
              )}
            >
              <Icon className='h-5 w-5' />
            </div>
          )}
          <div className='space-y-1 flex-1'>
            {title && (
              <div className='flex items-center gap-2'>
                <CardTitle className='text-lg font-semibold leading-tight'>
                  {title}
                </CardTitle>
                {badge && (
                  <Badge
                    variant={badge.variant || 'default'}
                    className='text-xs'
                  >
                    {badge.text}
                  </Badge>
                )}
              </div>
            )}
            {description && (
              <CardDescription className='text-sm text-muted-foreground leading-relaxed'>
                {description}
              </CardDescription>
            )}
          </div>
        </div>
        {actions && <div className='flex items-center gap-2'>{actions}</div>}
      </div>
    </CardHeader>
  );
}

/**
 * 卡片内容组件
 */
export function CommonCardContent({
  children,
  padding = 'md',
}: CardContentProps) {
  return (
    <CardContent className={cn(contentPaddingClasses[padding])}>
      {children}
    </CardContent>
  );
}

/**
 * 卡片底部组件
 */
export function CommonCardFooter({
  children,
  actions,
  metadata,
  alignment = 'between',
}: CardFooterProps) {
  if (children) {
    return <CardFooter>{children}</CardFooter>;
  }

  return (
    <CardFooter
      className={cn(
        'flex items-center gap-4',
        footerAlignmentClasses[alignment]
      )}
    >
      {metadata && (
        <span className='text-xs text-muted-foreground font-medium'>
          {metadata}
        </span>
      )}
      {actions && (
        <div className='flex items-center gap-2 ml-auto'>
          {actions.secondary && (
            <Button
              variant={actions.secondary.variant || 'outline'}
              size='sm'
              onClick={actions.secondary.onClick}
            >
              {actions.secondary.text}
            </Button>
          )}
          {actions.primary && (
            <Button
              size='sm'
              onClick={actions.primary.onClick}
              disabled={actions.primary.disabled}
              className='bg-brand-500 hover:bg-brand-600'
            >
              {actions.primary.loading ? '加载中...' : actions.primary.text}
            </Button>
          )}
        </div>
      )}
    </CardFooter>
  );
}

/**
 * 完整的卡片组件 - 包含所有部分
 */
export function FullCard({
  header,
  content,
  footer,
  ...cardProps
}: FullCardProps) {
  return (
    <CommonCard {...cardProps}>
      {header && <CommonCardHeader {...header} />}
      {content && <CommonCardContent {...content} />}
      {footer && <CommonCardFooter {...footer} />}
    </CommonCard>
  );
}

// 导出所有组件
export default CommonCard;
