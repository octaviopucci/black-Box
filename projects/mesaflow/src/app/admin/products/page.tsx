"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ImageIcon, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type { Category, Product, ProductAvailability, Sector } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ProductImage } from "@/components/ui/product-image";

type CatalogResponse = { products: Product[]; categories: Category[]; sectors: Sector[] };
type ProductDraft = {
  name: string;
  description: string;
  categoryId: string;
  sectorId: string;
  price: string;
  prepMinutes: string;
  image: string;
  availability: ProductAvailability;
  featured: boolean;
  active: boolean;
};

const EMPTY_DRAFT: ProductDraft = {
  name: "",
  description: "",
  categoryId: "",
  sectorId: "",
  price: "",
  prepMinutes: "15",
  image: "",
  availability: "AMBOS",
  featured: false,
  active: true,
};

const AVAILABILITY_LABEL: Record<ProductAvailability, string> = {
  VITRINE: "Vitrine",
  SOB_DEMANDA: "Cozinha",
  AMBOS: "Ambos",
};

function draftFromProduct(product: Product): ProductDraft {
  return {
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    sectorId: product.sectorId,
    price: String(product.price),
    prepMinutes: String(product.prepMinutes),
    image: product.image || "",
    availability: product.availability,
    featured: product.featured,
    active: product.active,
  };
}

export default function AdminProductsPage() {
  const { authHeaders } = useAuth();
  const [catalog, setCatalog] = useState<CatalogResponse>({ products: [], categories: [], sectors: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<"all" | ProductAvailability>("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch(apiUrl("/admin/products"), { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar o catálogo.");
      setCatalog({
        products: json.products || [],
        categories: json.categories || [],
        sectors: json.sectors || [],
      });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao carregar o catálogo.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return catalog.products.filter((product) => {
      if (term && !`${product.name} ${product.description}`.toLocaleLowerCase("pt-BR").includes(term)) return false;
      if (availability !== "all" && product.availability !== availability) return false;
      if (status === "active" && !product.active) return false;
      if (status === "inactive" && product.active) return false;
      return true;
    });
  }, [availability, catalog.products, search, status]);

  function openCreate() {
    setEditing(null);
    setDraft({
      ...EMPTY_DRAFT,
      categoryId: catalog.categories[0]?.id || "",
      sectorId: catalog.sectors[0]?.id || "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setDraft(draftFromProduct(product));
    setFormError("");
    setModalOpen(true);
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    const price = Number(draft.price);
    const prepMinutes = Number(draft.prepMinutes);
    if (!draft.name.trim() || !draft.categoryId || !draft.sectorId || !Number.isFinite(price) || price < 0) {
      setFormError("Preencha nome, categoria, setor e um preço válido.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const response = await fetch(apiUrl(editing ? `/admin/products/${encodeURIComponent(editing.id)}` : "/admin/products"), {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          ...draft,
          name: draft.name.trim(),
          description: draft.description.trim(),
          image: draft.image.trim() || undefined,
          price,
          prepMinutes: Math.max(0, prepMinutes || 0),
          ...(editing ? {} : { tags: [], variants: [], addons: [] }),
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível salvar o produto.");
      setModalOpen(false);
      setFeedback(editing ? "Produto atualizado." : "Produto criado.");
      await load();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Retirar “${product.name}” do cardápio? O produto ficará inativo e poderá ser editado depois.`)) return;
    setFeedback("");
    try {
      const response = await fetch(apiUrl(`/admin/products/${encodeURIComponent(product.id)}`), {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível excluir o produto.");
      setFeedback("Produto retirado do cardápio.");
      await load();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao excluir.");
    }
  }

  const categoryNames = Object.fromEntries(catalog.categories.map((category) => [category.id, category.name]));
  const sectorNames = Object.fromEntries(catalog.sectors.map((sector) => [sector.id, sector.name]));

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Cardápio</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">Produtos</h1>
          <p className="mt-1 text-sm text-muted">{catalog.products.length} itens no catálogo</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Novo produto</Button>
      </header>

      {feedback && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> {feedback}
        </div>
      )}
      {loadError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          <span>{loadError}</span><Button size="sm" variant="ghost" onClick={load}>Tentar novamente</Button>
        </div>
      )}

      <div className="mb-6 grid gap-3 rounded-2xl border border-white/5 bg-surface-2/60 p-3 sm:grid-cols-[1fr_180px_160px]">
        <label className="relative">
          <span className="sr-only">Buscar produto</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto…" className="pl-9" />
        </label>
        <Select value={availability} onChange={(event) => setAvailability(event.target.value as typeof availability)} aria-label="Filtrar disponibilidade">
          <option value="all">Toda disponibilidade</option>
          <option value="VITRINE">Vitrine</option>
          <option value="SOB_DEMANDA">Cozinha</option>
          <option value="AMBOS">Ambos</option>
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Filtrar status">
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <ImageIcon className="mx-auto mb-3 h-8 w-8 text-muted" />
          <p className="font-semibold">{catalog.products.length ? "Nenhum produto encontrado" : "Seu catálogo está vazio"}</p>
          <p className="mt-1 text-sm text-muted">{catalog.products.length ? "Ajuste a busca ou os filtros." : "Cadastre o primeiro produto para começar."}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <article key={product.id} className={cn("glass-card overflow-hidden", !product.active && "opacity-65")}>
              <div className="flex gap-4 p-4">
                <ProductImage src={product.image} alt={product.name} seed={product.id} width={112} height={112} className="h-28 w-28 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-2 font-bold">{product.name}</h2>
                    <span className={cn("shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold", product.active ? "bg-success/10 text-success" : "bg-white/5 text-muted")}>
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{categoryNames[product.categoryId] || "Sem categoria"} · {sectorNames[product.sectorId] || "Sem setor"}</p>
                  <p className="mt-3 font-bold text-brand">{formatCurrency(product.price)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="rounded-full bg-brand/10 px-2 py-1 text-brand">{AVAILABILITY_LABEL[product.availability]}</span>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-muted">{product.prepMinutes} min</span>
                    {product.featured && <span className="rounded-full bg-warning/10 px-2 py-1 text-warning">Destaque</span>}
                  </div>
                </div>
              </div>
              <div className="flex border-t border-white/5">
                <button onClick={() => openEdit(product)} className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-semibold text-muted hover:bg-white/5 hover:text-ink">
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button onClick={() => deleteProduct(product)} className="flex flex-1 items-center justify-center gap-2 border-l border-white/5 py-3 text-xs font-semibold text-danger hover:bg-danger/5">
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
          <form onSubmit={saveProduct} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface-2 p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">{editing ? "Editar" : "Cadastrar"}</p>
                <h2 id="product-form-title" className="text-xl font-bold">{editing ? editing.name : "Novo produto"}</h2>
              </div>
              <button type="button" aria-label="Fechar" onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-muted hover:bg-white/5"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-muted">Nome</span><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-muted">Descrição</span><textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-surface/80 px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20" /></label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Categoria</span><Select required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}><option value="">Selecione</option>{catalog.categories.map((category) => <option key={category.id} value={category.id}>{category.emoji} {category.name}</option>)}</Select></label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Setor de preparo</span><Select required value={draft.sectorId} onChange={(event) => setDraft({ ...draft, sectorId: event.target.value })}><option value="">Selecione</option>{catalog.sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}</Select></label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Preço (R$)</span><Input required type="number" min="0" step="0.01" inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Preparo (min)</span><Input type="number" min="0" step="1" value={draft.prepMinutes} onChange={(event) => setDraft({ ...draft, prepMinutes: event.target.value })} /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-muted">URL da imagem</span><Input type="url" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="https://…" /></label>
              <div className="sm:col-span-2 overflow-hidden rounded-xl border border-white/5 bg-surface">
                <ProductImage src={draft.image} alt={draft.name || "Prévia do produto"} width={640} height={240} className="h-36 w-full object-cover" />
              </div>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Disponibilidade</span><Select value={draft.availability} onChange={(event) => setDraft({ ...draft, availability: event.target.value as ProductAvailability })}><option value="VITRINE">Vitrine</option><option value="SOB_DEMANDA">Cozinha</option><option value="AMBOS">Ambos</option></Select></label>
              <div className="flex items-center gap-5 pt-5">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="h-4 w-4 accent-brand" /> Ativo</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} className="h-4 w-4 accent-brand" /> Destaque</label>
              </div>
            </div>

            {formError && <p className="mt-4 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={saving}>{editing ? "Salvar alterações" : "Criar produto"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
