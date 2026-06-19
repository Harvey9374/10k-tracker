/**
 * Client-side background removal using corner-seeded flood fill.
 * Works well for clothing photos with reasonably uniform backgrounds.
 */

const WORK_SIZE = 400; // downscale to this before processing
const TOLERANCE = 35;  // colour distance threshold for flood fill
const EDGE_BLUR = 3;   // feather radius in pixels

function colourDist(data: Uint8ClampedArray, i: number, r: number, g: number, b: number): number {
  return Math.abs(data[i] - r) + Math.abs(data[i + 1] - g) + Math.abs(data[i + 2] - b);
}

/** Flood fill from a seed pixel, marking visited pixels in a mask. */
function floodFill(
  data: Uint8ClampedArray,
  mask: Uint8Array,
  w: number, h: number,
  sx: number, sy: number,
): void {
  const si = (sy * w + sx) * 4;
  const sr = data[si], sg = data[si + 1], sb = data[si + 2];

  const stack: number[] = [sy * w + sx];
  while (stack.length) {
    const idx = stack.pop()!;
    if (mask[idx]) continue;
    const x = idx % w, y = (idx / w) | 0;
    const pi = idx * 4;
    if (colourDist(data, pi, sr, sg, sb) > TOLERANCE) continue;
    mask[idx] = 1;
    if (x > 0)     stack.push(idx - 1);
    if (x < w - 1) stack.push(idx + 1);
    if (y > 0)     stack.push(idx - w);
    if (y < h - 1) stack.push(idx + w);
  }
}

function gaussianBlurMask(mask: Uint8Array, w: number, h: number, radius: number): Float32Array {
  const float = new Float32Array(mask.length);
  for (let i = 0; i < mask.length; i++) float[i] = mask[i];

  const tmp = new Float32Array(mask.length);
  const r = radius;
  // Box blur approximation (3 passes ≈ Gaussian)
  for (let pass = 0; pass < 3; pass++) {
    // Horizontal
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0, count = 0;
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          if (nx >= 0 && nx < w) { sum += float[y * w + nx]; count++; }
        }
        tmp[y * w + x] = sum / count;
      }
    }
    // Vertical
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0, count = 0;
        for (let dy = -r; dy <= r; dy++) {
          const ny = y + dy;
          if (ny >= 0 && ny < h) { sum += tmp[ny * w + x]; count++; }
        }
        float[y * w + x] = sum / count;
      }
    }
  }
  return float;
}

async function removeBgCanvas(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Scale down for processing
      const scale = Math.min(1, WORK_SIZE / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Seed flood fill from all 4 corners + edge midpoints
      const mask = new Uint8Array(w * h);
      const seeds: [number, number][] = [
        [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
        [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
        [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
      ];
      for (const [sx, sy] of seeds) floodFill(data, mask, w, h, sx, sy);

      // Feather the mask edges
      const softMask = gaussianBlurMask(mask, w, h, EDGE_BLUR);

      // Apply mask: background pixels become transparent
      for (let i = 0; i < w * h; i++) {
        const bgStrength = softMask[i];        // 0 = foreground, 1 = background
        const alpha = Math.round((1 - bgStrength) * 255);
        data[i * 4 + 3] = Math.min(data[i * 4 + 3], alpha);
      }
      ctx.putImageData(imageData, 0, 0);

      // Scale back up to original size
      const outCanvas = document.createElement('canvas');
      outCanvas.width = img.width; outCanvas.height = img.height;
      const outCtx = outCanvas.getContext('2d')!;
      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = 'high';
      outCtx.drawImage(canvas, 0, 0, img.width, img.height);

      resolve(outCanvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

export async function removeBackground(
  imageDataUrl: string
): Promise<{ processed: string; didProcess: boolean }> {
  try {
    const processed = await removeBgCanvas(imageDataUrl);
    return { processed, didProcess: true };
  } catch {
    return { processed: imageDataUrl, didProcess: false };
  }
}

export function resetServerCheck() {}
