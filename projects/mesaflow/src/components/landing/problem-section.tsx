import { Clock, Receipt, XCircle } from "lucide-react";
import { PROBLEM_BULLETS } from "@/components/landing/landing-data";

const ICONS = {
  clock: Clock,
  receipt: Receipt,
  "x-circle": XCircle,
} as const;

export function ProblemSection() {
  return (
    <section id="problema" className="scroll-mt-16 py-12">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">O problema no salão</h2>
      <p className="mt-2 max-w-2xl text-muted">Três coisas que travam mesa, equipe e caixa — todo dia.</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {PROBLEM_BULLETS.map(({ title, text, icon }) => {
          const Icon = ICONS[icon];
          return (
            <li
              key={title}
              className="flex flex-col rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.8)]"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
