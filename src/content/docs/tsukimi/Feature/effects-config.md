---
title: 特效配置
order: 7
icon: "ri:sparkles-line"
badge:
  type: warning
  text: 新
createTime: 2025/05/20 00:00:00
permalink: /feature/effects-config/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 特效配置

Mizuki 主题内置了视觉特效配置，目前支持樱花飘落特效。特效配置位于 `src/config/effectsConfig.ts` 文件中，类型定义为 `EffectsConfig`。

## 基本配置

```typescript title="src/config/effectsConfig.ts"
export const effectsConfig: EffectsConfig = {
    sakura: {
        enable: false,       // 是否默认启用樱花特效
        switchable: true,    // 是否在显示设置面板中显示开关
        config: {
            sakuraNum: 21,   // 樱花数量
            limitTimes: -1,  // 越界限制次数，-1 为无限循环
            size: {
                min: 0.5,    // 最小尺寸倍数
                max: 1.1,    // 最大尺寸倍数
            },
            opacity: {
                min: 0.3,    // 最小不透明度
                max: 0.9,    // 最大不透明度
            },
            speed: {
                horizontal: {
                    min: -1.7, // 水平速度最小值
                    max: -1.2, // 水平速度最大值
                },
                vertical: {
                    min: 1.5,  // 垂直速度最小值
                    max: 2.2,  // 垂直速度最大值
                },
                rotation: 0.03,  // 旋转速度
                fadeSpeed: 0.03, // 消失速度
            },
            zIndex: 100,     // CSS z-index 值
        },
    },
    // 可以在此添加更多特效配置
};
```

## 顶层配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `sakura` | `object` | 樱花特效配置 |

## 樱花特效配置 (sakura)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enable` | `boolean` | 是 | 是否默认启用樱花特效 |
| `switchable` | `boolean` | 否 | 是否在显示设置面板中显示开关 |
| `config` | `Omit<SakuraConfig, "enable">` | 否 | 樱花特效详细配置 |

### enable

是否**默认启用**樱花特效。用户可以在显示设置面板中手动切换，不受此配置影响。

- `true`: 默认开启
- `false`: 默认关闭（用户仍可通过显示设置手动开启）

### switchable

是否在显示设置面板中显示樱花特效的开关按钮。

- `true`: 显示开关，用户可以自由切换
- `false`: 隐藏开关，用户无法在前端调整（强制使用 `enable` 的值）

### config 详细配置

`config` 字段使用 `Omit<SakuraConfig, "enable">` 类型，即 `SakuraConfig` 去掉 `enable` 字段后的所有配置项。

#### sakuraNum

```typescript
sakuraNum: number;
```

同时显示的樱花花瓣数量，默认 21。

| 推荐值 | 效果 | 性能影响 |
|--------|------|----------|
| 5-10 | 稀疏飘落 | 极低 |
| 10-20 | 适中（默认 21） | 低 |
| 20-40 | 密集飘落 | 中 |
| 40+ | 暴雪效果 | 高 |

#### limitTimes

```typescript
limitTimes: number;
```

樱花越界限制次数。花瓣飘出屏幕后重新出现的次数限制。

- `-1`: 无限循环（默认）
- `N`: 花瓣飘出屏幕 N 次后消失

#### size

```typescript
size: { min: number; max: number; }
```

花瓣尺寸倍数范围。实际渲染时每个花瓣的大小在这个范围内随机取值。

| 推荐值 | 效果 |
|--------|------|
| `{ min: 0.3, max: 0.8 }` | 小花瓣 |
| `{ min: 0.5, max: 1.1 }` | 适中（默认） |
| `{ min: 0.8, max: 1.5 }` | 大花瓣 |

#### opacity

```typescript
opacity: { min: number; max: number; }
```

花瓣不透明度范围（0-1）。每个花瓣的透明度在这个范围内随机取值。

| 推荐值 | 效果 |
|--------|------|
| `{ min: 0.2, max: 0.5 }` | 半透明、淡雅 |
| `{ min: 0.3, max: 0.9 }` | 明显可见（默认） |
| `{ min: 0.7, max: 1.0 }` | 完全不透明 |

#### speed

```typescript
speed: {
    horizontal: { min: number; max: number; };
    vertical: { min: number; max: number; };
    rotation: number;
    fadeSpeed: number;
}
```

花瓣运动速度配置。

| 子字段 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `horizontal.min` | `number` | 水平移动速度最小值 | -1.7 |
| `horizontal.max` | `number` | 水平移动速度最大值 | -1.2 |
| `vertical.min` | `number` | 垂直下落速度最小值 | 1.5 |
| `vertical.max` | `number` | 垂直下落速度最大值 | 2.2 |
| `rotation` | `number` | 旋转速度 | 0.03 |
| `fadeSpeed` | `number` | 消失速度（不应大于最小不透明度） | 0.03 |

- 水平速度为负值时花瓣向左飘移
- 垂直速度为正值时花瓣向下飘落
- `fadeSpeed` 不应大于 `opacity.min`，否则花瓣会过快消失

#### zIndex

```typescript
zIndex: number;
```

樱花图层的 CSS `z-index` 值，控制花瓣显示层级。

- 默认值: 100
- 确保它高于背景但低于弹窗、导航栏等重要元素

## 与 sakuraConfig 的关系

`effectsConfig.sakura.config` 的类型是 `Omit<SakuraConfig, "enable">`，即 `SakuraConfig` 去掉 `enable` 字段。`SakuraConfig` 是独立的樱花配置类型（位于 `src/config.ts` 中的 `sakuraConfig`），两者共享相同的配置结构，但 `enable` 字段在 `effectsConfig` 中位于上层。

```typescript
// effectsConfig 中的 enable 在上层
effectsConfig.sakura.enable = true;

// sakuraConfig 中的 enable 在自身
sakuraConfig.enable = false;
```

## 用户端控制

用户可以在 [显示设置面板](/docs/mizuki/feature/display-settings/) 中实时开关樱花特效：

- 用户设置保存在 `localStorage` 中
- 用户设置优先级高于 `effectsConfig.sakura.enable`
- 如果 `switchable: false`，用户将看不到开关选项

## 完整配置示例

```typescript title="src/config/effectsConfig.ts"
export const effectsConfig: EffectsConfig = {
    sakura: {
        enable: true,
        switchable: true,
        config: {
            sakuraNum: 15,  // 稍少一些，性能更好
            limitTimes: -1,
            size: {
                min: 0.4,
                max: 1.0,
            },
            opacity: {
                min: 0.3,
                max: 0.7,
            },
            speed: {
                horizontal: { min: -1.5, max: -1.0 },
                vertical: { min: 1.2, max: 1.8 },
                rotation: 0.02,
                fadeSpeed: 0.02,
            },
            zIndex: 100,
        },
    },
};
```

## 性能优化建议

1. **移动端优化**: 如果主要访问来自移动端，建议降低 `sakuraNum` 至 10 以下
2. **合理透明度**: 过高的 `opacity.max` 配合大量花瓣可能导致过度绘制
3. **降低速度**: 在低端设备上可降低 `speed` 值减少计算量

## 实现细节

樱花特效通过 `src/utils/sakura-manager.ts` 管理：

- 使用 `requestAnimationFrame` 实现流畅动画
- 对象池复用花瓣对象，减少 GC
- 自动监听页面可见性，暂停不可见时的动画