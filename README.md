# pq-companion-site

Marketing + info site for [PQ Companion](https://github.com/jasonsoprovich/pq-companion) — the desktop companion app for Project Quarm.

Built with [Astro 6](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com). Theme tokens mirror the app's UI (`frontend/src/index.css` in the main repo) so the site visually matches the app.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
npm run preview  # serve ./dist locally
```

Requires Node.js 22.12+.

## Project structure

```
src/
  components/        # Header, Footer, Hero, Features, FeatureCard, About, Download
  layouts/
    BaseLayout.astro # html shell, meta, header/footer wrapper
  pages/
    index.astro      # the only page, composes the components above
  styles/
    global.css       # Tailwind import + theme tokens (EQ gold + dark)
public/
  media/             # video/gif assets — see public/media/README.md
```

The site is a single static page. Each feature card shows a placeholder until you drop a matching `.mp4` into `public/media/` (filenames listed in `public/media/README.md`).

## Deploying to Cloudflare Pages

This is a static site — no Cloudflare adapter or Workers runtime needed. Just point Cloudflare Pages at the repo.

1. Push this repo to GitHub (e.g. `jasonsoprovich/pq-companion-site`).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick this repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `22` (set via env var `NODE_VERSION=22` if needed)
4. First deploy gives you `pq-companion-site.pages.dev`. Test it.
5. **Custom domain:** Pages project → **Custom domains → Set up a custom domain**. If your domain's DNS is already on Cloudflare, this is one click — Cloudflare adds the CNAME for you and provisions the cert.

Every push to `main` redeploys automatically. PR branches get preview URLs.

### Updating after release

When PQ Companion ships a new version:

- The hero's "Download" button already points at `releases/latest`, so it always tracks the newest release with no edits needed.
- To call out a specific version, edit the copy in `src/components/Hero.astro` or `src/components/Download.astro`.

## Adding videos later

See [`public/media/README.md`](public/media/README.md) for filenames and the snippet that swaps a placeholder for a real `<video>` tag.

## License

Same as the main app — built by players, for players.
