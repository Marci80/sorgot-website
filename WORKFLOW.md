# Project Workflow

How to work on this site day to day. The site is built with Astro (static output)
and deployed to GitHub Pages at:

**https://marci80.github.io/sorgot-website/**

Because the site lives under the `/sorgot-website/` subpath, **every internal link
and asset path must respect the base** (see "The base-path rule" below).

---

## Run and test locally

```bash
npm install      # first time only
npm run dev      # start the dev server (http://localhost:4321/sorgot-website/)
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

The dev server also serves the site under `/sorgot-website/`, so local paths match
production.

---

## Deploy

Deployment is automatic. Push to `master` and GitHub Actions builds and publishes:

```bash
git add -A
git commit -m "Describe your change in English"
git push origin master
```

Watch progress in the repo's **Actions** tab. The live URL updates in ~1-2 minutes.
You can also trigger a build manually from **Actions -> Deploy to GitHub Pages -> Run workflow**.

---

## The base-path rule (read this first)

The site is served from `/sorgot-website/`, not `/`. A path that starts with a bare
`/` (like `/images/photo.jpg`) breaks in production. Always build paths from the base.

In `.astro` / `.js` files, the base is available as `import.meta.env.BASE_URL`
(it already ends with a `/`):

```astro
---
const base = import.meta.env.BASE_URL;
---
<a href={`${base}register`}>Register</a>
<img src={`${base}images/donate/heart.png`} alt="<Hebrew alt text>" />
```

Plain `.css` files cannot read `BASE_URL`. Font `@font-face` rules are therefore
injected from `src/layouts/BaseLayout.astro`, where the base is interpolated.

---

## Adding images

There are two homes for images. Pick based on whether Astro should optimize it.

### 1. Editorial images -> `src/assets/images/` (optimized)

Use this for content photos. Render them with Astro's `<Image>` component, which
auto-generates WebP, makes responsive sizes, and lazy-loads:

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/images/exhibit-01.jpg';
---
<Image src={photo} alt="<Hebrew alt text>" widths={[400, 800, 1200]} />
```

- Astro handles the path and the base for you here, so no manual `BASE_URL`.
- **Hebrew alt text is the default** for accessibility.

### 2. Static pass-through images -> `public/images/` (not optimized)

Use this for favicons, OG images, or anything that must keep an exact filename/path.
Reference them with the base prefix:

```astro
<img src={`${import.meta.env.BASE_URL}images/og-cover.png`} alt="<Hebrew alt text>" />
```

The animated homepage wall reads from `public/images/home/`; add new wall images
there and list their filenames in `src/data/homeImages.js`.

### Image size ceiling

Keep images **under ~500 KB** where possible. Large originals slow the page and bloat
the repo. (Source originals for the home wall live in `public/images/home/_original/`.)

---

## Adding MP3 audio

1. **Folder:** put MP3 files in `public/audio/`.
2. **Naming:** ASCII only, lowercase, hyphens. Examples:
   `track-01-intro.mp3`, `lesson-02-overview.mp3`.
   Hebrew or spaced filenames cause URL-encoding problems across browsers and CI.
3. **Ceiling:** keep each MP3 **under ~10 MB** where possible.
4. **Use it on a page** with the reusable player component:

```astro
---
import AudioPlayer from '../components/AudioPlayer.astro';
---
<AudioPlayer src="track-01-intro.mp3" title="<Hebrew title>" />
```

`AudioPlayer` resolves the base path for you, aligns RTL, and uses `title` as the
accessible label (pass `ariaLabel` to override). You can also reference audio
directly as `{BASE_URL}audio/<name>.mp3`.

5. **To production:** commit and push to `master` like any other file.

---

## File-size safety (pre-commit hook)

A guard script lives at `scripts/check-file-size.sh`. It warns at 50 MB and blocks
commits over 100 MB (GitHub's hard limit). Install it once per machine:

```bash
cp scripts/check-file-size.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

To commit past a block in a pinch: `git commit --no-verify`.

---

## Git LFS (not enabled yet)

Audio is currently stored as **plain git files**, which is simplest and has no
bandwidth caps. This is fine while total audio stays under ~500 MB.

If the audio library grows past ~500 MB, switch MP3s to **Git LFS**. Be aware of the
free-tier limits first:

- **1 GB** LFS storage total
- **1 GB** LFS bandwidth per month (every download/deploy of an LFS file counts)

To enable LFS later:

```bash
git lfs install
# uncomment the *.mp3 LFS line in .gitattributes, then:
git add .gitattributes
git add --renormalize public/audio
git commit -m "Move MP3 audio to Git LFS"
git push origin master
```

Then add `lfs: true` to the checkout step in `.github/workflows/deploy.yml`
(a commented hint is already there).

**On a new machine** with LFS in use, install LFS before cloning/pulling so audio
files download as real files rather than pointer stubs:

```bash
git lfs install
git lfs pull
```
