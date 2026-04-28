# Media assets

Drop your screenshare videos here. Filenames referenced by the site:

- `hero.mp4` — main hero demo (used by `src/components/Hero.astro`)
- `database-explorer.mp4`
- `dps-meter.mp4`
- `spell-timers.mp4`
- `npc-info.mp4`
- `spell-checklist.mp4`
- `inventory-tracker.mp4`
- `triggers.mp4`
- `backup-manager.mp4`

Until each file exists, the corresponding card on the site shows a placeholder block.

## Replacing a placeholder with a real video

Open the matching component (e.g. `src/components/Hero.astro` or `src/components/FeatureCard.astro`) and swap the placeholder `<div>` for a `<video>` element:

```astro
<video
  src="/media/hero.mp4"
  autoplay
  loop
  muted
  playsinline
  class="h-full w-full object-cover"
></video>
```

Recommended specs:
- 1280×720 or 1920×1080 MP4 (H.264 / AAC) for broad browser support
- 5–15 seconds, looping, silent
- Keep each file under ~3 MB so the page stays fast
