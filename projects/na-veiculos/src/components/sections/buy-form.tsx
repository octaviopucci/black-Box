"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { availableVehicles, formatPrice, getVehicle } from "@/data/vehicles";
import { asset } from "@/lib/assets";
import {
  buildBuyMessage,
  openWhatsApp,
  type BuyFormData,
} from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { useVehicleSelection } from "@/components/vehicle-selection";
import { cn } from "@/lib/utils";

const initialState: BuyFormData = {
  nome: "",
  whatsapp: "",
  cidade: "",
  pagamento: "",
  temTroca: false,
  carroTroca: "",
  mensagem: "",
};

const fieldClass =
  "w-full border border-line bg-elevated px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-accent-soft";

const selectWrapClass = "relative";
const selectIconClass =
  "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute";

export function BuyForm() {
  const { selectedId, setSelectedId } = useVehicleSelection();
  const [form, setForm] = useState<BuyFormData>(initialState);

  const vehicle = selectedId ? getVehicle(selectedId) : undefined;

  const update = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!vehicle) return;
    openWhatsApp(buildBuyMessage(form, vehicle));
  };

  return (
    <section id="orcamento" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="005"
            label="Quero comprar"
            title="Escolha o carro, diga como prefere pagar e a mensagem chega pronta no WhatsApp da loja. Respondemos com disponibilidade e simulação."
          />
        </Reveal>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1fr_360px]">
          <Reveal delay={0.08}>
            <form onSubmit={submit} className="space-y-4">
              <div className={selectWrapClass}>
                <label htmlFor="carro" className="sr-only">
                  Carro
                </label>
                <select
                  id="carro"
                  name="carro"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className={cn(
                    fieldClass,
                    "appearance-none pr-12",
                    !selectedId && "text-mute/60",
                  )}
                  required
                >
                  <option value="">Qual carro você quer?</option>
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title} — {formatPrice(v.price)}
                    </option>
                  ))}
                </select>
                <ChevronDown className={selectIconClass} aria-hidden />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="nome"
                  aria-label="Seu nome"
                  placeholder="Seu nome"
                  autoComplete="name"
                  value={form.nome}
                  onChange={update}
                  className={fieldClass}
                  required
                />
                <input
                  name="whatsapp"
                  aria-label="Seu WhatsApp (com DDD)"
                  type="tel"
                  inputMode="tel"
                  placeholder="Seu WhatsApp (com DDD)"
                  autoComplete="tel"
                  value={form.whatsapp}
                  onChange={update}
                  className={fieldClass}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="cidade"
                  aria-label="Cidade"
                  placeholder="Cidade"
                  autoComplete="address-level2"
                  value={form.cidade}
                  onChange={update}
                  className={fieldClass}
                />
                <div className={selectWrapClass}>
                  <label htmlFor="pagamento" className="sr-only">
                    Forma de pagamento
                  </label>
                  <select
                    id="pagamento"
                    name="pagamento"
                    value={form.pagamento}
                    onChange={update}
                    className={cn(
                      fieldClass,
                      "appearance-none pr-12",
                      !form.pagamento && "text-mute/60",
                    )}
                  >
                    <option value="">Forma de pagamento</option>
                    {site.paymentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={selectIconClass} aria-hidden />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-mute">
                <input
                  type="checkbox"
                  checked={form.temTroca}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, temTroca: e.target.checked }))
                  }
                  className="h-4 w-4 accent-ink"
                />
                Tenho um carro para dar na troca
              </label>

              {form.temTroca && (
                <input
                  name="carroTroca"
                  aria-label="Qual carro? (modelo, ano, km)"
                  placeholder="Qual carro? (modelo, ano, km)"
                  value={form.carroTroca}
                  onChange={update}
                  className={fieldClass}
                />
              )}

              <textarea
                name="mensagem"
                aria-label="Quer perguntar algo? Entrada, parcelas, visita na loja..."
                placeholder="Quer perguntar algo? Entrada, parcelas, visita na loja..."
                value={form.mensagem}
                onChange={update}
                rows={4}
                className={cn(fieldClass, "resize-y")}
              />

              <button type="submit" className="btn-primary w-full">
                Enviar pedido pelo WhatsApp
              </button>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute/60">
                Abre o WhatsApp {site.whatsappLabel} com a mensagem pronta. Nada
                é enviado sem você confirmar.
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.14}>
            <aside className="border border-line/40 bg-surface p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
                Carro escolhido
              </p>

              {vehicle ? (
                <>
                  <div className="relative mt-4 aspect-[4/3] overflow-hidden ring-1 ring-line/40">
                    <Image
                      key={vehicle.id}
                      src={asset(vehicle.image)}
                      alt={vehicle.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                    {[
                      vehicle.brand,
                      vehicle.year,
                      vehicle.transmission,
                      vehicle.fuel,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h3 className="mt-2 text-lg font-medium leading-tight text-ink">
                    {vehicle.title}
                  </h3>
                  <p className="mt-1 font-mono text-lg text-accent-soft">
                    {formatPrice(vehicle.price)}
                  </p>
                  {vehicle.highlights.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {vehicle.highlights.slice(0, 4).map((item) => (
                        <li
                          key={item}
                          className="border border-line/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-mute"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  Nenhum carro selecionado ainda. Escolha na lista ao lado ou
                  toque em “Quero este carro” no estoque.
                </p>
              )}
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
