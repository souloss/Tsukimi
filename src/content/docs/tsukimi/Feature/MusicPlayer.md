---
title: 音乐播放器配置
order: 1
icon: "ri:music-2-line"
createTime: 2025/08/17 17:21:41
permalink: /feature/musicplayer/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 音乐播放器配置

Mizuki 支持集成音乐播放器，可以播放来自网易云、QQ音乐等平台的在线音乐或本地音乐文件。配置位于 `src/config.ts` 中的 `musicPlayerConfig` 对象。

## 基本配置

```typescript title="src/config.ts"
export const musicPlayerConfig: MusicPlayerConfig = {
  enable: true,               // 启用音乐播放器
  mode: "local",              // 模式："meting" 或 "local"
  showFloatingPlayer: true,   // 显示悬浮播放器 UI
  floatingEntryMode: "fab",   // 悬浮入口模式
  // Meting 模式配置（旧版顶层字段）
  meting_api: "https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
  id: "14164869977",          // 歌单ID
  server: "netease",          // 音乐源服务器
  type: "playlist",           // 播单类型
};
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `false` | 是否启用音乐播放器 |
| `mode` | `"meting" \| "local"` | - | 音乐来源模式 |
| `volume` | `number` | `0.7` | 默认音量 (0-1) |
| `playMode` | `"list" \| "one" \| "random"` | `"list"` | 播放模式 |
| `showLyrics` | `boolean` | `false` | 是否显示歌词 |
| `showInNavbar` | `boolean` | `false` | 是否在导航栏显示播放器 |
| `showFloatingPlayer` | `boolean` | `false` | 是否显示悬浮播放器 UI |
| `floatingEntryMode` | `"default" \| "fab"` | `"default"` | 悬浮入口模式 |

## Meting 模式

当 `mode` 设置为 `"meting"` 时，使用 Meting API 播放在线音乐。

### 新版嵌套配置（推荐）

```typescript
musicPlayerConfig: {
  mode: "meting",
  meting: {
    api: "https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
    server: "netease",   // 音乐源服务器
    type: "playlist",    // 类型
    id: "14164869977",   // 歌单ID
    auth: "",            // 认证 token（可选）
    fallbackApis: [],    // 备用 API（可选）
  },
},
```

### Meting 配置项

| 字段 | 类型 | 说明 |
|------|------|------|
| `api` | `string` | Meting API 地址 |
| `server` | `"netease" \| "tencent" \| "kugou" \| "xiami" \| "baidu"` | 音乐源服务器 |
| `type` | `"song" \| "playlist" \| "album" \| "search" \| "artist"` | 资源类型 |
| `id` | `string` | 歌单/专辑/单曲 ID 或搜索关键词 |
| `auth` | `string` | 认证 token（可选） |
| `fallbackApis` | `string[]` | 备用 API 地址列表（可选） |

### 旧版顶层字段（兼容）

```typescript
musicPlayerConfig: {
  mode: "meting",
  meting_api: "https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
  server: "netease",
  type: "playlist",
  id: "14164869977",
},
```

### 音乐源服务器说明

| 值 | 平台 |
|----|------|
| `netease` | 网易云音乐 |
| `tencent` | QQ音乐 |
| `kugou` | 酷狗音乐 |
| `xiami` | 虾米音乐 |
| `baidu` | 百度音乐 |

## Local 模式

当 `mode` 设置为 `"local"` 时，使用本地音乐文件。

```typescript
musicPlayerConfig: {
  mode: "local",
  local: {
    playlist: [
      {
        name: "ひとり上手",           // 歌曲名称
        artist: "Kaya",              // 艺术家
        url: "assets/music/url/hitori.mp3",  // 音乐文件路径（相对于 public 目录）
        cover: "assets/music/cover/hitori.jpg", // 封面图片（可选）
        lrc: "",                     // 歌词内容，支持 LRC 格式（可选）
      },
    ],
  },
},
```

### Local 配置项

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 歌曲名称 |
| `artist` | `string` | 是 | 艺术家 |
| `url` | `string` | 是 | 音乐文件路径（相对于 public 目录） |
| `cover` | `string` | 否 | 封面图片路径（相对于 public 目录） |
| `lrc` | `string` | 否 | 歌词内容，支持 LRC 格式 |

## 悬浮播放器

悬浮播放器提供页面右下角的快捷控制：

- `showFloatingPlayer: true` 启用悬浮播放器 UI
- `floatingEntryMode: "default"` 独立悬浮播放器
- `floatingEntryMode: "fab"` 集成到通用 FAB 按钮组

## 注意事项

- 使用 `local` 模式时，请确保拥有音乐文件的版权
- Meting API 地址可能随时失效，建议自行搭建 API 实例
- Bilibili 的 SESSDATA 为账号凭证，不可硬编码，请使用环境变量
