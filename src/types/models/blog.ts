// ==================== 博客相关类型 ====================
// 使用 Prisma 生成的类型

import { Prisma } from '@/generated/prisma';
import type {
  Post,
  Category,
  Tag,
  PostCategory,
  PostTag,
  PostStatus,
  PostVisibility,
} from '@/generated/prisma';

// 重新导出基础类型
export type { Post, Category, Tag, PostCategory, PostTag, PostStatus, PostVisibility };

// 导出 Prisma 生成的类型
export type PostCreateInput = Prisma.PostCreateInput;
export type PostUpdateInput = Prisma.PostUpdateInput;
export type CategoryCreateInput = Prisma.CategoryCreateInput;
export type CategoryUpdateInput = Prisma.CategoryUpdateInput;
export type TagCreateInput = Prisma.TagCreateInput;
export type TagUpdateInput = Prisma.TagUpdateInput;

// 查询类型
export type PostWhereInput = Prisma.PostWhereInput;
export type PostOrderByInput = Prisma.PostOrderByWithRelationInput;
export type PostInclude = Prisma.PostInclude;
export type PostSelect = Prisma.PostSelect;

// 扩展的博客类型 - 使用 Prisma 的 GetPayload
export type PostWithAuthor = Prisma.PostGetPayload<{
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

export type PostWithCategories = Prisma.PostGetPayload<{
  include: {
    categories: {
      include: { category: true };
    };
  };
}>;

export type PostWithTags = Prisma.PostGetPayload<{
  include: {
    tags: {
      include: { tag: true };
    };
  };
}>;

export type PostDetail = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        avatar: true;
        bio: true;
      };
    };
    categories: {
      include: { category: true };
    };
    tags: {
      include: { tag: true };
    };
    comments: {
      include: {
        author: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
      };
      where: {
        status: 'APPROVED';
      };
      orderBy: {
        createdAt: 'desc';
      };
    };
    _count: {
      select: {
        likes: true;
        comments: true;
      };
    };
  };
}>;

export type CategoryWithPosts = Prisma.CategoryGetPayload<{
  include: {
    posts: {
      include: {
        post: {
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
      };
    };
    _count: {
      select: { posts: true };
    };
  };
}>;

export type CategoryHierarchy = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: true;
      };
    };
    parent: true;
  };
}>;

// 博客表单类型
export interface PostForm {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: PostStatus;
  visibility: PostVisibility;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  categoryIds: string[];
  tagIds: string[];
  publishedAt?: Date;
}

export interface CategoryForm {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
}

export interface TagForm {
  name: string;
  slug: string;
  color?: string;
}

// 博客统计类型
export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  totalLikes: number;
  percentageOfTotal: number;
}

export interface TagStats {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  percentageOfTotal: number;
}

// 博客筛选和排序
export interface PostFilters {
  status?: PostStatus[];
  visibility?: PostVisibility[];
  authorId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export enum PostSortField {
  CREATED_AT = 'createdAt',
  PUBLISHED_AT = 'publishedAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  VIEW_COUNT = 'viewCount',
  LIKE_COUNT = 'likeCount',
  COMMENT_COUNT = 'commentCount',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface PostSort {
  field: PostSortField;
  direction: SortDirection;
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostListResponse {
  posts: PostWithAuthor[];
  pagination: Pagination;
  filters: PostFilters;
  sort: PostSort;
}
