import { ColorItem, HarmonyType, Palette } from '../types';
import { generateHarmonicColors } from './colorHarmony';
import { getColorName } from './colorNaming';
import { hslToRgb, rgbToHex, hexToRgb, rgbToHsl, clamp } from './colorConversion';
import { getRelativeLuminance, getContrastRatio } from './colorAccessibility';

/**
 * Generates an aesthetic random base color (well-saturated, pleasant luminance)
 */
export function generateRandomHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(55 + Math.random() * 35); // 55-90%
  const l = Math.floor(40 + Math.random() * 30); // 40-70%
  return rgbToHex(hslToRgb({ h, s, l }));
}

/**
 * Perceptually assigns semantic design system roles based on luminance and saturation.
 * Guarantees that dark container tones become 'background' and 'surface',
 * bright high-contrast tones become 'text', and vibrant saturated tones become 'primary' / 'accent'.
 */
export function assignColorRoles(colors: ColorItem[]): ColorItem[] {
  if (colors.length === 0) return [];

  // If only 1-2 colors, simple assignment
  if (colors.length <= 2) {
    const roles: ColorItem['role'][] = ['primary', 'background'];
    return colors.map((c, i) => ({ ...c, role: c.role || roles[i] }));
  }

  // Calculate luminance & saturation for each color
  const analyzed = colors.map((c, index) => {
    const rgb = hexToRgb(c.hex);
    const lum = getRelativeLuminance(rgb);
    const hsl = rgbToHsl(rgb);
    return {
      index,
      color: c,
      lum,
      sat: hsl.s,
      assignedRole: c.role as ColorItem['role'] | undefined,
    };
  });

  // Respect user locked roles if already set
  const usedRoles = new Set<string>();
  analyzed.forEach((item) => {
    if (item.color.locked && item.color.role) {
      item.assignedRole = item.color.role;
      usedRoles.add(item.color.role);
    }
  });

  // Sort remaining by luminance
  const sortedByLum = [...analyzed].sort((a, b) => a.lum - b.lum);

  // 1. Lowest luminance -> background
  const darkest = sortedByLum[0];
  if (!darkest.assignedRole && !usedRoles.has('background')) {
    darkest.assignedRole = 'background';
    usedRoles.add('background');
  }

  // 2. Highest luminance -> text
  const brightest = sortedByLum[sortedByLum.length - 1];
  if (!brightest.assignedRole && !usedRoles.has('text')) {
    brightest.assignedRole = 'text';
    usedRoles.add('text');
  }

  // 3. Second lowest luminance -> surface
  const secondDarkest = sortedByLum.find(
    (item) => item !== darkest && !item.assignedRole
  );
  if (secondDarkest && !usedRoles.has('surface')) {
    secondDarkest.assignedRole = 'surface';
    usedRoles.add('surface');
  }

  // 4. Highest saturation among remaining -> primary
  const remaining = analyzed.filter((item) => !item.assignedRole);
  const sortedBySat = [...remaining].sort((a, b) => b.sat - a.sat);

  if (sortedBySat.length > 0 && !usedRoles.has('primary')) {
    sortedBySat[0].assignedRole = 'primary';
    usedRoles.add('primary');
  }

  // 5. Next highest saturation -> accent
  const remainingAfterPrimary = analyzed.filter((item) => !item.assignedRole);
  const sortedBySat2 = [...remainingAfterPrimary].sort((a, b) => b.sat - a.sat);

  if (sortedBySat2.length > 0 && !usedRoles.has('accent')) {
    sortedBySat2[0].assignedRole = 'accent';
    usedRoles.add('accent');
  }

  // 6. Remaining become secondary, muted, etc.
  const fallbackRoles: ColorItem['role'][] = ['secondary', 'muted', 'primary', 'accent'];
  let fbIdx = 0;
  analyzed.forEach((item) => {
    if (!item.assignedRole) {
      item.assignedRole = fallbackRoles[fbIdx % fallbackRoles.length];
      fbIdx++;
    }
  });

  return analyzed.map((item) => ({
    ...item.color,
    role: item.assignedRole,
  }));
}

/**
 * Generates an authentically balanced UI design system palette based on a primary hue.
 * Produces structured tokens: Primary, Secondary, Accent, Surface, Background, Text, Muted
 * with mathematically sound lightness tiers.
 */
export function generateUiSystemColors(baseHex: string, count: number): string[] {
  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb);
  const h = baseHsl.h;

  const hexes: string[] = [];

  // Tier 1: Primary Brand CTA (vivid, prominent midtone)
  const primaryHex = rgbToHex(
    hslToRgb({
      h,
      s: clamp(baseHsl.s, 65, 95),
      l: clamp(baseHsl.l, 52, 66),
    })
  );
  hexes.push(primaryHex);

  // Tier 2: Deep Dark Background (tinted with subtle ambient base hue)
  const bgHex = rgbToHex(
    hslToRgb({
      h,
      s: 18,
      l: 7,
    })
  );
  hexes.push(bgHex);

  // Tier 3: Elevated Surface / Card (distinct contrast from background)
  const surfaceHex = rgbToHex(
    hslToRgb({
      h,
      s: 16,
      l: 12,
    })
  );
  hexes.push(surfaceHex);

  // Tier 4: High-Contrast Primary Text (meets WCAG AAA against bg and surface)
  const textHex = rgbToHex(
    hslToRgb({
      h: (h + 10) % 360,
      s: 12,
      l: 96,
    })
  );
  hexes.push(textHex);

  // Tier 5: Accent Pop (vibrant harmonic hue, e.g. analogous or triadic shift)
  const accentHex = rgbToHex(
    hslToRgb({
      h: (h + 45) % 360,
      s: 85,
      l: 62,
    })
  );
  hexes.push(accentHex);

  // Tier 6: Secondary / Supporting Tone
  const secondaryHex = rgbToHex(
    hslToRgb({
      h: (h + 180) % 360, // Complementary or analogous
      s: 60,
      l: 50,
    })
  );
  hexes.push(secondaryHex);

  // Tier 7: Muted Neutral (for borders, dividers, subtle metadata)
  const mutedHex = rgbToHex(
    hslToRgb({
      h,
      s: 14,
      l: 44,
    })
  );
  hexes.push(mutedHex);

  // If user requested more than 7, add intermediate harmonious tints
  for (let i = 7; i < count; i++) {
    const stepH = (h + i * 35) % 360;
    const stepL = clamp(25 + (i * 12) % 55, 20, 80);
    hexes.push(rgbToHex(hslToRgb({ h: stepH, s: 65, l: stepL })));
  }

  return hexes.slice(0, count);
}

/**
 * Intelligent 1-click Contrast & Lightness Balancing.
 * Preserves hues and locked colors while adjusting unlocked colors to ensure
 * clear visual hierarchy and WCAG AA/AAA compliance across containers, brand actions, and content.
 */
export function balancePaletteContrast(colors: ColorItem[]): ColorItem[] {
  // First ensure proper semantic roles
  const withRoles = assignColorRoles(colors);

  return withRoles.map((c) => {
    if (c.locked) return c; // Never mutate locked colors

    const rgb = hexToRgb(c.hex);
    const hsl = rgbToHsl(rgb);
    let targetL = hsl.l;
    let targetS = hsl.s;

    switch (c.role) {
      case 'background':
        // Deep container: ~7-9% lightness, subtle ambient tint
        targetL = clamp(targetL, 6, 9);
        targetS = clamp(targetS, 10, 22);
        break;

      case 'surface':
        // Card/Panel: ~12-16% lightness, clear separation from background
        targetL = clamp(targetL, 12, 16);
        targetS = clamp(targetS, 12, 24);
        break;

      case 'text':
        // Content: ~94-98% lightness for outstanding readability
        targetL = clamp(targetL, 94, 98);
        targetS = clamp(targetS, 5, 20);
        break;

      case 'primary':
        // Hero brand CTA: vibrant midtone
        targetL = clamp(targetL, 54, 66);
        targetS = clamp(targetS, 70, 95);
        break;

      case 'accent':
        // High-energy highlight
        targetL = clamp(targetL, 58, 70);
        targetS = clamp(targetS, 80, 100);
        break;

      case 'muted':
        // Secondary copy / borders
        targetL = clamp(targetL, 42, 52);
        targetS = clamp(targetS, 12, 28);
        break;

      case 'secondary':
      default:
        // Supporting tone
        targetL = clamp(targetL, 46, 58);
        targetS = clamp(targetS, 50, 80);
        break;
    }

    const balancedHex = rgbToHex(hslToRgb({ h: hsl.h, s: targetS, l: targetL }));
    return {
      ...c,
      hex: balancedHex,
      name: getColorName(balancedHex),
    };
  });
}

/**
 * Generates or regenerates a full palette with lock preservation and role assignment
 */
export function generatePalette(params: {
  existingColors?: ColorItem[];
  count?: number;
  harmony?: HarmonyType;
  baseHex?: string;
  name?: string;
  mode?: 'ui-system' | 'pure-harmony';
}): Palette {
  const count = params.count ?? params.existingColors?.length ?? 5;
  const harmony = params.harmony ?? 'analogous';
  const mode = params.mode ?? 'ui-system';

  // Check if there is a locked base color or user provided base
  const lockedColor = params.existingColors?.find((c) => c.locked);
  const baseHex = params.baseHex ?? lockedColor?.hex ?? generateRandomHex();

  // Generate either practical UI system colors or classic color wheel harmonies
  const generatedHexes =
    mode === 'ui-system'
      ? generateUiSystemColors(baseHex, count)
      : generateHarmonicColors({
          baseHex,
          count,
          harmonyType: harmony,
        });

  const finalColors: ColorItem[] = [];

  for (let i = 0; i < count; i++) {
    const existing = params.existingColors?.[i];
    if (existing && existing.locked) {
      finalColors.push(existing);
    } else {
      const hex = generatedHexes[i] || generateRandomHex();
      finalColors.push({
        id: existing?.id ?? `color-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        hex,
        name: getColorName(hex),
        locked: false,
      });
    }
  }

  const roleAssignedColors = assignColorRoles(finalColors);

  // Palette name based on the primary or dominant color
  const primaryColor = roleAssignedColors.find((c) => c.role === 'primary') || roleAssignedColors[0];
  const paletteName =
    params.name ?? `${getColorName(primaryColor?.hex || baseHex)} Harmony`;

  return {
    id: `palette-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: paletteName,
    colors: roleAssignedColors,
    harmony,
    createdAt: Date.now(),
    isFavorite: false,
  };
}
