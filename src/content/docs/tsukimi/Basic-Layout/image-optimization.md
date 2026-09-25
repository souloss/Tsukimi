---
title: 图片优化
createTime: 2026/09/25
permalink: /basic-layout/image-optimization/
order: 9
icon: ri:image-edit-line
badge:
  type: warning
  text: 实现边界
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 图片优化

当前主题不会读取 siteConfig.imageOptimization，也不会根据该字段自动重写远程图片的格式或 referrer。这个名称仍存在于部分类型/旧文档中，但不能作为运行时配置使用；不要把它加入 src/overrides/siteConfig.ts。

## 当前可用的图片路径

- 文章和页面中的普通 Markdown 图片由 Astro/主题的图片管线处理，建议使用明确的 alt 和稳定的本地路径。
- 放在 public/ 的文件以根路径引用，例如 public/images/cover.webp 对应 /images/cover.webp。
- 放在 src/assets/ 的图片可由 Astro 在组件中导入并生成处理后的资源；它不等同于在 frontmatter 中填写任意路径。
- Banner、全屏壁纸和叠加层图片在 src/config/backgroundWallpaper.ts 配置。
- 相册的图片目录和外链字段按 special/gallery 文档配置。

## 构建脚本

仓库可能通过 scripts/convert-images.js 等脚本在内容同步或发布流程中转换图片；这类脚本的输入、输出和可用格式以脚本源码为准，不是 siteConfig 字段。若要修改压缩质量、格式或 CDN 策略，请在构建脚本、Astro assets 配置或部署平台中完成，并同步写测试。

## 防盗链排查

外部图片加载失败时：

1. 确认图片 URL 在生产域名可访问，并检查服务商的 CORS/Referer 要求。
2. 查看浏览器 Network 中的响应状态和 referrer policy。
3. 优先下载并托管有许可的图片，减少对第三方域名的依赖。
4. 不要通过未实现的 noReferrerDomains 配置假设主题会自动添加属性；需要自定义行为时应修改图片渲染管线。

修改图片资源后运行 pnpm check；涉及构建脚本或文章相对资源时使用 pnpm build && pnpm preview 验证最终输出。
