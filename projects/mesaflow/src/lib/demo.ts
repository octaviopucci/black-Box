export const DEMO_ESTABLISHMENT_SLUG = "ponto-do-sabor";
export const DEMO_ESTABLISHMENT_ID = "est_ponto_sabor";

/** Login do lojista demo (restaurante) — NÃO é platform owner. Somente dev seed. */
export const DEMO_LOGIN = { email: "owner@pontodosabor.com", password: "demo123" };

/** Login do dono da plataforma NA MESA — defaults só em dev; produção exige env. */
export const PLATFORM_OWNER_LOGIN = {
  email: process.env.MESAFLOW_PLATFORM_OWNER_EMAIL || "octavio@namesa.io",
  password: process.env.MESAFLOW_PLATFORM_OWNER_PASSWORD || "namesa-platform-dev",
};
