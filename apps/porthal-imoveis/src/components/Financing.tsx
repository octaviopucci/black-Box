import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'
import { whatsappUrl } from '../data/site'

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function Financing() {
  const [price, setPrice] = useState(650000)
  const [down, setDown] = useState(20)
  const [years, setYears] = useState(30)
  const [rate, setRate] = useState(9.5)

  const result = useMemo(() => {
    const financed = price * (1 - down / 100)
    const months = years * 12
    const monthlyRate = rate / 100 / 12
    if (financed <= 0 || months <= 0) {
      return { installment: 0, financed: 0, total: 0 }
    }
    const installment =
      monthlyRate === 0
        ? financed / months
        : (financed * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1)
    return {
      installment,
      financed,
      total: installment * months,
    }
  }, [price, down, years, rate])

  return (
    <section id="financie" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(196,52,42,0.07),transparent_40%),linear-gradient(0deg,rgba(23,19,17,0.03),transparent)]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_1.05fr] sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Financie</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Simulador de financiamento
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mute">
            Estime a parcela do seu próximo imóvel e fale com a Porthal para validar condições
            bancárias e oportunidades alinhadas ao seu perfil.
          </p>
          <a
            href={whatsappUrl(
              `Olá! Simulei financiamento de ${currency(price)} com entrada de ${down}% em ${years} anos. Podem me ajudar?`,
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            <Calculator className="h-4 w-4" />
            Enviar simulação no WhatsApp
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Valor do imóvel" value={currency(price)}>
              <input
                type="range"
                min={150000}
                max={4000000}
                step={10000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </Field>
            <Field label="Entrada" value={`${down}%`}>
              <input
                type="range"
                min={5}
                max={70}
                step={1}
                value={down}
                onChange={(e) => setDown(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </Field>
            <Field label="Prazo" value={`${years} anos`}>
              <input
                type="range"
                min={5}
                max={35}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </Field>
            <Field label="Taxa anual" value={`${rate.toFixed(1)}% a.a.`}>
              <input
                type="range"
                min={6}
                max={16}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </Field>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl bg-ink px-5 py-6 text-white sm:grid-cols-3">
            <Stat label="Financiado" value={currency(result.financed)} />
            <Stat label="Parcela estimada" value={currency(result.installment)} highlight />
            <Stat label="Total pago" value={currency(result.total)} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-mute">
            Simulação ilustrativa pelo sistema Price. Valores não constituem proposta de crédito.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          {label}
        </span>
        <span className="text-sm font-semibold text-ink">{value}</span>
      </div>
      {children}
    </label>
  )
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className={`mt-2 font-display text-2xl font-semibold ${highlight ? 'text-brand-soft' : ''}`}>
        {value}
      </p>
    </div>
  )
}
