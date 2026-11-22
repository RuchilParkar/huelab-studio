import { describe, it, expect } from 'vitest';
import { getColorName } from '../engine/colorNaming';

describe('Color Naming Engine', () => {
  it('assigns consistent human-friendly names to common hex codes', () => {
    expect(getColorName('#0B0C10')).toBe('Obsidian Black');
    expect(getColorName('#FFFFFF')).toBe('Pure Snow');
    expect(getColorName('#A78BFA')).toBe('Velvet Lavender');
    expect(getColorName('#7C5CFC')).toBe('Royal Amethyst');
    expect(getColorName('#10B981')).toBe('Emerald Glade');
  });

  it('determines nearest name deterministically for intermediate custom colors', () => {
    const name1 = getColorName('#7E5DFC');
    const name2 = getColorName('#7E5DFC');
    expect(name1).toBe(name2);
    expect(name1).toBeTruthy();
  });
});
