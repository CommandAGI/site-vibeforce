# VibeForce: the dispatch board

*Designer's voice: workwear and logistics signage. I make things people read at four metres, in rain, with gloves
on.*

## concept

The page is a dispatch board for a crew. Every section is a sign, a manifest or a tag you would find in a depot: bay
numbers, hi-vis tape, stencilled letters, equipment tags on a rail, sleeve chevrons, a tariff board. The product is
shown as the thing it makes: a **mission manifest** that fills itself, line by line, when you dispatch a sample job.
It must be excellent on a phone in a yard: big targets, one column, the dispatch bar under the thumb.

## type

- Display: **Barlow Condensed** 800 (signage), 600 (labels). Uppercase only at display and tag sizes, tracked +0.02em
  at display, +0.08em at tags.
- Text: **Barlow** 400/600, italic 400 for asides. Body 18 px at 1440, 17 px at 390; line-height 1.45.
- Tags and numbers: **Barlow Semi Condensed** 600, `font-variant-numeric: tabular-nums` everywhere a number lines
  up (prices, timecodes, bay numbers).
- Scale: ratio 1.333 (perfect fourth) from 17 px; the hero line breaks the scale on purpose (clamp to 17vw at 320 px,
  14rem at 2560). `text-wrap: balance` on headings, `pretty` on paragraphs.
- Self-hosted latin subsets, `font-display: swap`, a metric-matched fallback (`Arial Narrow`/`Arial` with
  `size-adjust`), so the swap does not move the page. zh-Hans falls back to the system CJK sans at the same weights.

## colour (OKLCH, sRGB fallback first)

| token | hex | OKLCH | use |
|---|---|---|---|
| concrete | #e9e7df | 92.7% 0.011 95 | page |
| concrete-2 | #d9d6cb | 87.5% 0.015 94 | rails, rules on concrete |
| forest | #14372e | 30.8% 0.044 174 | ink, signage panels |
| ink | #15191a | 21.0% 0.006 214 | body text on concrete |
| hi-vis lime | #dcfa43 | 93.3% 0.198 119 | tape, the call to dispatch, focus fill — never text on concrete |
| signal orange | #fa774d | 71.6% 0.171 38 | warnings, "illustrative" tags, the hazard edge; on forest or with ink text only |
| orange text | #b2401b | 52.6% 0.156 37 | orange words on concrete |

Measured contrast: forest on concrete 10.5:1; ink on concrete 14.3:1; forest on lime 11.0:1; ink on orange 6.6:1;
orange on forest 4.8:1 (large text and tags only); orange-text on concrete 4.7:1. Lime never carries text on concrete
(1.1:1); it is a fill behind forest or ink.

## shape

Zero radius, everywhere. Rules are 3 px (forest) and 1 px (concrete-2). Buttons are **signs**: a rectangle with a
chevron end (`clip-path`), 3 px forest border drawn as an inset shadow, lime fill for the one action that dispatches,
concrete fill for the rest; press moves the sign 2 px down, no shadow. Focus: a 3 px signal-orange outline offset 3 px
plus the lime fill: seen on concrete, on forest and on video.

## layout

- **1440 / 2560**: a 12-column grid of 96 px bays, max 1600 px; the hero is a 7/5 split (type / framed clip); the
  manifest sits on a forest panel full bleed. 2560 widens the gutters, not the line length (max 62ch).
- **768**: 6 columns; the hero stacks (type, then a 16:9 clip); tags two by two.
- **390**: one column, 20 px gutters; the nav moves into a **fixed dispatch bar** at the bottom (Home, Mission
  control, Pricing, language) — 56 px targets, under the thumb; the manifest rows become full-width strips, the
  dispatch button is full width.
- **320**: the hero line is set at 17vw so DEPLOY / ANYWHERE fits on two lines; tags one per row; the tariff board
  becomes three stacked boards.

## nav

A forest **signage strip** at the top: the stencilled wordmark left, then numbered bays (`01 HOME`, `02 MISSION
CONTROL` …), the language switch as a three-position plate. Under 760 px the bays move to the bottom dispatch bar.
No hamburger.

## motion grammar: "stamped, not floated"

Things arrive like stencil stamps and tape: a hard 120 ms cut-in with a 2 px drop, never a fade-up-and-scale. The
manifest fills row by row at 140 ms per row; each row gets a lime tape stripe that wipes left to right. The route
line (how it works) fills lime with scroll (`animation-timeline: view()`), stop by stop. Tags on the rail swing 2°
when hovered, then settle. Videos are slow (locked-off or a slow dolly), muted, looped.

Reduced motion: the manifest fills at once; the route is drawn full; tags do not swing; videos do not play — their
graded poster frames stand, with the caption.

## media plan (fal, budget $15, used $1.85)

Three clips, all graded the same way in `redesign/media.mjs`: saturation 0.78, blacks pushed towards forest, fine
grain. Nobody's face, no readable text, no logo, captioned "Generated footage. Not a real mission."

1. `yard` — top-down concrete yard, painted bays, one operator in hi-vis crossing with a hard case. Hero clip (10 s).
2. `proof` — gloved hands photograph a pallet with a phone. Full-screen section "Money waits for proof" (5 s).
3. `route` — dusk, a wet crossroads in an unnamed industrial district, an unmarked van with its doors open. Full-screen
   section "Where your team is not" (5 s).

Each: AV1 + H.264, 1280 wide, under 3 MB; poster WebP (1280 and 640); the hero clip loads after its poster; the
others load when near the viewport.

## signature moment

**Dispatch a sample job.** Choose one of three job tags (supplier check · Shenzhen, pop-up · Osaka, prototype
delivery · Berlin). Press DISPATCH. The manifest stamps its seven lines: objective, place, skills, acceptance,
operator, evidence, approval. The operator is a fictional sample; the approval line says "approved — sample, nothing
dispatched". The whole manifest is labelled illustrative and announced in an `aria-live` region; it works by keyboard
and with JavaScript off (the first job is printed in full in the HTML).

## sections (each says one thing)

1. Hero — DEPLOY ANYWHERE. / Boots on the ground, by the hour. Framed yard clip. Two signs.
2. Manifest — dispatch a sample job.
3. Proof (full-screen clip) — Money waits for proof.
4. Route — brief, match, execute, evidence, pay: five stops on one line.
5. Rail — six equipment tags: accounts, dispatch, escrow, records, trust, anywhere.
6. Ladder — four ranks as sleeve chevrons.
7. Anywhere (full-screen clip) — Where your team is not.
8. Tariff board — Launch, Growth, Platinum.
9. Field notes — the questions.
10. Footer — the wordmark across the full width over a hazard edge.

## don'ts

No rounded corners. No soft shadows. No gradients except the hazard stripe (a hard repeating stripe). No lime text on
concrete. No icons in boxes. No fake numbers: no counters, no "operators online", no ratings outside the demo.
