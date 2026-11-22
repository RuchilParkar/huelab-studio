import { hexToRgb, rgbToHex } from './colorConversion';
import { ContrastEvaluation, RgbColor } from '../types';

/**
 * Calculates WCAG 2.2 Relative Luminance of an sRGB color.
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const channelLuminance = (val: number): number => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = channelLuminance(rgb.r);
  const g = channelLuminance(rgb.g);
  const b = channelLuminance(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates contrast ratio between two colors (hex).
 * Formula: (L1 + 0.05) / (L2 + 0.05), where L1 is lighter.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Evaluates WCAG 2.2 contrast compliance for normal and large text.
 */
export function evaluateContrast(foregroundHex: string, backgroundHex: string): ContrastEvaluation {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);

  const normalTextAA = ratio >= 4.5;
  const normalTextAAA = ratio >= 7.0;
  const largeTextAA = ratio >= 3.0;
  const largeTextAAA = ratio >= 4.5;

  let score: 'Fail' | 'AA Large' | 'AA' | 'AAA' = 'Fail';
  if (normalTextAAA) {
    score = 'AAA';
  } else if (normalTextAA) {
    score = 'AA';
  } else if (largeTextAA) {
    score = 'AA Large';
  }

  const suggestions: string[] = [];
  if (!normalTextAA) {
    const fgRgb = hexToRgb(foregroundHex);
    const bgRgb = hexToRgb(backgroundHex);
    const bgLum = getRelativeLuminance(bgRgb);

    if (bgLum > 0.5) {
      // Darken foreground to reach 4.5:1
      const darkerFg = adjustHexLightness(foregroundHex, -0.2);
      suggestions.push(`Darken foreground text to ${darkerFg} to improve contrast`);
    } else {
      // Lighten foreground to reach 4.5:1
      const lighterFg = adjustHexLightness(foregroundHex, 0.25);
      suggestions.push(`Lighten foreground text to ${lighterFg} to improve contrast`);
    }

    if (ratio < 3.0) {
      suggestions.push('Avoid using this color pair for body text or essential UI components.');
    } else {
      suggestions.push('Acceptable for large text (>= 18pt regular or >= 14pt bold).');
    }
  } else {
    suggestions.push('Excellent contrast! Meets WCAG 2.2 AA standard for body copy and UI elements.');
    if (normalTextAAA) {
      suggestions.push('Outstanding readability! Exceeds WCAG 2.2 AAA standard for high accessibility.');
    }
  }

  return {
    ratio,
    normalTextAA,
    normalTextAAA,
    largeTextAA,
    largeTextAAA,
    score,
    suggestions,
  };
}

/**
 * Adjusts color lightness by a fraction (-1 to 1)
 */
function adjustHexLightness(hex: string, delta: number): string {
  const rgb = hexToRgb(hex);
  if (delta > 0) {
    return rgbToHex({
      r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * delta)),
      g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * delta)),
      b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * delta)),
    });
  } else {
    const factor = 1 + delta;
    return rgbToHex({
      r: Math.max(0, Math.round(rgb.r * factor)),
      g: Math.max(0, Math.round(rgb.g * factor)),
      b: Math.max(0, Math.round(rgb.b * factor)),
    });
  }
}

/**
 * Returns whether text should be dark or light against a background hex
 */
export function getIdealTextColor(bgHex: string): '#0B0C10' | '#F4F5F7' {
  const ratioDark = getContrastRatio('#0B0C10', bgHex);
  const ratioLight = getContrastRatio('#F4F5F7', bgHex);
  return ratioDark > ratioLight ? '#0B0C10' : '#F4F5F7';
}
