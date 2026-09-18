/** Cloudflare Turnstile — opt-in via env; sem keys = skip verify (dev). */

export function turnstileSiteKeyPublic(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ||
    process.env.TURNSTILE_SITE_KEY?.trim() ||
    undefined
  );
}

export function turnstileConfigured(): boolean {
  return Boolean(turnstileSiteKeyPublic() && process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!turnstileConfigured()) return { ok: true };

  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();
  const response = String(token ?? "").trim();
  if (!response) {
    return { ok: false, error: "Verificação anti-bot obrigatória." };
  }

  const body = new URLSearchParams({
    secret,
    response,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (json.success) return { ok: true };
    return {
      ok: false,
      error: "Verificação anti-bot falhou. Tente novamente.",
    };
  } catch {
    return { ok: false, error: "Não foi possível validar anti-bot." };
  }
}
