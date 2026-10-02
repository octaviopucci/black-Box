export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  const smooth =
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches;
  target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
}

export function openInstagram(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
