// ==================== 用户相关类型 ====================
// 使用 Prisma 生成的类型

import { Prisma } from '@/generated/prisma';
import type { User, UserSettings, Follow } from '@/generated/prisma';

// 重新导出基础类型
export type { User, UserSettings, Follow };

// 导出 Prisma 生成的类型
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserSettingsCreateInput = Prisma.UserSettingsCreateInput;
export type UserSettingsUpdateInput = Prisma.UserSettingsUpdateInput;

// 查询类型
export type UserWhereInput = Prisma.UserWhereInput;
export type UserOrderByInput = Prisma.UserOrderByWithRelationInput;
export type UserInclude = Prisma.UserInclude;
export type UserSelect = Prisma.UserSelect;

// 扩展的用户类型 - 使用 Prisma 的 GetPayload
export type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

export type UserWithSettings = Prisma.UserGetPayload<{
  include: { settings: true };
}>;

export type UserWithFollowers = Prisma.UserGetPayload<{
  include: {
    followers: { include: { follower: true } };
    follows: { include: { following: true } };
  };
}>;

export type UserProfile = Prisma.UserGetPayload<{
  include: {
    settings: true;
    _count: {
      select: {
        posts: true;
        followers: true;
        follows: true;
      };
    };
  };
}>;

// 用户统计类型
export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  commentsCount: number;
}

// 用户搜索结果类型
export interface UserSearchResult {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
  mutualFollowers: number;
}

// 用户认证相关类型
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
}

// 用户设置表单类型
export interface UserSettingsForm {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  commentNotifications: boolean;
  likeNotifications: boolean;
  followNotifications: boolean;
  profilePublic: boolean;
  showEmail: boolean;
  showLocation: boolean;
}

// 用户资料表单类型
export interface UserProfileForm {
  username: string;
  email: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: string;
}

// 关注状态枚举
export enum FollowStatus {
  NOT_FOLLOWING = 'not_following',
  FOLLOWING = 'following',
  MUTUAL = 'mutual',
}

// 用户在线状态
export enum UserOnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
}

// 用户操作权限
export interface UserPermissions {
  canEditProfile: boolean;
  canDeleteAccount: boolean;
  canChangePassword: boolean;
  canManagePosts: boolean;
  canManageComments: boolean;
}

// 导出常用的查询选择器
export const userBasicSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  bio: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const userProfileSelect = {
  ...userBasicSelect,
  website: true,
  location: true,
  isEmailVerified: true,
  settings: true,
  _count: {
    select: {
      posts: true,
      followers: true,
      follows: true,
    },
  },
} satisfies Prisma.UserSelect;

export const userWithStatsInclude = {
  settings: true,
  _count: {
    select: {
      posts: true,
      comments: true,
      likes: true,
      followers: true,
      follows: true,
    },
  },
} satisfies Prisma.UserInclude;
