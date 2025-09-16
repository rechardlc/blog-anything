// ==================== 评论相关类型 ====================
// 使用 Prisma 生成的类型

import { Prisma } from '@/generated/prisma';
import type { Comment, CommentStatus } from '@/generated/prisma';

// 重新导出基础类型
export type { Comment, CommentStatus };

// 导出 Prisma 生成的类型
export type CommentCreateInput = Prisma.CommentCreateInput;
export type CommentUpdateInput = Prisma.CommentUpdateInput;

// 查询类型
export type CommentWhereInput = Prisma.CommentWhereInput;
export type CommentOrderByInput = Prisma.CommentOrderByWithRelationInput;
export type CommentInclude = Prisma.CommentInclude;
export type CommentSelect = Prisma.CommentSelect;

// 扩展的评论类型 - 使用 Prisma 的 GetPayload
export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
  };
}>;

export type CommentWithReplies = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
    replies: {
      include: {
        author: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
      };
      orderBy: {
        createdAt: 'asc';
      };
    };
    _count: {
      select: {
        likes: true;
        replies: true;
      };
    };
  };
}>;

export type CommentDetail = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        avatar: true;
        bio: true;
      };
    };
    post: {
      select: {
        id: true;
        title: true;
        slug: true;
      };
    };
    parent: {
      include: {
        author: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
      };
    };
    replies: {
      include: {
        author: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
        _count: {
          select: {
            likes: true;
            replies: true;
          };
        };
      };
      where: {
        status: 'APPROVED';
      };
      orderBy: {
        createdAt: 'asc';
      };
    };
    _count: {
      select: {
        likes: true;
        replies: true;
      };
    };
  };
}>;

// 评论表单类型
export interface CommentForm {
  content: string;
  postId: string;
  parentId?: string;
}

export interface CommentUpdateForm {
  content: string;
  status?: CommentStatus;
}

// 评论列表项类型
export interface CommentListItem {
  id: string;
  content: string;
  status: CommentStatus;
  likeCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parent?: {
    id: string;
    author: {
      username: string;
    };
  };
}

// 评论树形结构类型
export interface CommentTree {
  id: string;
  content: string;
  status: CommentStatus;
  likeCount: number;
  isLiked: boolean;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  replies: CommentTree[];
  canReply: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// 评论统计类型
export interface CommentStats {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  rejectedComments: number;
  spamComments: number;
  avgCommentsPerPost: number;
  commentsToday: number;
  commentsThisWeek: number;
  commentsThisMonth: number;
}

export interface CommentAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    date: string;
    count: number;
    approved: number;
    pending: number;
    rejected: number;
    spam: number;
  }>;
}

// 评论筛选类型
export interface CommentFilters {
  status?: CommentStatus[];
  authorId?: string;
  postId?: string;
  parentId?: string | null;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  hasReplies?: boolean;
}

export enum CommentSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  LIKE_COUNT = 'likeCount',
  AUTHOR = 'author',
  STATUS = 'status',
}

export interface CommentSort {
  field: CommentSortField;
  direction: 'asc' | 'desc';
}

// 评论审核类型
export interface CommentModerationAction {
  commentId: string;
  action: 'approve' | 'reject' | 'spam' | 'delete';
  reason?: string;
}

export interface CommentModerationResult {
  success: boolean;
  commentId: string;
  newStatus: CommentStatus;
  message?: string;
}

// 评论通知类型
export interface CommentNotification {
  id: string;
  type: 'reply' | 'mention' | 'like';
  commentId: string;
  postId: string;
  fromUser: {
    id: string;
    username: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    username: string;
  };
  isRead: boolean;
  createdAt: Date;
}

// 评论权限类型
export interface CommentPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReply: boolean;
  canLike: boolean;
  canReport: boolean;
  canModerate: boolean;
}
