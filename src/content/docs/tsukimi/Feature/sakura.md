---
title: 樱花特效配置
order: 4
icon: "ri:plant-line"
createTime: 2025/08/17 17:21:41
permalink: /feature/sakura/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 樱花特效配置

Tsukimi 支持在页面中添加樱花飘落特效。配置位于 `src/config/effectsConfig.ts` 中 `effectsConfig.sakura` 对象。

## 基本配置

```typescript title="src/config/effectsConfig.ts"
export const effectsConfig = {
  sakura: {
    enable: true,       // 是否启用樱花特效
    switchable: true,   // 是否允许用户关闭樱花特效
    config: {
      sakuraNum: 21,    // 同时显示的花瓣数量
      limitTimes: -1,   // 限制次数，-1 为无限
      size: {
        min: 0.5,       // 最小尺寸倍率
        max: 1.1,       // 最大尺寸倍率
      },
      opacity: {
        min: 0.3,       // 最小透明度
        max: 0.9,       // 最大透明度
      },
      speed: {
        horizontal: {
          min: -1.7,    // 水平最小速度（负值向左）
          max: -1.2,    // 水平最大速度
        },
        vertical: {
          min: 1.5,     // 垂直最小速度（下落）
          max: 2.2,     // 垂直最大速度
        },
        rotation: 0.03,  // 旋转速度
        fadeSpeed: 0.03,  // 消隐速度
      },
    },
  },
};
```

## 配置项说明

### 外层控制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `false` | 是否启用樱花特效 |
| `switchable` | `boolean` | `true` | 是否允许用户通过显示设置面板关闭樱花特效 |

### 内层 config

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sakuraNum` | `number` | `21` | 同时显示的花瓣数量 |
| `limitTimes` | `number` | `-1` | 限制生成次数，`-1` 为无限 |
| `size.min` / `size.max` | `number` | `0.5` / `1.1` | 花瓣尺寸倍率范围 |
| `opacity.min` / `opacity.max` | `number` | `0.3` / `0.9` | 花瓣透明度范围 |
| `speed.horizontal.min` / `max` | `number` | `-1.7` / `-1.2` | 水平速度范围，负值向左 |
| `speed.vertical.min` / `max` | `number` | `1.5` / `2.2` | 垂直下落速度范围 |
| `speed.rotation` | `number` | `0.03` | 花瓣旋转速度 |
| `speed.fadeSpeed` | `number` | `0.03` | 花瓣消隐速度 |

## 性能建议

- `sakuraNum` 值越大，GPU 负载越高，建议在低端设备上降低此值
- 启用 `switchable` 可以让用户在性能不佳时手动关闭特效
- 移动设备上建议减少花瓣数量以节省电量