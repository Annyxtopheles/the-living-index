# Atelier des Ombres 🏛️

> A museum-grade digital collection framework engineered for independent collectors, gallery archivists, and curators. Inaugurated with **Folio I: The Visceral Line (Francisco Goya & Francis Bacon)**.

**Atelier des Ombres** (Studio of Shadows) is an open-source, serverless, zero-maintenance digital archival platform. In alignment with modern decentralized and static web standards, it uses GitHub as its database via a single version-controlled `collection.json` file and compiles into a static web application deployable directly to Vercel, Cloudflare Pages, or GitHub Pages.

---

## 🌑 Current Exhibition: Folio I — The Visceral Line

A curatorial dialogue between two centuries of existential dread: from **Francisco Goya’s** secluded madness on the plaster walls of the *Quinta del Sordo* (the *Pinturas Negras*, 1819–1823) to **Francis Bacon’s** post-war screaming figures trapped in optical geometric cages (1944–1954).

---

## ✨ Architectural Features

- 📁 **Git-Driven JSON Schema (`collection.json`)**: Curate and manage high-resolution archival specimens, accession numbers, physical dimensions, and provenance trails using version control.
- 🎨 **Context-Aware Dynamic Theme Engine**: Live-switchable aesthetic philosophies:
  - **Editorial Serif**: Harriet-inspired layout margins, classic serif typography (*Cinzel*, *Cormorant Garamond*, *Newsreader*), warm aged bone ivory paper (`#FAF7F2`), and deep dried oxblood accents (`#421515`).
  - **Monochrome Index**: Rigid monospaced grid, high-contrast dark palette, and phosphor white telemetry markers.
- 🔬 **Museum Specimen Micro-Viewer Lightbox**:
  - Hardware-accelerated matrix transforms (`translate3d` + `scale`).
  - Cursor-focal pointer-wheel zoom (`0.6x` to `6.5x`).
  - Grab-and-drag panning with pointer capture.
  - Keyboard navigation (`Esc` dismiss, `ArrowLeft` / `ArrowRight` stepping, `+`/`-` zoom, `0` reset).
  - Pinned asymmetrical museum wall label with full provenance and custodial records.
  - **1-Click Chicago Manual of Style Citation Generator** for academic and scholarly reference.
- ⏳ **Chronological Folio & Axis**:
  - Interactive era filtering spanning the two centuries (1819–1954).
  - Interactive year scrubber with zero Cumulative Layout Shift (CLS = 0).
- 📜 **Fine-Press Exhibition Colophon**:
  - Typeset documentation of typeface foundries, curatorial direction, and open scholarly ledger standards.
- ⚡ **100% Serverless & Static**: Powered by Next.js App Router static export (`output: 'export'`). Zero database hosting fees, zero backend maintenance.

---

## 🛠️ Tech Stack

- **Framework**: React 19 / Next.js (App Router, Static Export)
- **Styling**: Tailwind CSS with dynamic CSS variable tokens and procedural SVG paper grain texture
- **Animations**: Framer Motion (strict layout animations)
- **Typography**: Cinzel, Cormorant Garamond, Newsreader, JetBrains Mono, Space Mono

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Annyxtopheles/the-living-index.git
cd the-living-index
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the archive.

### 3. Build Static Export
```bash
npm run build
```
The compiled static assets are output to `./out/`, ready for instant zero-config deployment to Vercel, GitHub Pages, or Netlify.

---

## 📄 License
MIT License. Open-source and free for scholarly and archival use.
