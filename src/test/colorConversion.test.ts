import { describe, it, expect } from 'vitest';
import {
  isValidHex,
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToOklch,
  oklchToRgb,
  hexToAllFormats,
} from '../engine/colorConversion';

describe('Color Conversion Engine', () => {
  it('validates hex codes correctly', () => {
    expect(isValidHex('#A78BFA')).toBe(true);
    expect(isValidHex('#FFF')).toBe(true);
    expect(isValidHex('7C5CFC')).toBe(true);
    expect(isValidHex('#12345678')).toBe(true);
    expect(isValidHex('#XYZ123')).toBe(false);
    expect(isValidHex('not-a-color')).toBe(false);
    expect(isValidHex('')).toBe(false);
    expect(isValidHex('   ')).toBe(false);
    expect(isValidHex(null as unknown as string)).toBe(false);
    expect(isValidHex(undefined as unknown as string)).toBe(false);
    expect(isValidHex('#12')).toBe(false);
    expect(isValidHex('#12345')).toBe(false);
  });

  it('normalizes hex codes to uppercase 6-digit or 8-digit format defensively', () => {
    expect(normalizeHex('#fff')).toBe('#FFFFFF');
    expect(normalizeHex('a78bfa')).toBe('#A78BFA');
    expect(normalizeHex('#123')).toBe('#112233');
    expect(normalizeHex('')).toBe('#000000');
    expect(normalizeHex(null as unknown as string)).toBe('#000000');
    expect(normalizeHex(undefined as unknown as string)).toBe('#000000');
    expect(normalizeHex('not-a-color')).toBe('#000000');
  });

  it('converts HEX <-> RGB accurately', () => {
    const rgb = hexToRgb('#7C5CFC');
    expect(rgb).toEqual({ r: 124, g: 92, b: 252 });
    expect(rgbToHex(rgb)).toBe('#7C5CFC');
  });

  it('converts RGB <-> HSL accurately', () => {
    const rgb = { r: 124, g: 92, b: 252 };
    const hsl = rgbToHsl(rgb);
    expect(hsl.h).toBeGreaterThanOrEqual(250);
    expect(hsl.h).toBeLessThanOrEqual(255);
    expect(hsl.s).toBeGreaterThanOrEqual(95);

    const backToRgb = hslToRgb(hsl);
    expect(Math.abs(backToRgb.r - rgb.r)).toBeLessThanOrEqual(2);
    expect(Math.abs(backToRgb.g - rgb.g)).toBeLessThanOrEqual(2);
    expect(Math.abs(backToRgb.b - rgb.b)).toBeLessThanOrEqual(2);
  });

  it('converts RGB <-> HSV accurately', () => {
    const rgb = { r: 255, g: 0, b: 0 };
    const hsv = rgbToHsv(rgb);
    expect(hsv).toEqual({ h: 0, s: 100, v: 100 });
    expect(hsvToRgb(hsv)).toEqual(rgb);
  });

  it('converts RGB to OKLCH perceptual space', () => {
    const rgb = { r: 167, g: 139, b: 250 }; // #A78BFA
    const oklch = rgbToOklch(rgb);
    expect(oklch.l).toBeGreaterThan(0.6);
    expect(oklch.c).toBeGreaterThan(0.1);
  });

  it('generates all format strings in hexToAllFormats', () => {
    const res = hexToAllFormats('#A78BFA');
    expect(res.hex).toBe('#A78BFA');
    expect(res.rgbString).toContain('rgb(');
    expect(res.hslString).toContain('hsl(');
    expect(res.oklchString).toContain('oklch(');
  });
});
