"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import {
  buildQuoteMessage,
  openWhatsApp,
  type QuoteFormData,
  type RequestType,
} from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const initialState: QuoteFormData = {
  tipo: "tatuagem",
  nome: "",
  whatsapp: "",
  email: "",
  idade: "",
  cidade: "",
  parte: "",
  tamanho: "",
  estilo: "",
  modeloTenis: "",
  numeroTenis: "",
  descricao: "",
  disponibilidade: "",
};

const fieldClass =
  "w-full border border-line bg-elevated px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-accent-soft";

export function QuoteForm() {
  const { t } = useLocale();
  const siteData = useSite();
  const [form, setForm] = useState<QuoteFormData>(initialState);
  const [hasReference, setHasReference] = useState(false);
  const p = t.quoteForm.placeholders;
  const isTattoo = form.tipo === "tatuagem";

  const update = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tipo" ? (value as RequestType) : value,
    }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    openWhatsApp(buildQuoteMessage({ ...form, hasReference }, t));
  };

  return (
    <section id="orcamento" className="relative bg-paper py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-mute">
            {t.quoteForm.label}
          </span>
          <h2 className="mt-4 font-display text-4xl font-light italic text-ink sm:text-5xl md:text-6xl">
            {t.quoteForm.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-light text-mute">
            {t.quoteForm.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={submit} className="mt-12 space-y-4">
            <select
              name="tipo"
              value={form.tipo}
              onChange={update}
              className={cn(fieldClass, "appearance-none")}
              required
            >
              {siteData.formOptions.requestTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="nome"
                placeholder={p.name}
                value={form.nome}
                onChange={update}
                className={fieldClass}
                required
              />
              <input
                name="whatsapp"
                placeholder={p.whatsapp}
                value={form.whatsapp}
                onChange={update}
                className={fieldClass}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="email"
                type="email"
                placeholder={p.email}
                value={form.email}
                onChange={update}
                className={fieldClass}
              />
              <input
                name="idade"
                placeholder={p.age}
                value={form.idade}
                onChange={update}
                className={fieldClass}
              />
            </div>

            <input
              name="cidade"
              placeholder={p.city}
              value={form.cidade}
              onChange={update}
              className={fieldClass}
            />

            {isTattoo ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    name="parte"
                    value={form.parte}
                    onChange={update}
                    className={cn(fieldClass, "appearance-none")}
                    required
                  >
                    <option value="">{p.bodyPart}</option>
                    {siteData.formOptions.bodyParts.map((part) => (
                      <option key={part} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                  <select
                    name="tamanho"
                    value={form.tamanho}
                    onChange={update}
                    className={cn(fieldClass, "appearance-none")}
                    required
                  >
                    <option value="">{p.size}</option>
                    {siteData.formOptions.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  name="estilo"
                  value={form.estilo}
                  onChange={update}
                  className={cn(fieldClass, "appearance-none")}
                  required
                >
                  <option value="">{p.style}</option>
                  {siteData.formOptions.styles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="modeloTenis"
                  value={form.modeloTenis}
                  onChange={update}
                  className={cn(fieldClass, "appearance-none")}
                  required
                >
                  <option value="">{p.shoeModel}</option>
                  {siteData.formOptions.shoeModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <select
                  name="numeroTenis"
                  value={form.numeroTenis}
                  onChange={update}
                  className={cn(fieldClass, "appearance-none")}
                  required
                >
                  <option value="">{p.shoeSize}</option>
                  {siteData.formOptions.shoeSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <textarea
              name="descricao"
              placeholder={isTattoo ? p.descriptionTattoo : p.descriptionSneaker}
              value={form.descricao}
              onChange={update}
              rows={5}
              className={cn(fieldClass, "resize-y")}
              required
            />

            <input
              name="disponibilidade"
              placeholder={p.availability}
              value={form.disponibilidade}
              onChange={update}
              className={fieldClass}
            />

            <label className="flex items-center gap-3 text-sm text-mute">
              <input
                type="checkbox"
                checked={hasReference}
                onChange={(e) => setHasReference(e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              {t.quoteForm.hasReference}
            </label>

            <button type="submit" className="btn-primary w-full">
              {t.quoteForm.submit}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
