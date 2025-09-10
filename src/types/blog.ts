/**
 * 博客相关的 TypeScript 类型定义
 */

// 作者信息
export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// 博客文章
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: Author;
  readTime: string;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  coverImage?: string;
  metaDescription?: string;
  seoKeywords?: string[];
}

// 文章摘要（用于列表显示）
export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  coverImage?: string;
}

// 分类
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  postCount: number;
}

// 标签
export interface Tag {
  id: string;
  slug: string;
  name: string;
  description?: string;
  postCount: number;
  color?: string;
}

// 分页信息
export interface Pagination {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API 响应基础结构
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 文章列表响应
export interface PostsResponse {
  posts: BlogPostSummary[];
  pagination: Pagination;
  meta: {
    total: number;
    filtered: boolean;
  };
}

// 搜索结果
export interface SearchResult {
  posts: BlogPostSummary[];
  total: number;
  query: string;
  suggestions?: string[];
}

// 评论（可选功能）
export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  publishedAt: string;
  parentId?: string; // 用于回复
  likes: number;
  replies?: Comment[];
}

// 网站配置
export interface SiteConfig {
  title: string;
  description: string;
  author: Author;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
  navigation: NavigationItem[];
  footer: {
    copyright: string;
    links: NavigationItem[];
  };
}

// 导航项
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavigationItem[];
}

// 主题配置
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontFamily: string;
}

// 表单数据类型
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SubscribeFormData {
  email: string;
  name?: string;
}

export interface SearchFormData {
  query: string;
  category?: string;
  tags?: string[];
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// 加载状态
export interface LoadingState {
  loading: boolean;
  error?: AppError;
}

// 文章统计
export interface PostStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  popularPosts: BlogPostSummary[];
  recentPosts: BlogPostSummary[];
  topTags: Tag[];
}
