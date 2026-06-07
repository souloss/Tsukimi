# File-Tree Directive Design

## Goal

Implement `:::file-tree` as an interactive, visually rich file tree directive for markdown content, and migrate all existing code-block file trees to use it.

## Syntax

```markdown
::: file-tree

- RootFolder/
  - subfolder/           # comment
    - file.md
    - ++ added-file.md
    - -- removed-file.ts
  - another-file.ts
- ++ README.md

:::
```

**Parsing rules:**
- Indentation level determines nesting (2-space indent)
- Trailing `/` on a name → folder
- `++` prefix → diff-add (green)
- `--` prefix → diff-remove (red)
- `# comment` after name → inline muted comment
- `…` as name → ellipsis placeholder

## Architecture

### Plugin: `src/plugins/remark-file-tree.mjs`

Remark plugin that:
1. Visits `containerDirective` nodes with `name === "file-tree"`
2. Parses list children into a tree structure (detect folders by trailing `/`, diff markers by `++`/`--` prefix, comments by `#`)
3. Renders as HTML using `<details>/<summary>` for folders (root-level open, nested collapsed)
4. Sets `node.data.hName` and replaces children with raw HTML nodes

**Registration**: Add to `remarkPlugins` in `astro.config.mjs` after `remarkContentDirectives`, before `parseDirectiveNode`. Add `"file-tree"` to `CONTENT_DIRECTIVE_NAMES` in `remark-directive-rehype.js`.

### HTML Structure

```html
<div class="vp-file-tree">
  <div class="vp-file-tree-node">
    <details open>
      <summary>
        <p class="vp-file-tree-info folder expanded" style="--file-tree-level: 0;">
          <svg class="vp-file-tree-icon folder-icon">...</svg>
          <span class="name folder">RootFolder</span>
          <span class="comment"># comment</span>
        </p>
      </summary>
      <div class="group">
        <!-- nested children -->
      </div>
    </details>
  </div>
  <div class="vp-file-tree-node">
    <p class="vp-file-tree-info file diff-add" style="--file-tree-level: 1;">
      <svg class="vp-file-tree-icon file-icon">...</svg>
      <span class="name file">added-file.md</span>
    </p>
  </div>
</div>
```

- `--file-tree-level` CSS variable drives indentation
- Diff markers: `diff-add` (green), `diff-remove` (red)
- Root-level folders: `<details open>`, nested: `<details>` (collapsed)

### Icons

Hardcoded SVG icons (Lucide, same pattern as remarkContentDirectives):
- Folder closed: Lucide `folder`
- Folder open: Lucide `folder-open`
- File: extension-based — `.ts/.js` → TS icon, `.md` → markdown, `.jpg/.png/.svg` → image, default → generic file
- `README.md`: info icon

### CSS: `src/styles/file-tree.css`

Imported in `src/styles/main.css`. Covers:
- Container with subtle border, rounded corners, background
- Indentation via `--file-tree-level`
- Folder/file name styling with proper font
- Comment text in muted color
- Diff-add (green left border + background tint) and diff-remove (red)
- Smooth `<details>` expand/collapse animation
- Dark mode via `.dark` overrides
- Hover effects on interactive rows
- Ellipsis placeholder styling

## Migration

8 code-block file trees across 7 files → `:::file-tree` syntax:

| File | Instances |
|------|-----------|
| `src/content/docs/tsukimi/Other/docs-system.md` | 2 |
| `src/content/posts/guide/index.md` | 1 |
| `src/content/docs/tsukimi/Basic-Layout/config-modularization.md` | 1 |
| `src/content/posts/encrypted-post.md` | 1 |
| `src/content/docs/tsukimi/Other/i18n.md` | 1 |
| `src/content/docs/tsukimi/problem/type.md` | 1 |
| `src/content/docs/tsukimi/API/picflow.md` | 1 |

**Not migrated**: `Cloudflare.md` (deployment flow diagram, not a file tree).

## Scope

- Remark plugin implementation
- CSS styling
- Plugin registration in astro.config.mjs
- Skip-list update in remark-directive-rehype.js
- Content migration (7 files)
- No Svelte components, no client-side JS beyond CSS animations
