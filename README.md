# ஓலை·AI — Olai Restore

A restoration workbench for Tamil palm-leaf manuscripts. This is the main app built from the `olaiprototype` HTML prototype.

## What it does

A 6-step interactive pipeline, all running live in your browser:

1. **Select leaf** — pick a sample manuscript (Puṟanāṉūṟu, Tirukkuṟaḷ, family jathakam) or upload your own scan
2. **Preprocess** — real pixel filters: contrast boost, fiber denoise, edge sharpen
3. **Damage diagnosis** — live pixel-level analysis scores structural risk (severity, insect damage, fading) with conservation recommendations
4. **AI restoration** — masked characters reconstructed with simulated per-word confidence; heatmap toggle
5. **Translation** — original register, modern Tamil, English, and literary context
6. **Archive search** — restored manuscripts become instantly searchable

## Tech

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS 4
- The interactive workbench ships as vanilla JS (`app/olai/olai-prototype.js`) hosted by a React client component (`app/olai/OlaiPrototype.tsx`), preserving the original prototype behaviour byte-for-byte
- Fonts self-hosted via `next/font`: Fraunces, Noto Serif Tamil, Inter, IBM Plex Mono
- Original design artifact kept at `olaiprototype/olai-ai-prototype.html`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production build

```bash
npm run build
npm run start
```
