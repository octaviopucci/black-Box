import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  GitBranch,
  Inbox,
  MessageSquareText,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Logo } from '@/components/Logo'

const features = [
  {
    icon: GitBranch,
    title: 'Flow Builder',
    text: 'Monte automações visuais com gatilhos, mensagens, botões, delays e IA.',
  },
  {
    icon: MessageSquareText,
    title: 'Comentário → DM',
    text: 'Transforme comentários com palavra-chave em conversas que vendem.',
  },
  {
    icon: Inbox,
    title: 'Inbox unificada',
    text: 'Instagram, WhatsApp, Messenger e Telegram em um só lugar.',
  },
  {
    icon: Zap,
    title: 'Broadcasts',
    text: 'Dispare campanhas para tags, segmentos e audiências ativas.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-hero text-paper">
      <div className="pointer-events-none fixed inset-0 bg-grain opacity-[0.08]" />
      <div className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-mist hover:text-paper sm:inline"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-flame px-4 py-2 text-sm font-bold text-night shadow-glow transition hover:bg-flameHot"
            >
              Começar grátis
            </Link>
          </div>
        </header>

        <section className="relative mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-abyss/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ember"
            >
              <Sparkles className="h-3.5 w-3.5" />
              de chamar · automação que converte
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance md:text-7xl"
            >
              chama
              <span className="block text-flame">quem importa.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-xl text-lg text-mist"
            >
              Transforme comentários, DMs e mensagens em vendas — com flows,
              inbox ao vivo e broadcasts. Um clone 100% funcional estilo Manychat.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-bold text-night shadow-glow transition hover:bg-flameHot"
              >
                Abrir painel
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-mist hover:border-mist hover:text-paper"
              >
                Ver recursos
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 animate-pulseRing rounded-[2rem] border border-flame/30" />
            <div className="animate-floatY overflow-hidden rounded-[1.75rem] border border-line bg-abyss/90 shadow-soft">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-flame" />
                <span className="h-2.5 w-2.5 rounded-full bg-ember" />
                <span className="h-2.5 w-2.5 rounded-full bg-signal" />
                <span className="ml-2 text-xs text-mist">Flow · Comentário → DM</span>
              </div>
              <div className="space-y-3 p-5">
                {[
                  { t: 'Gatilho', c: 'Comentário: EU QUERO', tone: 'text-ember' },
                  { t: 'Mensagem', c: 'Oi! Quer o link da mentoria?', tone: 'text-sky' },
                  { t: 'Botões', c: 'Quero o link · Falar com humano', tone: 'text-signal' },
                  { t: 'Ação', c: 'Tag lead-quente + enviar URL', tone: 'text-flame' },
                ].map((row) => (
                  <div
                    key={row.t}
                    className="rounded-xl border border-line bg-slateDeep/70 px-4 py-3"
                  >
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${row.tone}`}>
                      {row.t}
                    </p>
                    <p className="mt-1 text-sm text-paper">{row.c}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 pb-24">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Tudo que você precisa para <span className="text-flame">chamar</span> no automático
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-line bg-abyss/70 p-5"
              >
                <f.icon className="h-6 w-6 text-flame" />
                <h3 className="mt-3 font-display text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-mist">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="border-t border-line px-5 py-8 text-center text-sm text-mist">
          chama — de chamar. Demo funcional · Black Box
        </footer>
      </div>
    </div>
  )
}
