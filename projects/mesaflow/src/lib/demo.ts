export const DEMO_ESTABLISHMENT_SLUG = "ponto-do-sabor";
export const DEMO_ESTABLISHMENT_ID = "est_ponto_sabor";

/** Login do lojista demo (restaurante) — também re-seed em produção quando store vazio. */
export const DEMO_LOGIN = { email: "owner@pontodosabor.com", password: "demo123" };

/** Login do dono da plataforma NA MESA — env ou defaults; seed automático se store vazio. */
export const PLATFORM_OWNER_LOGIN = {
  email: process.env.MESAFLOW_PLATFORM_OWNER_EMAIL || "octavio@namesa.io",
  password: process.env.MESAFLOW_PLATFORM_OWNER_PASSWORD || "namesa-platform-dev",
};
