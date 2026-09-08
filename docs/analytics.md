# Analytics

[Umami Cloud](https://cloud.umami.is). Chosen because it is free at this site's scale, sets no
cookies — so the page needs no consent banner, which would have wrecked the design — and ships
2.3 kB gzipped.

Size was the deciding factor. Measured against the live scripts, gzipped:

| Provider                 | Transfer   | Cost                               |
| ------------------------ | ---------- | ---------------------------------- |
| Plausible                | 1.3 kB     | ~$9/mo                             |
| **Umami Cloud**          | **2.3 kB** | **free — 100k events/mo, 3 sites** |
| GoatCounter              | 3.3 kB     | free, non-commercial only          |
| Cloudflare Web Analytics | 10.1 kB    | free, unlimited                    |

For scale, the whole page is about 4.3 kB of HTML, CSS and JS gzipped. Cloudflare's beacon
would have more than doubled it. Plausible is lighter than Umami but costs money every month
for a site that will see a few hundred visits, and Umami's free tier caps at 100k events —
roughly two hundred times what this site is likely to do.

## The one limit worth knowing

The free tier keeps **6 months** of data. Fine for "is anyone reading this", not enough for
year-over-year. If that starts to matter, the Pro plan is $20/mo, or Umami is MIT-licensed and
self-hostable.

## Turning it on

1. Sign up at <https://cloud.umami.is> (no card) and add `yogagang.pl` as a website.
2. Copy its **Website ID** — a UUID like `94db1cb1-74f4-4a40-ad6c-962362670409`.
3. In the repository: **Settings → Secrets and variables → Actions → Variables → New repository
   variable**, named `UMAMI_WEBSITE_ID`, with that UUID as the value.
4. Re-run the deploy workflow, or push anything to `main`.

A **variable**, not a secret: the id is visible in the served HTML by definition, so hiding it
buys nothing and a secret would only make it harder to see what is deployed.

## How it is wired

There is no analytics tag in `index.html`. The `umami()` plugin in `vite.config.ts` injects one
at build time, and only when `UMAMI_WEBSITE_ID` is set. Three consequences worth keeping:

- A build without the variable — every `make dev`, every fork, and every deploy before you
  finish step 3 — ships **no third-party request at all**, rather than a script tag pointing at
  an empty id.
- `data-domains="yogagang.pl,www.yogagang.pl"` means the tracker matches
  `window.location.hostname` and stays silent anywhere else, so localhost and tailnet previews
  cannot pollute the dashboard even if the variable is exported locally.
- `defer` keeps it off the critical path: fetched in parallel, run after parsing, so it cannot
  delay first paint.

To check what a build actually produced:

```sh
grep -o '<script[^>]*umami[^>]*>' dist/index.html
```

Empty output means no analytics in that build, which is the correct result locally.

## Switching providers later

All four options above are a single `<script>` tag. Change the `src` and the data attributes in
the `umami()` plugin, rename the environment variable, and update the workflow. Nothing else in
the site touches analytics.
