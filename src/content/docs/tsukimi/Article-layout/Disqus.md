---
title: Disqus（遗留配置）
order: 10
icon: "ri:message-3-line"
badge:
  type: warning
  text: 当前未接入
createTime: 2026/09/25
permalink: /article-layout/disqus/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Disqus（遗留配置）

当前评论渲染器只动态加载 Twikoo、Waline 和 Giscus。虽然 CommentConfig 类型仍保留 disqus 字段，src/components/comment/index.astro 没有 Disqus 分支，设置 system: disqus 不会渲染评论组件。

请改用：

- [Twikoo 评论配置](/docs/tsukimi/article-layout/twikoo/)
- [Waline 评论配置](/docs/tsukimi/article-layout/waline/)
- [Giscus 评论配置](/docs/tsukimi/article-layout/giscus/)

如果要恢复 Disqus 支持，需要新增组件、动态分支、脚本清理和隐私说明，并同步更新 CommentConfig 类型与本页；在此之前不要把 shortname 写入生产配置。
