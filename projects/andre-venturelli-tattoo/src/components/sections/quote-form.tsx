"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";
import {
  buildQuoteMessage,
  openWhatsApp,
  type QuoteFormData,
} from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const initialState: QuoteFormData = {
  nome: "",
  whatsapp: "",
  email: "",
  idade: "",
  cidade: "",
  parte: "",
  tamanho: "",
  estilo: "",
  descricao: "",
  disponibilidade: "",
};

const fieldClass =
  "w-full border border-line bg-elevated px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-accent-soft";

export function QuoteForm() {
  const [form, setForm] = useState<QuoteFormData>(initialState);
  const [hasReference, setHasReference] = useState(false);

  const update = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    openWhatsApp(buildQuoteMessage({ ...form, hasReference }));
  };

  return (
    <section id="orcamento" className="relative bg-paper py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-mute">
            Orçamento
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium text-ink sm:text-5xl">
            Fazer Orçamento
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-mute">
            Preencha os campos abaixo e enviaremos sua solicitação diretamente
            para o WhatsApp do André.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={submit} className="mt-12 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="nome"
                placeholder="Nome completo"
                value={form.nome}
                onChange={update}
                className={fieldClass}
                required
              />
              <input
                name="whatsapp"
                placeholder="WhatsApp (com DDD)"
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
                placeholder="Email"
                value={form.email}
                onChange={update}
                className={fieldClass}
              />
              <input
                name="idade"
                placeholder="Idade"
                value={form.idade}
                onChange={update}
                className={fieldClass}
              />
            </div>

            <input
              name="cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChange={update}
              className={fieldClass}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                name="parte"
                value={form.parte}
                onChange={update}
                className={cn(fieldClass, "appearance-none")}
                required
              >
                <option value="">Parte do corpo</option>
                {site.formOptions.bodyParts.map((part) => (
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
                <option value="">Tamanho aproximado</option>
                {site.formOptions.sizes.map((size) => (
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
              <option value="">Estilo desejado</option>
              {site.formOptions.styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            <textarea
              name="descricao"
              placeholder="Descreva sua ideia de tatuagem..."
              value={form.descricao}
              onChange={update}
              rows={5}
              className={cn(fieldClass, "resize-y")}
              required
            />

            <input
              name="disponibilidade"
              placeholder="Disponibilidade para realizar a tattoo"
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
              Tenho referência/imagem para enviar no WhatsApp
            </label>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Enviar orçamento pelo WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
