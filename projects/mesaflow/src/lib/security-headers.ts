/** CSP e security headers — Next headers / Vercel. Turnstile incluído quando configurado. */

import { turnstileSiteKeyPublic } from "./turnstile";

function turnstileOrigins(): string {
  return turnstileSiteKeyPublic() ? " https://challenges.cloudflare.com" : "";
}

export function contentSecurityPolicy(): string {
  const turnstile = turnstileOrigins();
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'${turnstile}`,
    `style-src 'self' 'unsafe-inline'${turnstile}`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'${turnstile}`,
    `frame-src 'self'${turnstile}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export function securityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy": contentSecurityPolicy(),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  };
}

export function securityHeaderEntries(): Array<{ key: string; value: string }> {
  return Object.entries(securityHeaders()).map(([key, value]) => ({ key, value }));
}
