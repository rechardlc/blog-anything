# GitHub OAuth 登录配置指南

## 环境变量配置

在您的 `.env.local` 文件中添加以下配置：

```env
# NextAuth.js 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth 配置
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# Google OAuth 配置
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/myapp?schema=blog"


# 应用配置
NEXT_PUBLIC_APP_NAME="Blog-Any"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## GitHub OAuth 应用设置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: Richard 博客管理后台
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. 创建应用后，复制 `Client ID` 和 `Client Secret`
5. 将这些值添加到您的 `.env.local` 文件中

## Google OAuth 应用设置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API：
   - 进入 "APIs & Services" > "Library"
   - 搜索 "Google+ API" 并启用
4. 创建 OAuth 2.0 凭据：
   - 进入 "APIs & Services" > "Credentials"
   - 点击 "Create Credentials" > "OAuth 2.0 Client IDs"
   - 选择 "Web application"
   - 填写信息：
     - **Name**: Richard 博客管理后台
     - **Authorized JavaScript origins**: `http://localhost:3000`
     - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. 创建后，复制 `Client ID` 和 `Client Secret`
6. 将这些值添加到您的 `.env.local` 文件中

## NextAuth Secret 生成

运行以下命令生成一个安全的密钥：

```bash
openssl rand -base64 32
```

或者使用在线工具：https://generate-secret.vercel.app/32

## 功能说明

现在 GitHub 登录功能已经完全配置好，包含以下特性：

### 自动用户管理

- 首次 GitHub 登录时自动创建用户账户
- 后续登录时更新用户信息（头像、姓名等）
- 自动验证邮箱并标记为已验证

### 数据库存储

- 用户基本信息存储在 `users` 表
- OAuth 账户信息存储在 `accounts` 表
- 会话信息存储在 `sessions` 表
- 登录活动记录在 `activity_logs` 表

### 用户信息字段

从 GitHub 获取并存储的信息包括：

- GitHub ID 和用户名
- 显示姓名
- 邮箱地址
- 头像图片
- 个人简介
- 网站链接
- 地理位置

## 测试步骤

1. 确保数据库服务正在运行
2. 配置好环境变量
3. 启动应用：`npm run dev`
4. 访问 `/login` 页面
5. 点击 GitHub 登录按钮
6. 完成 GitHub 授权
7. 检查数据库中的用户记录

## 故障排除

### 常见错误

1. **"GitHub 登录功能暂未配置"**
   - 检查 `AUTH_GITHUB_ID` 和 `AUTH_GITHUB_SECRET` 环境变量

2. **"GitHub 登录处理失败"**
   - 检查数据库连接
   - 查看控制台错误日志

3. **重定向错误**
   - 确认 GitHub OAuth 应用的回调 URL 设置正确

### 调试模式

开发环境下会自动启用调试模式，可以在控制台看到详细的登录信息。
