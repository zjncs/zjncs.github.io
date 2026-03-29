# CloudCannon Setup

This repository is prepared for CloudCannon so editing can move off the current Decap CMS path.

## What is already configured

- Global CloudCannon config: `/cloudcannon.config.yml`
- Initial site settings: `/.cloudcannon/initial-site-settings.json`
- New file schemas:
  - `/.cloudcannon/schemas/post.md`
  - `/.cloudcannon/schemas/draft.md`

## Expected build settings

CloudCannon should auto-detect these during Site creation:

- SSG: `Custom SSG` (`other`)
- Hosting mode: `hosted`
- Install command: `git submodule sync --recursive && git submodule update --init --recursive && npm ci`
- Build command: `npm run build`
- Output path: `public`
- Include Git folder: `true`
- Node version: `18`

## Recommended editor usage

- `posts` / `drafts`: use Content Editor for normal writing, switch to Source Editor when editing formulas, Hexo tags, or exact Markdown.
- `about` / `essay`: Content or Source is fine.
- `gallery`: use Source Editor, because the page uses Hexo tags.
- `wiki_data` / `link_data` / `life_data`: use Data Editor.
- `wiki_page` / `link_page` / `life_page`: usually leave body unchanged; they are wrappers around Hexo tags.

## Image uploads

CloudCannon is configured to upload images into:

- repo path: `source/images/uploads/`
- public path after Hexo build: `/images/uploads/...`

This avoids the current Decap-specific upload hacks.

## What CloudCannon will solve

- Rich text / markdown editor instability in Decap
- image upload and media management
- field-to-field mixups caused by custom Decap scripting
- Git-backed editing without Netlify Identity + custom upload glue

## What CloudCannon will not solve automatically

- Hexo theme rendering bugs
- KaTeX / Mermaid / custom Hexo tag runtime behavior on the final site
- anything caused by the Butterfly theme or custom render scripts themselves

## Final external step you still need

1. Create a CloudCannon site from this repository.
2. Let CloudCannon read `/.cloudcannon/initial-site-settings.json`.
3. Confirm the detected build settings.
4. Use CloudCannon for content editing.
5. Keep the existing GitHub Actions deploy flow, or later move public hosting if you want.

Until that step is complete, the old `/admin` path still exists only as a temporary fallback.
