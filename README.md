# The Living Index 🏛️

> A museum-grade digital collection framework engineered for independent collectors, gallery archivists, and curators.

**The Living Index** is an open-source, serverless, zero-maintenance digital archival platform. In alignment with modern decentralized and static web standards, it uses GitHub as its database via a single version-controlled `collection.json` file and compiles into a static web application deployable directly to Vercel, Cloudflare Pages, or GitHub Pages.

---

## ✨ Features

- 📁 **Git-Driven JSON Schema (`collection.json`)**: Curate and manage high-resolution archival specimens, accession numbers, physical dimensions, and provenance trails using version control.
- 🎨 **Context-Aware Dynamic Theme Engine**: Live-switchable aesthetic philosophies:
  - **Editorial Serif**: Harriet-inspired layout margins, classic serif typography (*Cinzel*, *Playfair Display*, *Newsreader*), warm paper palette, and vermillion red accents.
  - **Brutalist Monospace**: Rigid monospaced grid, high-contrast dark palette, and phosphor green telemetry markers.
  - **Mid-Century Modern**: Warm sand canvas, burnt cadmium orange accents, and clean grotesque sans-serif geometry.
- 🔬 **Museum Specimen Micro-Viewer Lightbox**:
  - Hardware-accelerated matrix transforms (`translate3d` + `scale`).
  - Cursor-focal pointer-wheel zoom (`0.6x` to `6.5x`).
  - Grab-and-drag panning with pointer capture.
  - Keyboard navigation (`Esc` dismiss, `ArrowLeft` / `ArrowRight` stepping, `+`/`-` zoom, `0` reset).
  - Pinned asymmetrical museum wall label with full provenance and custodial records.
- ⏳ **Chronological Era & Timeline Navigator**:
  - Interactive era filtering (`1920s`, `1930s`, `1940s`, etc.) with specimen counts.
  - Interactive year scrubber with zero Cumulative Layout Shift (CLS = 0).
- ⚡ **100% Serverless & Static**: Powered by Next.js App Router static export (`output: 'export'`). Zero database hosting fees, zero backend maintenance.

---

## 🛠️ Tech Stack

- **Framework**: React 19 / Next.js (App Router, Static Export)
- **Styling**: Tailwind CSS with dynamic CSS variable tokens
- **Animations**: Framer Motion (strict layout animations)
- **Icons**: Lucide React
- **Typography**: Cinzel, Playfair Display, Newsreader, Space Mono, JetBrains Mono

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
