# Gordon Mei — Portfolio

Night Market-themed portfolio with scroll-driven parallax, color transitions, and flippable project cards.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **CSS Modules** (zero external UI libraries)
- **Google Fonts** — Cinzel (display) + Crimson Pro (body)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

That's it — Vercel auto-detects Next.js.

## File Structure

```
portfolio/
├── app/
│   ├── globals.css       # Design tokens, resets, fonts
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Scroll orchestration (the brain)
│   └── page.module.css   # Scroll spacer
├── components/
│   ├── ParallaxBg        # Layered SVG mountains + scroll-driven color lerp
│   ├── Petals            # Canvas floating petal animation
│   ├── Navbar            # Fixed nav with active section highlight
│   ├── ProgressDots      # Right-side section indicator
│   ├── HeroSection       # Name, subtitle, social icons
│   ├── ExperienceSection # 2×2 experience grid + bio strip
│   ├── ProjectsSection   # Night Market card row
│   ├── NightMarketCard   # Flip card shell (state)
│   ├── CardFront         # Crystal shards + ornaments
│   └── CardBack          # Project info, tags, stars, link
└── lib/
    └── data.ts           # All content — projects, experience, socials
```

## Customisation

**Adding a project** — edit `lib/data.ts`, add an entry to the `projects` array.  
Crystal color is a 4-value array: `[shardOuter1, shardOuter2, shardCenter1, shardCenter2]`.

**Changing scroll timing** — the `r` breakpoints in `app/page.tsx` control when each section
fades in and out. All values are fractions of total scroll (0–1).

**Color palette** — CSS variables in `app/globals.css` under `:root`.

## Scroll Math

Total scroll height = `window.innerHeight × 3` (set in `page.tsx`).

| Range | Effect |
|---|---|
| 0 – 30% | Hero fades out, sunset → navy |
| 28 – 52% | Experience fades in |
| 60 – 74% | Experience fades out |
| 65 – 85% | Projects fades in |
