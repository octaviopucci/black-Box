import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { brand, plans } from '@/data/site'

export function PlanosPage() {
  const [params] = useSearchParams()
  const initial = useMemo(() => {
    const q = params.get('plano')
    if (q && plans.some((p) => p.id === q)) return q
    return plans.find((p) => p.highlight)?.id ?? plans[0].id
  }, [params])
  const [selected, setSelected] = useState(initial)
  const plan = plans.find((p) => p.id === selected) ?? plans[0]
  const email = params.get('email')

  return (
    <div className="min-h-dvh bg-ink px-4 py-8 text-paper sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link to="/quiz" className="mb-6 inline-block opacity-90">
          <img src={brand.logo} alt="BASE" className="h-7 w-auto" draggable={false} />
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight">Escolha seu plano</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          Se você comprou pela Kiwify, cadastre no app com o mesmo e-mail da compra. Quando o
          pagamento for aprovado, o acesso libera. Se ainda não pagou, escolhe o plano e segue pro
          checkout.
        </p>

        {email ? (
          <p className="mt-4 text-sm text-ash">
            Email da conta: <span className="underline text-paper">{email}</span>
          </p>
        ) : null}

        <div className="mt-8 space-y-3">
          {plans.map((p) => {
            const active = p.id === selected
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`relative w-full rounded-xl border px-4 py-4 text-left transition ${
                  active ? 'border-signal bg-signal/10' : 'border-line bg-panel'
                }`}
              >
                {active ? (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-signal text-[11px] text-white">
                    ✓
                  </span>
                ) : null}
                <div className="flex items-center justify-between gap-3 pr-6">
                  <div>
                    <p className="font-display text-lg font-bold">{p.name}</p>
                    <p className="text-sm text-ash">{p.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold">{p.price}</p>
                    <p className="text-xs text-ash">{p.cadence.replace(/^\//, '')}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash">Incluso</p>
          <ul className="mt-4 space-y-3">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex gap-3 text-sm text-mist">
                <span className="text-signal">✓</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={plan.checkout}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-signalHot"
        >
          Ir para pagamento
        </a>

        <div className="mt-5 flex flex-col items-center gap-3 text-center text-sm">
          <a href={brand.loginExternal} className="text-ash underline-offset-2 hover:text-paper hover:underline">
            Já paguei → entrar no app
          </a>
          <a
            href={brand.cadastroExternal}
            className="text-ash underline-offset-2 hover:text-paper hover:underline"
          >
            Ainda não tenho conta → cadastro
          </a>
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-ash">{brand.disclaimer}</p>
      </div>
    </div>
  )
}
