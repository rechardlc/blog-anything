# Prisma 模型业务分离方案

## ✅ 已完成更新

**类型系统已更新为使用 Prisma 生成的实际类型**，所有临时类型定义已被替换。

## 🚨 重要说明

**Prisma 目前不支持原生的模型文件拆分**，所以我们采用在单个 `schema.prisma` 文件中通过注释进行业务领域分离的方案。

## 📋 当前模型组织结构

### 1. **用户相关模型** (User Domain)

- `User` - 用户基础信息
- `UserSettings` - 用户设置
- `Follow` - 用户关注关系

### 2. **博客相关模型** (Blog Domain)

- `Post` - 博客文章
- `Category` - 文章分类
- `Tag` - 文章标签
- `PostCategory` - 文章-分类关联
- `PostTag` - 文章-标签关联
- `PostStatus` - 文章状态枚举
- `PostVisibility` - 文章可见性枚举

### 3. **评论相关模型** (Comment Domain)

- `Comment` - 评论
- `CommentStatus` - 评论状态枚举

### 4. **互动相关模型** (Interaction Domain)

- `Like` - 点赞

### 5. **系统相关模型** (System Domain)

- `SystemConfig` - 系统配置
- `ActivityLog` - 操作日志

## 🎯 业务分离的好处

1. **清晰的边界**: 每个业务域有明确的职责
2. **易于维护**: 相关模型集中管理
3. **团队协作**: 不同团队可以专注不同领域
4. **可扩展性**: 新功能可以按领域添加

## 🔄 模型关系图

```
User (用户)
├── UserSettings (用户设置) [1:1]
├── Follow (关注关系) [1:N]
├── Post (文章) [1:N]
├── Comment (评论) [1:N]
├── Like (点赞) [1:N]
└── ActivityLog (日志) [1:N]

Post (文章)
├── User (作者) [N:1]
├── Category (分类) [N:N]
├── Tag (标签) [N:N]
├── Comment (评论) [1:N]
└── Like (点赞) [1:N]

Comment (评论)
├── User (作者) [N:1]
├── Post (文章) [N:1]
├── Comment (父评论) [N:1]
└── Like (点赞) [1:N]
```

## 📝 模型设计原则

### 1. **命名规范**

- 模型名: PascalCase (如 `User`, `Post`)
- 字段名: camelCase (如 `userId`, `createdAt`)
- 表名: snake_case (如 `users`, `post_categories`)

### 2. **字段设计**

- 主键统一使用 UUID
- 时间戳字段: `createdAt`, `updatedAt`
- 软删除字段: `deletedAt` (可选)
- 状态字段使用枚举类型

### 3. **关系设计**

- 外键字段命名: `{关联模型}Id` (如 `userId`, `postId`)
- 关联字段命名: 有意义的名称 (如 `author`, `posts`)
- 多对多关系通过中间表实现

### 4. **索引策略**

- 主键自动索引
- 外键字段添加索引
- 唯一字段添加唯一索引
- 查询频繁字段添加复合索引

## 🚀 替代模型分离方案

虽然 Prisma 不支持文件拆分，但可以考虑以下方案：

### 方案 1: 使用 Prisma 生成器

```bash
# 安装自定义生成器
npm install prisma-generator-split-schema
```

### 方案 2: 使用构建脚本

创建多个 `.prisma` 文件，通过构建脚本合并到主文件

### 方案 3: 使用 Prisma Schema Builder

```typescript
// 使用代码生成 schema
import { createSchema } from '@prisma/schema-builder';
```

## 📚 数据库迁移

```bash
# 生成迁移文件
npx prisma migrate dev --name init

# 推送到数据库
npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

## 🛠️ 开发工具

```bash
# 查看数据库
npx prisma studio

# 格式化 schema
npx prisma format

# 验证 schema
npx prisma validate
```

## 📖 扩展建议

### 未来可能添加的模型:

1. **媒体管理**
   - `Media` - 媒体文件
   - `MediaFolder` - 媒体文件夹

2. **权限管理**
   - `Role` - 角色
   - `Permission` - 权限
   - `UserRole` - 用户角色关联

3. **内容管理**
   - `Page` - 页面
   - `Menu` - 菜单
   - `Widget` - 小部件

4. **营销功能**
   - `Newsletter` - 邮件列表
   - `Campaign` - 营销活动
   - `Analytics` - 分析数据

## 🔧 维护指南

1. **添加新模型时**:
   - 确定所属业务域
   - 添加到对应的注释区域
   - 更新本文档

2. **修改模型时**:
   - 考虑向后兼容性
   - 创建迁移文件
   - 更新相关类型定义

3. **删除模型时**:
   - 检查依赖关系
   - 创建清理迁移
   - 更新应用代码
