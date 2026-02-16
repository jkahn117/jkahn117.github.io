# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog at https://blog.iamjkahn.com — built with Astro 5, React, Tailwind CSS v4, and deployed to Cloudflare Workers.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm preview` — Preview production build locally (uses Wrangler)
- `pnpm create` — Interactive CLI to scaffold a new blog post (prompts for title, slug, date, local vs link post)
- `npx prettier --write <file>` — Format a file (uses prettier-plugin-astro and prettier-plugin-tailwindcss)

## Architecture

**Rendering**: SSR mode (`output: 'server'`) with Cloudflare adapter. Not a static site.

**Content**: Blog posts are Markdown files in `src/content/blog/` using Astro's content collections with a glob loader. Filenames follow `YYYY-MM-DD-slug.md`. The schema is defined in `src/content.config.js` — posts have `title`, `date`, `author`, `summary`, and an optional `redirect_link` for link-style posts that point to external URLs.

**Routing**: Post pages use dynamic routes at `src/pages/posts/[year]/[month]/[slug].astro`. A middleware (`src/middleware.js`) handles legacy Blogger URL redirects (`/YYYY/MM/slug.html` → `/posts/YYYY/MM/slug`). The `/archive` → `/posts` redirect is in `astro.config.mjs`.

**Layouts**: `src/layouts/Base.astro` is the base HTML layout. `src/components/Layout.astro` wraps pages with header/footer. `src/components/PostLayout.astro` is the blog post layout. `src/components/SimpleLayout.astro` is for simple pages (about, speaking).

**Components**: Mix of `.astro` and `.jsx` (React) components. React is used for interactive components (`Header.jsx`, `SocialIcons.jsx`). The Card component is split into subcomponents (`Card`, `CardTitle`, `CardDescription`, `CardEyebrow`, `CardCta`, `CardLink`).

**Styling**: Tailwind CSS v4 via Vite plugin (not PostCSS). Global styles in `src/css/tailwind.css`. Typography uses `@tailwindcss/typography`.

**Formatting**: Prettier with no semicolons, double quotes. Config in `prettier.config.js`.
