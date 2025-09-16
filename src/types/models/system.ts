// ==================== 系统相关类型 ====================
// 使用 Prisma 生成的类型

import { Prisma } from '@/generated/prisma';
import type { SystemConfig, ActivityLog, Like } from '@/generated/prisma';

// 重新导出基础类型
export type { SystemConfig, ActivityLog, Like };

// 导出 Prisma 生成的类型
export type SystemConfigCreateInput = Prisma.SystemConfigCreateInput;
export type SystemConfigUpdateInput = Prisma.SystemConfigUpdateInput;
export type ActivityLogCreateInput = Prisma.ActivityLogCreateInput;
export type LikeCreateInput = Prisma.LikeCreateInput;

// 查询类型
export type SystemConfigWhereInput = Prisma.SystemConfigWhereInput;
export type ActivityLogWhereInput = Prisma.ActivityLogWhereInput;
export type LikeWhereInput = Prisma.LikeWhereInput;

// 系统配置相关类型
export interface SystemConfigValue {
  string?: string;
  number?: number;
  boolean?: boolean;
  json?: any;
}

export interface SystemConfigForm {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  category?: string;
}

export interface SystemConfigGroup {
  category: string;
  configs: Array<{
    id: string;
    key: string;
    value: string;
    type: string;
    description?: string;
  }>;
}

// 预定义的系统配置键
export enum SystemConfigKey {
  // 站点基础设置
  SITE_NAME = 'site.name',
  SITE_DESCRIPTION = 'site.description',
  SITE_LOGO = 'site.logo',
  SITE_FAVICON = 'site.favicon',
  SITE_KEYWORDS = 'site.keywords',

  // SEO 设置
  SEO_TITLE_TEMPLATE = 'seo.title_template',
  SEO_DEFAULT_DESCRIPTION = 'seo.default_description',
  SEO_DEFAULT_KEYWORDS = 'seo.default_keywords',
  SEO_GOOGLE_ANALYTICS = 'seo.google_analytics',
  SEO_GOOGLE_SEARCH_CONSOLE = 'seo.google_search_console',

  // 评论设置
  COMMENT_MODERATION = 'comment.moderation',
  COMMENT_GUEST_ALLOWED = 'comment.guest_allowed',
  COMMENT_MAX_LENGTH = 'comment.max_length',
  COMMENT_SPAM_PROTECTION = 'comment.spam_protection',

  // 邮件设置
  EMAIL_SMTP_HOST = 'email.smtp_host',
  EMAIL_SMTP_PORT = 'email.smtp_port',
  EMAIL_SMTP_USER = 'email.smtp_user',
  EMAIL_SMTP_PASSWORD = 'email.smtp_password',
  EMAIL_FROM_ADDRESS = 'email.from_address',
  EMAIL_FROM_NAME = 'email.from_name',

  // 上传设置
  UPLOAD_MAX_SIZE = 'upload.max_size',
  UPLOAD_ALLOWED_TYPES = 'upload.allowed_types',
  UPLOAD_STORAGE_TYPE = 'upload.storage_type',
  UPLOAD_S3_BUCKET = 'upload.s3_bucket',
  UPLOAD_S3_REGION = 'upload.s3_region',

  // 缓存设置
  CACHE_ENABLED = 'cache.enabled',
  CACHE_TTL = 'cache.ttl',
  CACHE_REDIS_URL = 'cache.redis_url',

  // 安全设置
  SECURITY_RATE_LIMIT = 'security.rate_limit',
  SECURITY_CORS_ORIGINS = 'security.cors_origins',
  SECURITY_CSP_ENABLED = 'security.csp_enabled',
}

// 活动日志相关类型
export interface ActivityLogDetail {
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  createdAt: Date;
}

export enum ActivityAction {
  // 用户操作
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_REGISTER = 'user.register',
  USER_UPDATE_PROFILE = 'user.update_profile',
  USER_CHANGE_PASSWORD = 'user.change_password',
  USER_DELETE_ACCOUNT = 'user.delete_account',

  // 文章操作
  POST_CREATE = 'post.create',
  POST_UPDATE = 'post.update',
  POST_DELETE = 'post.delete',
  POST_PUBLISH = 'post.publish',
  POST_UNPUBLISH = 'post.unpublish',
  POST_VIEW = 'post.view',

  // 评论操作
  COMMENT_CREATE = 'comment.create',
  COMMENT_UPDATE = 'comment.update',
  COMMENT_DELETE = 'comment.delete',
  COMMENT_APPROVE = 'comment.approve',
  COMMENT_REJECT = 'comment.reject',
  COMMENT_MARK_SPAM = 'comment.mark_spam',

  // 点赞操作
  LIKE_ADD = 'like.add',
  LIKE_REMOVE = 'like.remove',

  // 关注操作
  FOLLOW_USER = 'follow.user',
  UNFOLLOW_USER = 'unfollow.user',

  // 管理员操作
  ADMIN_LOGIN = 'admin.login',
  ADMIN_UPDATE_CONFIG = 'admin.update_config',
  ADMIN_MANAGE_USER = 'admin.manage_user',
  ADMIN_MODERATE_CONTENT = 'admin.moderate_content',
}

export enum ActivityResource {
  USER = 'user',
  POST = 'post',
  COMMENT = 'comment',
  CATEGORY = 'category',
  TAG = 'tag',
  LIKE = 'like',
  FOLLOW = 'follow',
  SYSTEM_CONFIG = 'system_config',
}

// 点赞相关类型
export interface LikeTarget {
  type: 'post' | 'comment';
  id: string;
}

// 扩展的系统类型 - 使用 Prisma 的 GetPayload
export type ActivityLogWithUser = Prisma.ActivityLogGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
  };
}>;

export type LikeWithTarget = Prisma.LikeGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
    post: {
      select: {
        id: true;
        title: true;
        slug: true;
      };
    };
    comment: {
      select: {
        id: true;
        content: true;
        post: {
          select: {
            id: true;
            title: true;
            slug: true;
          };
        };
      };
    };
  };
}>;

// 系统统计类型
export interface SystemStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  posts: {
    total: number;
    published: number;
    draft: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    totalViews: number;
    totalLikes: number;
  };
  comments: {
    total: number;
    approved: number;
    pending: number;
    spam: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  engagement: {
    avgViewsPerPost: number;
    avgLikesPerPost: number;
    avgCommentsPerPost: number;
    activeUsersToday: number;
    activeUsersThisWeek: number;
    bounceRate: number;
  };
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message?: string;
    responseTime?: number;
  }>;
  uptime: number;
  version: string;
  environment: string;
}

// 通知相关类型
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  sms: boolean;
}

export interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  icon?: string;
  action?: {
    label: string;
    url: string;
  };
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// 备份和维护类型
export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental';
  size: number;
  path: string;
  createdAt: Date;
  status: 'completed' | 'failed' | 'in_progress';
}

export interface MaintenanceMode {
  enabled: boolean;
  message?: string;
  allowedIps?: string[];
  startTime?: Date;
  endTime?: Date;
}
