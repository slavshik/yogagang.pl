# Agent guidance

## Scope and documentation

These instructions apply to the whole repository. `AGENTS.md` is the canonical agent guide;
`CLAUDE.md` must remain a relative symlink to `AGENTS.md`. Edit this file to update either guide.

Keep `README.md` for human visitors: the community, its purpose, and ways to connect. Put
commands, architecture, development rules, and operational details here or in `docs/`, never
in the README. Update relevant guidance when changing the workflow.

## Project map

This is a small, static, one-page website for a yoga community in Warsaw. It uses Vite,
TypeScript, and plain HTML/CSS, with no application framework, backend, or CMS.

- `index.html`: page content, metadata, links, and responsive image markup.
- `src/style.css`: fonts, palette, layout, responsive rules, and motion.
- `src/main.ts`: imports the stylesheet and enables the progressive hero animation.
- `public/`: photographs, self-hosted fonts, favicon, `CNAME`, and `.nojekyll`.
- `vite.config.ts`: build settings, dev server settings, and optional Umami injection.
- `tsconfig.json`: strict browser TypeScript; `tsconfig.node.json`: build config checks.
- `Makefile`: project build/check targets; `make/vite.mk`: portable Vite server targets.
- `.github/workflows/ci.yml`: pull request and non-main branch checks.
- `.github/workflows/deploy.yml`: publishes GitHub Pages on pushes to `main`.
- `docs/design.md`: design intent; read before visual changes.
- `docs/dns.md` and `docs/analytics.md`: operational setup notes. Verify external state before
  treating historical DNS records, setup status, or provider pricing as current.

## Local workflow

Use Node.js 22 from `.nvmrc` and npm with the committed `package-lock.json`.

```sh
npm ci            # install the locked dependencies
make              # dev server; requested port 5173, bound to 0.0.0.0
make tailscale    # dev server bound to this machine's Tailscale IPv4
make build        # TypeScript checks and production build into dist/
make preview      # serve dist/ after building; requested port 4173
make check        # TypeScript checks and repository-wide Prettier check
```

Equivalent npm scripts are in `package.json`. `make lan` aliases the default dev target.
Use the URL Vite actually prints: it may select another port if the requested one is occupied.
Tailscale must be installed and connected for `make tailscale`; the Vite `allowedHosts`
setting permits tailnet hostnames.

## Editing rules

- Inspect `git status` and relevant files first. Preserve unrelated work and keep the diff
  focused on the requested change.
- Preserve the small static architecture. Add dependencies or a framework only when the task
  needs them. Update `package-lock.json` alongside dependency changes.
- Edit source files, never generated `dist/` output or `node_modules/`.
- Follow `.prettierrc.json`: tabs, single quotes, semicolons, trailing commas, 100-column width.
  Format changed supported files with `npx --no-install prettier --write <files>`.
- `index.html` is deliberately excluded from Prettier. Preserve its hand alignment and useful
  comments; do not force-format it.
- `make/vite.mk` is a verbatim shared target set from `../paper-io`, also used by
  `../slavshik.github.io`. Keep project-specific changes in the root Makefile; preserve the
  shared file unless the task explicitly changes those portable targets.
- Keep browser code free of Node globals such as `process.env`; environment access belongs
  in the build configuration.

## Content and design

The page uses studio-supplied English copy. Do not invent class times, prices, contact links,
or claims. Schedules and prices are plain text in `index.html`; use supplied updates and keep
the Telegram group as the source for the coming week's schedule.

Preserve the photographic focus, cool neutral palette, left alignment, and generous spacing
described in `docs/design.md`. Familjen Grotesk is the main face; Newsreader italic is reserved
for the pull quote. Fonts and images are self-hosted.

Keep the page readable without JavaScript. Hero animation is enabled by the `.js` class and
respects reduced-motion preferences. Preserve semantic markup, visible keyboard focus,
descriptive alt text, image dimensions, responsive sources, and lazy loading below the fold.

## Validation and handoff

For code, configuration, or dependency changes, run `make check` and `make build`; these cover
the checks in CI. There is currently no automated test suite. For documentation-only changes,
run `npm run format:check` and verify changed links and the `CLAUDE.md` symlink.

For visible page changes, also inspect a local preview at narrow and wide widths, check
keyboard navigation and reduced motion, and confirm content remains visible without
JavaScript. For analytics changes, inspect production HTML with the website ID both unset
and set to verify the conditional injection. Report checks run, any failures or checks you
could not perform, and remaining limitations. Review the final diff for unrelated changes.

## Deployment and analytics

Pushing to `main` triggers publication to GitHub Pages; the deploy workflow also supports
manual dispatch. Treat a push to `main` as a production deployment. `public/CNAME` holds
`yogagang.pl`, `public/.nojekyll` disables Jekyll processing, and Vite copies both into `dist/`.
The Vite base is `/` for the custom domain; project-subpath previews need different settings.

The Umami plugin injects a deferred script only during builds with a nonempty
`UMAMI_WEBSITE_ID`. The deployment reads it from a GitHub Actions repository variable, not a
secret. Preserve the domain restriction to `yogagang.pl,www.yogagang.pl` and the absence of an
analytics tag when the ID is unset. See `docs/analytics.md` for setup and `docs/dns.md` for
domain setup; do not assume those external steps have been completed.

## Commits

Use Conventional Commits: `<type>[optional scope]: <description>`.
Use `feat` or `fix` for page behavior or visual changes, `docs` for prose, `build` for Vite/npm/
Makefile changes, `ci` for workflows, and `chore` for other maintenance. `style` means formatting,
not CSS design changes. Write an imperative, lower-case description, keep the header under
about 72 characters, and mark breaking changes with `!` before the colon. Explain why in the
body when needed; avoid restating the diff.
