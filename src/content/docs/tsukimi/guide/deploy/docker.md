---
title: Docker 部署
order: 7
icon: ri:ship-line
createTime: 2025/11/21 19:58:08
permalink: /guide/deploy/docker/
copyright:
  creation: reprint
  license: CC-BY-4.0
  source: https://github.com/limitationai
  author:
    name: 浮生
    url: https://github.com/limitationai
---

使用 Docker 部署 Mizuki 博客可以实现环境隔离、快速部署和轻松扩展。本文将详细介绍如何使用 Docker 容器化并部署 Mizuki 博客。

## 前提条件

开始之前，请确保您已准备好以下环境：

1. 已安装 Docker（推荐使用最新稳定版）
2. 已安装 pnpm（Mizuki 使用的包管理器）
3. 基本的 Linux 命令行知识

## 准备工作

### 1. 安装 Docker

在 Ubuntu/Debian 系统上安装 Docker：

```bash title="安装 Docker"
sudo apt update
sudo apt install docker.io -y
```

安装完成后，确保 Docker 服务已启动：

```bash title="启动 Docker 服务"
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. 准备项目文件

将 Mizuki 项目克隆到本地：

```bash title="克隆项目"
git clone https://github.com/souloss/Mizuki.git
cd Mizuki
```

## 创建 Docker 配置文件

### 1. 创建 .dockerignore 文件

`.dockerignore` 文件用于指定在构建 Docker 镜像时需要忽略的文件和目录，这样可以减小镜像体积并提高构建速度。

在项目根目录创建 `.dockerignore` 文件：

```text title=".dockerignore"
.git
node_modules
dist
.gitignore
Dockerfile
.dockerignore
.vscode
.github
docs
scripts
.astro
frontmatter.json
pagefind.yml
vercel.json
```

### 2. 创建 Dockerfile

`Dockerfile` 定义了如何构建 Docker 镜像。在项目根目录创建 `Dockerfile` 文件：

```dockerfile title="Dockerfile"
# 使用 Node.js 官方镜像作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建项目 - 添加容错处理
RUN pnpm run build || pnpm exec astro build && pnpm exec pagefind --site dist

# 使用 nginx 作为运行时镜像
FROM nginx:alpine

# 复制构建结果到 nginx 的 html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 设置文件权限
RUN chmod -R 755 /usr/share/nginx/html/
RUN chown -R nginx:nginx /usr/share/nginx/html/

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口 80
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. 创建 nginx.conf

`nginx.conf` 文件用于配置 Nginx 服务器。在项目根目录创建 `nginx.conf` 文件：

```nginx title="nginx.conf"
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # 支持前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 构建 Docker 镜像

完成上述配置后，使用以下命令构建 Docker 镜像：

```bash title="构建镜像"
docker build -t mizuki-blog .
```

::: tip
- `-t mizuki-blog`：为构建的镜像添加标签，命名为 mizuki-blog
- `.`：表示使用当前目录作为构建上下文
:::

## 运行容器

使用以下命令运行容器：

```bash title="运行容器"
docker run -d --name mizuki-blog -p 5090:80 mizuki-blog
```

::: tip
- `-d`：在后台运行容器
- `--name mizuki-blog`：为容器指定名称
- `-p 5090:80`：将主机的 5090 端口映射到容器的 80 端口
:::

## 访问应用

容器启动成功后，可以通过以下地址访问博客应用：

- 本地访问：`http://localhost:5090`
- 远程访问：`http://服务器IP地址:5090`

## 容器管理

### 常用命令

::: tabs

# 查看容器状态

```bash
docker ps
```

# 启动/停止容器

```bash
# 停止容器
docker stop mizuki-blog

# 启动容器
docker start mizuki-blog

# 重启容器
docker restart mizuki-blog
```

# 查看日志

```bash
# 查看容器日志
docker logs mizuki-blog

# 实时查看日志
docker logs -f mizuki-blog
```

# 删除容器

```bash
# 先停止容器
docker stop mizuki-blog
# 再删除容器
docker rm mizuki-blog
```

:::

### 数据持久化

如果需要持久化日志或数据，可以使用卷映射：

```bash title="使用卷映射"
docker run -d --name mizuki-blog \
  -p 5090:80 \
  -v /path/to/logs:/var/log/nginx \
  mizuki-blog
```

## 高级配置

### 1. 使用 Docker Compose

创建 `docker-compose.yml` 文件来简化部署：

```yaml title="docker-compose.yml"
version: '3'

services:
  mizuki-blog:
    build: .
    container_name: mizuki-blog
    ports:
      - "5090:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

使用 Docker Compose 启动：

```bash title="启动服务"
docker-compose up -d
```

### 2. 自动重启配置

添加 `--restart` 参数确保容器在崩溃后自动重启：

```bash title="自动重启"
docker run -d --name mizuki-blog \
  --restart unless-stopped \
  -p 5090:80 \
  mizuki-blog
```

### 自动更新脚本参考
```bash
#!/bin/bash

# 脚本功能: 自动构建并部署 mizuki-blog Docker 容器

# 构建Docker镜像
# docker build: Docker构建命令
# -t mizuki-blog: 为构建的镜像添加标签，命名为 mizuki-blog
# .: 使用当前目录作为构建上下文，包含Dockerfile和相关文件
echo "正在构建Docker镜像..."
docker build -t mizuki-blog .

# 检查是否有正在运行的容器并停止
echo "检查是否有正在运行的容器..."
# docker ps -q --filter "name=mizuki-blog": 查找名称包含 mizuki-blog 的正在运行的容器ID
# -q: 仅返回容器ID，不显示其他信息
# --filter "name=mizuki-blog": 按容器名称过滤
container_id=$(docker ps -q --filter "name=mizuki-blog")

# 条件判断: 如果找到了容器ID (即 $container_id 不为空)
if [ -n "$container_id" ]; then
  echo "停止正在运行的容器: $container_id"
  # 停止容器
  docker stop $container_id
  # 删除容器
  docker rm $container_id
fi

# 运行新容器
echo "启动新容器..."
# docker run: 运行Docker容器
# -d: 在后台运行容器
# -p 5090:5090: 将主机的5090端口映射到容器的5090端口
# --name mizuki-blog: 为容器指定名称
# mizuki-blog: 使用的镜像名称
docker run -d -p 5090:5090 --name mizuki-blog mizuki-blog

# 显示容器日志 (已注释掉)
# 取消注释下面两行可以在部署完成后自动查看容器实时日志
# echo "显示容器日志..."
# docker logs -f mizuki-blog
```


## 常见问题

### 端口冲突

如果端口 5090 已被占用，可以修改端口映射：

```bash title="修改端口"
docker run -d --name mizuki-blog -p 8080:80 mizuki-blog
```

这样应用将通过 `http://localhost:8080` 访问。

### 构建失败

如果构建失败，可能是由于以下原因：

1. 网络问题 - 检查网络连接
2. 依赖安装失败 - 尝试更新 Dockerfile 中的 Node.js 版本
3. 权限问题 - 确保当前用户有 Docker 权限

### 容器无法访问

如果容器无法访问，可以尝试以下步骤：

1. 检查容器是否正在运行：`docker ps`
2. 检查端口映射是否正确
3. 查看容器日志：`docker logs mizuki-blog`

## 总结

使用 Docker 部署 Mizuki 博客具有以下优势：

- 🚀 快速部署：一次构建，随处运行
- 🔒 环境隔离：避免依赖冲突
- 📦 版本管理：轻松回滚到之前的版本
- 🔄 水平扩展：轻松创建多个实例

通过本教程，您应该能够成功使用 Docker 部署 Mizuki 博客，并掌握基本的容器管理技能。
