import { PROBLEM_BULLETS } from "@/components/landing/landing-data";

export function ProblemSection() {
  return (
    <section id="problema" className="scroll-mt-16 py-11">
      <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">O problema no salão</h2>
      <ul className="mt-4 grid gap-2.5">
        {PROBLEM_BULLETS.map(({ title, text }) => (
          <li
            key={title}
            className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3.5 text-muted"
          >
            <strong className="font-bold text-ink">{title}</strong> {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
