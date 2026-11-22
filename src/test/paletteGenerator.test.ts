import { describe, it, expect } from 'vitest';
import {
  generatePalette,
  assignColorRoles,
  generateUiSystemColors,
  balancePaletteContrast,
} from '../engine/paletteGenerator';
import { getContrastRatio } from '../engine/colorAccessibility';

describe('Palette Generator Engine', () => {
  it('generates a full palette with default 5 colors and roles', () => {
    const palette = generatePalette({ count: 5 });
    expect(palette.colors).toHaveLength(5);
    expect(palette.name).toBeTruthy();
    const hasPrimary = palette.colors.some((c) => c.role === 'primary');
    expect(hasPrimary).toBe(true);
  });

  it('preserves locked colors during regeneration', () => {
    const initialPalette = generatePalette({ count: 5 });
    // Lock the first two colors
    initialPalette.colors[0].locked = true;
    initialPalette.colors[1].locked = true;

    const lockedHex0 = initialPalette.colors[0].hex;
    const lockedHex1 = initialPalette.colors[1].hex;

    const regenerated = generatePalette({
      existingColors: initialPalette.colors,
      count: 5,
      harmony: 'analogous',
    });

    expect(regenerated.colors[0].hex).toBe(lockedHex0);
    expect(regenerated.colors[0].locked).toBe(true);
    expect(regenerated.colors[1].hex).toBe(lockedHex1);
    expect(regenerated.colors[1].locked).toBe(true);
  });

  it('generates practical UI design system color tokens', () => {
    const uiTokens = generateUiSystemColors('#7C5CFC', 6);
    expect(uiTokens).toHaveLength(6);
    expect(uiTokens[0]).toBeTruthy(); // Primary
    expect(uiTokens[1]).toBeTruthy(); // Background
    expect(uiTokens[2]).toBeTruthy(); // Surface
    expect(uiTokens[3]).toBeTruthy(); // Text
  });

  it('intelligently assigns semantic roles according to luminance and chroma', () => {
    const testColors = [
      { id: '1', hex: '#0B0C10', name: 'Dark Bg', locked: false }, // Darkest
      { id: '2', hex: '#FFFFFF', name: 'Bright White', locked: false }, // Brightest
      { id: '3', hex: '#7C5CFC', name: 'Vibrant Purple', locked: false }, // High Saturation
      { id: '4', hex: '#171A22', name: 'Surface Gray', locked: false }, // Second darkest
      { id: '5', hex: '#EC4899', name: 'Accent Pink', locked: false },
    ];

    const withRoles = assignColorRoles(testColors);
    const bgCol = withRoles.find((c) => c.role === 'background');
    const textCol = withRoles.find((c) => c.role === 'text');
    const surfaceCol = withRoles.find((c) => c.role === 'surface');

    expect(bgCol?.hex).toBe('#0B0C10');
    expect(textCol?.hex).toBe('#FFFFFF');
    expect(surfaceCol?.hex).toBe('#171A22');
  });

  it('balances palette contrast for WCAG AA/AAA compliance while respecting locks', () => {
    const initialPalette = generatePalette({ count: 5 });
    initialPalette.colors[0].locked = true;
    const lockedHex = initialPalette.colors[0].hex;

    const balanced = balancePaletteContrast(initialPalette.colors);
    expect(balanced[0].hex).toBe(lockedHex);

    const text = balanced.find((c) => c.role === 'text');
    const bg = balanced.find((c) => c.role === 'background');
    if (text && bg) {
      const ratio = getContrastRatio(text.hex, bg.hex);
      expect(ratio).toBeGreaterThanOrEqual(7.0); // Meets WCAG AAA!
    }
  });
});
