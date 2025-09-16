# Prisma 模型业务分离使用指南

## 📖 概述

本项目采用业务领域驱动的 Prisma 模型设计，通过注释和类型分离的方式实现模型的逻辑分组。

## 🏗️ 项目结构

```
prisma/
├── schema.prisma           # 主 Schema 文件
├── models/
│   └── README.md          # 模型设计说明
└── USAGE.md              # 使用指南

src/types/models/
├── index.ts              # 统一导出
├── user.ts              # 用户相关类型
├── blog.ts              # 博客相关类型
├── comment.ts           # 评论相关类型
└── system.ts            # 系统相关类型
```

## 🚀 快速开始

### 1. 初始化数据库

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
npx prisma generate

# 推送 Schema 到数据库
npx prisma db push

# 或者创建并应用迁移
npx prisma migrate dev --name init
```

### 2. 查看数据库

```bash
# 启动 Prisma Studio
npx prisma studio
```

### 3. 使用类型定义

```typescript
import { User, Post, Comment } from '@/types/models';

// 创建用户
const createUser = async (data: UserCreateInput): Promise<User> => {
  return await prisma.user.create({ data });
};

// 获取用户资料
const getUserProfile = async (id: string): Promise<UserProfile | null> => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      settings: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          follows: true,
        },
      },
    },
  });
};
```

## 🔄 业务模型说明

### 1. 用户领域 (User Domain)

**核心模型**:

- `User` - 用户基础信息
- `UserSettings` - 用户个性化设置
- `Follow` - 用户关注关系

**关键特性**:

- 支持邮箱验证
- 丰富的用户设置选项
- 关注/被关注关系管理

```typescript
// 用户注册示例
const registerUser = async (userData: UserCreateInput) => {
  const user = await prisma.user.create({
    data: {
      ...userData,
      settings: {
        create: {
          theme: 'system',
          language: 'zh-CN',
        },
      },
    },
    include: {
      settings: true,
    },
  });
  return user;
};
```

### 2. 博客领域 (Blog Domain)

**核心模型**:

- `Post` - 博客文章
- `Category` - 文章分类（支持层级）
- `Tag` - 文章标签
- `PostCategory` / `PostTag` - 多对多关联

**关键特性**:

- 文章状态管理（草稿/发布/归档/删除）
- 可见性控制（公开/私有/不列出）
- SEO 优化字段
- 分类层级结构

```typescript
// 发布文章示例
const publishPost = async (postData: PostCreateInput) => {
  const post = await prisma.post.create({
    data: {
      ...postData,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      categories: {
        create: postData.categoryIds?.map(categoryId => ({
          category: { connect: { id: categoryId } },
        })),
      },
      tags: {
        create: postData.tagIds?.map(tagId => ({
          tag: { connect: { id: tagId } },
        })),
      },
    },
    include: {
      author: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
  return post;
};
```

### 3. 评论领域 (Comment Domain)

**核心模型**:

- `Comment` - 评论内容
- `CommentStatus` - 评论状态枚举

**关键特性**:

- 层级评论（回复功能）
- 评论审核机制
- 反垃圾评论（IP/UA 记录）

```typescript
// 添加评论示例
const addComment = async (commentData: CommentCreateInput) => {
  const comment = await prisma.comment.create({
    data: {
      ...commentData,
      status: 'PENDING', // 默认待审核
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
  return comment;
};
```

### 4. 交互领域 (Interaction Domain)

**核心模型**:

- `Like` - 点赞记录

**关键特性**:

- 支持文章和评论点赞
- 防重复点赞约束

```typescript
// 点赞功能示例
const toggleLike = async (userId: string, target: LikeTarget) => {
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      ...(target.type === 'post'
        ? { postId: target.id }
        : { commentId: target.id }),
    },
  });

  if (existingLike) {
    // 取消点赞
    await prisma.like.delete({ where: { id: existingLike.id } });
    return { action: 'removed', liked: false };
  } else {
    // 添加点赞
    await prisma.like.create({
      data: {
        userId,
        ...(target.type === 'post'
          ? { postId: target.id }
          : { commentId: target.id }),
      },
    });
    return { action: 'added', liked: true };
  }
};
```

### 5. 系统领域 (System Domain)

**核心模型**:

- `SystemConfig` - 系统配置
- `ActivityLog` - 操作日志

**关键特性**:

- 灵活的配置管理
- 完整的操作审计

```typescript
// 系统配置示例
const updateSiteConfig = async (configs: SystemConfigForm[]) => {
  const updates = configs.map(config =>
    prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {
        value: config.value,
        type: config.type,
        description: config.description,
      },
      create: config,
    })
  );

  return await prisma.$transaction(updates);
};

// 操作日志示例
const logActivity = async (activityData: ActivityLogCreateInput) => {
  return await prisma.activityLog.create({
    data: activityData,
  });
};
```

## 🔧 开发最佳实践

### 1. 模型设计原则

- **单一职责**: 每个模型专注特定业务功能
- **清晰边界**: 业务领域之间界限明确
- **可扩展性**: 支持未来功能扩展
- **一致性**: 统一的命名和设计规范

### 2. 关系设计

- 使用外键确保数据一致性
- 合理使用级联删除 (`onDelete: Cascade`)
- 重要关联使用 `onDelete: SetNull` 保留历史
- 复合唯一约束防止重复记录

### 3. 性能优化

- 为查询字段添加索引
- 使用 `select` 和 `include` 优化查询
- 避免 N+1 查询问题
- 合理使用事务处理

### 4. 类型安全

- 充分利用 TypeScript 类型系统
- 使用生成的 Prisma 类型
- 创建业务特定的类型定义
- 避免使用 `any` 类型

## 📝 迁移管理

### 添加新字段

```sql
-- 示例：为用户表添加新字段
ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP;
```

### 创建迁移

```bash
# 生成迁移文件
npx prisma migrate dev --name add_user_last_login

# 应用迁移
npx prisma migrate deploy
```

### 数据迁移

```typescript
// 数据迁移脚本示例
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUserSettings() {
  const users = await prisma.user.findMany({
    where: { settings: null },
  });

  for (const user of users) {
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        theme: 'system',
        language: 'zh-CN',
      },
    });
  }
}

migrateUserSettings()
  .then(() => {
    console.log('用户设置迁移完成');
  })
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
  });
```

## 🚨 常见问题

### Q: 如何处理循环依赖？

A: 使用 TypeScript 的类型定义解决，或者重新设计模型关系。

### Q: 如何优化查询性能？

A: 使用 `select` 精确查询，添加数据库索引，使用查询分析工具。

### Q: 如何处理软删除？

A: 添加 `deletedAt` 字段，在查询时过滤已删除记录。

### Q: 如何备份数据库？

A: 使用 `pg_dump` 或云服务的备份功能。

## 📚 相关资源

- [Prisma 官方文档](https://www.prisma.io/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs)
- [TypeScript 类型系统](https://www.typescriptlang.org/docs)
- [Next.js 数据获取](https://nextjs.org/docs/basic-features/data-fetching)
