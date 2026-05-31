---
title: 分支管理与工作流
order: 3
icon: ri:git-branch-line
createTime: 2025/05/27 15:00:00
permalink: /guide/branch-workflow/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 分支角色说明

本项目采用双分支策略进行开发和部署：

### master 分支（上游开发）
- **角色**：上游开发分支，用于功能开发和 bug 修复
- **内容**：包含所有通用功能，配置文件使用空默认值
- **推送目标**：`origin/master`

### blog 分支（用户自定义博客）
- **角色**：用户个人博客分支，基于 master 进行定制
- **内容**：包含用户的文章、配置、静态资源等
- **推送目标**：`private/main` 或用户自己的远程仓库

---

## .gitattributes 配置说明

项目根目录的 `.gitattributes` 文件已配置好合并策略：

```txt
* text=auto eol=lf
*.js linguist-language=astro

# ==================== 用户内容（合并时保留 ours）====================
# 用户文章和内容
src/content/** merge=ours

# 静态资源（用户自定义的 favicon 等）
public/** merge=ours
```

### merge=ours 策略说明
当从 master 合并到 blog 时，上述路径的文件会**自动保留 blog 的版本**，不会被 master 覆盖。

---

## 日常工作流

### 场景 1：在 master 上开发功能/修复 bug

```bash
# 1. 切换到 master
git checkout master

# 2. 进行代码修改
# ... 编辑文件 ...

# 3. 提交更改
git add .
git commit -m "fix: 修复某某问题"
# 或
git commit -m "feat: 添加某某功能"

# 4. 推送到远程
git push origin master
```

### 场景 2：将 master 的更新同步到 blog

```bash
# 1. 切换到 blog
git checkout blog

# 2. 合并 master 的更新
git merge master -m "merge: sync updates from master"

# 3. 如果有冲突（通常是配置文件）
# 手动编辑冲突文件，保留你的自定义配置
# 然后标记解决并提交
git add src/config/siteConfig.ts
git commit -m "merge: sync updates from master, preserve user config"

# 4. 推送到你的远程仓库
git push private blog
```

---

## 配置文件处理原则

由于配置文件（如 `siteConfig.ts`、`navBarConfig.ts` 等）既包含上游可能新增的配置项，又包含用户的自定义值，因此**不使用 merge=ours 自动处理**，而是采用以下原则：

### 上游（master）的配置文件
- 使用空默认值或示例值
- 保持结构完整，新增配置项时及时补充类型定义

### 用户（blog）的配置文件
- 填写真实的配置值
- 合并时仔细查看新增的配置项
- 保留自己的自定义值，同时补充新配置项

---

## 常见场景处理

### 新增配置项时
1. 合并后查看 git diff
2. 将新配置项复制到你的配置文件中
3. 根据需要填写配置值

### 删除配置项时
1. 合并后确认配置项确实不再使用
2. 从你的配置文件中删除相关代码

### 配置项结构变化时
1. 查看 git diff 或 commit message 了解变化
2. 根据新结构调整你的配置

---

## Cherry-pick 特定提交（可选）

如果你只需要 master 上的某个特定修复，可以使用 cherry-pick：

```bash
git checkout blog
git cherry-pick <commit-hash>
```

---

## 快速检查命令

```bash
# 查看当前分支状态
git status

# 查看两个分支的差异
git diff master...blog

# 查看提交历史
git log --oneline --graph --all -20
```

---

## 最佳实践建议

1. **master 只放通用代码**：不要在 master 上提交个人配置
2. **blog 只改配置和内容**：尽量不要在 blog 上修改上游代码
3. **经常同步**：定期从 master 合并更新，避免差距过大
4. **写清晰的 commit message**：便于以后查看和回溯
