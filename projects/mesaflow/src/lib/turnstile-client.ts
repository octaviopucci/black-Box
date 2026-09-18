/** Site key pública para widget Turnstile no browser. */
export function turnstileSiteKeyClient(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
}
