---
title: 扩展
createTime: 2025/11/21 01:38:59
permalink: /press/markdown/customize/
order: 2
icon: ri:markdown-line
badge:
  type: info
  text: v2
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Tsukimi Markdown 语法说明
## 一、GitHub 仓库卡片（GitHub Repository Cards）
支持添加动态 GitHub 仓库卡片，页面加载时会通过 GitHub API 拉取仓库实时信息（如星标数、分支数等）。

### 使用示例
::github{repo="souloss/Tsukimi"}

### 语法格式
```markdown
::github{repo="用户名/仓库名"}
```
- `repo` 参数：必填，格式为「GitHub 用户名/仓库名称」（如 `souloss/Tsukimi`）

## 二、提示框（Admonitions）
支持 13 种预设类型的提示框，用于突出显示不同重要程度的信息，适配多种使用场景。每种类型既可作为 `:::callout{type="..."}` 的 `type` 属性，也可直接作为指令名使用（如 `:::tip`、`:::caution`）。

### 支持类型及示例
| 类型         | 语法标识    | 默认标题    |
|--------------|-------------|-------------|
| 信息         | `info`      | Info        |
| 技巧         | `tip`       | Tip         |
| 警告         | `warning`   | Warning     |
| 危险         | `danger`    | Danger      |
| 说明         | `note`      | Note        |
| 注意（谨慎） | `caution`   | Caution     |
| 重要         | `important` | Important   |
| 疑问         | `question`  | Question    |
| 引用         | `quote`     | Quote       |
| 缺陷         | `bug`       | Bug         |
| 示例         | `example`   | Example     |
| 成功         | `success`   | Success     |
| 失败         | `failure`   | Failure     |

### 基础语法
```markdown
:::类型标识
提示框内容（支持换行）
:::
```

### 自定义标题
可修改提示框默认标题，语法如下：
```markdown
:::note{title="我的自定义标题"}
这是一个带有自定义标题的说明提示框。
:::
```
效果：
:::note{title="我的自定义标题"}
这是一个带有自定义标题的说明提示框。
:::

### GitHub 兼容语法
同时支持 GitHub 官方提示框语法（无缝适配 GitHub 文档风格）：
```markdown
> [!NOTE]
> GitHub 语法的说明提示框。
> 支持多行内容。

> [!TIP]
> GitHub 语法的技巧提示框。
```
效果：
> [!NOTE]
> GitHub 语法的说明提示框。
> 支持多行内容。

> [!TIP]
> GitHub 语法的技巧提示框。

---

## 三、更多指令

Tsukimi 还支持大量进阶 Markdown 指令，包括：

- **npm-to** — 包管理器命令自动转换
- **Chat** — 对话气泡展示（使用 `[用户名]` 和 `[self]` 语法）
- **Field / Field-group** — API 字段文档
- **Code-tree** — 文件树 + 代码查看器
- **Code-group** — 代码分组选项卡
- **Steps** — 有序列表转步骤展示
- **Asciinema** — 终端录制播放器
- **Colors** — 色板展示
- **Flex** — 弹性布局容器
- **Alignment** — 对齐指令（`:::left`、`:::center`、`:::right`、`:::justify`）
- **Badge** — 行内徽章标签（`:badge[文本]{type="tip"}`）
- **Color** — 行内彩色文字（`:color[文本]{color="red"}`）
- **Card-grid** — 卡片响应式网格
- **Accordion** — Folders 手风琴模式
- **Annotation** — 行内悬停注释
- **Abbreviation** — 缩写词悬停提示
- **File Include** — 外部文件内容引入
- **Video** — 视频播放器（支持本地视频、Bilibili、YouTube 嵌入）
- 代码块行内标注（`[!code ++]`、`[!code --]`、`[!code focus]` 等）
- Tabs 选项卡同步、Timeline 富文本增强、Callout 自定义图标

👉 完整语法和示例请参阅 [Markdown 指令](/press/markdown/directives/)