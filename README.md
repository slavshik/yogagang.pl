# yogagang.pl

A one-page site for yoga gang, a yoga community in Warsaw. Static, no framework: one HTML file, one stylesheet, three photographs.

Live at <https://yogagang.pl> once the domain points at GitHub Pages. Two steps are left and
both need a human: [docs/dns.md](docs/dns.md) for the DNS records, and
[docs/analytics.md](docs/analytics.md) to switch analytics on.

## Running it

```sh
npm install
make            # dev server on 0.0.0.0:5173
make tailscale  # same, bound to this machine's tailnet address
make preview    # serve the production build
make build      # typecheck + vite build into dist/
make check      # typecheck + prettier --check
```

`make/vite.mk` is copied verbatim from `../paper-io` and is meant to stay that way: it is the
same portable target set used there and in `../slavshik.github.io`. `make tailscale` reads
`tailscale ip -4` and binds Vite to it, so the page opens on a phone that shares the tailnet
without exposing anything to the LAN. `server.allowedHosts` in `vite.config.ts` is what stops
Vite rejecting the tailnet hostname.

## Deploying

Every push to `main` builds and publishes to GitHub Pages (`.github/workflows/deploy.yml`).
There is nothing to run by hand.

`public/CNAME` holds the custom domain and `public/.nojekyll` stops Pages running Jekyll over
the build. Both are copied into `dist/` by Vite.

## Analytics

Umami, injected at build time only when the `UMAMI_WEBSITE_ID` repository variable is set — so
local builds and forks ship no third-party request at all. 2.3 kB gzipped, no cookies, no
consent banner. [docs/analytics.md](docs/analytics.md) covers the setup and why this one.

## Copy

The words on the page are the studio's own, supplied by them. The schedule and the prices are
what will go stale: they are plain text in `index.html`, there is no CMS, and there does not
need to be. Times shift from week to week, which is why the page names the days but points
people to the group chat for the actual week rather than pretending to be authoritative.

## Design

The full plan lives in `docs/design.md`. The short version: the photographs are the only
colour on the page, the interface adds none, and the gaps between sections are deliberately
larger than they look like they should be. Two typefaces — Familjen Grotesk throughout, and
Newsreader italic for exactly one sentence. Both are self-hosted from `public/fonts/` in their
latin cut only.
