# VibeForce: content audit (2026-10-26)

The site before the redesign: static HTML, one `style.css`, no build, a strict CSP (`script-src 'self'`,
`connect-src 'none'`). Three locales (en, es, zh-Hans) with `hreflang` links.

## routes (every one kept)

| route | what it is | kept as |
|---|---|---|
| `/` `/es/` `/zh/` | landing: hero, how it works (5 steps), six capabilities, operator ladder (4 ranks), plans, FAQ | redesigned, same facts, fewer words |
| `/app/` `/es/app/` `/zh/app/` | **mission control, the working demo** (`app/app.js`): brief → scope → shortlist → escrow milestones → dispatch → pipeline (matching, field, review, paid) → accounts; localStorage per locale; reset | same script, untouched; restyled |
| `/about.html` (+ es, zh) | what it is, who for, how it runs, team, what it does not do, contact | restyled |
| `/team.html`, `/team-<name>.html` | three AI-agent personas, generated portraits, "AI agent" badges, disclosure | restyled; team page's canonical fixed (it pointed at about.html) |

## real workflows

- The demo in `app/`: a keyword-rule planner on fictional data. It sends nothing and dispatches nothing.
- `mailto:hello@vibeforce.pro` (Platinum, contact). `https://vibeforce.pro/` link.
- Language switch on every page.

## what is a demo, what is a claim

- Demo (labelled illustrative everywhere it appears): the operators, their names, ratings, records; missions; the
  sample job on the landing; prices inside the demo.
- Owner's claims kept verbatim: plan prices ($99, $349, "Talk to us") with "prices are the owner's and change with
  notice"; "50+ cities"; the ladder ranks; vetting before a first mission.
- Disclosures kept: the demo runs in the browser; the operators are fictional; VibeForce does not do a site's legal or
  safety checks; the team are AI agents with human sign-off.
- Generated media (new): three fal clips. Each carries a caption "Generated footage. Not a real mission." No person's
  face is shown; nothing poses as a customer, an operator or a real event.

## what the redesign removes

Nothing that works. The landing's long paragraphs are cut to one line per idea; their facts move to the FAQ or stay
on the about page.
