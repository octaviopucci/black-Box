const GUEST_TOKEN_KEY = "mf_cs";

export function getStoredGuestToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(GUEST_TOKEN_KEY);
}

export function storeGuestToken(token: string) {
  sessionStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function clearGuestToken() {
  sessionStorage.removeItem(GUEST_TOKEN_KEY);
}
