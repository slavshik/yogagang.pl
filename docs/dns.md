# Pointing yogagang.pl at GitHub Pages

The site is already built, deployed and serving from GitHub Pages; the custom domain is set on
the repository. The only thing missing is DNS, which only the domain owner can change.

## Do you need Cloudflare? No.

Short answer: put the records in GoDaddy and stop. GitHub Pages already gives you a global
CDN, HTTP/2 and a free auto-renewing TLS certificate, which is most of what people move a
static site to Cloudflare for. And analytics is not a reason either — Cloudflare Web Analytics
works on any site without touching DNS, and this site uses Umami anyway.

Putting Cloudflare's **proxy** (the orange cloud) in front of GitHub Pages actively costs you
something. GitHub cannot issue the certificate while the record is proxied, so you have to
bootstrap the domain DNS-only, wait for the certificate, flip the proxy on, set SSL mode to
Full (strict) — anything less gives a redirect loop, because Pages forces HTTPS — and then add
a rule letting `/.well-known/acme-challenge/*` through so the certificate can still renew a
year later. That is four ways to quietly break the site in exchange for a CDN in front of a
CDN.

Moving **nameservers** to Cloudflare while leaving every record DNS-only (grey cloud) is
harmless and gives you a much better DNS editor than GoDaddy's. Worth doing if you are going to
be changing records often, or if you might move the site to Cloudflare Pages later. Not worth
doing today. Instructions are at the bottom if you want them anyway.

## What is in the zone right now

```
yogagang.pl.       NS     ns59.domaincontrol.com. ns60.domaincontrol.com.
yogagang.pl.       A      76.223.105.230
yogagang.pl.       A      13.248.243.5
www.yogagang.pl.   CNAME  yogagang.pl.
```

Those two A records are GoDaddy's parking page, not yours — the server answering on them
identifies itself as GoDaddy's Domain Parking Service. They have to go.

## The change, in GoDaddy

Domain portfolio → **yogagang.pl** → **DNS** → **DNS Records**.

**1. Turn off parking and forwarding first.** GoDaddy re-creates the parking A records if
domain forwarding is still on, and you will spend an evening wondering why your edits keep
reverting. On the domain's settings page, make sure **Forwarding** is empty for both the
domain and `www`.

**2. Delete both existing `A` records for `@`** (`76.223.105.230` and `13.248.243.5`).

**3. Add four `A` records for `@`:**

| Type | Name | Value             | TTL     |
| ---- | ---- | ----------------- | ------- |
| A    | `@`  | `185.199.108.153` | 600 sec |
| A    | `@`  | `185.199.109.153` | 600 sec |
| A    | `@`  | `185.199.110.153` | 600 sec |
| A    | `@`  | `185.199.111.153` | 600 sec |

All four, not one. They are GitHub's four Pages edge addresses, and listing every one is what
keeps a single edge failing from taking your site down with it. Use a short TTL while you are
setting this up — you can raise it to an hour once it works.

**4. Add four `AAAA` records for `@`,** same idea over IPv6:

| Type | Name | Value                 |
| ---- | ---- | --------------------- |
| AAAA | `@`  | `2606:50c0:8000::153` |
| AAAA | `@`  | `2606:50c0:8001::153` |
| AAAA | `@`  | `2606:50c0:8002::153` |
| AAAA | `@`  | `2606:50c0:8003::153` |

Optional, but skipping it means IPv6-only clients — some mobile networks — cannot reach the
site at all.

**5. Change the `www` CNAME** from `yogagang.pl` to `slavshik.github.io`. Note it is the
GitHub user domain with no repository name on the end; GitHub works out which repository from
the `CNAME` file in the build.

## Then, in the repository

**Settings → Pages** already has the custom domain set to `yogagang.pl`. Once DNS has
propagated:

1. Reload the page. The DNS check should go green. If it complains, hit **Save** on the domain
   again to force a re-check rather than assuming it is broken.
2. Tick **Enforce HTTPS**. The certificate comes from Let's Encrypt and can take up to an hour
   to issue; the tickbox stays greyed out until it is ready. This is normal, not a fault.

## Checking it

```sh
dig +short yogagang.pl A          # expect the four 185.199.x.153 addresses
dig +short www.yogagang.pl CNAME  # expect slavshik.github.io.
curl -sI https://yogagang.pl | head -1
```

Propagation is usually minutes and occasionally a few hours. To see whether the site itself is
fine before DNS catches up, bypass DNS entirely:

```sh
curl -s --resolve yogagang.pl:80:185.199.108.153 http://yogagang.pl/ | head -20
```

That is how this deployment was verified in the first place, and it returns the real page.

## Until DNS lands

`base` is `/` in `vite.config.ts`, so asset paths assume the apex domain. That means
<https://slavshik.me/yogagang.pl/> (where `slavshik.github.io` redirects) serves the HTML but
no CSS or images. Expected, not a bug — it fixes itself the moment the domain points here. To
preview under the project path instead, set `base: '/yogagang.pl/'` and delete `public/CNAME`.

## If you do want Cloudflare DNS anyway

Free plan, nameservers only, every record left grey:

1. Add `yogagang.pl` as a site in Cloudflare. It will import the existing records — check the
   import and delete the parking A records if they came across.
2. Enter the records above, and set every one to **DNS only** (grey cloud, not orange).
3. Cloudflare shows you two nameservers. In GoDaddy: domain → **Nameservers** → **Change** →
   **I'll use my own nameservers**, and replace `ns59/ns60.domaincontrol.com` with them.
4. Wait for Cloudflare to report the zone active — usually under an hour, occasionally 24.

Leave it grey unless you have a specific reason. If you later decide you do want the proxy on,
re-read the second paragraph of this document first.
