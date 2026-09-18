export type UserRole = "OWNER" | "MANAGER" | "KITCHEN" | "COUNTER" | "WAITER";

/** Planos comerciais NA MESA (SaaS). */
export type PlatformPlan = "essencial" | "premium" | "custom";

/** Status operacional do lojista na plataforma. */
export type PlatformStatus = "active" | "inactive" | "suspended";

export type PlatformUserRole = "PLATFORM_OWNER";

export interface PlatformUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: PlatformUserRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type BusinessType =
  | "restaurante"
  | "lanchonete"
  | "padaria"
  | "bar"
  | "cafeteria"
  | "rodizio";

export type OperationMode =
  | "a_la_carte"
  | "rodizio"
  | "buffet"
  | "self_service"
  | "peso_kg"
  | "comanda"
  | "personalizado"
  | "outros";

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
  /** Default: a_la_carte */
  operationMode?: OperationMode;
  logo?: string;
  tagline?: string;
  open: boolean;
  rodizioEnabled: boolean;
  settings: EstablishmentSettings;
  createdAt: string;
  /** Plano NA MESA — default essencial no cadastro. */
  plan?: PlatformPlan;
  planStartedAt?: string;
  /** Controle pelo platform admin — default active. */
  platformStatus?: PlatformStatus;
  suspendedAt?: string;
  suspendedReason?: string;
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
  /** Default true — demo `ponto-do-sabor` usa false */
  otpRequired?: boolean;
}

export type GuestParticipationStatus = "OPEN" | "CLOSING_REQUESTED" | "CLOSED";

export interface GuestParticipation {
  id: string;
  establishmentId: string;
  commandId: string;
  tableId: string;
  phoneLookupHash: string;
  phoneDisplay: string;
  displayName?: string;
  comandaNumber?: string;
  participantIndex: number;
  status: GuestParticipationStatus;
  joinedAt: string;
  verifiedAt: string;
  closingRequestedAt?: string;
  closedAt?: string;
  closedByUserId?: string;
  /** OK do restaurante — cliente pode sair da mesa após este timestamp */
  paymentConfirmedAt?: string;
  paymentConfirmedByUserId?: string;
  orderCount: number;
  lastOrderAt?: string;
}

export interface ClientSession {
  id: string;
  guestParticipationId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
  revokedAt?: string;
}

export interface OtpChallenge {
  id: string;
  establishmentId: string;
  commandId: string;
  tableId: string;
  phoneLookupHash: string;
  codeHash: string;
  purpose: "JOIN" | "RECOVER";
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  consumedAt?: string;
  sentAt: string;
  resendCount: number;
}

export interface GuestPhoneSecret {
  phoneCiphertext: string;
}

export interface User {
  id: string;
  establishmentId: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  active: boolean;
  lastLoginAt?: string;
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
  /** Order bumps shown in product modal / cart */
  bumpProductIds?: string[];
  upsellProductIds?: string[];
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

export type ClosingScope = "SELF" | "SELECTED" | "TABLE";

export interface Command {
  id: string;
  establishmentId: string;
  tableId: string;
  openedAt: string;
  closedAt?: string;
  status: "ABERTA" | "FECHADA" | "PAGAMENTO_SOLICITADO";
  guestCount: number;
  total: number;
  closingRequestedAt?: string;
  lastClosingScope?: ClosingScope;
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
  guestParticipationId: string;
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
  guestParticipationId: string;
  rodizioId: string;
  roundNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  sentAt?: string;
}

export interface ClosingRequest {
  id: string;
  establishmentId: string;
  commandId: string;
  tableId: string;
  requestedByGuestParticipationId: string;
  scope: ClosingScope;
  targetGuestParticipationIds: string[];
  status: "PENDING" | "CANCELLED" | "CONFIRMED" | "SETTLED";
  createdAt: string;
  cancelledAt?: string;
  confirmedAt?: string;
  confirmedByUserId?: string;
  settledAt?: string;
  settledByUserId?: string;
}

export interface OrderItemSplit {
  id: string;
  orderItemId: string;
  orderId: string;
  commandId: string;
  guestParticipationId: string;
  quantity: number;
  createdAt: string;
}

export type PaymentMethod = "cash" | "credit" | "debit" | "pix" | "other";
export type PaymentStatus = "registered" | "voided";

export interface Payment {
  id: string;
  establishmentId: string;
  commandId: string;
  guestParticipationId?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  registeredByUserId: string;
  registeredAt: string;
  note?: string;
  voidedAt?: string;
  voidedByUserId?: string;
}

export interface Notification {
  id: string;
  establishmentId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  commandId?: string;
  tableId?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export type IntegrationProvider = "ifood" | "rappi" | "whatsapp" | "erp" | "webhook";
export type IntegrationStatus = "available" | "connected" | "error" | "disabled";

export interface IntegrationConnection {
  id: string;
  establishmentId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  label: string;
  config: Record<string, string>;
  connectedAt?: string;
  lastSyncAt?: string;
  lastError?: string;
}

export interface AuditEvent {
  id: string;
  establishmentId: string;
  type: string;
  actorType: "STAFF" | "SYSTEM";
  actorUserId?: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
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
  guestParticipations: Record<string, GuestParticipation>;
  rodizios: Record<string, Rodizio>;
  rodizioRounds: Record<string, RodizioRound>;
  notifications: Record<string, Notification>;
  closingRequests: Record<string, ClosingRequest>;
  orderItemSplits: Record<string, OrderItemSplit>;
  payments: Record<string, Payment>;
  integrationConnections: Record<string, IntegrationConnection>;
  auditEvents: Record<string, AuditEvent>;
  orderCounter: Record<string, number>;
}

export interface MesaFlowIdentityStore {
  users: Record<string, User>;
  sessions: Record<string, Session>;
  platformUsers: Record<string, PlatformUser>;
  clientSessions: Record<string, ClientSession>;
  otpChallenges: Record<string, OtpChallenge>;
  guestPhoneSecrets: Record<string, GuestPhoneSecret>;
  /** hashToken(guestJwt) → ISO revokedAt — denylist so revoke works with JWT sessions */
  revokedGuestTokenHashes: Record<string, string>;
}

export interface MesaFlowStore extends MesaFlowOperationalStore, MesaFlowIdentityStore {}

export type StoreEvent =
  | { type: "order.created"; orderId: string; establishmentId: string }
  | { type: "order.updated"; orderId: string; establishmentId: string }
  | { type: "command.updated"; commandId: string; establishmentId: string }
  | { type: "notification"; notificationId: string; establishmentId: string }
  | { type: "rodizio.round"; roundId: string; establishmentId: string };
