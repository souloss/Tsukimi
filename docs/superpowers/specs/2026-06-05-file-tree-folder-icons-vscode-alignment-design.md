# File-Tree Folder Icons: Full VS Code Alignment

**Date**: 2026-06-05
**Status**: Approved

## Problem

The file-tree directive's folder icon coverage is minimal (20 folder names) and many mappings are imprecise — e.g. `pages`, `views`, `public`, `shared` all map to `folder-type-src` when vscode-icons has dedicated icons (`folder-type-view`, `folder-type-public`, `folder-type-shared`). VS Code's vscode-icons extension provides 191 distinct folder icon types with ~400+ folder name variants, and also differentiates opened/closed states.

## Goal

Fully align the file-tree directive's folder icons with VS Code's vscode-icons:
1. Expand folder name mapping to cover all 191 icon types (~400+ name variants)
2. Fix imprecise existing mappings
3. Support opened/closed folder icon variants

## Design

### 1. Expanded Folder Mapping Table

Replace the current 20-entry `FOLDER_ICON_MAP` in `scripts/generate-file-icons.mjs` with the complete mapping from vscode-icons' ListOfFolders wiki. Each icon type maps to multiple folder name variants:

```js
const FOLDER_ICON_MAP = {
  // src
  src: "folder-type-src", source: "folder-type-src", sources: "folder-type-src", __src__: "folder-type-src",
  // api
  api: "folder-type-api", ".api": "folder-type-api", apis: "folder-type-api", ".apis": "folder-type-api",
  // component
  component: "folder-type-component", components: "folder-type-component", ".components": "folder-type-component",
  gui: "folder-type-component", "src-ui": "folder-type-component", ui: "folder-type-component", widgets: "folder-type-component",
  // config
  conf: "folder-type-config", ".conf": "folder-type-config", config: "folder-type-config", ".config": "folder-type-config",
  configs: "folder-type-config", ".configs": "folder-type-config", configuration: "folder-type-config",
  ".configuration": "folder-type-config", configurations: "folder-type-config", ".configurations": "folder-type-config",
  setting: "folder-type-config", ".setting": "folder-type-config", settings: "folder-type-config",
  ".settings": "folder-type-config", ini: "folder-type-config", ".ini": "folder-type-config",
  initializers: "folder-type-config", ".initializers": "folder-type-config",
  // ... (full list ~400+ entries covering all 191 icon types)
};
```

Key corrections from current mapping:
- `pages` → `folder-type-view` (was `folder-type-src`)
- `views` → `folder-type-view` (was `folder-type-src`)
- `public` → `folder-type-public` (was `folder-type-src`)
- `shared` → `folder-type-shared` (was `folder-type-src`)
- `store` → `folder-type-db` (was `folder-type-node`)
- `middleware` → `folder-type-middleware` (was `folder-type-src`)
- `layout` / `layouts` → `folder-type-view` (was `folder-type-src`)
- `common` → `folder-type-common` (was `folder-type-src`)

### 2. Opened/Closed Icon Support

**folderOpenMap derivation**: After building `folderMap`, automatically derive `folderOpenMap` by checking if `{iconName}-opened` exists in the icon set:

```js
const folderOpenMap = {};
for (const iconName of new Set(Object.values(folderMap))) {
  const openedName = `${iconName}-opened`;
  if (icons[openedName]) {
    folderOpenMap[iconName] = openedName;
  }
}
```

**file-icons.json structure**:
```json
{
  "icons": { ... },
  "fileMap": { ... },
  "folderMap": { ... },
  "folderOpenMap": { "folder-type-src": "folder-type-src-opened", ... },
  "defaultFolder": "default-folder",
  "defaultFolderOpen": "default-folder-opened",
  "chevron": { ... },
  "ellipsis": { ... }
}
```

### 3. rehype-file-tree.mjs Changes

Update `resolveFolderIcon` to use `folderOpenMap`:

```js
function resolveFolderIcon(folderName, isOpen) {
  const lower = folderName.toLowerCase();
  const closedName = iconData.folderMap?.[lower];
  if (closedName && iconData.icons[closedName]) {
    if (isOpen) {
      const openName = iconData.folderOpenMap?.[closedName];
      if (openName && iconData.icons[openName]) return openName;
    }
    return closedName;
  }
  return isOpen
    ? iconData.defaultFolderOpen || iconData.defaultFolder
    : iconData.defaultFolder;
}
```

No other changes needed — `buildNodeHast` already passes `isOpen` correctly.

### 4. Size Impact

- Current `file-icons.json`: ~131KB
- After expansion: ~350-450KB (adding ~382 folder icon SVGs)
- This is a build-time static JSON file, loaded once during rehype processing. No client-side impact.

## Scope

- `scripts/generate-file-icons.mjs` — expand FOLDER_ICON_MAP, add folderOpenMap generation
- `src/plugins/rehype-file-tree.mjs` — update resolveFolderIcon
- `src/plugins/file-icons.json` — regenerated output (not committed to spec, auto-generated)

No content file changes needed — existing `:::file-tree` blocks automatically benefit from improved icon resolution.
