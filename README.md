# huelabstudio — Advanced Color Intelligence & Palette Studio

<div align="center">

[![Repository](https://img.shields.io/badge/GitHub-RuchilParkar%2Fhuelab--studio-18181B?style=flat&logo=github&logoColor=white)](https://github.com/RuchilParkar/huelab-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](https://github.com/RuchilParkar/huelab-studio/blob/main/LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-37%20Passed-green?style=flat&logo=vitest&logoColor=white)](https://github.com/RuchilParkar/huelab-studio)

**Explore Color. Build Harmony.**

*A precision optical color instrument and design-token workbench for UI/UX designers, frontend engineers, and creative technologists.*

</div>

---

## 🔬 Design Philosophy: "Quiet Chrome, Vivid Pigment"

huelabstudio is engineered as a professional design instrument rather than a generic SaaS dashboard. Built according to strict art-directed design principles:

- **Quiet Chrome, Vivid Pigment**: The surrounding interface recedes into dark graphite surfaces (`#0B0C10`, `#0E1015`, `#141720`) with razor `#222632` hairlines, ensuring that generated swatches are the sole vivid elements on screen.
- **Disciplined Geometry**: Strict proportional radius mathematics ($R_{\text{inner}} = R_{\text{outer}} - \text{padding}$) across modal shells (14px), control inputs (8px), and micro-badges (6px).
- **Tabular Precision**: Monospaced tabular numerals (`font-mono tabular-nums`) across all hexadecimal, sRGB, OKLCH, and contrast ratios eliminate layout shifting during slider scrubbing.
- **Instrument-Grade Physics**: Zero bouncy spring physics (`scale-105` / `scale-95` removed) in favor of instantaneous, crisp 150ms ease-out transitions (`transition-colors duration-150`).
- **Distributed Telemetry Inspector**: Live preview uses realistic engineering telemetry components instead of generic marketing copy to validate token performance under real UI conditions.

---

## 🎨 Key Features

### 1. Color Palette Studio
- **Dynamic Swatch Canvas**: 2 to 10 vertical color swatches with responsive desktop columns and mobile cards.
- **Lock & Unlock Colors**: Lock individual hues while regenerating surrounding tones with harmonic cohesion.
- **Semantic Role Assignment**: Automatic classification of design system roles (`primary`, `secondary`, `accent`, `surface`, `background`, `text`, `muted`).
- **Harmonic Engines**:
  - **Monochromatic**: Perceptual lightness and chroma shifts at constant dominant hue.
  - **Analogous**: Adjacent color wheel positions ($\pm 30^\circ, \pm 60^\circ$).
  - **Complementary**: High-contrast $180^\circ$ opposing pairs with harmonic supporting tints.
  - **Split Complementary**: Dynamic tri-point harmony ($150^\circ$ and $210^\circ$).
  - **Triadic**: Equidistant $120^\circ$ color triads.
  - **Tetradic**: Dual-complementary rectangular coordinates.
  - **Square**: Perceptually balanced $90^\circ$ equidistant distribution.
  - **Custom**: Golden ratio ($\phi$) organic color dispersion.
- **Keyboard Controls**:
  - <kbd>Space</kbd> : Regenerate unlocked swatches
  - <kbd>L</kbd> : Toggle lock on focused swatch
  - <kbd>C</kbd> : Copy HEX code of focused swatch
  - <kbd>1</kbd>–<kbd>9</kbd> : Focus swatch by index
  - <kbd>E</kbd> : Open Export modal
  - <kbd>?</kbd> : View all keyboard shortcuts

### 2. Advanced Color Editor
- Bi-directional synchronized conversion across **HEX, RGB, RGBA, HSL, HSLA, HSV, and OKLCH**.
- Fine-grained channel controls for Hue ($0^\circ - 360^\circ$), Saturation ($0\% - 100\%$), and Lightness ($0\% - 100\%$).
- Live WCAG contrast rating against dark (`#0B0C10`) and light (`#FFFFFF`) surfaces.
- One-click copy buttons with formatted channel strings.

### 3. Distributed Telemetry UI Simulation
- Instant preview of active palette in 4 realistic responsive interface modes:
  - **Telemetry Dashboard**: KPI metrics, node status badges, cluster utilization bars, and data tables.
  - **SaaS Platform**: Navbar, hero badge, headline, CTA buttons, feature cards.
  - **Storefront (E-Commerce)**: Product cards, pricing tags, inventory badges, and checkout buttons.
  - **Mobile Application**: Mobile bezel, balance card, quick actions, and tab bar.
- Dynamically maps generated tokens to backgrounds, borders, typography, and interactive states.

### 4. Computer Vision Image Color Extractor
- Client-side drag-and-drop image processing (PNG, JPG, WebP up to 15MB).
- K-Means centroid clustering in RGB/Lab space extracting 2 to 10 dominant colors.
- Suppression of near-duplicate pixels and calculation of coverage percentage.
- One-click "Apply to Studio Palette" transfers extracted colors directly into the generator.
- 100% private: images are processed entirely in-browser on HTML5 canvas with zero server transmission.

### 5. Gradient Studio
- Linear and radial gradient builder.
- Interactive angle rotation dial ($0^\circ - 360^\circ$).
- Multi-stop manager: add, delete, and adjust color stops with percentage sliders.
- Production CSS code generation (`background: linear-gradient(...)`).
- High-resolution (1920x1080) PNG gradient export via offscreen Canvas rendering.

### 6. Accessibility & WCAG 2.2 Contrast Checker
- Mathematical evaluation using WCAG relative luminance formula:
  $$L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$
  $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
- Real-time compliance rating:
  - Normal text AA ($\ge 4.5:1$) and AAA ($\ge 7.0:1$)
  - Large text AA ($\ge 3.0:1$) and AAA ($\ge 4.5:1$)
- Live typography preview at multiple type scales (16px, 18px, 24px).
- Actionable lightness adjustment suggestions to fix failing color pairs.
- One-click foreground/background swap.

### 7. Color Converter
- Live multi-format converter for HEX, RGB, RGBA, HSL, HSLA, HSV, and OKLCH.
- Quick preset examples (Royal Amethyst, Cyber Cyan, Neon Fuchsia, Emerald Glade, Champagne Gold, Obsidian Black).

### 8. Curated Explore Library
- Hand-crafted palettes organized across 11 visual categories:
  - Minimal, Nature, Cyberpunk, Pastel, Luxury, Vintage, Modern, Monochrome, Dark UI, Warm, Cool.
- Instant tag search, color code copying, and direct studio loading.

### 9. Favorites, History & Full Backup
- LocalStorage persistence for recent generation history and favorited palettes.
- Inline palette renaming.
- Complete huelabstudio Backup Export and Import (JSON) with structure validation.

### 10. AI Color Intelligence (with Local Semantic Fallback)
- Natural language concept parsing (e.g. "A luxury black and gold brand", "A futuristic cyberpunk interface").
- Smart deterministic local semantic engine that maps emotional moods to harmonious palettes without requiring an external server or API key.
- Optional client-side API key configuration for external AI endpoints.

### 11. Multi-Format Export Center
- **CSS Variables**: Formatted `:root { --color-primary-1: #...; }`
- **JSON Tokens**: Structured tokens with metadata and hex codes
- **Tailwind CSS**: `theme.extend.colors` configuration object
- **SCSS Variables**: `$color-primary-1: #...;`
- **Branded PNG Image Card**: High-resolution (1200x630) social showcase card rendered on Canvas.

---

## 🛠️ Technology Stack

- **Framework**: React 19, TypeScript (Strict Mode)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Color Operations**: Culori & Custom Perceptual Algorithms
- **State Management**: Zustand with LocalStorage Persistence
- **Image Extraction**: HTML5 Canvas K-Means Clustering & React Dropzone
- **Testing**: Vitest, React Testing Library, JSDOM

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/RuchilParkar/huelab-studio.git
cd huelab-studio

# Install dependencies
npm install
```

### Local Development
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### Running Tests
```bash
npm run test
```
Runs the full Vitest suite covering:
- Color conversions (HEX, RGB, HSL, HSV, OKLCH)
- WCAG 2.2 Relative Luminance and contrast ratios
- Color harmony algorithms (Monochromatic, Analogous, Complementary, Triadic, Tetradic, Square, Custom)
- Palette generation and lock preservation
- Color naming nearest-match accuracy
- Gradient CSS generation
- Multi-format token exports
- Store integrity and backup verification

### Production Build
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

---

## 📦 Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNavigation.tsx
│   ├── palette/
│   │   ├── PaletteCanvas.tsx
│   │   ├── ColorSwatch.tsx
│   │   ├── ColorDetailsModal.tsx
│   │   ├── PaletteControls.tsx
│   │   └── PaletteHistoryDrawer.tsx
│   ├── preview/
│   │   └── WebsitePreview.tsx
│   └── shared/
│       ├── Modal.tsx
│       ├── Tooltip.tsx
│       ├── Toast.tsx
│       ├── EmptyState.tsx
│       ├── ExportModal.tsx
│       ├── AiPaletteModal.tsx
│       ├── ShortcutsModal.tsx
│       └── AboutModal.tsx
├── pages/
│   ├── GeneratorPage.tsx
│   ├── ExplorePage.tsx
│   ├── ImageExtractorPage.tsx
│   ├── GradientPage.tsx
│   ├── ContrastPage.tsx
│   ├── ColorConverterPage.tsx
│   ├── FavoritesPage.tsx
│   └── SettingsPage.tsx
├── engine/
│   ├── colorConversion.ts
│   ├── colorHarmony.ts
│   ├── colorAccessibility.ts
│   ├── colorNaming.ts
│   ├── paletteGenerator.ts
│   ├── colorExtraction.ts
│   ├── gradientEngine.ts
│   └── exportEngine.ts
├── store/
│   └── useHueStore.ts
├── data/
│   └── curatedPalettes.ts
├── types/
│   └── index.ts
└── test/
    ├── setup.ts
    ├── colorConversion.test.ts
    ├── colorAccessibility.test.ts
    ├── colorHarmony.test.ts
    ├── paletteGenerator.test.ts
    ├── colorNaming.test.ts
    ├── gradientEngine.test.ts
    ├── exportEngine.test.ts
    ├── clipboard.test.ts
    └── storeIntegrity.test.ts
```

---

## 🌐 Deployment

### Vercel Deployment
huelabstudio is pre-configured for one-click deployment on Vercel:
1. Push your repository to GitHub: [https://github.com/RuchilParkar/huelab-studio](https://github.com/RuchilParkar/huelab-studio)
2. Import the project into Vercel.
3. Framework Preset: **Vite**
4. Root Directory: `./`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. SPA rewrites are already configured in `vercel.json`.

---

## 🛡️ License

MIT License. Designed with architectural restraint and functional clarity.
Repository: [https://github.com/RuchilParkar/huelab-studio](https://github.com/RuchilParkar/huelab-studio)
