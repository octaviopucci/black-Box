import { WHAT_YOU_GET } from "@/components/landing/landing-data";

export function WhatYouGet() {
  return (
    <section id="leva" className="scroll-mt-16 py-11">
      <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">O que você leva</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {WHAT_YOU_GET.map(({ title, text }) => (
          <article
            key={title}
            className="rounded-[0.85rem] border border-[#2a2a2a] bg-[#1a1a1a] px-[1.15rem] py-[1.1rem]"
          >
            <h3 className="text-[1.05rem] font-bold">{title}</h3>
            <p className="mt-1 text-[0.95rem] text-muted">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
