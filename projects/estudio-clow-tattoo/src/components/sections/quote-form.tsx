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
  "w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mute/70 focus:border-ink";

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
    <section id="orcamento" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            Orçamento
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
            Solicitar orçamento
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-light text-mute">
            Preencha os campos abaixo e enviaremos sua solicitação diretamente
            para nosso WhatsApp.
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
              className="w-full bg-ink px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-paper transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Enviar orçamento pelo WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
