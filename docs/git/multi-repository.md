# 多仓库协同开发：如何优雅管理测试与生产环境

> 在现代软件开发中，我们经常需要同时维护测试环境和生产环境的代码仓库。本文将分享一种高效的 Git 多仓库管理方案，让你轻松实现"一次推送，双环境同步"的开发流程。

## 🎯 背景与挑战

在团队协作开发中，我们经常遇到这样的场景：

- 测试环境和生产环境使用不同的代码仓库
- 需要保持两个环境的代码同步
- 希望简化推送流程，避免重复操作

传统的解决方案需要分别推送到两个仓库，不仅繁琐还容易出错。本文将介绍一种更优雅的解决方案。

## 📋 开发规范与约定

### 核心原则

1. **统一拉取源**：所有代码拉取都从测试仓库进行
2. **配置分离**：环境相关配置必须通过配置文件管理，绝不可硬编码到业务代码中
3. **分支策略**：
   - `dev` 分支：测试环境
   - `master` 分支：生产环境
4. **开发流程**：从 `dev` 分支创建个人分支 → 开发完成 → 合并到 `dev` 分支
5. **合并前检查**：每次合并前必须先 `pull` 相关分支代码

### 环境配置管理

```bash
# 推荐的环境配置结构
config/
├── dev.properties    # 测试环境配置
├── prod.properties   # 生产环境配置
└── application.yml   # 通用配置
```

## 🚀 Git 多仓库配置实战

### 方案概述

采用 **一个 fetch 源（测试）+ 两个 push 源（测试+生产）** 的配置策略，实现一次推送，双环境同步。

### 详细配置步骤

#### 第一步：克隆测试仓库

```bash
# 从测试环境克隆代码
git clone <测试仓库地址>
cd <项目目录>
```

#### 第二步：添加生产环境推送地址

```bash
# 添加生产环境作为额外的推送地址
git remote set-url --add origin <生产仓库地址>

# 验证配置
git remote -v
```

执行后你会看到类似输出：

```
origin  <测试仓库地址> (fetch)
origin  <测试仓库地址> (push)
origin  <生产仓库地址> (push)
```

#### 第三步：验证配置

```bash
# 查看远程仓库配置
git remote -v

# 测试推送（建议先在测试分支进行）
git push origin dev
```

### 完整配置示例

```bash
# 1. 克隆测试仓库
git clone https://test-repo.com/project.git
cd project

# 2. 添加生产环境推送地址
git remote set-url --add origin https://prod-repo.com/project.git

# 3. 验证配置
git remote -v

# 4. 正常开发流程
git checkout -b feature/new-feature
# ... 开发代码 ...
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature
```

## 🏗️ 项目架构说明

### 仓库分工

| 仓库          | 技术栈      | 用途       | 特殊说明                                   |
| ------------- | ----------- | ---------- | ------------------------------------------ |
| `estate-ui`   | R1.0 版本   | 原有系统   | 无需构建，使用 PowerShell 脚本处理环境配置 |
| `estate-vite` | Vue3 + Vite | 新版本开发 | 需要全局安装 Vite                          |

### 环境启动指南

#### estate-ui 项目

```bash
# 使用 PowerShell 环境
npm run dev:ui-test
```

#### estate-vite 项目

```bash
# 全局安装 Vite
npm install -g vite

# 启动开发服务器
npm run dev
```

## 💡 最佳实践与注意事项

### ✅ 推荐做法

1. **保持仓库同步**：确保两个仓库的初始状态一致
2. **分支管理**：使用清晰的分支命名规范
3. **提交信息**：遵循 [Git 提交规范](https://www.jianshu.com/p/ff4f98695c2c)
4. **权限管理**：确保本地已配置好相应的认证信息

### ⚠️ 注意事项

1. **首次推送**：如果两个仓库状态不一致，首次推送可能出现冲突
2. **拉取策略**：拉取代码时只会从第一个仓库拉取
3. **权限配置**：确保对不同仓库都有相应的访问权限

### 🔧 故障排除

#### 问题：推送失败

```bash
# 检查远程仓库配置
git remote -v

# 重新配置（如果需要）
git remote remove origin
git remote add origin <测试仓库地址>
git remote set-url --add origin <生产仓库地址>
```

#### 问题：权限认证失败

```bash
# 检查 SSH 密钥配置
ssh -T git@github.com

# 或使用 HTTPS 认证
git config --global credential.helper store
```

## 🎉 总结

通过这种多仓库配置方案，我们可以：

- ✅ 简化推送流程，一次命令同步双环境
- ✅ 降低操作错误率
- ✅ 提高开发效率
- ✅ 保持代码仓库的一致性

这种方案特别适合需要同时维护测试和生产环境的团队，让我们的开发工作更加高效和可靠。

---
