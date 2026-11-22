import { describe, it, expect } from 'vitest';
import {
  getRelativeLuminance,
  getContrastRatio,
  evaluateContrast,
  getIdealTextColor,
} from '../engine/colorAccessibility';

describe('WCAG 2.2 Color Accessibility Engine', () => {
  it('calculates relative luminance correctly', () => {
    const blackLum = getRelativeLuminance({ r: 0, g: 0, b: 0 });
    const whiteLum = getRelativeLuminance({ r: 255, g: 255, b: 255 });

    expect(blackLum).toBeCloseTo(0, 4);
    expect(whiteLum).toBeCloseTo(1, 4);
  });

  it('calculates exact contrast ratios', () => {
    // Pure Black vs Pure White is exactly 21:1
    const maxRatio = getContrastRatio('#000000', '#FFFFFF');
    expect(maxRatio).toBe(21);

    // Same color has ratio 1:1
    const sameRatio = getContrastRatio('#7C5CFC', '#7C5CFC');
    expect(sameRatio).toBe(1);
  });

  it('evaluates WCAG 2.2 compliance levels accurately', () => {
    // Pure white on dark background has outstanding contrast (AAA)
    const resultWhiteOnDark = evaluateContrast('#FFFFFF', '#0B0C10');
    expect(resultWhiteOnDark.ratio).toBeGreaterThan(15);
    expect(resultWhiteOnDark.normalTextAA).toBe(true);
    expect(resultWhiteOnDark.normalTextAAA).toBe(true);
    expect(resultWhiteOnDark.score).toBe('AAA');

    // Muted grey on dark grey might fail AAA normal text
    const resultLowContrast = evaluateContrast('#272B36', '#111319');
    expect(resultLowContrast.normalTextAA).toBe(false);
  });

  it('determines ideal text color based on background', () => {
    expect(getIdealTextColor('#FFFFFF')).toBe('#0B0C10');
    expect(getIdealTextColor('#000000')).toBe('#F4F5F7');
    expect(getIdealTextColor('#111319')).toBe('#F4F5F7');
  });
});
