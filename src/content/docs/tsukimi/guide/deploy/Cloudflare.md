---
title: Cloudflare Pages 部署
order: 4
icon: ri:cloud-line
createTime: 2025/11/21 12:00:00
permalink: /guide/deploy/cloudflare/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Cloudflare Pages 部署指南

Cloudflare Pages 是一个优秀的静态网站托管平台，具有全球 CDN、自动部署和免费 SSL 证书等特性。本指南将介绍如何将 Tsukimi 部署到 Cloudflare Pages，包括**单站点部署**和**双站点部署**两种模式。

## 准备工作

1. **Git 仓库**：确保您的 Tsukimi 项目已上传到 GitHub
2. **Cloudflare 账号**：注册一个免费的 Cloudflare 账号

## 单站点部署

最简单的部署方式，适合只需要一个站点的用户。

### 1. 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Workers & Pages → Create application → Pages → Connect to Git
3. 选择您的 Tsukimi 仓库

### 2. 配置构建

| 设置项 | 值 |
|--------|-----|
| Project name | `tsukimi` 或自定义 |
| Production branch | `master` |
| Framework preset | Astro |
| Build command | `pnpm build` |
| Build output directory | `dist` |

### 3. 环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ENABLE_CONTENT_SYNC` | `false` | 禁用内容分离（使用本地内容） |
| `NODE_VERSION` | `22` | Node.js 版本 |

如果启用内容分离，额外添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ENABLE_CONTENT_SYNC` | `true` | 启用内容分离 |
| `CONTENT_REPO_URL` | 内容仓库 URL | 支持 HTTPS/SSH/PAT Token |

### 4. 自定义域名

Settings → Custom domains → 添加域名，Cloudflare 自动配置 SSL。

---

## 双站点部署

同时部署两个站点：**Demo 站**展示模板功能，**个人站**使用私有内容。

两个站点都连接同一个仓库的同一个分支，通过不同的环境变量区分构建行为。

```
souloss/Tsukimi (master 分支)
  ↓ 推送时自动触发
  ├→ CF Pages tsukimi 项目 (ENABLE_CONTENT_SYNC=false) → tsukimi.souloss.com
  ├→ CF Pages astro-blog 项目 (ENABLE_CONTENT_SYNC=true) → blog.souloss.com
  ↓ 内容仓库推送时
  └→ Deploy Hook 只触发 astro-blog 重新构建
```

### Demo 站点配置

与单站点部署相同，环境变量设为 `ENABLE_CONTENT_SYNC=false`。

### 个人站点配置

1. **创建第二个 CF Pages 项目**，同样连接 `souloss/Tsukimi` 仓库的 `master` 分支

2. **构建配置相同**，但**环境变量不同**：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ENABLE_CONTENT_SYNC` | `true` | 启用内容分离 |
| `CONTENT_REPO_URL` | `https://x-access-token:<PAT_TOKEN>@github.com/your-username/Tsukimi-Content.git` | 带 Token 的私有仓库 URL |
| `NODE_VERSION` | `22` | Node.js 版本 |

> `CONTENT_REPO_URL` 中需要嵌入 PAT Token，因为构建时需要克隆私有内容仓库

3. **自定义域名**: `blog.souloss.com`

### 内容更新自动触发

内容仓库推送时，通过 Deploy Hook 自动触发个人站点重新构建（Demo 站不受影响）：

**1. 获取 Deploy Hook URL**

个人站点项目 → Settings → Builds & deployments → Deploy hooks → 创建 Hook（Branch: `master`）

**2. 配置内容仓库 Secret**

内容仓库 → Settings → Secrets → Actions → 添加 `CF_DEPLOY_HOOK`

**3. 内容仓库工作流**

```yaml
# .github/workflows/trigger-build.yml
name: Trigger Blog Rebuild

on:
  push:
    branches: [main]

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare Pages rebuild
        run: curl -X POST "${{ secrets.CF_DEPLOY_HOOK }}"
```

---

## 常见问题

### 构建失败？

1. 检查 Node.js 版本（需要 >= 22）
2. 查看构建日志中的错误信息
3. 确认环境变量配置正确（`CONTENT_REPO_URL` 无换行符）

### 内容仓库克隆失败？

检查 `CONTENT_REPO_URL`：
- 私有仓库需要带 PAT Token: `https://x-access-token:<TOKEN>@github.com/user/repo.git`
- 确保 Token 有 `repo` 权限
- URL 必须是一行完整的字符串，不能有换行

### 如何使用自定义镜像源？

创建 `.npmrc` 文件：
```ini
registry=https://registry.npmmirror.com
```

---

## 本地预览

```bash
pnpm build   # 构建
pnpm preview # 本地预览 http://localhost:4321
```

---

## 成本

Cloudflare Pages 免费计划：
- 每月 500 次构建
- 无限静态请求
- 全球 CDN + 免费 SSL

对于个人博客，免费计划足够。