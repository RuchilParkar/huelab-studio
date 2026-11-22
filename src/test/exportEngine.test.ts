import { describe, it, expect } from 'vitest';
import {
  exportToCssVariables,
  exportToJson,
  exportToTailwindConfig,
  exportToScssVariables,
} from '../engine/exportEngine';
import { generatePalette } from '../engine/paletteGenerator';

describe('Export Center Engine', () => {
  const palette = generatePalette({
    count: 3,
    baseHex: '#7C5CFC',
    name: 'Test Harmony',
  });

  it('exports clean CSS variables', () => {
    const css = exportToCssVariables(palette);
    expect(css).toContain(':root {');
    expect(css).toContain('--color');
    expect(css).toContain('}');
  });

  it('exports structured JSON', () => {
    const jsonStr = exportToJson(palette);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.app).toBe('HueLab');
    expect(parsed.palette.name).toBe(palette.name);
    expect(parsed.palette.colors).toHaveLength(3);
  });

  it('exports Tailwind CSS config format', () => {
    const tailwind = exportToTailwindConfig(palette);
    expect(tailwind).toContain('module.exports');
    expect(tailwind).toContain('colors');
    expect(tailwind).toContain('huelab');
  });

  it('exports SCSS variables format', () => {
    const scss = exportToScssVariables(palette);
    expect(scss).toContain('$color');
  });
});
