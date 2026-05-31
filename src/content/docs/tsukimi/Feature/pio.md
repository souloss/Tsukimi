---
title: Live2D 看板娘配置
order: 2
icon: "ri:robot-line"
createTime: 2025/08/17 17:21:41
permalink: /feature/pio/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Live2D 看板娘配置

Mizuki 支持通过 Pio 组件集成 Live2D 看板娘。配置位于 `src/config.ts` 中的 `pioConfig` 对象。

## 基本配置

```typescript title="src/config.ts"
export const pioConfig: PioConfig = {
  enable: false, // 默认关闭以提升性能
  models: ["/pio/models/pio/model.json"], // 模型路径数组
  position: "left", // 显示位置
  width: 280, // 宽度
  height: 250, // 高度
  mode: "draggable", // 交互模式
  hiddenOnMobile: true, // 移动端隐藏
  dialog: {
    welcome: "Welcome to Mizuki Website!",
    touch: ["What are you doing?", "Stop touching me!", "HENTAI!", "Don't bully me like that!"],
    home: "Click here to go back to homepage!",
    skin: ["Want to see my new outfit?", "The new outfit looks great~"],
    close: "QWQ See you next time~",
    link: "https://github.com/souloss/Mizuki",
  },
};
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `false` | 是否启用看板娘 |
| `models` | `string[]` | - | 模型文件路径数组 |
| `position` | `"left" \| "right"` | `"left"` | 看板娘显示位置 |
| `width` | `number` | `280` | 看板娘宽度 |
| `height` | `number` | `250` | 看板娘高度 |
| `mode` | `"static" \| "fixed" \| "draggable"` | `"draggable"` | 交互模式 |
| `hiddenOnMobile` | `boolean` | `true` | 是否在移动设备上隐藏 |

### 交互模式说明

| 模式 | 说明 |
|------|------|
| `"static"` | 静态模式，看板娘固定在原位不可交互 |
| `"fixed"` | 固定模式，看板娘固定在页面角落 |
| `"draggable"` | 可拖拽模式，用户可以拖动看板娘到任意位置 |

## 对话配置 (dialog)

| 字段 | 类型 | 说明 |
|------|------|------|
| `welcome` | `string \| string[]` | 欢迎词，支持单个字符串或数组随机选择 |
| `touch` | `string \| string[]` | 触摸提示，支持单个字符串或数组随机选择 |
| `home` | `string` | 首页提示 |
| `skin` | `[string, string]` | 换装提示，元组格式：[切换前提示, 切换后提示] |
| `close` | `string` | 关闭提示 |
| `link` | `string` | 关于链接 |
| `custom` | `object[]` | 自定义交互配置 |

### 自定义交互 (dialog.custom)

可以为特定 DOM 元素绑定看板娘交互行为：

```typescript
dialog: {
  // ...
  custom: [
    {
      selector: "#some-element", // CSS 选择器
      type: "read",              // 类型："read" 或 "link"
      text: "点击了某个元素",     // 提示文本（可选）
    },
  ],
},
```

## 使用说明

1. 将看板娘模型文件放置在 `public/pio/models/` 目录下
2. 将 `enable` 设置为 `true` 启用看板娘
3. 根据需要修改 `pioConfig` 中的配置项
4. 保存配置文件并重新启动博客

## 注意事项

- 确保模型路径正确，否则看板娘将无法显示
- 看板娘功能可能会影响页面加载速度，建议根据实际需求启用或禁用
- 在移动设备上建议启用 `hiddenOnMobile`，以避免影响用户体验
- 对话内容可以根据个人喜好进行修改，使看板娘更加个性化
