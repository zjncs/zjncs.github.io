# Pages CMS Setup

This repo is now prepared for Pages CMS, which is a free Git-based CMS for static sites.

## Why this path

CloudCannon is cleaner, but it is paid.
Pages CMS is officially 100% free and works directly on top of GitHub.

Official docs:
- https://pagescms.org/
- https://pagescms.org/docs/
- https://pagescms.org/docs/configuration/

## Repo files added

- `/.pages.yml`
- `/PAGESCMS_SETUP.md`

## How to start

1. Open `https://app.pagescms.org/`
2. Sign in with GitHub
3. Open the `zjncs/zjncs.github.io` repository on branch `main`
4. Pages CMS will read `/.pages.yml`

## Configured media path

Uploads go to:
- repo path: `source/images/uploads/`
- public URL path: `/images/uploads/...`

## Configured content types

- Posts: `source/_posts`
- Drafts: `source/_drafts`
- About: `source/about/index.md`
- Essay: `source/essay/index.md`
- Gallery: `source/gallery/index.md`
- Wiki Page: `source/wiki/index.md`
- Link Page: `source/link/index.md`
- Life Page: `source/life/index.md`
- Wiki Data: `source/_data/wiki.yml`
- Link Data: `source/_data/link.yml`
- Life Data: `source/_data/life.yml`

## Practical advice

- Use `Posts` for normal writing.
- Use `About` / `Essay` for singleton markdown pages.
- Use `Wiki Data` / `Link Data` / `Life Data` to edit those structured pages instead of touching wrapper markdown.
- `Gallery`, `Wiki Page`, `Link Page`, `Life Page` keep raw markdown/tag wrappers, so they are configured conservatively.

## Important limitation

Pages CMS should solve the CMS and upload side.
It will not automatically fix Hexo theme bugs, KaTeX rendering issues, or custom tag runtime bugs.
