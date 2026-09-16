export type UserRole = "OWNER" | "MANAGER" | "KITCHEN" | "COUNTER" | "WAITER";

export type BusinessType =
  | "restaurante"
  | "lanchonete"
  | "padaria"
  | "bar"
  | "cafeteria"
  | "rodizio";

export type TableStatus = "LIVRE" | "OCUPADA" | "AGUARDANDO_PAGAMENTO" | "RESERVADA" | "INATIVA";

export type OrderStatus =
  | "NOVO"
  | "ACEITO"
  | "EM_PREPARO"
  | "PRONTO"
  | "ENTREGUE"
  | "CANCELADO";

export type SectorKind = "COZINHA" | "BALCAO" | "BAR" | "CAFETERIA" | "PIZZARIA" | "CONFEITARIA";

export type ProductAvailability = "VITRINE" | "SOB_DEMANDA" | "AMBOS";

export interface Establishment {
  id: string;
  slug: string;
  name: string;
  businessType?: BusinessType;
  logo?: string;
  tagline?: string;
  open: boolean;
  rodizioEnabled: boolean;
  settings: EstablishmentSettings;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  establishmentId: string;
  createdAt: string;
  expiresAt: string;
}

export interface EstablishmentSettings {
  currency: string;
  allowEditAfterPrep: boolean;
  soundNotifications: boolean;
  minIntervalRodizioSec: number;
}

export interface User {
  id: string;
  establishmentId: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  active: boolean;
}

export interface Sector {
  id: string;
  establishmentId: string;
  name: string;
  kind: SectorKind;
  color: string;
  active: boolean;
}

export interface Category {
  id: string;
  establishmentId: string;
  name: string;
  emoji?: string;
  sortOrder: number;
  active: boolean;
  parentId?: string;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  maxQty?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  establishmentId: string;
  categoryId: string;
  sectorId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  tags: string[];
  prepMinutes: number;
  availability: ProductAvailability;
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
  addons: ProductAddon[];
  rodizioIncluded: boolean;
  rodizioPremiumPrice?: number;
}

export interface Table {
  id: string;
  establishmentId: string;
  number: string;
  name: string;
  capacity: number;
  status: TableStatus;
  commandId?: string;
  qrToken: string;
}

export interface Command {
  id: string;
  establishmentId: string;
  tableId: string;
  openedAt: string;
  closedAt?: string;
  status: "ABERTA" | "FECHADA" | "PAGAMENTO_SOLICITADO";
  guestCount: number;
  total: number;
}

export interface OrderItemAddon {
  addonId: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sectorId: string;
  sectorName: string;
  qty: number;
  unitPrice: number;
  variantName?: string;
  variantDelta: number;
  addons: OrderItemAddon[];
  notes?: string;
  status: OrderStatus;
}

export interface Order {
  id: string;
  establishmentId: string;
  tableId: string;
  tableNumber: string;
  commandId: string;
  /** Fase 0: legado usa gp_legacy_{commandId} */
  guestParticipationId?: string;
  number: number;
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  source: "MESA" | "RODIZIO" | "BALCAO";
  rodizioRoundId?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload do cliente — sem preços (resolvidos no servidor). */
export interface OrderLineInput {
  productId: string;
  qty: number;
  variantId?: string;
  addonIds?: string[];
  notes?: string;
}

export interface Rodizio {
  id: string;
  establishmentId: string;
  name: string;
  pricePerPerson: number;
  durationMinutes: number;
  maxItemsPerRound: number;
  maxRounds: number;
  minIntervalSec: number;
  drinksIncluded: boolean;
  active: boolean;
  productIds: string[];
  premiumProductIds: string[];
}

export interface RodizioRound {
  id: string;
  establishmentId: string;
  commandId: string;
  tableId: string;
  rodizioId: string;
  roundNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  sentAt?: string;
}

export interface Notification {
  id: string;
  establishmentId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface MesaFlowOperationalStore {
  establishments: Record<string, Establishment>;
  sectors: Record<string, Sector>;
  categories: Record<string, Category>;
  products: Record<string, Product>;
  tables: Record<string, Table>;
  commands: Record<string, Command>;
  orders: Record<string, Order>;
  rodizios: Record<string, Rodizio>;
  rodizioRounds: Record<string, RodizioRound>;
  notifications: Record<string, Notification>;
  orderCounter: Record<string, number>;
}

export interface MesaFlowIdentityStore {
  users: Record<string, User>;
  sessions: Record<string, Session>;
}

export interface MesaFlowStore extends MesaFlowOperationalStore, MesaFlowIdentityStore {}

export type StoreEvent =
  | { type: "order.created"; orderId: string; establishmentId: string }
  | { type: "order.updated"; orderId: string; establishmentId: string }
  | { type: "command.updated"; commandId: string; establishmentId: string }
  | { type: "notification"; notificationId: string; establishmentId: string }
  | { type: "rodizio.round"; roundId: string; establishmentId: string };
