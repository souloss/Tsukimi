---
title: Encrypted Posts 加密文章
createTime: 2026-05-20
permalink: /press/article-types/encrypted-posts/
order: 3
icon: ri:key-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## Encrypted Posts 加密文章功能

Mizuki 支持加密文章功能，可以创建需要密码才能查看的文章。

---

### 文章Frontmatter配置

在文章Frontmatter中添加加密配置：

```yaml
---
title: 私密文章
published: 2026-01-01

encrypted: true
password: 'my-secret-password'
passwordHint: '提示：密码是什么？'
hideHomeContent: true
---

这篇文章的内容是私密内容...
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `encrypted` | boolean | 否 | 是否加密，设为true启用加密 |
| `password` | string | 否 | 访问密码（明文存储在配置中，非加密） |
| `passwordHint` | string | 否 | 密码提示，显示在密码输入框下方 |
| `hideHomeContent` | boolean | 否 | 是否在首页隐藏文章摘要，默认false |

---

### 客户端加密机制

加密文章的实现原理：
1. 文章在构建时使用密码加密
2. 访问文章时显示密码输入框
3. 用户输入密码后，前端解密并显示内容
4. 解密使用 CryptoJS 库

---

### 首页隐藏摘要

如果 `hideHomeContent: true` 配置，文章在首页、列表页、RSS等位置不会显示摘要内容，只会显示标题，但不影响用户输入密码查看。

---

### 使用示例

#### 基本用法

```yaml
---
title: 个人日记
published: 2026-01-01
encrypted: true
password: 'password123'
passwordHint: '我的生日'
hideHomeContent: true
---

这是我个人的日记内容...
```

---

### 安全说明

⚠️ **安全提醒**：
1. 密码明文存储在源文件中，请确保源代码的安全性
2. 不要使用真实的密码
3. 建议将加密文章的仓库设置为私有
4. 这是一个轻量级的加密，不是真正的高强度加密
5. 不要用它存储真正的敏感内容
