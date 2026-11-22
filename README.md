# HueLab — Advanced Color Intelligence & Palette Studio

> **Explore Color. Build Harmony.**

HueLab is an advanced, production-grade color intelligence workspace designed for UI/UX designers, frontend architects, graphic designers, and creative technologists. It combines color science with a dark, refined developer-first interface to generate harmonic color systems, evaluate accessibility, extract colors from images, edit gradients, and export production design tokens.

---

## 🎨 Key Features

### 1. Color Palette Studio
- **Dynamic Swatch Canvas**: 2 to 10 color vertical swatches with responsive desktop and mobile stacking.
- **Lock & Unlock Colors**: Lock individual colors while regenerating the unlocked tones around them.
- **Role Assignment**: Automatically assigns design system roles (`primary`, `secondary`, `accent`, `surface`, `background`, `text`, `muted`).
- **Harmonic Algorithms**:
  - Monochromatic (varying lightness/saturation at fixed perceptual hue)
  - Analogous (neighbors on the color wheel: $\pm 30^\circ$, $\pm 60^\circ$)
  - Complementary ($180^\circ$ opposing pairs with harmonic tints)
  - Split Complementary ($150^\circ$ and $210^\circ$)
  - Triadic (three equidistant $120^\circ$ hues)
  - Tetradic (rectangular double-complementary)
  - Square ($90^\circ$ equidistant hues)
  - Custom (golden ratio organic distribution)
- **Keyboard Shortcuts**:
  - `Space`: Regenerate palette
  - `L`: Lock/unlock focused color
  - `C`: Copy HEX code of focused color
  - `1–9`: Focus swatch by index
  - `E`: Open Export modal
  - `?`: View all keyboard shortcuts

### 2. Advanced Color Editor
- Real-time synchronized conversion between **HEX, RGB, RGBA, HSL, HSLA, HSV, and OKLCH**.
- Fine-grained perceptual sliders for Hue ($0^\circ - 360^\circ$), Saturation ($0\% - 100\%$), and Lightness ($0\% - 100\%$).
- Live WCAG contrast rating of the color against dark (`#0B0C10`) and light (`#FFFFFF`) surfaces.
- One-click copy buttons for every format.

### 3. Live Website UI Simulation
- Instant preview of active palette in 4 realistic responsive interface modes:
  - **SaaS Platform**: Navbar, hero badge, headline, CTA buttons, feature cards.
  - **Analytics Dashboard**: KPI cards, trend percentages, cluster utilization bars.
  - **Storefront (E-Commerce)**: Hero product banner, product cards, price tags, ratings.
  - **Mobile Application**: Mobile bezel, balance card, quick actions, tab bar.
- Dynamically binds tokens to background, text, primary, secondary, and accent surfaces.

### 4. Image Color Extractor
- Client-side drag-and-drop image processing (PNG, JPG, WebP up to 15MB).
- K-Means centroid clustering in RGB/Lab space to extract 2 to 10 dominant colors.
- Suppression of near-duplicate pixels and calculation of pixel coverage percentage.
- One-click "Apply to Studio Palette" transfers extracted colors directly into the generator.
- 100% private: images are processed in-browser on HTML5 canvas and never sent to any server.

### 5. Gradient Studio
- Linear and radial gradient generator.
- Interactive angle rotation slider ($0^\circ - 360^\circ$).
- Multi-stop manager: add, delete, and adjust color stops with percentage sliders.
- Instant CSS export (`background: linear-gradient(...)`).
- High-resolution (1920x1080) PNG gradient download via offscreen Canvas rendering.

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
- Live bi-directional multi-format converter for HEX, RGB, RGBA, HSL, HSLA, HSV, and OKLCH.
- Quick preset examples (Royal Amethyst, Cyber Cyan, Neon Fuchsia, Emerald Glade, Champagne Gold, Obsidian Black).

### 8. Curated Explore Library
- Hand-crafted palettes organized across 11 visual categories:
  - Minimal, Nature, Cyberpunk, Pastel, Luxury, Vintage, Modern, Monochrome, Dark UI, Warm, Cool.
  - Instant tag search, color code copying, and studio loading.

### 9. Favorites, History & Full Backup
- LocalStorage persistence for recent generation history and favorited palettes.
- Inline palette renaming.
- Complete HueLab Backup Export and Import (JSON) with structure validation.

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
git clone <repo-url>
cd HeuLab

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
    └── exportEngine.test.ts
```

---

## 🌐 Deployment

### Vercel Deployment
HueLab is pre-configured for one-click deployment on Vercel:
1. Push your repository to GitHub or GitLab.
2. Import the project into Vercel.
3. Framework Preset: **Vite**
4. Root Directory: `./`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. SPA rewrites are already configured in `vercel.json`.

---

## 🛡️ License

MIT License. Designed with intentional craft and restraint.
