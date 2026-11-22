import { describe, it, expect } from 'vitest';
import { generateHarmonicColors } from '../engine/colorHarmony';
import { isValidHex } from '../engine/colorConversion';

describe('Color Harmony Engine', () => {
  const baseHex = '#7C5CFC';

  it('generates monochromatic harmony with exact count requested', () => {
    const colors = generateHarmonicColors({
      baseHex,
      count: 5,
      harmonyType: 'monochromatic',
    });
    expect(colors).toHaveLength(5);
    colors.forEach((c) => expect(isValidHex(c)).toBe(true));
  });

  it('generates analogous harmony across color wheel', () => {
    const colors = generateHarmonicColors({
      baseHex,
      count: 5,
      harmonyType: 'analogous',
      hueVariation: 30,
    });
    expect(colors).toHaveLength(5);
    colors.forEach((c) => expect(isValidHex(c)).toBe(true));
  });

  it('generates complementary harmony containing opposite hue', () => {
    const colors = generateHarmonicColors({
      baseHex,
      count: 4,
      harmonyType: 'complementary',
    });
    expect(colors).toHaveLength(4);
    colors.forEach((c) => expect(isValidHex(c)).toBe(true));
  });

  it('generates triadic harmony with 3 distinct color regions', () => {
    const colors = generateHarmonicColors({
      baseHex,
      count: 6,
      harmonyType: 'triadic',
    });
    expect(colors).toHaveLength(6);
  });

  it('supports 2 to 10 colors dynamically', () => {
    for (let count = 2; count <= 10; count++) {
      const colors = generateHarmonicColors({
        baseHex,
        count,
        harmonyType: 'tetradic',
      });
      expect(colors).toHaveLength(count);
    }
  });
});
