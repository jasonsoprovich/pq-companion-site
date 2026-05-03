# Media assets

Each placeholder on the site accepts either an **image** or a **video**. Drop a file with the matching slug here and the site will pick it up at build time — videos render as autoplaying, looping, muted `<video>` elements; images render as `<img>` elements with lazy loading.

## Resolution order

For each slug, the resolver looks for these extensions in order and uses the first one it finds:

1. Video: `.mp4`, `.webm`, `.mov`
2. Image: `.webp`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.avif`

If nothing matches, the card shows a placeholder block.

## Slugs

| Slug | Used by |
| --- | --- |
| `hero` | `src/components/Hero.astro` |
| `database-explorer` | Features card |
| `dps-meter` | Features card |
| `spell-timers` | Features card |
| `npc-info` | Features card |
| `character-progression` | Features card |
| `spell-checklist` | Features card |
| `inventory-tracker` | Features card |
| `triggers` | Features card |
| `overlays-dashboard` | Features card |
| `backup-manager` | Features card |

## Recommended specs

**Video:**
- 1280×720 or 1920×1080 MP4 (H.264 / AAC) for broad browser support
- 5–15 seconds, looping, silent
- Keep each file under ~3 MB so the page stays fast

**Image:**
- 1600×900 or higher; 16:9 aspect ratio matches the card frame exactly
- WebP or optimized PNG/JPG; aim for under 500 KB per asset

## Implementation

Resolution lives in `src/lib/media.ts`. Both `Hero.astro` and `FeatureCard.astro` call `resolveMedia(slug)` and render the appropriate element automatically — no per-asset code changes needed when you swap a placeholder for the real file.
