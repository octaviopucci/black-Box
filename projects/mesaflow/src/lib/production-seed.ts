import { hashPassword, id } from "./crypto-utils";
import { PLATFORM_OWNER_LOGIN } from "./demo";
import { buildDemoStore } from "./seed";
import { isProductionEnv } from "./production-secrets";
import { getStore, saveStore } from "./store";
import type { MesaFlowStore, PlatformUser } from "./types";

export function needsProductionSeed(store: MesaFlowStore): boolean {
  return (
    Object.keys(store.platformUsers || {}).length === 0 ||
    Object.keys(store.establishments).length === 0
  );
}

/** Merge demo merchant (Ponto do Sabor + owner@pontodosabor.com) when operational data is missing. */
export function mergeDemoMerchantIntoStore(store: MesaFlowStore): boolean {
  const establishmentsEmpty = Object.keys(store.establishments).length === 0;
  const usersEmpty = Object.keys(store.users).length === 0;
  if (!establishmentsEmpty && !usersEmpty) return false;

  const demo = buildDemoStore();

  if (establishmentsEmpty) {
    Object.assign(store.establishments, demo.establishments);
    Object.assign(store.users, demo.users);
    Object.assign(store.sectors, demo.sectors);
    Object.assign(store.categories, demo.categories);
    Object.assign(store.products, demo.products);
    Object.assign(store.tables, demo.tables);
    Object.assign(store.commands, demo.commands);
    Object.assign(store.orders, demo.orders);
    Object.assign(store.rodizios, demo.rodizios);
    Object.assign(store.rodizioRounds, demo.rodizioRounds);
    Object.assign(store.guestParticipations, demo.guestParticipations);
    Object.assign(store.orderCounter, demo.orderCounter);
    Object.assign(store.notifications, demo.notifications);
    Object.assign(store.closingRequests, demo.closingRequests);
    Object.assign(store.orderItemSplits, demo.orderItemSplits);
    Object.assign(store.payments, demo.payments);
    Object.assign(store.integrationConnections, demo.integrationConnections);
    Object.assign(store.auditEvents, demo.auditEvents);
    return true;
  }

  Object.assign(store.users, demo.users);
  return true;
}

function seedPlatformOwner(store: MesaFlowStore): PlatformUser | null {
  store.platformUsers ||= {};
  if (Object.keys(store.platformUsers).length > 0) return null;

  const email = (
    process.env.MESAFLOW_PLATFORM_OWNER_EMAIL?.trim() || PLATFORM_OWNER_LOGIN.email
  ).toLowerCase();
  const password =
    process.env.MESAFLOW_PLATFORM_OWNER_PASSWORD?.trim() || PLATFORM_OWNER_LOGIN.password;

  const existing = Object.values(store.platformUsers).find((u) => u.email === email);
  if (existing) return existing;

  const user: PlatformUser = {
    id: id("plat_"),
    email,
    passwordHash: hashPassword(password),
    name: "Octavio Pucci",
    role: "PLATFORM_OWNER",
    active: true,
    createdAt: new Date().toISOString(),
  };
  store.platformUsers[user.id] = user;
  return user;
}

/**
 * When production store is empty after hydrate (0 establishments or 0 platform users),
 * seed platform owner + demo merchant so login works without Blob recovery.
 */
export function ensureProductionSeed(): boolean {
  if (!isProductionEnv()) return false;

  const store = getStore();
  if (!needsProductionSeed(store) && Object.keys(store.users).length > 0) return false;

  let changed = false;

  if (seedPlatformOwner(store)) changed = true;
  if (mergeDemoMerchantIntoStore(store)) changed = true;

  if (changed) saveStore(store);
  return changed;
}
