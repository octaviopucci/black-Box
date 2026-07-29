import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function Financing() {
  const [price, setPrice] = useState(450000)
  const [entry, setEntry] = useState(90000)
  const [years, setYears] = useState(30)
  const [rate, setRate] = useState(10.5)

  const result = useMemo(() => {
    const principal = Math.max(price - entry, 0)
    const months = years * 12
    const monthlyRate = rate / 100 / 12
    if (principal <= 0 || months <= 0) {
      return { installment: 0, principal, months }
    }
    const installment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    return { installment, principal, months }
  }, [price, entry, years, rate])

  const message = `Olá! Simulei financiamento no site da Porthal. Imóvel ~ ${currency(price)}, entrada ${currency(entry)}, ${years} anos. Gostaria de atendimento.`

  return (
    <section id="financie" className="scroll-mt-28 bg-ink py-20 text-white sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
            Financie
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.5rem,5.5vw,4.2rem)] leading-[0.95] tracking-tight">
            Simule e avance
            <span className="mt-1 block italic text-white/75">com clareza</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
            Estimativa ilustrativa para organizar o orçamento. A Porthal acompanha você na
            conversa com o banco e na documentação — sem surpresas no caminho.
          </p>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-8"
          >
            <Calculator className="h-4 w-4" />
            Quero falar sobre financiamento
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Valor do imóvel"
                value={price}
                min={80000}
                max={5000000}
                step={10000}
                onChange={setPrice}
                display={currency(price)}
              />
              <Field
                label="Entrada"
                value={entry}
                min={0}
                max={price}
                step={5000}
                onChange={setEntry}
                display={currency(entry)}
              />
              <Field
                label="Prazo (anos)"
                value={years}
                min={5}
                max={35}
                step={1}
                onChange={setYears}
                display={`${years} anos`}
              />
              <Field
                label="Taxa a.a. (%)"
                value={rate}
                min={6}
                max={18}
                step={0.1}
                onChange={setRate}
                display={`${rate.toFixed(1)}%`}
              />
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Parcela estimada
              </p>
              <p className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
                {currency(result.installment)}
                <span className="ml-2 font-sans text-sm text-white/45">/mês</span>
              </p>
              <p className="mt-3 text-sm text-white/50">
                Financiar cerca de {currency(result.principal)} em {result.months} meses. Simulação
                aproximada — condições reais dependem do banco e do perfil do crédito.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display: string
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
        <span className="text-white/80 normal-case tracking-normal">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-brand"
      />
    </label>
  )
}
