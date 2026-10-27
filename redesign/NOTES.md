# VibeForce redesign: notes (2026-10-26)

## generated media (fal)

Made by `redesign/media.mjs` (the prompts are in that file; each request, with its id and price, is in
`redesign/media-log.json`). The key is read from the .env cascade on the build machine and never reaches the client.
fal's originals stay in `redesign/.src/` (not committed, not deployed).

| shot | still | motion | seconds | cost |
|---|---|---|---|---|
| yard (hero) | fal-ai/nano-banana-pro, 16:9 | fal-ai/kling-video/v2.5-turbo/pro/image-to-video | 10 | $0.15 + $0.70 |
| proof | fal-ai/nano-banana-pro, 16:9 | same | 5 | $0.15 + $0.35 |
| route | fal-ai/nano-banana-pro, 16:9 | same | 5 | $0.15 + $0.35 |
| **total** | | | | **$1.85** of $15 |

Prices are fal's list prices read from `api.fal.ai/v1/models/pricing` on the day. Encodes: AV1 (libaom, CRF 40) and
H.264 (CRF 29) at 1280 wide, muted, 0.36–0.70 MB per loop; WebP posters at 1280 and 640. Every clip is captioned
"Generated footage. Not a real mission." and the FAQ says so too. No face, no readable text, no logo.

Other assets made here: `wordmark.svg` (Barlow Condensed ExtraBold outlines with hand-set kerning, cut by one band,
the reflective-tape gap; made by `redesign/wordmark.py`), `mark.svg`, `touch-icon.png`, `og.png` (rendered
from the site's own CSS with Playwright). Fonts: Barlow, Barlow Condensed, Barlow Semi Condensed (OFL, `fonts/OFL.txt`),
latin subsets, self-hosted.

## look-at-it rounds (Playwright, 1440 / 768 / 390 / 320 + reduced motion)

1. Buttons: the 3 px rule did not follow the chevron point → the sign is now two clip-paths (rule, face).
   Manifest: job labels were invisible (global `label` colour), evidence items were numbered as manifest lines
   (nested `li`) → scoped to `#mf > li`.
2. Mobile: the clip's pause control covered the copy in full-screen sections → top-left everywhere.
3. zh-Hans: the 0.84 display leading made CJK lines collide → `:lang(zh)` leading 1.08 and a smaller hero.
   About: the hero inherited the two-column manual grid → block. App: an empty toast showed as a black square.
   Team: one card alone in a wide row → groups side by side at ≥ 900 px.
4. Font swap moved the app's heading at 390 (CLS 0.18) → fonts preloaded on every page, fallback size-adjusted.
   Team LCP 2.7 s (first portrait lazy) → eager with `fetchpriority`.

## measured (local static server, Chromium, slow 4G 1.6 Mb/s + 150 ms RTT, CPU ×4)

| page | LCP 390 / 1440 | CLS 390 / 1440 | JS before interaction | axe-core 4.14 WCAG 2.2 AA |
|---|---|---|---|---|
| / | 1868 / 2036 ms | 0.021 / 0.002 | 11.0 KB | 0 violations |
| /app/ | 992 / 1012 ms | 0.012 / 0.001 | 38.8 KB | 0 |
| /about.html | 600 / 588 ms | 0.036 / 0.035 | 0 | 0 |
| /team.html | 2124 / 2124 ms | 0.000 / 0.001 | 0 | 0 |
| /team-callum-reid.html | 996 / 1612 ms | 0.046 / 0.001 | 0 | 0 |
| /es/, /zh/ | 1384–2024 ms | ≤ 0.033 | 11.0 KB | 0 |

The sample dispatch was driven by keyboard and pointer in Playwright: the live region says "Sample job VF-S-0142
dispatched on this page only. Seven lines filled. Nothing was sent." Under reduced motion the manifest fills at once
and the clips stay as posters until "Play motion" is pressed.

## scores (mine, after round 4)

| art direction | brand specificity | product expression | interaction | technical quality | craft | mean |
|---|---|---|---|---|---|---|
| 8 | 9 | 8 | 8 | 8 | 8 | 8.2 |

Weakest: the inner pages (about, team profiles) are restyled manuals, not composed plates; the app keeps its
original layout under the new signage.
