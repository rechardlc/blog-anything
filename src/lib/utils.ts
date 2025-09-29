/**
 * 通用工具函数库
 * 包含项目中常用的工具函数
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期
 * @param date - 日期字符串或 Date 对象
 * @param format - 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | Date,
  format: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('zh-CN', format).format(dateObj);
}

/**
 * 格式化相对时间
 * @param date - 日期字符串或 Date 对象
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    年: 31536000,
    月: 2592000,
    周: 604800,
    天: 86400,
    小时: 3600,
    分钟: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}前`;
    }
  }

  return '刚刚';
}

/**
 * 生成 URL slug
 * @param text - 要转换的文本
 * @returns URL 友好的 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // 替换空格和下划线为连字符
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, '') // 移除特殊字符，保留中文
    .replace(/\-\-+/g, '-') // 替换多个连字符为单个
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

/**
 * 截断文本
 * @param text - 要截断的文本
 * @param maxLength - 最大长度
 * @param suffix - 后缀
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 计算阅读时间
 * @param content - 文章内容
 * @param wordsPerMinute - 每分钟阅读字数
 * @returns 阅读时间字符串
 */
export function calculateReadTime(content: string, wordsPerMinute = 200): string {
  // 移除 HTML 标签和 Markdown 语法
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/[#*`_~\[\]()]/g, '') // 移除 Markdown 语法
    .trim();

  // 计算字符数（中文）和单词数（英文）
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;

  // 中文按字符计算，英文按单词计算
  const totalWords = chineseChars + englishWords;
  const minutes = Math.ceil(totalWords / wordsPerMinute);

  return `${minutes} 分钟阅读`;
}

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * 节流函数
 * @param func - 要节流的函数
 * @param limit - 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 深度复制对象
 * @param obj - 要复制的对象
 * @returns 复制后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const copy = {} as T;
    Object.keys(obj).forEach((key) => {
      copy[key as keyof T] = deepClone(obj[key as keyof T]);
    });
    return copy;
  }
  return obj;
}

/**
 * 生成随机 ID
 * @param length - ID 长度
 * @returns 随机 ID 字符串
 */
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证 URL 格式
 * @param url - URL 地址
 * @returns 是否为有效 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取文件扩展名
 * @param filename - 文件名
 * @returns 文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @param decimals - 小数位数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 空函数
 * 用作默认回调函数
 */
export function noop(): void {
  // 什么都不做
}
