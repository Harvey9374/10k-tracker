/**
 * Sends an image to the background removal API.
 * Dev: local Flask server on :5174
 * Prod: Netlify function at /.netlify/functions/remove-bg
 */

const IS_DEV = import.meta.env.DEV;
const API_URL = IS_DEV
  ? "http://localhost:5174/remove-bg"
  : "/.netlify/functions/remove-bg";

let serverAvailable: boolean | null = null;

async function checkServer(): Promise<boolean> {
  if (serverAvailable !== null) return serverAvailable;
  try {
    const res = await fetch(
      IS_DEV ? "http://localhost:5174/health" : "/.netlify/functions/remove-bg",
      { method: IS_DEV ? "GET" : "OPTIONS", signal: AbortSignal.timeout(3000) }
    );
    serverAvailable = res.ok;
  } catch {
    serverAvailable = false;
  }
  return serverAvailable;
}

/**
 * Remove background from a base64 image data URL.
 * Returns the processed data URL, or the original if the server is unavailable.
 */
export async function removeBackground(imageDataUrl: string): Promise<{ processed: string; didProcess: boolean }> {
  const available = await checkServer();
  if (!available) {
    return { processed: imageDataUrl, didProcess: false };
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.processed) {
      return { processed: data.processed, didProcess: true };
    }
    throw new Error(data.error ?? "No processed image returned");
  } catch {
    // Fall back to original silently
    return { processed: imageDataUrl, didProcess: false };
  }
}

/** Reset the cached availability so the next call re-checks. */
export function resetServerCheck() {
  serverAvailable = null;
}
