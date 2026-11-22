import { rgbToHex } from './colorConversion';
import { RgbColor } from '../types';

interface ExtractedColor {
  hex: string;
  rgb: RgbColor;
  percentage: number;
}

/**
 * Extracts dominant colors from an HTMLImageElement using k-means clustering in RGB space.
 */
export function extractColorsFromImage(
  imageElement: HTMLImageElement,
  k: number = 6,
  maxSamplePixels: number = 10000
): ExtractedColor[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // Downscale image for fast, responsive processing
  const width = Math.min(imageElement.naturalWidth || imageElement.width, 240);
  const height = Math.round((width / (imageElement.naturalWidth || 1)) * (imageElement.naturalHeight || 1));
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(imageElement, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Sample pixels, ignoring transparent or near-transparent pixels
  const pixels: [number, number, number][] = [];
  const totalPixels = data.length / 4;
  const step = Math.max(1, Math.floor(totalPixels / maxSamplePixels));

  for (let i = 0; i < data.length; i += step * 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue; // Skip transparent
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  if (pixels.length === 0) return [];

  // Run K-Means Clustering
  const centroids = runKMeans(pixels, Math.min(k, pixels.length), 12);

  // Calculate percentage of pixels belonging to each centroid
  const counts = new Array(centroids.length).fill(0);
  pixels.forEach((p) => {
    let nearestIdx = 0;
    let minDist = Infinity;
    centroids.forEach((c, idx) => {
      const dist = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });
    counts[nearestIdx]++;
  });

  const total = pixels.length;
  const results: ExtractedColor[] = centroids
    .map((c, idx) => {
      const rgb: RgbColor = {
        r: Math.round(c[0]),
        g: Math.round(c[1]),
        b: Math.round(c[2]),
      };
      return {
        hex: rgbToHex(rgb),
        rgb,
        percentage: Math.round((counts[idx] / total) * 1000) / 10,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Filter out any centroids that might be nearly identical
  const uniqueResults: ExtractedColor[] = [];
  results.forEach((item) => {
    const exists = uniqueResults.some((u) => {
      const dr = Math.abs(u.rgb.r - item.rgb.r);
      const dg = Math.abs(u.rgb.g - item.rgb.g);
      const db = Math.abs(u.rgb.b - item.rgb.b);
      return dr + dg + db < 30; // Perceptually close
    });
    if (!exists) {
      uniqueResults.push(item);
    }
  });

  // If strict filtering reduced count below requested k, supplement with next best candidates
  if (uniqueResults.length < k && results.length > uniqueResults.length) {
    for (const item of results) {
      if (!uniqueResults.some((u) => u.hex === item.hex)) {
        uniqueResults.push(item);
        if (uniqueResults.length >= k) break;
      }
    }
  }

  return uniqueResults.slice(0, k);
}

/**
 * K-Means algorithm implementation
 */
function runKMeans(
  pixels: [number, number, number][],
  k: number,
  maxIterations: number
): [number, number, number][] {
  // Initialize centroids with k-means++ style spread
  const centroids: [number, number, number][] = [];
  centroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);

  while (centroids.length < k) {
    const distances = pixels.map((p) => {
      return Math.min(
        ...centroids.map((c) => (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2)
      );
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let target = Math.random() * totalDist;
    let chosen = pixels[0];
    for (let i = 0; i < pixels.length; i++) {
      target -= distances[i];
      if (target <= 0) {
        chosen = pixels[i];
        break;
      }
    }
    centroids.push([...chosen]);
  }

  // Iteratively update centroids
  for (let iter = 0; iter < maxIterations; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);

    for (let p of pixels) {
      let nearestIdx = 0;
      let minDist = Infinity;
      for (let i = 0; i < k; i++) {
        const c = centroids[i];
        const dist = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = i;
        }
      }
      clusters[nearestIdx].push(p);
    }

    let converged = true;
    for (let i = 0; i < k; i++) {
      const cluster = clusters[i];
      if (cluster.length === 0) continue;

      let rSum = 0, gSum = 0, bSum = 0;
      for (const p of cluster) {
        rSum += p[0];
        gSum += p[1];
        bSum += p[2];
      }
      const newCentroid: [number, number, number] = [
        rSum / cluster.length,
        gSum / cluster.length,
        bSum / cluster.length,
      ];

      const diff =
        Math.abs(newCentroid[0] - centroids[i][0]) +
        Math.abs(newCentroid[1] - centroids[i][1]) +
        Math.abs(newCentroid[2] - centroids[i][2]);
      if (diff > 1) converged = false;

      centroids[i] = newCentroid;
    }

    if (converged) break;
  }

  return centroids;
}
