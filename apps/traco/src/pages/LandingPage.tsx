import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, Waypoints, Sparkles, Brush } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-atmosphere text-bone">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-bold tracking-tight">traço</span>
        <Link
          to="/gallery"
          className="rounded-xl border border-line bg-panel/60 px-4 py-2 text-sm text-bone backdrop-blur hover:border-ember/40"
        >
          Abrir gallery
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-6xl items-center gap-10 px-6 pb-16 pt-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-[clamp(3.4rem,9vw,6.4rem)] font-bold leading-[0.9] tracking-tight"
          >
            traço
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 max-w-xl text-2xl font-medium leading-snug text-bone/90 md:text-3xl"
          >
            O studio de pintura com IA embutida no laço.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-4 max-w-lg text-base leading-relaxed text-mist"
          >
            Tudo que você espera de um Procreate — pincéis, camadas, seleção — mais o poder de
            apontar para qualquer região e pedir à IA.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/gallery"
              className="rounded-2xl bg-ember px-6 py-3 text-sm font-semibold text-ink shadow-glow transition hover:bg-emberSoft"
            >
              Começar a desenhar
            </Link>
            <a
              href="#diferencial"
              className="rounded-2xl border border-line bg-panel/50 px-6 py-3 text-sm text-bone backdrop-blur hover:border-mist/40"
            >
              Ver diferencial
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line/70 bg-slate shadow-soft"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,107,61,0.35),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(91,168,255,0.25),transparent_40%),linear-gradient(145deg,#151b24,#0c1016)]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600" fill="none">
            <path
              d="M120 420C220 240 320 160 680 120"
              stroke="#FF6B3D"
              strokeWidth="28"
              strokeLinecap="round"
              className="animate-pulseSoft"
            />
            <path
              d="M160 460C280 300 420 220 640 200"
              stroke="#F2EEE6"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M420 180c40 60 90 110 170 150"
              stroke="#3DDC97"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.8"
            />
            <circle cx="520" cy="300" r="90" stroke="#FF6B3D" strokeWidth="2" strokeDasharray="8 6" className="marching" />
          </svg>
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-ink/55 px-4 py-3 backdrop-blur">
            <span className="text-sm text-bone/90">Seleção + prompt → nova pintura</span>
            <Sparkles className="text-ember" size={18} />
          </div>
        </motion.div>
      </main>

      <section id="diferencial" className="relative z-10 border-t border-line/60 bg-ink/50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
          <Feature
            icon={<Brush className="text-ember" size={22} />}
            title="Studio completo"
            text="Pincéis, borracha, aerógrafo, aquarela, fill, smudge, zoom, undo e export PNG."
          />
          <Feature
            icon={<Layers className="text-sky" size={22} />}
            title="Camadas de verdade"
            text="Opacidade, blend modes, bloqueio, duplicar, reordenar — como no Procreate."
          />
          <Feature
            icon={<Waypoints className="text-jade" size={22} />}
            title="IA por seleção"
            text="Laço, retângulo, elipse ou camada inteira: descreva a mudança e a IA aplica no alvo."
          />
        </div>
      </section>
    </div>
  )
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div>
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl border border-line bg-panel">
        {icon}
      </div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
    </div>
  )
}
