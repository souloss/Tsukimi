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

Mizuki 支持在页面中添加樱花飘落特效。配置位于 `src/config.ts` 中的 `sakuraConfig` 对象。

## 基本配置

```typescript title="src/config.ts"
export const sakuraConfig: SakuraConfig = {
  enable: true,       // 是否启用樱花特效
  switchable: true,   // 是否允许用户关闭樱花特效
  maxPetals: 30,      // 最大花瓣数量
  size: { min: 10, max: 20 }, // 花瓣大小范围(px)
  speed: { min: 1, max: 3 },  // 下落速度范围
  wind: { min: -1, max: 1 },  // 水平风力范围
};
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `false` | 是否启用樱花特效 |
| `switchable` | `boolean` | `true` | 是否允许用户通过显示设置面板关闭樱花特效 |
| `maxPetals` | `number` | `30` | 同时显示的最大花瓣数量 |
| `size` | `object` | `{ min: 10, max: 20 }` | 花瓣大小范围（像素） |
| `speed` | `object` | `{ min: 1, max: 3 }` | 花瓣下落速度范围 |
| `wind` | `object` | `{ min: -1, max: 1 }` | 水平风力范围，负值向左，正值向右 |

## 性能建议

- `maxPetals` 值越大，GPU 负载越高，建议在低端设备上降低此值
- 启用 `switchable` 可以让用户在性能不佳时手动关闭特效
- 移动设备上建议减少花瓣数量以节省电量

## 与 effectsConfig 的关系

`effectsConfig` 是特效的统一配置入口，包含樱花等所有特效的配置。`sakuraConfig` 是樱花特效的独立配置，两者可以同时使用。当 `effectsConfig` 中也配置了樱花时，以 `effectsConfig` 的配置为准。
