import { HslColor, HsvColor, OklchColor, RgbColor } from '../types';

/**
 * Validates a HEX color string (3, 4, 6, or 8 hex digits, optional leading #)
 */
export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false;
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex.trim());
}

/**
 * Normalizes HEX string to #RRGGBB (or #RRGGBBAA if alpha exists)
 */
export function normalizeHex(hex: string): string {
  if (!hex || typeof hex !== 'string' || !isValidHex(hex)) return '#000000';
  let clean = hex.trim();
  if (!clean.startsWith('#')) clean = '#' + clean;

  // #RGB -> #RRGGBB
  if (clean.length === 4) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  // #RGBA -> #RRGGBBAA
  if (clean.length === 5) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    const a = clean[4];
    return `#${r}${r}${g}${g}${b}${b}${a}${a}`.toUpperCase();
  }

  return clean.toUpperCase();
}

/**
 * Clamps a number between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Converts HEX to RGB
 */
export function hexToRgb(hex: string): RgbColor {
  const norm = normalizeHex(hex);
  const clean = norm.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  let a: number | undefined = undefined;

  if (clean.length === 8) {
    a = Math.round((parseInt(clean.substring(6, 8), 16) / 255) * 100) / 100;
  }

  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b,
    ...(a !== undefined ? { a } : {}),
  };
}

/**
 * Converts RGB to HEX
 */
export function rgbToHex(rgb: RgbColor): string {
  const r = clamp(Math.round(rgb.r), 0, 255).toString(16).padStart(2, '0');
  const g = clamp(Math.round(rgb.g), 0, 255).toString(16).padStart(2, '0');
  const b = clamp(Math.round(rgb.b), 0, 255).toString(16).padStart(2, '0');

  if (rgb.a !== undefined && rgb.a < 1) {
    const a = clamp(Math.round(rgb.a * 255), 0, 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}${a}`.toUpperCase();
  }

  return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = clamp(rgb.r, 0, 255) / 255;
  const g = clamp(rgb.g, 0, 255) / 255;
  const b = clamp(rgb.b, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    ...(rgb.a !== undefined ? { a: rgb.a } : {}),
  };
}

/**
 * Converts HSL to RGB
 */
export function hslToRgb(hsl: HslColor): RgbColor {
  const h = ((hsl.h % 360) + 360) % 360 / 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v, ...(hsl.a !== undefined ? { a: hsl.a } : {}) };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tAdj = t;
    if (tAdj < 0) tAdj += 1;
    if (tAdj > 1) tAdj -= 1;
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj;
    if (tAdj < 1 / 2) return q;
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    ...(hsl.a !== undefined ? { a: hsl.a } : {}),
  };
}

/**
 * Converts RGB to HSV/HSB
 */
export function rgbToHsv(rgb: RgbColor): HsvColor {
  const r = clamp(rgb.r, 0, 255) / 255;
  const g = clamp(rgb.g, 0, 255) / 255;
  const b = clamp(rgb.b, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/**
 * Converts HSV to RGB
 */
export function hsvToRgb(hsv: HsvColor): RgbColor {
  const h = ((hsv.h % 360) + 360) % 360 / 60;
  const s = clamp(hsv.s, 0, 100) / 100;
  const v = clamp(hsv.v, 0, 100) / 100;

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));

  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts sRGB to Linear sRGB
 */
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Converts Linear sRGB to sRGB
 */
function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return clamp(Math.round(v * 255), 0, 255);
}

/**
 * Converts RGB to OKLCH color space (perceptually uniform)
 */
export function rgbToOklch(rgb: RgbColor): OklchColor {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  // Convert linear sRGB to LMS
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // OKLab coordinates
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // Polar coordinates -> OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  let h = (Math.atan2(b_, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return {
    l: Math.round(L * 1000) / 1000,
    c: Math.round(C * 1000) / 1000,
    h: Math.round(h * 10) / 10,
  };
}

/**
 * Converts OKLCH to RGB
 */
export function oklchToRgb(oklch: OklchColor): RgbColor {
  const L = oklch.l;
  const C = oklch.c;
  const hRad = (oklch.h * Math.PI) / 180;

  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767439362 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return {
    r: linearToSrgb(rLin),
    g: linearToSrgb(gLin),
    b: linearToSrgb(bLin),
  };
}

/**
 * High-level converter: converts HEX to all supported formats
 */
export function hexToAllFormats(hex: string) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const oklch = rgbToOklch(rgb);

  return {
    hex: normalizeHex(hex),
    rgb,
    rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgbaString: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`,
    hsl,
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hslaString: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a ?? 1})`,
    hsv,
    hsvString: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    oklch,
    oklchString: `oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`,
  };
}
