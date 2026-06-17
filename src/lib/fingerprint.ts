const COOLDOWN_MS = 60_000; // 1 minute between submissions

/**
 * Returns a stable anonymous fingerprint for this browser session.
 * Creates and persists one in localStorage on first call.
 */
export function getOrCreateFingerprint(): string {
  let fp = localStorage.getItem("drawing_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("drawing_fp", fp);
  }
  return fp;
}

/**
 * Returns true if enough time has elapsed since the last submission.
 * Pass `null` when there is no recorded last-submit time.
 */
export function canSubmit(lastSubmitTimestamp: number | null): boolean {
  if (!lastSubmitTimestamp) return true;
  return Date.now() - lastSubmitTimestamp >= COOLDOWN_MS;
}

/** Read the persisted last-submit timestamp from localStorage. */
export function getLastSubmitTimestamp(): number | null {
  const raw = localStorage.getItem("last_drawing_submit");
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Persist the current time as the last-submit timestamp. */
export function recordSubmit(): void {
  localStorage.setItem("last_drawing_submit", Date.now().toString());
}
