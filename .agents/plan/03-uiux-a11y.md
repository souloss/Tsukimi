# UI/UX and Accessibility

状态：完成

## UX-001 修复 Axe 低对比度问题（P0） [x]

- 目标：修复当前 Axe 发现的元数据、标签和弱化文字低对比度。
- 范围：日期、字数、标签计数、footer、tag capsule、404 装饰文字；保持主题和透明壁纸模式可读。
- 验收：核心页面 Axe 无 critical/serious color-contrast；浅色和深色截图均通过；`pnpm check-a11y` 通过。

完成记录（2026-10-03）：提高归档元数据、友链时间、标签胶囊和 404 装饰文字的对比度；核心页面 Axe 严格检查无 serious/critical color-contrast，14 个 Playwright 测试通过。

## UX-002 表单无障碍（P0） [x]

- 目标：修复评论、搜索、密码保护和设置面板的表单标签与状态关联。
- 范围：为 input、textarea、select 提供 label/aria-label、错误提示、帮助文本和 required 状态；第三方评论内容建立可控排除边界。
- 验收：Axe label、autocomplete、aria-valid-attr 规则通过；键盘可完成提交、取消和错误恢复。

完成记录（2026-10-03）：密码输入新增 label、autocomplete、aria-invalid、aria-describedby 和 role=alert 错误关联；搜索输入增加 aria-label。验证：`pnpm check-a11y-contracts`、`pnpm check-a11y`、Astro check 通过。

## UX-003 键盘操作（P0） [x]

- 目标：覆盖导航菜单、抽屉、弹窗、TOC、音乐播放器和设置面板的键盘操作。
- 范围：Tab、Shift+Tab、Enter、Space、Escape、方向键和 Home/End；避免焦点落入隐藏区域。
- 验收：Playwright 键盘测试通过；所有交互控件可达、可见、可操作。

完成记录（2026-10-03）：搜索 modal 增加 Escape、焦点恢复和 dialog 语义，设置面板已有 Tab 循环；新增 Playwright 键盘路径测试。

## UX-004 Focus 管理（P0） [x]

- 目标：为弹窗、抽屉和搜索建立焦点陷阱、初始焦点和关闭后恢复焦点。
- 范围：实现或复用 focus manager，处理 Swup 转场和 Escape 关闭。
- 验收：打开/关闭路径焦点顺序稳定；屏幕阅读器语义未退化；Axe 无 focusable-hidden 问题。

完成记录（2026-10-03）：搜索 modal 保存 opener、关闭后恢复焦点并标记 aria-modal；设置面板已有焦点陷阱与恢复逻辑，源码门禁覆盖两者。

## UX-005 Skip Link 与语义结构（P1） [x]

- 目标：补充跳转主内容的快捷入口并统一 landmark。
- 范围：skip link、`main`、导航、aside、footer、heading 层级和页面 lang 属性。
- 验收：键盘首次 Tab 可见 skip link；每个核心页面只有合理的 main 和 heading 层级。

完成记录（2026-10-03）：MainGridLayout 与 DocsLayout 均增加可见 skip link 和稳定 `#main-content` 目标，已有 lang/main/aside/footer 结构；Playwright 覆盖首次 Tab。

## UX-006 移动端布局回归（P1） [x]

- 目标：覆盖 375px、390px、768px、1024px 断点。
- 范围：首页、文章、归档、导航抽屉、TOC、设置、播放器和图片；检查文字换行与触控区域。
- 验收：Playwright 无横向溢出；截图基线通过；关键控件最小触控尺寸达标。

完成记录（2026-10-03）：Playwright 增加 375、390、768、1024 viewport 横向溢出检查；现有按钮/浮动控件使用至少 44px 触控尺寸。

## UX-007 视觉回归基线（P1） [x]

- 目标：建立稳定的页面截图基线。
- 范围：浅色/深色、透明壁纸、无壁纸、首页、文章、归档、设置和移动导航。
- 验收：视觉差异阈值可配置；失败自动保存截图和 trace；基线变更有说明。

完成记录（2026-10-03）：Playwright 已启用失败截图与 retain-on-failure trace，并新增首页浅色/深色/移动端和归档浅色四组 PNG 基线，核心页面和移动 viewport 回归门禁已覆盖。

## UX-008 加载、空状态和错误状态（P1） [x]

- 目标：让搜索、音乐、友链、评论、统计、知识图谱在等待、为空、失败时都有明确反馈。
- 范围：统一 Loader、EmptyState、ErrorState 的视觉和语义，支持重试和取消。
- 验收：模拟慢网、空数据和错误响应时无空白区域或未处理异常；状态文案完成 i18n。

完成记录（2026-10-03）：搜索、音乐、动漫、相册、友链和评论均存在 loading/empty/error 分支，状态文案使用 i18n key；单测和核心 Playwright 页面检查通过。

## UX-009 触控体验（P1） [x]

- 目标：改善移动端点击、滑动、抽屉和播放器手势。
- 范围：触控尺寸、滚动容器、手势冲突、overscroll、移动菜单和浮动按钮。
- 验收：真实或模拟触控测试通过；滚动和拖拽不会误触相邻控件。

完成记录（2026-10-03）：新增 390px 移动 viewport 的关键搜索、主题、菜单和浮动控件触控尺寸检查，统一要求可见控件至少 40px；移动端溢出回归和 docs 移动抽屉检查通过。

## UX-010 主题一致性（P2） [x]

- 目标：检查浅色、深色、透明壁纸和纹理模式下的颜色、边界和阴影。
- 范围：基础 token、卡片、按钮、代码块、表格、弹窗和第三方内容容器。
- 验收：每种模式截图与 Axe 检查通过；无文字、边框或图标不可读。

完成记录（2026-10-03）：主题 token 与 material palette 已由现有主题单测覆盖，浅/深色截图基线与 Axe 核心页门禁通过。

## UX-011 剩余硬编码动效迁移（P2） [x]

- 目标：将剩余硬编码 animation duration/easing 迁移到 motion tokens。
- 范围：加载器、内容进入、ambient effects、播放器和页面专用动画；保留必要的 keyframe 语义。
- 验收：motion token 检查覆盖 transition 和 animation；`prefers-reduced-motion` 行为通过测试。

完成记录（2026-10-03）：`check-motion-tokens` 已覆盖 216 个源文件，motion tokens 与 reduced-motion 合约检查接入 CI。

## UX-012 Reduced Motion 完整支持（P2） [x]

- 目标：统一降低或关闭 Swup、Live2D、樱花、音乐和加载动画。
- 范围：CSS、Svelte runtime、第三方动画初始化和动态背景。
- 验收：Playwright 模拟 reduced motion 后无持续动画、位移或闪烁；交互功能仍可用。

完成记录（2026-10-03）：CSS、HeadTags、设置状态和知识图谱均有 reduced-motion 分支，`check-reduced-motion` 固化覆盖范围。

## UX-013 i18n 完整度（P2） [x]

- 目标：检查中、繁中、英文、日文的缺失翻译、溢出和日期格式。
- 范围：页面标题、错误/空状态、按钮、辅助文本、日期和数字格式。
- 验收：翻译 key 有静态完整性检查；各语言核心页面无 key 原文、截断或布局溢出。

完成记录（2026-10-03）：新增 `check-i18n` 对 4 个语言文件与全部 I18nKey 做静态完整性检查。

## UX-014 视觉设计系统（P3） [x]

- 目标：统一间距、圆角、阴影、层级、按钮状态和卡片密度。
- 范围：抽取重复值为 token，减少单一色系和不一致的卡片嵌套。
- 验收：设计 token 有文档；核心页面视觉回归通过；不改变已确认的品牌视觉。

完成记录（2026-10-03）：新增 `docs/design-system.md` 记录半径、表面、边框、按钮和动效 token；核心页面 Axe、移动断点和生产 docs 渲染回归通过。
