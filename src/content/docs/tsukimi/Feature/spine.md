---
title: Spine 看板娘（规划中）
createTime: 2026/09/25
permalink: /feature/spine/
order: 11
icon: ri:user-star-line
badge:
  type: warning
  text: 未实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Spine 看板娘（规划中）

当前仓库没有 Spine 组件、运行时加载器或 src/config/spineConfig.ts。src/types/config.ts 中的 SpineModelConfig 只是预留类型，不能据此在站点中启用 Spine 模型。

不要添加 spineModelConfig，也不要把 Spine 文件路径写入配置；这些字段目前不会被任何组件消费。现阶段可用的看板娘是 Pio，配置位于 src/config/pioConfig.ts，文档见 [Pio 配置](/docs/tsukimi/feature/pio/)。

如果要实现 Spine 支持，需要同时补充：

- 组件和客户端资源加载逻辑；
- 配置模块、导出入口和类型校验；
- 移动端/无障碍/性能策略；
- 构建和浏览器验证；
- 本页及示例资源。

在上述实现合并前，本页仅作为路线记录，不应作为使用指南。
