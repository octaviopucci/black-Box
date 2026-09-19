"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type {
  Category,
  Product,
  ProductAvailability,
  Sector } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ProductImage } from "@/components/ui/product-image";

type CatalogResponse = { products: Product[]; categories: Category[]; sectors: Sector[] };

type VariantDraft = { id?: string; name: string; priceDelta: string };
type AddonDraft = { id?: string; name: string; price: string; maxQty: string };

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
  variants: VariantDraft[];
  addons: AddonDraft[];
  bumpProductIds: string[];
  upsellProductIds: string[];
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
  variants: [],
  addons: [],
  bumpProductIds: [],
  upsellProductIds: [] };

const AVAILABILITY_LABEL: Record<ProductAvailability, string> = {
  VITRINE: "Vitrine",
  SOB_DEMANDA: "Cozinha",
  AMBOS: "Ambos" };

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
    variants: (product.variants || []).map((variant) => ({
      id: variant.id,
      name: variant.name,
      priceDelta: String(variant.priceDelta) })),
    addons: (product.addons || []).map((addon) => ({
      id: addon.id,
      name: addon.name,
      price: String(addon.price),
      maxQty: addon.maxQty != null ? String(addon.maxQty) : "" })),
    bumpProductIds: [...(product.bumpProductIds || [])],
    upsellProductIds: [...(product.upsellProductIds || [])] };
}

type VariantPayload = { id?: string; name: string; priceDelta: number };
type AddonPayload = { id?: string; name: string; price: number; maxQty?: number };

function parseVariants(drafts: VariantDraft[]): VariantPayload[] | null {
  const variants: VariantPayload[] = [];
  for (const row of drafts) {
    const name = row.name.trim();
    if (!name && !row.priceDelta.trim()) continue;
    if (!name) return null;
    const priceDelta = Number(row.priceDelta);
    if (!Number.isFinite(priceDelta)) return null;
    const entry: VariantPayload = { name, priceDelta };
    if (row.id) entry.id = row.id;
    variants.push(entry);
  }
  return variants;
}

function parseAddons(drafts: AddonDraft[]): AddonPayload[] | null {
  const addons: AddonPayload[] = [];
  for (const row of drafts) {
    const name = row.name.trim();
    if (!name && !row.price.trim() && !row.maxQty.trim()) continue;
    if (!name) return null;
    const price = Number(row.price);
    if (!Number.isFinite(price) || price < 0) return null;
    let maxQty: number | undefined;
    if (row.maxQty.trim()) {
      maxQty = Number(row.maxQty);
      if (!Number.isInteger(maxQty) || maxQty < 1 || maxQty > 99) return null;
    }
    const entry: AddonPayload = { name, price };
    if (row.id) entry.id = row.id;
    if (maxQty !== undefined) entry.maxQty = maxQty;
    addons.push(entry);
  }
  return addons;
}

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function isMarceloEstablishment(name: string, slug: string) {
  const normalizedName = name.toLowerCase();
  const normalizedSlug = slug.toLowerCase();
  return (
    name === "Marcelo Lanches" ||
    normalizedSlug === "marcelo-lanches" ||
    normalizedName.includes("marcelo") ||
    normalizedSlug.includes("marcelo")
  );
}

export default function AdminProductsPage() {
  const { fetchApi, session } = useAuth();
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
  const [uploading, setUploading] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [renamingCategoryId, setRenamingCategoryId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [importingMarcelo, setImportingMarcelo] = useState(false);

  const showMarceloImport =
    session?.establishment &&
    isMarceloEstablishment(session.establishment.name, session.establishment.slug);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetchApi("/admin/products", { });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar o catálogo.");
      setCatalog({
        products: json.products || [],
        categories: json.categories || [],
        sectors: json.sectors || [] });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao carregar o catálogo.");
    } finally {
      setLoading(false);
    }
  }, [fetchApi]);

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

  const activeProductsForLinks = useMemo(
    () => catalog.products.filter((product) => product.active && product.id !== editing?.id),
    [catalog.products, editing?.id],
  );

  const categoryOptions = useMemo(
    () =>
      [...catalog.categories].sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "pt-BR");
      }),
    [catalog.categories],
  );

  function openCreate() {
    setEditing(null);
    setDraft({
      ...EMPTY_DRAFT,
      categoryId: catalog.categories.find((category) => category.active)?.id || catalog.categories[0]?.id || "",
      sectorId: catalog.sectors[0]?.id || "",
      variants: [],
      addons: [],
      bumpProductIds: [],
      upsellProductIds: [] });
    setShowImageUrl(false);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setDraft(draftFromProduct(product));
    setShowImageUrl(Boolean(product.image));
    setFormError("");
    setModalOpen(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setFormError("");
    try {
      const dataBase64 = await readFileAsDataUrl(file);
      const response = await fetchApi("/admin/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name || "upload.jpg",
          contentType: file.type || "application/octet-stream",
          dataBase64,
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível enviar a imagem.");
      if (typeof json.url !== "string" || !json.url) throw new Error("Upload sem URL de retorno.");
      setDraft((current) => ({ ...current, image: json.url }));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    const price = Number(draft.price);
    const prepMinutes = Math.max(0, Math.trunc(Number(draft.prepMinutes) || 0));
    if (!draft.name.trim() || !draft.categoryId || !draft.sectorId || !Number.isFinite(price) || price < 0) {
      setFormError("Preencha nome, categoria, setor e um preço válido.");
      return;
    }
    const variants = parseVariants(draft.variants);
    const addons = parseAddons(draft.addons);
    if (variants === null) {
      setFormError("Verifique as variantes: nome e delta de preço são obrigatórios.");
      return;
    }
    if (addons === null) {
      setFormError("Verifique os adicionais: nome, preço e max. qty (1–99) quando informado.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const response = await fetchApi(editing ? `/admin/products/${encodeURIComponent(editing.id)}` : "/admin/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name.trim(),
          description: draft.description.trim(),
          categoryId: draft.categoryId,
          sectorId: draft.sectorId,
          image: draft.image.trim() || undefined,
          price,
          prepMinutes,
          availability: draft.availability,
          featured: draft.featured,
          active: draft.active,
          tags: editing?.tags || [],
          variants,
          addons,
          bumpProductIds: draft.bumpProductIds,
          upsellProductIds: draft.upsellProductIds }) });
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
      const response = await fetchApi(`/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível excluir o produto.");
      setFeedback("Produto retirado do cardápio.");
      await load();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao excluir.");
    }
  }

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryError("Informe o nome da categoria.");
      return;
    }
    setCategorySaving(true);
    setCategoryError("");
    try {
      const response = await fetchApi("/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          emoji: newCategoryEmoji.trim() || undefined }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível criar a categoria.");
      setNewCategoryName("");
      setNewCategoryEmoji("");
      setFeedback("Categoria criada.");
      await load();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : "Falha ao criar categoria.");
    } finally {
      setCategorySaving(false);
    }
  }

  async function renameCategory(category: Category) {
    const name = renameValue.trim();
    if (!name) {
      setCategoryError("Informe o novo nome.");
      return;
    }
    setCategorySaving(true);
    setCategoryError("");
    try {
      const response = await fetchApi(`/admin/categories/${encodeURIComponent(category.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível renomear.");
      setRenamingCategoryId(null);
      setRenameValue("");
      setFeedback("Categoria renomeada.");
      await load();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : "Falha ao renomear.");
    } finally {
      setCategorySaving(false);
    }
  }

  async function deactivateCategory(category: Category) {
    if (!window.confirm(`Desativar a categoria “${category.name}”?`)) return;
    setCategorySaving(true);
    setCategoryError("");
    try {
      const response = await fetchApi(`/admin/categories/${encodeURIComponent(category.id)}`, { method: "DELETE" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível desativar.");
      setFeedback("Categoria desativada.");
      await load();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : "Falha ao desativar.");
    } finally {
      setCategorySaving(false);
    }
  }

  async function reactivateCategory(category: Category) {
    setCategorySaving(true);
    setCategoryError("");
    try {
      const response = await fetchApi(`/admin/categories/${encodeURIComponent(category.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível reativar.");
      setFeedback("Categoria reativada.");
      await load();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : "Falha ao reativar.");
    } finally {
      setCategorySaving(false);
    }
  }

  async function importMarceloCatalog() {
    if (
      !window.confirm(
        "Importar o cardápio completo Marcelo Lanches? Categorias e produtos atuais deste estabelecimento serão substituídos.",
      )
    ) {
      return;
    }
    setImportingMarcelo(true);
    setFeedback("");
    setLoadError("");
    try {
      const response = await fetchApi("/admin/catalog/import-marcelo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Falha na importação.");
      setFeedback(`Cardápio importado: ${json.categories} categorias, ${json.products} produtos.`);
      await load();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha na importação.");
    } finally {
      setImportingMarcelo(false);
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
        <div className="flex flex-wrap gap-2">
          {showMarceloImport && (
            <Button variant="secondary" disabled={importingMarcelo} onClick={importMarceloCatalog}>
              {importingMarcelo ? "Importando…" : "Importar cardápio Marcelo Lanches"}
            </Button>
          )}
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Novo produto
          </Button>
        </div>
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

      <section className="glass-card mb-6 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Categorias</h2>
            <p className="text-xs text-muted">{catalog.categories.length} no estabelecimento</p>
          </div>
        </div>

        <form onSubmit={createCategory} className="mb-4 grid gap-2 sm:grid-cols-[72px_1fr_auto]">
          <Input
            value={newCategoryEmoji}
            onChange={(event) => setNewCategoryEmoji(event.target.value)}
            placeholder="🍕"
            aria-label="Emoji da categoria"
            maxLength={16}
          />
          <Input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="Nome da categoria"
            aria-label="Nome da categoria"
            maxLength={80}
          />
          <Button type="submit" loading={categorySaving} size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar
          </Button>
        </form>

        {categoryError && <p className="mb-3 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{categoryError}</p>}

        {catalog.categories.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma categoria ainda. Crie a primeira acima.</p>
        ) : (
          <ul className="divide-y divide-white/5 rounded-xl border border-white/5">
            {categoryOptions.map((category) => (
              <li key={category.id} className={cn("flex flex-wrap items-center gap-2 px-3 py-2.5", !category.active && "opacity-60")}>
                <span className="w-8 text-center text-lg" aria-hidden>{category.emoji || "•"}</span>
                {renamingCategoryId === category.id ? (
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <Input
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      className="max-w-xs py-2"
                      autoFocus
                      maxLength={80}
                    />
                    <Button type="button" size="sm" loading={categorySaving} onClick={() => void renameCategory(category)}>Salvar</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setRenamingCategoryId(null); setRenameValue(""); }}>Cancelar</Button>
                  </div>
                ) : (
                  <>
                    <span className="min-w-0 flex-1 font-medium">{category.name}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", category.active ? "bg-success/10 text-success" : "bg-white/5 text-muted")}>
                      {category.active ? "Ativa" : "Inativa"}
                    </span>
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-white/5 hover:text-ink"
                      onClick={() => { setRenamingCategoryId(category.id); setRenameValue(category.name); setCategoryError(""); }}
                    >
                      Renomear
                    </button>
                    {category.active ? (
                      <button
                        type="button"
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/5"
                        disabled={categorySaving}
                        onClick={() => void deactivateCategory(category)}
                      >
                        Desativar
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-brand hover:bg-brand/10"
                        disabled={categorySaving}
                        onClick={() => void reactivateCategory(category)}
                      >
                        Reativar
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

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
                    {(product.variants?.length || 0) > 0 && (
                      <span className="rounded-full bg-white/5 px-2 py-1 text-muted">{product.variants.length} var.</span>
                    )}
                    {(product.addons?.length || 0) > 0 && (
                      <span className="rounded-full bg-white/5 px-2 py-1 text-muted">{product.addons.length} adic.</span>
                    )}
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
              <label>
                <span className="mb-1.5 block text-xs font-medium text-muted">Categoria</span>
                <Select required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
                  <option value="">Selecione</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.emoji ? `${category.emoji} ` : ""}{category.name}{category.active ? "" : " (inativa)"}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-medium text-muted">Setor de preparo</span>
                <Select required value={draft.sectorId} onChange={(event) => setDraft({ ...draft, sectorId: event.target.value })}>
                  <option value="">Selecione</option>
                  {catalog.sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
                </Select>
              </label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Preço (R$)</span><Input required type="number" min="0" step="0.01" inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Preparo (min)</span><Input type="number" min="0" step="1" value={draft.prepMinutes} onChange={(event) => setDraft({ ...draft, prepMinutes: event.target.value })} /></label>

              <div className="sm:col-span-2 space-y-3">
                <span className="block text-xs font-medium text-muted">Foto do produto</span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-surface/80 px-4 py-3 text-sm font-semibold hover:border-brand/30">
                    <Upload className="h-4 w-4 text-brand" />
                    {uploading ? "Enviando…" : "Enviar imagem"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      disabled={uploading || saving}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (file) void uploadImage(file);
                      }}
                    />
                  </label>
                  {draft.image && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-muted hover:text-danger"
                      onClick={() => setDraft({ ...draft, image: "" })}
                    >
                      Remover foto
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-xs font-semibold text-muted hover:text-ink"
                    onClick={() => setShowImageUrl((value) => !value)}
                  >
                    {showImageUrl ? "Ocultar URL" : "Usar URL"}
                  </button>
                </div>
                {showImageUrl && (
                  <Input
                    type="url"
                    value={draft.image}
                    onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                    placeholder="https://…"
                    aria-label="URL da imagem"
                  />
                )}
                {draft.image ? (
                  <div className="overflow-hidden rounded-xl border border-white/5 bg-surface">
                    <ProductImage src={draft.image} alt={draft.name || "Prévia do produto"} width={640} height={240} className="h-36 w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-muted">
                    Sem imagem
                  </div>
                )}
              </div>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-muted">Disponibilidade</span>
                <Select value={draft.availability} onChange={(event) => setDraft({ ...draft, availability: event.target.value as ProductAvailability })}>
                  <option value="VITRINE">Vitrine</option>
                  <option value="SOB_DEMANDA">Cozinha</option>
                  <option value="AMBOS">Ambos</option>
                </Select>
              </label>
              <div className="flex items-center gap-5 pt-5">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="h-4 w-4 accent-brand" /> Ativo</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} className="h-4 w-4 accent-brand" /> Destaque</label>
              </div>

              <div className="sm:col-span-2 space-y-3 rounded-xl border border-white/5 bg-surface/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold">Variantes</h3>
                    <p className="text-xs text-muted">Nome + diferença de preço (ex.: tamanho)</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setDraft({ ...draft, variants: [...draft.variants, { name: "", priceDelta: "0" }] })}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
                  </Button>
                </div>
                {draft.variants.length === 0 ? (
                  <p className="text-xs text-muted">Nenhuma variante.</p>
                ) : (
                  <ul className="space-y-2">
                    {draft.variants.map((variant, index) => (
                      <li key={variant.id || `v-${index}`} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                        <Input
                          value={variant.name}
                          onChange={(event) => {
                            const variants = [...draft.variants];
                            variants[index] = { ...variant, name: event.target.value };
                            setDraft({ ...draft, variants });
                          }}
                          placeholder="Nome"
                          aria-label={`Nome da variante ${index + 1}`}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.priceDelta}
                          onChange={(event) => {
                            const variants = [...draft.variants];
                            variants[index] = { ...variant, priceDelta: event.target.value };
                            setDraft({ ...draft, variants });
                          }}
                          placeholder="Δ R$"
                          aria-label={`Delta de preço da variante ${index + 1}`}
                        />
                        <button
                          type="button"
                          className="rounded-xl px-3 py-2 text-danger hover:bg-danger/5"
                          aria-label={`Remover variante ${index + 1}`}
                          onClick={() => setDraft({ ...draft, variants: draft.variants.filter((_, i) => i !== index) })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="sm:col-span-2 space-y-3 rounded-xl border border-white/5 bg-surface/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold">Adicionais</h3>
                    <p className="text-xs text-muted">Nome, preço e qtd. máx. opcional</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setDraft({ ...draft, addons: [...draft.addons, { name: "", price: "0", maxQty: "" }] })}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
                  </Button>
                </div>
                {draft.addons.length === 0 ? (
                  <p className="text-xs text-muted">Nenhum adicional.</p>
                ) : (
                  <ul className="space-y-2">
                    {draft.addons.map((addon, index) => (
                      <li key={addon.id || `a-${index}`} className="grid gap-2 sm:grid-cols-[1fr_100px_80px_auto]">
                        <Input
                          value={addon.name}
                          onChange={(event) => {
                            const addons = [...draft.addons];
                            addons[index] = { ...addon, name: event.target.value };
                            setDraft({ ...draft, addons });
                          }}
                          placeholder="Nome"
                          aria-label={`Nome do adicional ${index + 1}`}
                        />
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addon.price}
                          onChange={(event) => {
                            const addons = [...draft.addons];
                            addons[index] = { ...addon, price: event.target.value };
                            setDraft({ ...draft, addons });
                          }}
                          placeholder="R$"
                          aria-label={`Preço do adicional ${index + 1}`}
                        />
                        <Input
                          type="number"
                          min="1"
                          max="99"
                          step="1"
                          value={addon.maxQty}
                          onChange={(event) => {
                            const addons = [...draft.addons];
                            addons[index] = { ...addon, maxQty: event.target.value };
                            setDraft({ ...draft, addons });
                          }}
                          placeholder="Máx"
                          aria-label={`Qtd. máxima do adicional ${index + 1}`}
                        />
                        <button
                          type="button"
                          className="rounded-xl px-3 py-2 text-danger hover:bg-danger/5"
                          aria-label={`Remover adicional ${index + 1}`}
                          onClick={() => setDraft({ ...draft, addons: draft.addons.filter((_, i) => i !== index) })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2 rounded-xl border border-white/5 bg-surface/40 p-3">
                <h3 className="text-sm font-bold">Order bumps</h3>
                <p className="text-xs text-muted">Ofertas no momento da adição ao pedido</p>
                {activeProductsForLinks.length === 0 ? (
                  <p className="text-xs text-muted">Nenhum outro produto ativo.</p>
                ) : (
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {activeProductsForLinks.map((product) => (
                      <li key={`bump-${product.id}`}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-brand"
                            checked={draft.bumpProductIds.includes(product.id)}
                            onChange={() => setDraft({ ...draft, bumpProductIds: toggleId(draft.bumpProductIds, product.id) })}
                          />
                          <span className="min-w-0 flex-1 truncate">{product.name}</span>
                          <span className="text-xs text-muted">{formatCurrency(product.price)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2 rounded-xl border border-white/5 bg-surface/40 p-3">
                <h3 className="text-sm font-bold">Upsells</h3>
                <p className="text-xs text-muted">Sugestões após o item no carrinho</p>
                {activeProductsForLinks.length === 0 ? (
                  <p className="text-xs text-muted">Nenhum outro produto ativo.</p>
                ) : (
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {activeProductsForLinks.map((product) => (
                      <li key={`upsell-${product.id}`}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-brand"
                            checked={draft.upsellProductIds.includes(product.id)}
                            onChange={() => setDraft({ ...draft, upsellProductIds: toggleId(draft.upsellProductIds, product.id) })}
                          />
                          <span className="min-w-0 flex-1 truncate">{product.name}</span>
                          <span className="text-xs text-muted">{formatCurrency(product.price)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {formError && <p className="mt-4 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={saving || uploading}>{editing ? "Salvar alterações" : "Criar produto"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
