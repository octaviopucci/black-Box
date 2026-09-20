"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { SoftSuggestions } from "@/components/customer/soft-suggestions";
import { Button } from "@/components/ui/button";
import { hasProductImage, ProductVisual } from "@/components/ui/product-image";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import {
  productBadge,
  suggestionsForCart,
  suggestionsForProduct,
  type SoftSuggestion,
} from "@/lib/menu-intelligence";
import { lineTotal, lineUnitPrice, variantDeltaValue } from "@/lib/order-math";
import type { Category, OrderLineInput, OrderServiceType, Product } from "@/lib/types";

export type OrderCatalogSubmitResult = {
  ok: boolean;
  error?: string;
  orderNumber?: number;
};

type OrderCatalogProps = {
  categories: Category[];
  products: Product[];
  onSubmit: (payload: {
    items: OrderLineInput[];
    serviceType: OrderServiceType;
  }) => Promise<OrderCatalogSubmitResult>;
  /** Garçom: padrão COMER_AQUI; guest exige escolha explícita. */
  defaultServiceType?: OrderServiceType;
  requireServiceTypeChoice?: boolean;
  submitLabel?: string;
  onNotify?: (message: string, tone?: "success" | "error") => void;
};

export function OrderCatalog({
  categories,
  products,
  onSubmit,
  defaultServiceType = "COMER_AQUI",
  requireServiceTypeChoice = false,
  submitLabel = "Confirmar pedido",
  onNotify,
}: OrderCatalogProps) {
  const cart = useCart();
  const notify = useCallback(
    (message: string, tone: "success" | "error" = "success") => {
      onNotify?.(message, tone);
    },
    [onNotify],
  );

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [pendingBumps, setPendingBumps] = useState<Record<string, number>>({});
  const [itemNotes, setItemNotes] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [serviceType, setServiceType] = useState<OrderServiceType | null>(
    requireServiceTypeChoice ? null : defaultServiceType,
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedVariantId(selected?.variants[0]?.id || "");
    setSelectedAddons({});
    setPendingBumps({});
    setItemNotes("");
  }, [selected]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;
      if (categoryId !== "all" && p.categoryId !== categoryId) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, categoryId, search]);

  const featured = useMemo(() => products.filter((p) => p.featured && p.active), [products]);

  const activeCategory = useMemo(
    () => (categoryId === "all" ? null : categories.find((c) => c.id === categoryId) || null),
    [categoryId, categories],
  );

  const categoryEmojiById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.emoji])),
    [categories],
  );

  function categoryEmojiFor(product: Product) {
    return categoryEmojiById[product.categoryId];
  }

  const selectedSuggestions = useMemo(() => {
    if (!selected) return [] as SoftSuggestion[];
    return suggestionsForProduct(selected, products, categories);
  }, [selected, products, categories]);

  const configuredBumpProducts = useMemo(() => {
    if (!selected) return [] as Product[];
    return (selected.bumpProductIds || [])
      .map((id) => products.find((entry) => entry.id === id))
      .filter((product): product is Product => Boolean(product?.active));
  }, [selected, products]);

  const modalSuggestions = useMemo(() => {
    if (!selected) return selectedSuggestions;
    const bumpIds = new Set(selected.bumpProductIds || []);
    return selectedSuggestions.filter((suggestion) => !bumpIds.has(suggestion.product.id));
  }, [selectedSuggestions, selected]);

  const pendingBumpAddons = useMemo(() => {
    return Object.entries(pendingBumps)
      .filter(([, qty]) => qty > 0)
      .flatMap(([productId, qty]) => {
        const product = products.find((entry) => entry.id === productId);
        if (!product) return [];
        return [{ addonId: `bump_${productId}`, name: product.name, price: product.price, qty }];
      });
  }, [pendingBumps, products]);

  const cartSuggestions = useMemo(() => {
    if (cart.lines.length === 0) return [] as SoftSuggestion[];
    return suggestionsForCart(cart.lines, products, categories);
  }, [cart.lines, products, categories]);

  function setPendingBumpQty(productId: string, qty: number) {
    setPendingBumps((current) => {
      const next = { ...current };
      if (qty <= 0) delete next[productId];
      else next[productId] = Math.min(9, qty);
      return next;
    });
  }

  function addSuggestion(suggestion: SoftSuggestion) {
    const { product, parentProductId } = suggestion;
    if (parentProductId) {
      if (selected?.id === parentProductId) {
        setPendingBumpQty(product.id, (pendingBumps[product.id] || 0) + 1);
        notify(`${product.name} adicionado como acréscimo.`);
        return;
      }
      if (cart.lines.some((line) => line.product.id === parentProductId)) {
        cart.addBump(parentProductId, product);
        notify(`${product.name} adicionado como acréscimo.`);
        return;
      }
      return;
    }
    if (product.variants.length > 0) {
      setSelected(product);
      setCartOpen(false);
      return;
    }
    cart.add(product);
    notify(`${product.name} adicionado.`);
  }

  async function handleSubmit() {
    if (cart.lines.length === 0) return;
    const resolvedServiceType = serviceType ?? defaultServiceType;
    if (requireServiceTypeChoice && !serviceType) {
      notify("Escolha se vai comer aqui ou levar para viagem.", "error");
      return;
    }
    for (const line of cart.lines) {
      if (line.product.variants.length > 0 && !line.variant?.id) {
        notify(`Selecione uma opção para ${line.product.name}.`, "error");
        return;
      }
    }
    setSubmitting(true);
    try {
      const result = await onSubmit({
        items: cart.toOrderLines(),
        serviceType: resolvedServiceType,
      });
      if (!result.ok) {
        notify(result.error || "Erro ao enviar pedido", "error");
        return;
      }
      cart.clear();
      setCartOpen(false);
      notify(
        result.orderNumber
          ? `Pedido #${result.orderNumber} enviado.`
          : "Pedido enviado.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative pb-24">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          className="w-full rounded-xl border border-white/10 bg-surface-2/80 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
          placeholder="Buscar no cardápio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {featured.length > 0 && categoryId === "all" && !search && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold">Sugestões da casa</h2>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
            {featured.map((p) => {
              const badge = productBadge(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className="w-44 shrink-0 overflow-hidden rounded-2xl bg-surface-2 text-left ring-1 ring-white/5 transition active:scale-[0.98]"
                >
                  {hasProductImage(p.image) && (
                    <div className="relative">
                      <ProductVisual
                        src={p.image}
                        alt={p.name}
                        width={176}
                        height={120}
                        className="h-28 w-full object-cover"
                      />
                      {badge && (
                        <span className="absolute left-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
                          {badge}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-2.5">
                    {!hasProductImage(p.image) && categoryEmojiFor(p) ? (
                      <span className="mb-1 block text-xl leading-none" aria-hidden>
                        {categoryEmojiFor(p)}
                      </span>
                    ) : null}
                    <p className="line-clamp-2 text-sm font-semibold leading-snug">{p.name}</p>
                    <p className="mt-1 text-sm font-bold text-brand">{formatCurrency(p.price)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="sticky top-0 z-10 -mx-1 mb-2 border-b border-white/5 bg-background/95 pb-2 pt-1 backdrop-blur-xl">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-1">
          <button
            type="button"
            onClick={() => setCategoryId("all")}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold",
              categoryId === "all" ? "bg-brand text-white" : "bg-surface-3/90 text-muted",
            )}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold",
                categoryId === c.id ? "bg-brand text-white" : "bg-surface-3/90 text-muted",
              )}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
        {activeCategory && (
          <p className="mt-2 px-1 text-[11px] text-muted">
            Explorando · {activeCategory.emoji} {activeCategory.name}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const badge = productBadge(p);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="flex w-full gap-3.5 rounded-2xl border border-white/10 p-3 text-left active:scale-[0.99]"
            >
              <ProductVisual
                src={p.image}
                alt={p.name}
                categoryEmoji={categoryEmojiFor(p)}
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
                emojiClassName="h-24 w-24 shrink-0 text-3xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <p className="flex-1 font-semibold leading-snug">{p.name}</p>
                  <Plus className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                </div>
                {badge && (
                  <span className="mt-1 inline-block text-[10px] font-medium text-brand/80">
                    {badge}
                  </span>
                )}
                <p className="mt-1 line-clamp-2 text-xs text-muted">{p.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-base font-bold text-brand">{formatCurrency(p.price)}</p>
                  {p.prepMinutes > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <Clock className="h-3 w-3" />~{p.prepMinutes} min
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 px-5 py-12 text-center">
            <Search className="mx-auto mb-3 h-7 w-7 text-muted" />
            <p className="font-semibold">Nada encontrado</p>
            <p className="mt-1 text-xs text-muted">Tente outro nome ou categoria.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryId("all");
              }}
              className="mt-4 text-xs font-semibold text-brand"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg safe-bottom">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="mx-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl bg-brand px-5 py-4 font-bold text-white shadow-xl shadow-brand/30"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Ver carrinho ({cart.count})
            </span>
            <span>{formatCurrency(cart.total)}</span>
          </button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/60 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-surface-2 sm:max-w-md sm:rounded-3xl">
            <div className="flex-1 overflow-y-auto p-5 pb-2">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug">{selected.name}</h3>
                  {productBadge(selected) && (
                    <p className="mt-1 text-[11px] font-medium text-brand/80">{productBadge(selected)}</p>
                  )}
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Fechar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {hasProductImage(selected.image) ? (
                <ProductVisual
                  src={selected.image}
                  alt={selected.name}
                  width={480}
                  height={260}
                  className="mb-4 h-52 w-full rounded-2xl object-cover"
                />
              ) : categoryEmojiFor(selected) ? (
                <p className="mb-3 text-3xl leading-none" aria-hidden>
                  {categoryEmojiFor(selected)}
                </p>
              ) : null}
              <p className="mb-3 text-sm leading-relaxed text-muted">{selected.description}</p>
              {selected.prepMinutes > 0 && (
                <p className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  Preparo aproximado · {selected.prepMinutes} min
                </p>
              )}
              {selected.variants.length > 0 && (
                <fieldset className="mb-4">
                  <legend className="mb-2 text-sm font-semibold">Escolha uma opção</legend>
                  <div className="grid gap-2">
                    {selected.variants.map((variant) => (
                      <label
                        key={variant.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm",
                          selectedVariantId === variant.id
                            ? "border-brand/40 bg-brand/10"
                            : "border-white/5 bg-surface",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="variant"
                            value={variant.id}
                            checked={selectedVariantId === variant.id}
                            onChange={() => setSelectedVariantId(variant.id)}
                            className="accent-brand"
                          />
                          {variant.name}
                        </span>
                        <span className="text-xs text-muted">
                          {variant.priceDelta
                            ? `${variant.priceDelta > 0 ? "+" : ""}${formatCurrency(variant.priceDelta)}`
                            : "Incluso"}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {selected.addons.length > 0 && (
                <fieldset className="mb-4">
                  <legend className="mb-2 text-sm font-semibold">Adicionais</legend>
                  <div className="space-y-2">
                    {selected.addons.map((addon) => {
                      const quantity = selectedAddons[addon.id] || 0;
                      return (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between rounded-xl bg-surface p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{addon.name}</p>
                            <p className="text-xs text-brand">+{formatCurrency(addon.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Remover ${addon.name}`}
                              onClick={() =>
                                setSelectedAddons((current) => ({
                                  ...current,
                                  [addon.id]: Math.max(0, quantity - 1),
                                }))
                              }
                              className="rounded-lg bg-surface-3 p-2"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-bold">{quantity}</span>
                            <button
                              type="button"
                              aria-label={`Adicionar ${addon.name}`}
                              onClick={() =>
                                setSelectedAddons((current) => ({
                                  ...current,
                                  [addon.id]: Math.min(addon.maxQty || 9, quantity + 1),
                                }))
                              }
                              className="rounded-lg bg-brand p-2 text-white"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              )}
              {configuredBumpProducts.length > 0 && (
                <fieldset className="mb-4">
                  <legend className="mb-2 text-sm font-semibold">Combina bem com</legend>
                  <div className="space-y-2">
                    {configuredBumpProducts.map((product) => {
                      const quantity = pendingBumps[product.id] || 0;
                      return (
                        <div
                          key={product.id}
                          className="flex items-center justify-between rounded-xl bg-surface p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-brand">+{formatCurrency(product.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Remover ${product.name}`}
                              onClick={() => setPendingBumpQty(product.id, quantity - 1)}
                              className="rounded-lg bg-surface-3 p-2"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-bold">{quantity}</span>
                            <button
                              type="button"
                              aria-label={`Adicionar ${product.name}`}
                              onClick={() => setPendingBumpQty(product.id, quantity + 1)}
                              className="rounded-lg bg-brand p-2 text-white"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              )}
              <label className="mb-4 block">
                <span className="mb-1.5 block text-xs font-medium text-muted">Observação (opcional)</span>
                <input
                  value={itemNotes}
                  onChange={(event) => setItemNotes(event.target.value)}
                  maxLength={160}
                  placeholder="Ex.: sem cebola"
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand/50"
                />
              </label>
              <SoftSuggestions
                className="mb-4"
                title="Pedir também"
                suggestions={modalSuggestions}
                categoryEmoji={categoryEmojiFor}
                quantities={pendingBumps}
                onQtyChange={setPendingBumpQty}
              />
            </div>
            <div className="shrink-0 border-t border-white/10 bg-surface-2 p-4 safe-bottom">
              <p className="mb-3 text-xl font-bold text-brand">
                {formatCurrency(
                  lineUnitPrice(
                    selected.price,
                    variantDeltaValue(selected.variants.find((variant) => variant.id === selectedVariantId)),
                    [
                      ...selected.addons
                        .filter((addon) => (selectedAddons[addon.id] || 0) > 0)
                        .map((addon) => ({
                          price: addon.price,
                          qty: selectedAddons[addon.id] || 0,
                        })),
                      ...pendingBumpAddons,
                    ],
                  ),
                )}
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (selected.variants.length > 0 && !selectedVariantId) {
                    notify("Selecione uma opção antes de adicionar.", "error");
                    return;
                  }
                  const variant = selected.variants.find((item) => item.id === selectedVariantId);
                  const addons = [
                    ...selected.addons
                      .filter((addon) => (selectedAddons[addon.id] || 0) > 0)
                      .map((addon) => ({
                        addonId: addon.id,
                        name: addon.name,
                        price: addon.price,
                        qty: selectedAddons[addon.id],
                      })),
                    ...pendingBumpAddons,
                  ];
                  cart.add(selected, { variant, addons, notes: itemNotes.trim() || undefined });
                  setSelected(null);
                  notify(`${selected.name} adicionado ao carrinho.`);
                }}
              >
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60">
          <div className="max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl bg-surface p-5 safe-bottom">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Carrinho</h3>
              <button type="button" onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>
            {cart.lines.map((line) => {
              const unit = lineUnitPrice(
                line.product.price,
                variantDeltaValue(line.variant),
                line.addons,
                line.qty,
              );
              const subtotal = lineTotal({
                qty: line.qty,
                unitPrice: line.product.price,
                variantDelta: variantDeltaValue(line.variant),
                addons: line.addons,
              });
              return (
                <div
                  key={line.key}
                  className="mb-3 flex items-center justify-between rounded-xl bg-surface-2 p-3"
                >
                  <div>
                    <p className="font-medium">{line.product.name}</p>
                    {line.variant && <p className="text-xs text-muted">{line.variant.name}</p>}
                    {line.addons.length > 0 && (
                      <p className="text-xs text-muted">
                        {line.addons.map((addon) => `${addon.qty}x ${addon.name}`).join(", ")}
                      </p>
                    )}
                    {line.notes && <p className="text-xs text-muted">Obs.: {line.notes}</p>}
                    <p className="text-xs text-muted">
                      {line.qty}x {formatCurrency(unit)} · Subtotal {formatCurrency(subtotal)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cart.updateQty(line.key, line.qty - 1)}
                      className="rounded-lg bg-surface-3 p-2"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => cart.updateQty(line.key, line.qty + 1)}
                      className="rounded-lg bg-brand p-2 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {requireServiceTypeChoice && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold">Como vai consumir?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType("COMER_AQUI")}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-medium",
                      serviceType === "COMER_AQUI"
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-white/10 bg-surface-2 text-muted",
                    )}
                  >
                    Comer aqui
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType("PARA_VIAGEM")}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-medium",
                      serviceType === "PARA_VIAGEM"
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-white/10 bg-surface-2 text-muted",
                    )}
                  >
                    Levar para viagem
                  </button>
                </div>
              </div>
            )}
            {cartSuggestions.length > 0 && (
              <SoftSuggestions
                className="mb-4"
                title={
                  cartSuggestions.some((s) => /bebida/i.test(s.reason))
                    ? "Falta uma bebida?"
                    : "Para completar"
                }
                suggestions={cartSuggestions}
                categoryEmoji={categoryEmojiFor}
                onAdd={addSuggestion}
                compact
              />
            )}
            <Button
              className="mt-4 w-full"
              size="lg"
              loading={submitting}
              onClick={() => void handleSubmit()}
              disabled={submitting}
            >
              {submitLabel} · {formatCurrency(cart.total)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
