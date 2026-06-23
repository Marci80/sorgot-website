import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Production origin (GitHub lowercases the username in the host).
  site: 'https://marci80.github.io',
  // The repo name — the site is served from this subpath.
  base: '/sorgot-website/',
  // Static HTML output (the default; stated here for clarity).
  output: 'static',
  // Use Astro's built-in sharp image service for <Image> optimization.
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [tailwind()],
});
