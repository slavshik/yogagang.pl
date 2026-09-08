# Design plan — yogagang.pl

## Subject

A small yoga community in Warsaw, running since 2023. Not a chain, not a wellness brand.
Audience: people in Warsaw who want a non-performative practice and, mostly, other people.
Primary job of the page: get someone to message the studio or join the group chat.

## Colour — the photographs are the only colour

Sampled from the studio's own photographs: bone walls, grey concrete, black clothing, one deep
pine green, pale birch floor. The interface adds no colour of its own.

    --paper  #E7E6E0   cool bone, green-grey undertone (deliberately NOT warm cream)
    --chalk  #F5F4F0   lightest, for type over photographs
    --ink    #171A12   near-black, pulled toward the pine so it is never a flat grey
    --pine   #2E4033   the one accent, used for links only
    --stone  #5E5D54   secondary text; dark enough to clear 4.5:1 at 15px

## Type — two families, clearly distinct

Familjen Grotesk (variable 400/500) carries everything structural. Swedish, slightly odd 'g'
and 'a', Nordic-clean. Set lowercase in the hero to echo the wordmark.

Newsreader Italic appears in exactly one sentence, the pull quote. It is a quotation of the
studio's own poster typography, so it stays a quotation and never becomes a second voice.

Scale: 13 / 15 / 17 / 22 / 34 / clamped hero. Measure capped at 58ch.

## Layout — paced like a class, not like a pitch

The studio's own posts put _small, tracked type on a big photograph_. Big display type would
have been the default move, not theirs. So the photograph is the hero and the type stays quiet
throughout.

    ┌────────────────────────────────────┐
    │████ full-bleed photo, 100svh  █████│
    │████ (flower mark, top left)   █████│
    │████                           █████│
    │████ body.                     █████│  lowercase, tracked, low-left,
    │████ breath.                   █████│  each word on its own line
    │████ community.                █████│
    └────────────────────────────────────┘
    │                                    │
    │   (a lot of empty paper — the      │
    │    gap is bigger than comfortable) │
    │                                    │
    │   opening statement                │  narrow measure, offset from left,
    │   supporting paragraph             │  never centred
    │                                    │
    │  ┌────────┐   pull quote in        │  photo left, italic serif quote
    │  │ photo  │   italic serif         │  hanging right, aligned to the
    │  └────────┘                        │  photo's lower third
    │                                    │
    │   what happens, as a plain table   │  no cards, no icons, no numbering
    │                                    │
    │  ████ wide photograph ████████████ │
    │                                    │
    │   closing line                     │
    │   two links                        │
    └────────────────────────────────────┘

Alignment is left throughout, on a column offset from the left edge. Centring would make it
read like every other landing page.

## Principles

1. Photographs are the only colour. The interface adds none.
2. Silence is the material. The gaps are deliberately larger than comfortable — that emptiness
   is the design, not an oversight. Resist closing them up.
3. Faces stay out of frame. The photographs show practice, not portraits.
4. One motion moment: the hero type settles on load. Nothing else moves, ever.
5. Spend the boldness on scale and emptiness, not on ornament.

## Review against the usual generated-page defaults

1. Warm cream ground + high-contrast serif display + terracotta accent → avoided: cool bone
   ground, sans display, pine green. The serif appears once, small, as a quotation.
2. Near-black ground with an acid accent → not used.
3. Broadsheet hairlines and dense columns → one hairline rule set on the page, wide single
   column.
4. Cards with uniform radius and soft shadows → no cards, no shadows, no radius anywhere.
5. Tracked all-caps eyebrows, middle dots, monospace labels, arrows appended to links → none.
   The hero is lowercase, echoing the wordmark. Tracked uppercase is the studio's own house
   style but appears nowhere here, because as an eyebrow it is exactly the tell.

## Cut after review

- A large italic-serif hero line. That is the default, and it is louder than anything the
  studio itself publishes. Replaced with a full-bleed photograph and small, quiet type.
- A three-up image grid. Rebuilding a social feed is lazy, and a minimal page does not need it.
  Two photographs besides the hero.
