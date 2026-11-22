import { hexToRgb } from './colorConversion';

/**
 * Comprehensive curated dictionary of human-friendly, professional color names.
 */
interface ColorEntry {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
}

const COLOR_DATABASE: ColorEntry[] = [
  // Neutrals, Darks & Blacks
  { name: 'Obsidian Black', hex: '#0B0C10', r: 11, g: 12, b: 16 },
  { name: 'Midnight Charcoal', hex: '#111319', r: 17, g: 19, b: 25 },
  { name: 'Eclipse Shadow', hex: '#171A22', r: 23, g: 26, b: 34 },
  { name: 'Slate Graphite', hex: '#272B36', r: 39, g: 43, b: 54 },
  { name: 'Muted Pewter', hex: '#626A78', r: 98, g: 106, b: 120 },
  { name: 'Cool Steel', hex: '#9298A6', r: 146, g: 152, b: 166 },
  { name: 'Silver Ash', hex: '#C2C7D0', r: 194, g: 199, b: 208 },
  { name: 'Cloud White', hex: '#F4F5F7', r: 244, g: 245, b: 247 },
  { name: 'Pure Snow', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { name: 'Jet Black', hex: '#000000', r: 0, g: 0, b: 0 },
  { name: 'Pitch Night', hex: '#08080C', r: 8, g: 8, b: 12 },
  { name: 'Vampire Grey', hex: '#1E2026', r: 30, g: 32, b: 38 },
  { name: 'Gunmetal', hex: '#2A303C', r: 42, g: 48, b: 60 },

  // Purples & Violets
  { name: 'Royal Amethyst', hex: '#7C5CFC', r: 124, g: 92, b: 252 },
  { name: 'Velvet Lavender', hex: '#A78BFA', r: 167, g: 139, b: 250 },
  { name: 'Soft Lilac', hex: '#C4B5FD', r: 196, g: 181, b: 253 },
  { name: 'Pale Iris', hex: '#DDD6FE', r: 221, g: 214, b: 254 },
  { name: 'Deep Violet', hex: '#5B21B6', r: 91, g: 33, b: 182 },
  { name: 'Midnight Violet', hex: '#3B0764', r: 59, g: 7, b: 100 },
  { name: 'Electric Violet', hex: '#8B5CF6', r: 139, g: 92, b: 246 },
  { name: 'Mystic Orchid', hex: '#C084FC', r: 192, g: 132, b: 252 },
  { name: 'Cosmic Plum', hex: '#6D28D9', r: 109, g: 40, b: 217 },
  { name: 'Nebula Purple', hex: '#7E22CE', r: 126, g: 34, b: 206 },
  { name: 'Thistle Frost', hex: '#E9D5FF', r: 233, g: 213, b: 255 },

  // Blues & Cyans
  { name: 'Deep Indigo', hex: '#4338CA', r: 67, g: 56, b: 202 },
  { name: 'Electric Cobalt', hex: '#6366F1', r: 99, g: 102, b: 241 },
  { name: 'Periwinkle Dusk', hex: '#818CF8', r: 129, g: 140, b: 248 },
  { name: 'Oceanic Blue', hex: '#2563EB', r: 37, g: 99, b: 235 },
  { name: 'Cerulean Sky', hex: '#3B82F6', r: 59, g: 130, b: 246 },
  { name: 'Glacier Blue', hex: '#60A5FA', r: 96, g: 165, b: 250 },
  { name: 'Arctic Ice', hex: '#93C5FD', r: 147, g: 197, b: 253 },
  { name: 'Breeze Mist', hex: '#BFDBFE', r: 191, g: 219, b: 254 },
  { name: 'Navy Abyss', hex: '#1E3A8A', r: 30, g: 58, b: 138 },
  { name: 'Cyber Cyan', hex: '#06B6D4', r: 6, g: 182, b: 212 },
  { name: 'Neon Aquamarine', hex: '#0891B2', r: 8, g: 145, b: 178 },
  { name: 'Capri Cyan', hex: '#22D3EE', r: 34, g: 211, b: 238 },
  { name: 'Frosted Cyan', hex: '#67E8F9', r: 103, g: 232, b: 249 },
  { name: 'Lagoon Turquoise', hex: '#14B8A6', r: 20, g: 184, b: 166 },
  { name: 'Deep Teal', hex: '#0F766E', r: 15, g: 118, b: 110 },
  { name: 'Mint Oasis', hex: '#2DD4BF', r: 45, g: 212, b: 191 },
  { name: 'Seafoam Tide', hex: '#5EEAD4', r: 94, g: 234, b: 212 },

  // Greens
  { name: 'Emerald Glade', hex: '#10B981', r: 16, g: 185, b: 129 },
  { name: 'Forest Green', hex: '#047857', r: 4, g: 120, b: 87 },
  { name: 'Pine Needle', hex: '#064E3B', r: 6, g: 78, b: 59 },
  { name: 'Jumping Jade', hex: '#059669', r: 5, g: 150, b: 105 },
  { name: 'Spring Foliage', hex: '#34D399', r: 52, g: 211, b: 153 },
  { name: 'Pale Celadon', hex: '#6EE7B7', r: 110, g: 231, b: 183 },
  { name: 'Dew Mint', hex: '#A7F3D0', r: 167, g: 243, b: 208 },
  { name: 'Lime Zest', hex: '#84CC16', r: 132, g: 204, b: 22 },
  { name: 'Chartreuse Neon', hex: '#A3E635', r: 163, g: 230, b: 53 },
  { name: 'Olive Grove', hex: '#65A30D', r: 101, g: 163, b: 13 },
  { name: 'Matcha Herb', hex: '#4D7C0F', r: 77, g: 124, b: 15 },

  // Yellows & Golds
  { name: 'Golden Amber', hex: '#F59E0B', r: 245, g: 158, b: 11 },
  { name: 'Champagne Gold', hex: '#FBBF24', r: 251, g: 191, b: 36 },
  { name: 'Solar Flares', hex: '#FCD34D', r: 252, g: 211, b: 77 },
  { name: 'Honey Wheat', hex: '#FDE68A', r: 253, g: 230, b: 138 },
  { name: 'Pure Sunlight', hex: '#EAB308', r: 234, g: 179, b: 8 },
  { name: 'Canary Yellow', hex: '#FACC15', r: 250, g: 204, b: 21 },
  { name: 'Dijon Mustard', hex: '#CA8A04', r: 202, g: 138, b: 4 },
  { name: 'Ancient Bronze', hex: '#A16207', r: 161, g: 98, b: 7 },

  // Oranges, Corals & Terracottas
  { name: 'Tangerine Dream', hex: '#F97316', r: 249, g: 115, b: 22 },
  { name: 'Autumn Ember', hex: '#EA580C', r: 234, g: 88, b: 12 },
  { name: 'Spiced Ochre', hex: '#C2410C', r: 194, g: 65, b: 12 },
  { name: 'Apricot Glow', hex: '#FB923C', r: 251, g: 146, b: 60 },
  { name: 'Peach Sorbet', hex: '#FDBA74', r: 253, g: 186, b: 116 },
  { name: 'Warm Bisque', hex: '#FED7AA', r: 254, g: 215, b: 170 },
  { name: 'Coral Reef', hex: '#FF6B6B', r: 255, g: 107, b: 107 },
  { name: 'Burnt Terracotta', hex: '#9A3412', r: 154, g: 52, b: 18 },

  // Reds, Roses & Pinks
  { name: 'Crimson Pulse', hex: '#EF4444', r: 239, g: 68, b: 68 },
  { name: 'Scarlet Ember', hex: '#DC2626', r: 220, g: 38, b: 38 },
  { name: 'Ruby Wine', hex: '#B91C1C', r: 185, g: 28, b: 28 },
  { name: 'Blood Garnet', hex: '#991B1B', r: 153, g: 27, b: 27 },
  { name: 'Watermelon Glow', hex: '#F87171', r: 248, g: 113, b: 113 },
  { name: 'Blush Blossom', hex: '#FCA5A5', r: 252, g: 165, b: 165 },
  { name: 'Neon Fuchsia', hex: '#EC4899', r: 236, g: 72, b: 153 },
  { name: 'Magenta Spark', hex: '#DB2777', r: 219, g: 39, b: 119 },
  { name: 'Berry Velvet', hex: '#BE185D', r: 190, g: 24, b: 93 },
  { name: 'Candy Rose', hex: '#F472B6', r: 244, g: 114, b: 182 },
  { name: 'Dusty Rose', hex: '#F9A8D4', r: 249, g: 168, b: 212 },
  { name: 'Sakura Petal', hex: '#FBCFE8', r: 251, g: 207, b: 232 },
  { name: 'Mulberry Night', hex: '#831843', r: 131, g: 24, b: 67 },

  // Earthy, Browns & Warm Neutrals
  { name: 'Espresso Bean', hex: '#3E2723', r: 62, g: 39, b: 35 },
  { name: 'Roasted Mocha', hex: '#4E342E', r: 78, g: 52, b: 46 },
  { name: 'Warm Chestnut', hex: '#5D4037', r: 93, g: 64, b: 55 },
  { name: 'Caramel Fudge', hex: '#8D6E63', r: 141, g: 110, b: 99 },
  { name: 'Desert Sand', hex: '#BCAAA4', r: 188, g: 170, b: 164 },
  { name: 'Oatmeal Milk', hex: '#D7CCC8', r: 215, g: 204, b: 200 },
  { name: 'Vanilla Cream', hex: '#EFEBE9', r: 239, g: 235, b: 233 },
];

/**
 * Calculates weighted Euclidean distance for RGB colors
 * Uses redmean color distance formula for human eye perception accuracy:
 * https://en.wikipedia.org/wiki/Color_difference#sRGB
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rmean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(
    (2 + rmean / 256) * dr * dr +
    4 * dg * dg +
    (2 + (255 - rmean) / 256) * db * db
  );
}

/**
 * Finds the nearest human-friendly name for any given HEX color.
 */
export function getColorName(hex: string): string {
  try {
    const rgb = hexToRgb(hex);
    let minDistance = Infinity;
    let closestName = 'Custom Hue';

    for (let i = 0; i < COLOR_DATABASE.length; i++) {
      const entry = COLOR_DATABASE[i];
      const dist = colorDistance(rgb.r, rgb.g, rgb.b, entry.r, entry.g, entry.b);
      if (dist < minDistance) {
        minDistance = dist;
        closestName = entry.name;
      }
    }

    return closestName;
  } catch {
    return 'Chromatic Hue';
  }
}
