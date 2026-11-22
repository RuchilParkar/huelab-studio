export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'oklch';

export type HarmonyType =
  | 'analogous'
  | 'monochromatic'
  | 'triadic'
  | 'complementary'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'custom';

export interface RgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a?: number; // 0-1
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a?: number; // 0-1
}

export interface HsvColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface OklchColor {
  l: number; // 0-1
  c: number; // 0-0.4
  h: number; // 0-360
}

export interface ColorItem {
  id: string;
  hex: string; // uppercase formatted, e.g. "#A78BFA"
  name: string;
  locked: boolean;
  role?: 'primary' | 'secondary' | 'background' | 'surface' | 'accent' | 'text' | 'muted';
}

export interface Palette {
  id: string;
  name: string;
  colors: ColorItem[];
  harmony: HarmonyType;
  mode?: 'ui-system' | 'pure-harmony';
  createdAt: number;
  tags?: string[];
  isFavorite?: boolean;
}

export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0 to 100
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number; // 0 to 360
  shape?: 'circle' | 'ellipse';
  stops: GradientStop[];
}

export interface ContrastEvaluation {
  ratio: number;
  normalTextAA: boolean;
  normalTextAAA: boolean;
  largeTextAA: boolean;
  largeTextAAA: boolean;
  score: 'Fail' | 'AA Large' | 'AA' | 'AAA';
  suggestions?: string[];
}

export interface CuratedPalette {
  id: string;
  name: string;
  category:
    | 'Minimal'
    | 'Nature'
    | 'Cyberpunk'
    | 'Pastel'
    | 'Luxury'
    | 'Vintage'
    | 'Modern'
    | 'Monochrome'
    | 'Dark UI'
    | 'Warm'
    | 'Cool';
  colors: string[];
  tags: string[];
}

export interface UserPreferences {
  defaultPaletteSize: number;
  defaultHarmony: HarmonyType;
  exportFormat: 'css' | 'json' | 'tailwind' | 'scss';
  enableKeyboardShortcuts: boolean;
  reducedMotion: boolean;
  aiApiKey?: string;
  aiProvider?: 'gemini' | 'openai' | 'local';
}

export type PageView =
  | 'generator'
  | 'explore'
  | 'image-extractor'
  | 'gradient'
  | 'contrast'
  | 'color-converter'
  | 'favorites'
  | 'settings';
