/** API base: `/api` em dev standalone, `/api/mesaflow` no deploy unificado. */
export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX;
  const base = prefix ? `/api/${prefix}` : "/api";
  return `${base}${normalized}`;
}

const STAFF_FETCH_TIMEOUT_MS = 25_000;

function mergeAbortSignals(
  ...signals: (AbortSignal | undefined | null)[]
): AbortSignal | undefined {
  const active = signals.filter((signal): signal is AbortSignal => Boolean(signal));
  if (active.length === 0) return undefined;
  if (active.length === 1) return active[0];
  const controller = new AbortController();
  for (const signal of active) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return controller.signal;
}

/** Fetch autenticado staff (admin/platform): envia cookie HttpOnly + Bearer se houver. */
export function staffFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const timeoutSignal =
    typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
      ? AbortSignal.timeout(STAFF_FETCH_TIMEOUT_MS)
      : undefined;
  const signal = mergeAbortSignals(init.signal, timeoutSignal);
  return fetch(apiUrl(path), { credentials: "include", ...init, signal }).catch((error) => {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("A requisição demorou demais. Tente novamente.");
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("A requisição demorou demais. Tente novamente.");
    }
    throw error;
  });
}

/** Parse JSON com mensagem legível quando a API não responde JSON (404 HTML, rede, etc.). */
export async function parseApiJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(
      response.ok
        ? "Resposta inválida da API."
        : `Erro ${response.status} ao chamar ${response.url || "a API"}.`,
    );
  }
}
