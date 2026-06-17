/** Matches only base64-encoded PNG / JPEG / WebP data URLs under 5 MB. */
const DATA_URL_RE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

/**
 * Returns true when `value` is a safe, inline base64 image data URL.
 * Rejects external URLs, `javascript:` URIs, and suspiciously large payloads.
 */
export function isSafeImageDataUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    DATA_URL_RE.test(value) &&
    value.length < 5_000_000
  );
}
