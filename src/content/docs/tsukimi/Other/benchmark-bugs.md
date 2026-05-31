---
title: Bug Benchmark 脚本
createTime: 2025/08/17 17:21:41
permalink: /other/benchmark-bugs/
order: 8
icon: ri:bug-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## Bug Benchmark 脚本

`scripts/benchmark-bugs.mjs` 是一个静态分析基准测试脚本，用于扫描 Mizuki Astro 博客源代码中已知的 bug 类别。

### 功能特性

脚本会检查以下 bug 类别：

| 检查项 | 说明 |
|--------|------|
| `missing_i18n` | 导航配置中的链接名称未在 navTitleMap 中映射 |
| `broken_nav_refs` | 内部导航 URL 没有对应的页面文件 |
| `missing_widget_reg` | 侧边栏组件类型未在 SidebarColumn 中注册 |
| `css_important_misuse` | 组件 CSS 中误用 `!important` |
| `dark_mode_gaps` | 文本颜色缺少 `dark:` 变体 |
| `i18n_coverage` | i18n 键缺少多语言翻译 |

### 使用方法

```bash
node scripts/benchmark-bugs.mjs
```

### 输出格式

脚本输出两部分内容：

1. **stderr**: 详细的 JSON 格式报告
2. **stdout (最后一行)**: 最终的分数 JSON

最终输出格式：
```json
{
  "primary": <bug_count>,
  "sub_scores": {
    "missing_i18n": N,
    "broken_nav_refs": N,
    "missing_widget_reg": N,
    "css_important_misuse": N,
    "dark_mode_gaps": N,
    "i18n_coverage": N
  }
}
```

### 检查项详细说明

#### 1. 缺失的 i18n 键

检查 `navBarConfig` 中的链接名称是否都在 `navTitleMap` 中有对应的映射。

**排除项**: 外部链接品牌名称（GitHub, Bilibili, Gitee, Codeberg, Discord）不需要 i18n。

**检测位置**:
- `src/config.ts` - `navBarConfig`
- `src/components/organisms/navigation/DropdownMenu.astro` - `navTitleMap`
- `src/components/organisms/navigation/NavMenuPanel.astro` - `navTitleMap`

#### 2. 破损的导航引用

检查内部导航 URL 是否有对应的页面文件存在。

**跳过项**: 包含 `children:` 的父容器 URL（下拉菜单容器）。

**检查位置**:
- `src/pages/<url>.astro`
- `src/pages/<url>/index.astro`
- `src/pages/<url>/` 目录下是否有任何 `.astro` 或 `.ts` 文件

#### 3. 缺失的组件注册

检查 `sidebarLayoutConfig.components` 中配置的所有组件类型是否都在 `SidebarColumn.astro` 的 `componentMap` 中注册。

#### 4. CSS !important 误用

检查组件级别的 CSS 文件中是否有 `!important` 使用，核心框架 CSS 除外。

**允许使用 !important 的文件**:
- `twikoo.css` - 覆盖动态注入的样式
- `encrypted-content.css` - 代码语法高亮覆盖
- `banner.css` - 复杂动画系统
- `main.css` - 全局性能/工具覆盖
- `transition.css` - Swup 页面过渡系统
- `expressive-code.css` - 代码块样式覆盖
- `mobile-transition-fix.css` - 移动端性能修复
- `mobile-post-list-fix.css` - 移动端布局修复
- `wallpaper-navbar-transparent.css` - 壁纸模式覆盖
- `widget-responsive.css` - 响应式布局覆盖
- `photoswipe.css` - 第三方灯箱覆盖
- `animation-enhancements.css` - 动画系统

**检查项**: 排除注释中的 `!important`。

#### 5. 暗色模式缺失

检查关键页面/组件文件中设置了亮色模式文本颜色但同一行缺少对应的 `dark:` 变体。

**检测模式**:
- 查找 `text-black/75` 等无 `dark:text-white/75` 的情况

**检查文件**: 所有特色页面和关键导航/侧边栏组件。

#### 6. i18n 覆盖率

检查 `i18nKey.ts` 中定义的所有键是否在所有语言文件（en.ts, ja.ts, zh_CN.ts, zh_TW.ts）中都有翻译。

### 评分说明

- **primary 分数**: 所有子分数之和（越低越好，目标: 0）
- **子分数**: 每个检查类别的 bug 数量

### 集成示例

可以将此脚本集成到 CI/CD 流程中：

```bash
# 在 CI 中运行并检查分数是否超过阈值
SCORE=$(node scripts/benchmark-bugs.mjs | tail -1 | jq .primary)
if [ "$SCORE" -gt "0" ]; then
  echo "Bug benchmark failed: $SCORE issues found"
  exit 1
fi
```

### 开发使用

在本地开发时定期运行此脚本，发现问题及时修复：

```bash
# 运行基准测试
node scripts/benchmark-bugs.mjs

# 查看详细报告
node scripts/benchmark-bugs.mjs 2>&1 | head -n -1
```
