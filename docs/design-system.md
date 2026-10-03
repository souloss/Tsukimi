# Tsukimi design tokens

The site keeps shared visual values in CSS variables so light, dark, and transparent wallpaper modes use the same scale.

## Core tokens

- `--radius-large` is the shared card, panel, and control radius.
- `--card-bg` and `--card-bg-transparent` are the two card surfaces.
- `--line-color` and `--line-divider` provide borders and separators.
- `--btn-*` variables define button surfaces, content colors, hover states, and active states.
- `--motion-*` variables in `src/styles/motion-tokens.css` define duration and easing values. Reduced motion collapses these durations to `1ms`.

New reusable UI should use these variables or Tailwind utilities that reference them. Feature-specific values remain local when they describe a distinct visual treatment such as a chart or wallpaper layer.
