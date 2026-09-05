# 行内指令

行内指令放在句子内部，基本语法是 `:name[内容]{属性}`。先用普通 Markdown（粗体、斜体、行内代码）即可表达时，不要为了装饰引入指令。行内指令在标题中会被 pipeline 转成字面量行内代码，这是刻意的兼容行为。

## 文本标记

| 指令 | 最小写法 | 属性/默认值 | 适用场景 |
| --- | --- | --- | --- |
| `mark` | `:mark[重点]` | `color`，默认 `yellow` | 只标出一句话中的关键片段。也支持 `==重点==`。 |
| `kbd` | `:kbd[Ctrl+C]` | 无 | 键盘快捷键或按键名称。 |
| `u` | `:u[下划线]` | `color`，默认 `accent` | 需要明确下划线语义时使用。 |
| `emp` | `:emp[强调]` | `color`，默认 `accent` | 中文着重号/傍点。 |
| `wavy` | `:wavy[波浪线]` | `color`，默认 `accent` | 波浪下划线提示。 |
| `del` | `:del[已删除]` | 无 | 需要删除语义时；普通删除线也可用 `~~文本~~`。 |
| `sup` | `x:sup[2]` | `color`，默认 `accent` | 上标。 |
| `sub` | `H:sub[2]O` | `color`，默认 `accent` | 下标。 |
| `color` | `:color[红字]{color="red"}` | `color` 或 `c`；缺省回退 `accent` | 只有颜色本身承载意义时使用。 |

颜色可以写 `red`、`orange`、`yellow`、`green`、`blue`、`purple`、`pink`、`cyan`、`accent`，也可以写安全的 CSS 色值，例如 `#3b82f6`。不要把引号、分号、换行等内容放入色值。

示例：

```markdown
这段有:mark[重点]{color="cyan"}，按 :kbd[Ctrl+C] 复制。

化学式 H:sub[2]O，公式 x:sup[2]，旧值 :del[¥99]。
```

## 交互和状态

### 遮罩

```markdown
剧透内容：:blur[点击后揭示]；密码：:psw[s3cret]。
```

`blur` 和 `psw` 会生成可聚焦的交互元素，点击或键盘操作后揭示内容。不要用它们隐藏必须立即看到的错误、版权或安全信息；`psw` 不是服务端加密。

### 标签和徽章

```markdown
:hashtag[Astro]{href="/tags/astro" color="blue"}
:badge[稳定]{type="tip"}
:badge[实验]{type="warning"}
```

- `hashtag` 支持 `href` 和 `color`。省略 `color` 时按页面中出现的顺序循环使用红、橙、黄、绿、青、蓝、紫七种颜色；省略 `href` 时链接目标是 `#`。
- `badge` 支持 `type` 和 `color`。常用 `type` 是 `tip`、`info`、`warning`、`danger`；`color` 会覆盖 `type`，也可直接使用命名色或 CSS 色值。

### 复选框和单选框

```markdown
- :checkbox[checked] 已完成
- :checkbox[todo]{color="blue"} 待处理
- :checkbox[待办]{checked="true" inline="false"} 带文字的状态
- :radio[selected] 方案 A
- :radio[unselected] 方案 B
```

`checkbox` 和 `radio` 都支持 `checked`、`color`、`inline`；`checkbox` 还支持 `symbol`。下面这些正文词会自动判断状态：

- 选中：`checked`、`true`、`done`、`yes`、`x`、`v`、`✓`、`✅`。
- 未选中：`unchecked`、`false`、`todo`、`no`、`☐`。

直接写 `{checked="true"}` 最明确。`inline` 默认开启，只有 `inline="false"` 才关闭行内布局。

## 注释、缩写和 emoji

### 悬浮说明

```markdown
这里解释一个:anno[术语](鼠标悬停或聚焦可见的解释)。
这里展开 :abbr[HTML](HyperText Markup Language) 的全称。
```

`anno` 的括号内容也可通过 `{content="..."}` 或 `{desc="..."}` 提供；`abbr` 可通过 `{title="..."}` 或 `{desc="..."}` 提供。括号内容含复杂嵌套时，优先使用属性形式。说明文本会作为交互提示，不要塞入长段落。

### Emoji

```markdown
:emoji[heart]
:emoji[rocket]{source="twemoji" height="1.5em"}
:emoji[custom]{source="https://example.com/emoji/{name}.png" name="custom"}
```

| 属性 | 默认/可选值 | 说明 |
| --- | --- | --- |
| `source` | `twemoji`（省略时） | 内置 `twemoji`、`qq`、`aru`、`tieba`、`blobcat`；也可给带 `{name}` 占位符的 URL 模板。 |
| `name` | 指令文本 | 资源文件名；省略时使用 `[]` 中的文本。 |
| `height` | `1.75em` | 图片高度，可用安全的 CSS 长度。 |

`twemoji` 会把常见名称（如 `heart`、`rocket`、`smile`）转换为 Unicode codepoint。外部表情资源可能受网络、许可和可用性影响。

### 步骤括号

```markdown
:step-brackets[1]{title="安装"} -> :step-brackets[2]{title="配置"}
```

`title` 可选，用于在编号旁显示步骤标题；正文内容是显示的编号文本。

## 解析边界

- `:mark[]` 和 `==...==` 是两条独立处理路径；`==...==` 只在普通文本节点中转换。
- `:anno[text](说明)`、`:abbr[text](全称)` 依赖兼容转换来避免被 Markdown 当成普通链接；括号内容尽量不要包含未转义的右括号。
- 行内指令不会自动成为组件 import。未知名字不会获得主题样式，不能把 `:button`、`:btn` 等预留名称当成按钮 API。
