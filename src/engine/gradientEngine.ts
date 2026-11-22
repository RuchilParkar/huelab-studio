import { GradientConfig, GradientStop } from '../types';
import { isValidHex, normalizeHex } from './colorConversion';

/**
 * Generates the valid CSS background string for a GradientConfig
 */
export function generateGradientCss(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopString = sortedStops
    .map((s) => {
      const clampedPos = Math.max(0, Math.min(100, Math.round(s.position)));
      const color = isValidHex(s.color) ? normalizeHex(s.color) : s.color;
      return `${color} ${clampedPos}%`;
    })
    .join(', ');

  if (config.type === 'linear') {
    return `linear-gradient(${config.angle}deg, ${stopString})`;
  } else {
    const shape = config.shape || 'circle';
    return `radial-gradient(${shape} at center, ${stopString})`;
  }
}

/**
 * Creates default initial gradient config
 */
export function getDefaultGradient(): GradientConfig {
  return {
    type: 'linear',
    angle: 135,
    stops: [
      { id: 'stop-1', color: '#A78BFA', position: 0 },
      { id: 'stop-2', color: '#6366F1', position: 50 },
      { id: 'stop-3', color: '#EC4899', position: 100 },
    ],
  };
}

/**
 * Renders gradient to an offscreen HTML Canvas and exports as PNG Data URL
 */
export function exportGradientToPng(
  config: GradientConfig,
  width: number = 1200,
  height: number = 800
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      let gradient: CanvasGradient;
      const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);

      if (config.type === 'linear') {
        const rad = ((config.angle - 90) * Math.PI) / 180;
        const x1 = width / 2 - (Math.cos(rad) * width) / 2;
        const y1 = height / 2 - (Math.sin(rad) * height) / 2;
        const x2 = width / 2 + (Math.cos(rad) * width) / 2;
        const y2 = height / 2 + (Math.sin(rad) * height) / 2;
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      } else {
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.max(width, height) / 2;
        gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      }

      for (const stop of sortedStops) {
        const offset = Math.min(Math.max((Number(stop.position) || 0) / 100, 0), 1);
        const safeColor = isValidHex(stop.color) ? normalizeHex(stop.color) : '#7C5CFC';
        gradient.addColorStop(offset, safeColor);
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      reject(err);
    }
  });
}
