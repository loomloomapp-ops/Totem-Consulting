# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a **greenfield project**: a website for a consulting company ("Консалтингова компанія" / brand **Gasanova**). As of now the repo contains only brand assets and a design-rule system — there is **no application code, no `package.json`, no build/test tooling, and it is not yet a git repository**. The first implementation task will define the stack. The design rules below strongly bias toward **React / Next.js + Tailwind CSS** (with GSAP or Framer Motion for animation), so prefer that stack unless the user asks otherwise.

When you scaffold the project, also initialize git and a dependency manifest so future build/lint/test commands have a home.

## Brand assets (`assets/`)

- `gasanova logo.svg`, `logo totem.svg` — brand logos (raster images embedded inside SVG wrappers; treat as final art, do not try to recolor the embedded bitmap).
- `Ельвіра Гасанова.jpeg`, `Микола Голобородько.jpeg` — real team-member portraits (Elvira Gasanova, Mykola Holoborodko). Use these for any team/about/testimonial section instead of stock or placeholder avatars.

The site content is **Ukrainian**. Keep copy in Ukrainian and avoid the banned AI-cliché phrasing called out in the design rules.

## Design-rule system (`.claude/rules/*/SKILL.md`)

The defining architecture of this repo is its set of **design skills** in `.claude/rules/`. These are project instructions (loaded as CLAUDE.md-level rules) that **override default design behavior** and are mandatory when producing any UI, image, or frontend output. They are not generic advice — they enforce a specific premium, anti-"AI-slop" aesthetic.

The rules overlap and sometimes prescribe different aesthetics, so **choose the skill that matches the requested task** rather than applying all of them at once:

- `taste-skill`, `soft-skill`, `gpt-tasteskill` — high-agency premium frontend engineering (layout variance, motion choreography, anti-cliché component patterns).
- `minimalist-skill` — editorial/utilitarian minimalism (warm monochrome, document-style).
- `brutalist-skill` — industrial brutalism / tactical-telemetry aesthetic.
- `stitch-skill` — generates a `DESIGN.md` design system for Google Stitch (an example `DESIGN.md` already lives in `.claude/rules/stitch-skill/`).
- `redesign-skill` — audit-and-upgrade an existing UI in place without rewriting the stack.
- `image-to-code-skill`, `imagegen-frontend-web`, `imagegen-frontend-mobile` — image-first workflows: generate reference images per section first, analyze them, then implement.
- `brandkit` — premium brand-kit / identity board image generation.
- `output-skill` — full-output enforcement: never emit partial code, `// ...`, "rest follows the same pattern", or truncated deliverables.

### Cross-cutting constraints these rules enforce (apply to all UI work)

- **No emojis** anywhere — in code, markup, comments, or alt text.
- **Banned fonts:** `Inter`, Roboto, Arial, Open Sans, Helvetica for premium/creative contexts. Use `Geist`, `Satoshi`, `Cabinet Grotesk`, or `Outfit`. Generic serifs (Times, Georgia, Garamond) are banned; only distinctive modern serifs (`Fraunces`, `Instrument Serif`) if a serif is needed.
- **Color:** no pure `#000000` (use Zinc-950/off-black), max one accent under ~80% saturation, no purple/blue "AI gradient" glow.
- **Layout:** no 3-equal-column card rows, no always-centered heroes at high variance, CSS Grid over flexbox `calc()` math, `min-h-[100dvh]` never `h-screen`, max-width container ~1400px.
- **Motion:** spring physics over linear easing; animate only `transform`/`opacity`; isolate perpetual/CPU-heavy animations in their own `'use client'` leaf components.
- **Content:** no generic names ("John Doe", "Acme"), no fake round numbers (`99.99%`), no clichés ("Elevate", "Seamless", "Unleash"); use `picsum.photos/seed/{id}/...` for placeholders, never Unsplash.
- **Dependency verification:** before importing any third-party library, check the manifest (once one exists) and surface the install command if missing.

When in doubt about which aesthetic to use for the Gasanova site, default to the premium-but-restrained direction in `taste-skill` / `minimalist-skill`, and always respect the cross-cutting constraints above.
