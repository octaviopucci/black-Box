export function ComparisonTable() {
  return (
    <section id="comparativo" className="scroll-mt-16 py-12">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#151515] px-5 py-6 sm:px-7 sm:py-7">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">Não é isso. É aquilo.</h2>
        <ul className="mt-5 grid gap-3 text-[0.98rem] text-muted">
          <li className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3.5">
            Não é só <strong className="font-bold text-ink">cardápio com QR</strong> — é pedido que chega na
            cozinha e conta que fecha.
          </li>
          <li className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3.5">
            Não é <strong className="font-bold text-ink">PDV grande</strong> cheio de módulo — é operação de
            mesa, direta.
          </li>
          <li className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3.5">
            Não é <strong className="font-bold text-ink">app de delivery</strong> — é pra quem vive do salão.
          </li>
        </ul>
      </div>
    </section>
  );
}
