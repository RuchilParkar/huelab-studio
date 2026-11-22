import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, clamp } from './colorConversion';
import { HarmonyType, HslColor } from '../types';

export interface HarmonyOptions {
  baseHex: string;
  count: number; // 2 to 10
  harmonyType: HarmonyType;
  hueVariation?: number; // Spread factor
  saturationOffset?: number; // -100 to 100
  lightnessOffset?: number; // -100 to 100
}

/**
 * Generates harmonic colors based on color theory and perceptual spacing
 */
export function generateHarmonicColors(options: HarmonyOptions): string[] {
  const {
    baseHex,
    count = 5,
    harmonyType = 'analogous',
    hueVariation = 30,
    saturationOffset = 0,
    lightnessOffset = 0,
  } = options;

  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb);

  // Apply base saturation/lightness adjustments
  const baseH = baseHsl.h;
  const baseS = clamp(baseHsl.s + saturationOffset, 15, 95);
  const baseL = clamp(baseHsl.l + lightnessOffset, 15, 88);

  const colors: string[] = [];

  switch (harmonyType) {
    case 'monochromatic': {
      // Vary lightness and slightly saturation across the same hue
      for (let i = 0; i < count; i++) {
        const step = count > 1 ? i / (count - 1) : 0.5;
        // Lightness distribution from deep dark/medium to bright pastel
        const l = clamp(18 + step * 68, 12, 92);
        // Subtle saturation curve to keep midtones vivid and ends refined
        const s = clamp(baseS - Math.abs(0.5 - step) * 20, 20, 95);
        colors.push(rgbToHex(hslToRgb({ h: baseH, s, l })));
      }
      break;
    }

    case 'analogous': {
      // Neighbors on color wheel: base ± hueVariation
      const spread = hueVariation;
      const startAngle = baseH - ((count - 1) * spread) / 2;
      for (let i = 0; i < count; i++) {
        const h = (startAngle + i * spread + 3600) % 360;
        const l = clamp(baseL + (i % 2 === 0 ? 4 : -4), 20, 85);
        const s = clamp(baseS + (i % 2 === 0 ? 0 : -6), 25, 95);
        colors.push(rgbToHex(hslToRgb({ h, s, l })));
      }
      break;
    }

    case 'complementary': {
      // Base and its 180° opposite, with intermediate tints/shades
      const compH = (baseH + 180) % 360;
      colors.push(rgbToHex(hslToRgb({ h: baseH, s: baseS, l: baseL })));
      colors.push(rgbToHex(hslToRgb({ h: compH, s: baseS, l: baseL })));

      for (let i = 2; i < count; i++) {
        const isBaseSide = i % 2 === 0;
        const targetH = isBaseSide ? baseH : compH;
        const step = Math.floor(i / 2);
        const l = clamp(baseL + (step % 2 === 1 ? 18 : -18) * Math.ceil(step / 2), 15, 90);
        const s = clamp(baseS - 8 * step, 20, 90);
        colors.push(rgbToHex(hslToRgb({ h: targetH, s, l })));
      }
      break;
    }

    case 'split-complementary': {
      // Base and two colors adjacent to its complement (180° ± 30°)
      const comp1 = (baseH + 150) % 360;
      const comp2 = (baseH + 210) % 360;
      const baseAngles = [baseH, comp1, comp2];

      for (let i = 0; i < count; i++) {
        const angle = baseAngles[i % 3];
        const cycle = Math.floor(i / 3);
        const l = clamp(baseL + (cycle === 0 ? 0 : cycle % 2 === 1 ? 16 : -16), 18, 88);
        const s = clamp(baseS - cycle * 10, 25, 95);
        colors.push(rgbToHex(hslToRgb({ h: angle, s, l })));
      }
      break;
    }

    case 'triadic': {
      // 3 equidistant colors: base, base + 120°, base + 240°
      const angles = [baseH, (baseH + 120) % 360, (baseH + 240) % 360];
      for (let i = 0; i < count; i++) {
        const angle = angles[i % 3];
        const cycle = Math.floor(i / 3);
        const l = clamp(baseL + (cycle === 0 ? (i === 0 ? 0 : -5) : cycle * 18), 18, 88);
        const s = clamp(baseS - cycle * 8, 25, 95);
        colors.push(rgbToHex(hslToRgb({ h: angle, s, l })));
      }
      break;
    }

    case 'tetradic': {
      // 4 colors formed by two complementary pairs: 0, 60, 180, 240
      const angles = [baseH, (baseH + 60) % 360, (baseH + 180) % 360, (baseH + 240) % 360];
      for (let i = 0; i < count; i++) {
        const angle = angles[i % 4];
        const cycle = Math.floor(i / 4);
        const l = clamp(baseL + (cycle === 0 ? 0 : cycle * 14), 18, 88);
        const s = clamp(baseS - cycle * 8, 25, 95);
        colors.push(rgbToHex(hslToRgb({ h: angle, s, l })));
      }
      break;
    }

    case 'square': {
      // 4 equidistant colors: 0, 90, 180, 270
      const angles = [baseH, (baseH + 90) % 360, (baseH + 180) % 360, (baseH + 270) % 360];
      for (let i = 0; i < count; i++) {
        const angle = angles[i % 4];
        const cycle = Math.floor(i / 4);
        const l = clamp(baseL + (cycle === 0 ? 0 : cycle * 15), 18, 88);
        const s = clamp(baseS - cycle * 8, 25, 95);
        colors.push(rgbToHex(hslToRgb({ h: angle, s, l })));
      }
      break;
    }

    case 'custom':
    default: {
      // Organic aesthetic distribution across color wheel
      const goldenRatio = 0.618033988749895;
      let currentHue = baseH / 360;
      for (let i = 0; i < count; i++) {
        if (i === 0) {
          colors.push(rgbToHex(hslToRgb({ h: baseH, s: baseS, l: baseL })));
        } else {
          currentHue = (currentHue + goldenRatio) % 1;
          const h = Math.round(currentHue * 360);
          const l = clamp(35 + (i * 12) % 50, 20, 85);
          const s = clamp(45 + (i * 15) % 50, 30, 90);
          colors.push(rgbToHex(hslToRgb({ h, s, l })));
        }
      }
      break;
    }
  }

  // Ensure output is exact count requested
  return colors.slice(0, count);
}
