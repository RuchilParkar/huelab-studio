import { Palette } from '../types';

/**
 * Formats palette as clean CSS variables
 */
export function exportToCssVariables(palette: Palette): string {
  const lines = [
    `/* huelabstudio Generated Palette: ${palette.name} */`,
    `:root {`,
  ];

  palette.colors.forEach((color, idx) => {
    const roleName = color.role ? `-${color.role}` : '';
    lines.push(`  --color${roleName}-${idx + 1}: ${color.hex}; /* ${color.name} */`);
  });

  lines.push('}');
  return lines.join('\n');
}

/**
 * Formats palette as SCSS variables
 */
export function exportToScssVariables(palette: Palette): string {
  const lines = [
    `// huelabstudio Generated Palette: ${palette.name}`,
  ];

  palette.colors.forEach((color, idx) => {
    const roleName = color.role ? `-${color.role}` : '';
    lines.push(`$color${roleName}-${idx + 1}: ${color.hex}; // ${color.name}`);
  });

  return lines.join('\n');
}

/**
 * Formats palette as a Tailwind CSS configuration object
 */
export function exportToTailwindConfig(palette: Palette): string {
  const colorObj: Record<string, string> = {};
  palette.colors.forEach((color, idx) => {
    const key = color.role || `shade-${idx + 1}`;
    colorObj[key] = color.hex;
  });

  return `// Tailwind CSS Color Extension for ${palette.name}\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        huelabstudio: ${JSON.stringify(colorObj, null, 10).replace(/\}$/, '      }')}\n      }\n    }\n  }\n};`;
}

/**
 * Formats palette as structured JSON
 */
export function exportToJson(palette: Palette): string {
  return JSON.stringify(
    {
      app: 'huelabstudio',
      version: '1.0.0',
      palette: {
        id: palette.id,
        name: palette.name,
        harmony: palette.harmony,
        createdAt: palette.createdAt,
        colors: palette.colors.map((c) => ({
          hex: c.hex,
          name: c.name,
          role: c.role,
        })),
      },
    },
    null,
    2
  );
}

/**
 * Generates an elegant high-resolution (1200x630) social/export card on Canvas
 */
export function exportPaletteCardPng(palette: Palette): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const width = 1200;
      const height = 630;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // 1. Dark workspace background
      ctx.fillStyle = '#0B0C10';
      ctx.fillRect(0, 0, width, height);

      // 2. Card frame / surface
      ctx.fillStyle = '#111319';
      ctx.strokeStyle = '#272B36';
      ctx.lineWidth = 2;
      roundRect(ctx, 40, 40, width - 80, height - 80, 20);
      ctx.fill();
      ctx.stroke();

      // 3. Header branding
      ctx.fillStyle = '#A78BFA';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillText('HUELABSTUDIO', 80, 95);

      ctx.fillStyle = '#626A78';
      ctx.font = '400 16px Inter, sans-serif';
      ctx.fillText('Color Intelligence & Palette Studio', 245, 95);

      // Palette Name & Harmony Tag
      ctx.fillStyle = '#F4F5F7';
      ctx.font = '600 28px Inter, sans-serif';
      ctx.fillText(palette.name, 80, 145);

      ctx.fillStyle = '#9298A6';
      ctx.font = '500 14px Inter, monospace';
      ctx.fillText(`HARMONY: ${palette.harmony.toUpperCase()} • ${palette.colors.length} COLORS`, 80, 175);

      // 4. Color Swatches display
      const swatchStartX = 80;
      const swatchStartY = 205;
      const swatchWidth = (width - 160) / palette.colors.length;
      const swatchHeight = 310;

      palette.colors.forEach((color, i) => {
        const x = swatchStartX + i * swatchWidth;

        // Swatch body
        ctx.fillStyle = color.hex;
        if (i === 0) {
          // Left rounded corners
          roundRect(ctx, x, swatchStartY, swatchWidth - 4, swatchHeight, 14, true, false, false, true);
        } else if (i === palette.colors.length - 1) {
          // Right rounded corners
          roundRect(ctx, x, swatchStartY, swatchWidth - 4, swatchHeight, 14, false, true, true, false);
        } else {
          roundRect(ctx, x, swatchStartY, swatchWidth - 4, swatchHeight, 4);
        }
        ctx.fill();

        // Swatch details card below
        ctx.fillStyle = '#F4F5F7';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillText(color.hex, x + 12, swatchStartY + swatchHeight - 45);

        ctx.fillStyle = '#E2E8F0';
        ctx.font = '500 13px Inter, sans-serif';
        const truncatedName = color.name.length > 18 ? color.name.slice(0, 16) + '...' : color.name;
        ctx.fillText(truncatedName, x + 12, swatchStartY + swatchHeight - 20);
      });

      // 5. Footer info
      ctx.fillStyle = '#626A78';
      ctx.font = '400 14px Inter, sans-serif';
      ctx.fillText('Crafted with huelabstudio • huelabstudio.com', 80, height - 60);

      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Helper to draw rounded rectangle on Canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  tl = true,
  tr = true,
  br = true,
  bl = true
) {
  ctx.beginPath();
  ctx.moveTo(x + (tl ? r : 0), y);
  ctx.lineTo(x + w - (tr ? r : 0), y);
  if (tr) ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - (br ? r : 0));
  if (br) ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + (bl ? r : 0), y + h);
  if (bl) ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + (tl ? r : 0));
  if (tl) ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Triggers a client-side file download
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a data URL (like PNG)
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
